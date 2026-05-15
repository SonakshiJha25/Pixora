import axios from "axios";
import crypto from "crypto";
import AppError from "../utils/appError.js";
import { logInfo, logWarn } from "../utils/logger.js";
import { persistImageBuffer } from "./imageStorageService.js";
import { resolveGeneratedImageUrl } from "./imageService.js";
import { enhancePrompt } from "../utils/promptStyles.js";

const FETCH_TIMEOUT_MS = 45_000;

/**
 * Build a single text prompt for refinement (composite path).
 * Real img2img providers can replace this pipeline later without changing controllers.
 */
export function buildCompositeEditPrompt(originalPrompt, editPrompt) {
  const orig = String(originalPrompt || "").trim().replace(/\s+/g, " ").slice(0, 900);
  const edit = String(editPrompt || "").trim().replace(/\s+/g, " ").slice(0, 900);
  if (!edit) {
    throw new AppError("Edit instruction is required", 400, "VALIDATION_ERROR");
  }
  return [
    "Refined image generation: keep continuity with the previous result.",
    `Original scene concept: ${orig || "(not specified)"}.`,
    `Apply this change: ${edit}.`,
    "Single coherent frame, full image, high quality.",
  ].join(" ");
}

/**
 * When no remote edit API is available or generation fails: copy pixels to a new URL
 * so the UX and DB chain still work (same image shown until img2img is wired).
 */
export async function duplicateImageToNewUrl(sourceAbsoluteUrl) {
  const url = String(sourceAbsoluteUrl || "").trim();
  if (!/^https?:\/\//i.test(url)) {
    throw new AppError("Invalid source image URL for edit fallback", 400, "VALIDATION_ERROR");
  }

  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: FETCH_TIMEOUT_MS,
    maxRedirects: 5,
    validateStatus: (s) => s >= 200 && s < 400,
  });

  const buffer = Buffer.from(response.data);
  if (!buffer?.length || buffer.length < 100) {
    throw new AppError("Could not read source image for edit fallback", 502, "EDIT_SOURCE_READ_FAILED");
  }

  const baseName = `edit-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const out = await persistImageBuffer(buffer, { publicId: baseName });
  logInfo(`Edit fallback: duplicated source image to new URL (${baseName})`);
  return out;
}

/**
 * Try composite text-to-image edit (uses same stack as new generations; no user credits).
 * On failure, duplicate source image bytes to a new stored URL.
 *
 * @param {object} opts
 * @param {string} opts.sourceAbsoluteUrl - HTTP(S) URL of the image being refined
 * @param {string} opts.originalPrompt - Root thread prompt
 * @param {string} opts.editPrompt - User edit instruction
 * @param {string} [opts.style] - Style key for enhancePrompt
 */
export async function resolveEditedImageUrl({
  sourceAbsoluteUrl,
  originalPrompt,
  editPrompt,
  style = "realistic",
}) {
  const composite = buildCompositeEditPrompt(originalPrompt, editPrompt);
  const promptEnhanced = enhancePrompt(composite, style);

  try {
    const url = await resolveGeneratedImageUrl({
      prompt: composite,
      promptEnhanced,
    });
    logInfo("Image edit: composite generation succeeded");
    return { imageUrl: url, mode: "composite" };
  } catch (err) {
    logWarn(
      `Image edit: composite generation unavailable (${err?.code || err?.message || "error"}); using duplicate fallback`
    );
    try {
      const imageUrl = await duplicateImageToNewUrl(sourceAbsoluteUrl);
      return { imageUrl, mode: "duplicate_fallback" };
    } catch (fallbackErr) {
      throw new AppError("Could not apply edit", 502, "EDIT_FAILED");
    }
  }
}
