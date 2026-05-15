import axios from "axios";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import AppError from "../utils/appError.js";
import { logInfo, logWarn } from "../utils/logger.js";
import { persistImageBuffer } from "./imageStorageService.js";
import { resolveGeneratedImageUrl } from "./imageService.js";
import { PROMPT_STYLES } from "../utils/promptStyles.js";

const __dirname_here = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.join(__dirname_here, "..", "public", "generated");

const FETCH_TIMEOUT_MS = 45_000;
const CLIP_PROMPT_MAX = 1000;

/**
 * When duplicate fallback runs, HTTP GET sometimes breaks (encoding, SSRF to self).
 * If the asset lives under /generated/, read straight from disk.
 */
async function tryReadLocalGeneratedBuffer(absoluteUrl) {
  let pathname = "";
  try {
    pathname = new URL(String(absoluteUrl).trim()).pathname;
  } catch {
    return null;
  }
  const m = pathname.match(/\/generated\/([^/?#]+)$/i);
  if (!m?.[1]) return null;
  const name = path.basename(m[1]);
  if (!name || name !== path.basename(path.normalize(m[1]))) return null;
  if (!/^[a-zA-Z0-9._-]+\.(png|jpe?g|webp)$/i.test(name)) return null;
  try {
    const buf = await fs.readFile(path.join(GENERATED_DIR, name));
    return buf?.length >= 100 ? buf : null;
  } catch {
    return null;
  }
}

/**
 * Clipdrop text-to-image only accepts ~1000 chars. User edit must survive truncation;
 * we shrink scene context iteratively—not the edit line.
 */
export function buildRefinementPromptForClipdrop(originalPrompt, editPrompt, style = "realistic") {
  let edit = String(editPrompt || "").trim().replace(/\s+/g, " ");
  if (!edit.length) {
    throw new AppError("Edit instruction is required", 400, "VALIDATION_ERROR");
  }
  edit = edit.slice(0, 680);

  const scene = String(originalPrompt || "").trim().replace(/\s+/g, " ");
  const styleHint = PROMPT_STYLES[style] || PROMPT_STYLES.realistic;
  const suffix = ` Style: ${styleHint}. One sharp, cohesive frame.`;

  let sceneChunk = scene.slice(0, Math.min(scene.length, 520));

  const build = () => {
    const bridge = sceneChunk.length
      ? ` Refine this result; stay consistent with composition and subjects unless this asks otherwise: ${sceneChunk}.`
      : ` Refine this result; coherent output.`;
    return `${edit}.${bridge}${suffix}`.replace(/\s+/g, " ").trim();
  };

  let out = build();
  while (out.length > CLIP_PROMPT_MAX && sceneChunk.length > 120) {
    sceneChunk = sceneChunk.slice(0, Math.floor(sceneChunk.length * 0.82));
    out = build();
  }
  if (out.length > CLIP_PROMPT_MAX) {
    out = `${edit}.${suffix}`.replace(/\s+/g, " ").trim();
  }
  if (out.length > CLIP_PROMPT_MAX) {
    const room = Math.max(120, CLIP_PROMPT_MAX - suffix.length - 8);
    edit = edit.slice(0, room);
    out = `${edit}.${suffix}`.replace(/\s+/g, " ").trim();
  }

  return out.slice(0, CLIP_PROMPT_MAX);
}

/**
 * @deprecated Use buildRefinementPromptForClipdrop.
 */
export function buildCompositeEditPrompt(originalPrompt, editPrompt) {
  return buildRefinementPromptForClipdrop(originalPrompt, editPrompt, "realistic");
}

/**
 * Copy pixels when generation fails — keeps UX and DB chain coherent.
 */
export async function duplicateImageToNewUrl(sourceAbsoluteUrl) {
  const url = String(sourceAbsoluteUrl || "").trim();
  if (!/^https?:\/\//i.test(url)) {
    throw new AppError("Invalid source image URL for edit fallback", 400, "VALIDATION_ERROR");
  }

  let buffer = await tryReadLocalGeneratedBuffer(url);

  if (!buffer?.length || buffer.length < 100) {
    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: FETCH_TIMEOUT_MS,
        maxRedirects: 5,
        validateStatus: (s) => s >= 200 && s < 400,
      });
      buffer = Buffer.from(response.data);
    } catch (httpErr) {
      logWarn(`Edit fallback: fetch failed (${httpErr?.message || httpErr}); trying local /generated`);
      buffer = await tryReadLocalGeneratedBuffer(url);
    }
  }

  if (!buffer?.length || buffer.length < 100) {
    throw new AppError("Could not read source image for edit fallback", 502, "EDIT_SOURCE_READ_FAILED");
  }

  const baseName = `edit-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const out = await persistImageBuffer(buffer, { publicId: baseName });
  logInfo(`Edit fallback: duplicated source image (${baseName})`);
  return out;
}

/**
 * Refinement uses the same Clipdrop text endpoint as fresh runs, with a compact edit-first prompt.
 * No second enhancePrompt layer (that duplicated style text and drowned edits past the 1k cap).
 */
export async function resolveEditedImageUrl({
  sourceAbsoluteUrl,
  originalPrompt,
  editPrompt,
  style = "realistic",
}) {
  const clipPrompt = buildRefinementPromptForClipdrop(originalPrompt, editPrompt, style);

  try {
    const url = await resolveGeneratedImageUrl({ prompt: clipPrompt });
    logInfo("Image edit: Clipdrop refinement succeeded");
    return { imageUrl: url, mode: "composite" };
  } catch (err) {
    logWarn(
      `Image edit: Clipdrop failed (${err?.code || err?.message || "error"}); duplicate fallback`
    );
    try {
      const imageUrl = await duplicateImageToNewUrl(sourceAbsoluteUrl);
      return { imageUrl, mode: "duplicate_fallback" };
    } catch (dupErr) {
      logWarn(`Image edit: duplicate fallback failed (${dupErr?.code || dupErr?.message || dupErr})`);
      throw new AppError(
        "Refine failed: Clipdrop error and we could not re-save your previous image. Ensure CLIPDROP_API is valid (quota/key) and stored images load from disk or CDN.",
        502,
        "EDIT_FAILED",
        {
          clipdrop: err?.code || String(err?.message || err),
          duplicate: dupErr?.code || String(dupErr?.message || dupErr),
        }
      );
    }
  }
}
