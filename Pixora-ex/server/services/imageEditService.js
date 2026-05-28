import axios from "axios";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import AppError from "../utils/appError.js";
import { logInfo, logWarn } from "../utils/logger.js";
import { persistImageBuffer } from "./imageStorageService.js";
import { refineImageWithClipdrop, FETCH_TIMEOUT_MS } from "./clipdropRefinementService.js";

const __dirname_here = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.join(__dirname_here, "..", "public", "generated");

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

/** Load raster bytes for the parent frame (CDN, local /generated, or remote URL). */
export async function loadSourceImageBuffer(sourceAbsoluteUrl) {
  const url = String(sourceAbsoluteUrl || "").trim();
  if (!/^https?:\/\//i.test(url)) {
    throw new AppError("Invalid source image URL", 400, "VALIDATION_ERROR");
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
      logWarn(`[Refine] fetch failed (${httpErr?.message || httpErr}); trying local /generated`);
      buffer = await tryReadLocalGeneratedBuffer(url);
    }
  }

  if (!buffer?.length || buffer.length < 100) {
    throw new AppError("Could not read source image for refinement", 502, "EDIT_SOURCE_READ_FAILED");
  }

  return buffer;
}

/**
 * Copy pixels when all Clipdrop image-to-image attempts fail — keeps thread intact.
 */
export async function duplicateImageToNewUrl(sourceAbsoluteUrl) {
  const buffer = await loadSourceImageBuffer(sourceAbsoluteUrl);
  const baseName = `edit-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const out = await persistImageBuffer(buffer, { publicId: baseName });
  logInfo(`[Refine] duplicate fallback saved (${baseName})`);
  return out;
}

/**
 * Image-to-image refinement: parent image bytes + edit prompt → modified image URL.
 * Does not call text-to-image or concatenate prompts for fresh generation.
 */
export async function resolveEditedImageUrl({
  sourceAbsoluteUrl,
  editPrompt,
}) {
  const trimmed = String(editPrompt || "").trim();
  logInfo("[Refine] refinement started");
  logInfo("[Refine] original image URL:", String(sourceAbsoluteUrl).slice(0, 160));

  const sourceBuffer = await loadSourceImageBuffer(sourceAbsoluteUrl);
  logInfo("[Refine] original image found, bytes:", sourceBuffer.length);

  try {
    const { buffer, mode } = await refineImageWithClipdrop(sourceBuffer, trimmed);
    const baseName = `refine-${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
    const imageUrl = await persistImageBuffer(buffer, { publicId: baseName });
    logInfo(`[Refine] saved refinement successfully (${baseName}, mode=${mode})`);
    return { imageUrl, mode };
  } catch (err) {
    logWarn(
      `[Refine] image-to-image failed (${err?.code || err?.message || "error"}); duplicate fallback`
    );
    try {
      const imageUrl = await duplicateImageToNewUrl(sourceAbsoluteUrl);
      return { imageUrl, mode: "duplicate_fallback" };
    } catch (dupErr) {
      logWarn(`[Refine] duplicate fallback failed (${dupErr?.code || dupErr?.message || dupErr})`);
      throw new AppError(
        "Refine failed: could not edit your image or re-save the previous frame. Check CLIPDROP_API and image storage.",
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
