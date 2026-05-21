import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import AppError from "../utils/appError.js";
import { isCloudinaryConfigured, uploadGeneratedImage } from "./cloudinaryService.js";
import { optimizeGeneratedBuffer } from "./imageOptimize.js";
import { logError, logInfo, logWarn } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.join(__dirname, "..", "public", "generated");

async function saveLocally(buffer, filename) {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  const filepath = path.join(GENERATED_DIR, filename);
  await fs.writeFile(filepath, buffer);
  return `/generated/${filename}`;
}

/**
 * Persist generated/edited rasters.
 * Production: prefer Cloudinary CDN URL when configured (fast global delivery).
 * Dev / fallback: local /generated on this server.
 */
export async function persistImageBuffer(buffer, { publicId } = {}) {
  if (!buffer?.length || buffer.length < 100) {
    throw new AppError("Invalid image buffer", 502, "STORAGE_INVALID_BUFFER");
  }

  const baseName =
    publicId || `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
  const optimized = await optimizeGeneratedBuffer(buffer);

  if (isCloudinaryConfigured()) {
    try {
      const secureUrl = await uploadGeneratedImage(optimized, { publicId: baseName });
      logInfo(`Image stored on Cloudinary (${baseName})`);
      if (process.env.NODE_ENV !== "production") {
        try {
          await saveLocally(optimized, `${baseName}.webp`);
        } catch {
          /* optional local copy in dev */
        }
      }
      return secureUrl;
    } catch (err) {
      logError("Cloudinary upload failed; falling back to local disk", err);
    }
  } else if (process.env.NODE_ENV === "production") {
    logWarn(
      "Cloudinary not configured — images use /generated on this server only (slower on split deploys)."
    );
  }

  const relativeUrl = await saveLocally(optimized, `${baseName}.webp`);
  logInfo(`Image stored locally (${baseName}.webp)`);
  return relativeUrl;
}
