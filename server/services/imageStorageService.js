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

  const relativeUrl = await saveLocallyAsFallback(buffer, `${baseName}.png`);
  logInfo(`Image stored locally (${baseName}.png)`);

  if (isCloudinaryConfigured()) {
    try {
      await uploadGeneratedImage(buffer, { publicId: baseName });
      logInfo(`Cloudinary mirror upload completed (asset: ${baseName})`);
    } catch (err) {
      logError("Cloudinary mirror upload failed", err);
    }
  } else if (process.env.NODE_ENV === "production") {
    logWarn(
      "Cloudinary not configured — images use /generated on this server only."
    );
  }

  return relativeUrl;
}
