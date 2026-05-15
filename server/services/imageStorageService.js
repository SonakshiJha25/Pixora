import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import AppError from "../utils/appError.js";
import { isCloudinaryConfigured, uploadGeneratedImage } from "./cloudinaryService.js";
import { logError, logInfo, logWarn } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.join(__dirname, "..", "public", "generated");

async function saveLocallyAsFallback(buffer, filename) {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  const filepath = path.join(GENERATED_DIR, filename);
  await fs.writeFile(filepath, buffer);
  return `/generated/${filename}`;
}

/**
 * Upload a raster buffer to Cloudinary when configured, else local /generated (dev).
 * Shared by text-to-image generation and edit fallbacks.
 */
export async function persistImageBuffer(buffer, { publicId } = {}) {
  if (!buffer?.length || buffer.length < 100) {
    throw new AppError("Invalid image buffer", 502, "STORAGE_INVALID_BUFFER");
  }

  const baseName =
    publicId || `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
  const isProd = process.env.NODE_ENV === "production";

  if (isCloudinaryConfigured()) {
    try {
      const cloudUrl = await uploadGeneratedImage(buffer, { publicId: baseName });
      logInfo(`Cloudinary upload completed (asset: ${baseName})`);
      return cloudUrl;
    } catch (err) {
      logError("Cloudinary upload failed", err);
      if (isProd) {
        throw new AppError(
          `Image storage failed (Cloudinary): ${err.message}`,
          502,
          "STORAGE_UPLOAD_FAILED"
        );
      }
    }
  } else if (isProd) {
    throw new AppError(
      "Image storage is not configured: set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET on the server.",
      500,
      "STORAGE_NOT_CONFIGURED"
    );
  } else {
    logWarn(
      "Cloudinary not configured (set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Saving to local disk only (development)."
    );
  }

  const relativeUrl = await saveLocallyAsFallback(buffer, `${baseName}.png`);
  logInfo(`Image stored locally (${baseName}.png, dev fallback)`);
  return relativeUrl;
}
