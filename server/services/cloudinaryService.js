import { v2 as cloudinary } from "cloudinary";

let configured = false;

/**
 * Lazily configure the Cloudinary SDK from env vars. Returns true if the
 * client is usable, false otherwise. We configure on first call instead of at
 * import time so that startup never crashes when Cloudinary isn't set up,
 * and we re-check env vars in case they were updated between calls.
 */
function ensureConfigured() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    configured = true;
  }
  return true;
}

export function isCloudinaryConfigured() {
  return ensureConfigured();
}

/**
 * Upload a PNG buffer to Cloudinary under the "pixorify/generated" folder
 * and return the secure HTTPS URL of the stored asset. Throws if the
 * Cloudinary client isn't configured — callers should fall back to local
 * disk only when this returns falsy via isCloudinaryConfigured().
 */
export async function uploadGeneratedImage(buffer, { publicId } = {}) {
  if (!ensureConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "pixorify/generated",
        public_id: publicId,
        resource_type: "image",
        format: "png",
        overwrite: false,
      },
      (err, result) => {
        if (err) return reject(err);
        if (!result?.secure_url) return reject(new Error("Cloudinary upload returned no URL"));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}
