import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import axios from "axios";
import FormData from "form-data";
import AppError from "../utils/appError.js";
import { isCloudinaryConfigured, uploadGeneratedImage } from "./cloudinaryService.js";

const CLIPDROP_ENDPOINT = "https://clipdrop-api.co/text-to-image/v1";
const MAX_PROMPT_LEN = 1000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.join(__dirname, "..", "public", "generated");

function buildClipDropPrompt({ prompt, promptEnhanced }) {
  const base = (promptEnhanced || prompt || "").trim();
  if (!base) {
    throw new AppError("Prompt is required", 400, "VALIDATION_ERROR");
  }
  if (base.length <= MAX_PROMPT_LEN) return base;
  return base.slice(0, MAX_PROMPT_LEN);
}

async function fetchClipDropBuffer(text, apiKey) {
  const form = new FormData();
  form.append("prompt", text);

  try {
    const response = await axios.post(CLIPDROP_ENDPOINT, form, {
      headers: {
        ...form.getHeaders(),
        "x-api-key": apiKey,
      },
      responseType: "arraybuffer",
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 120_000,
    });
    return Buffer.from(response.data);
  } catch (err) {
    let detail = err.message;
    if (axios.isAxiosError(err) && err.response?.data) {
      const raw = err.response.data;
      detail =
        typeof raw === "string"
          ? raw
          : Buffer.from(raw).toString("utf8").slice(0, 500);
    }
    throw new AppError(`ClipDrop generation failed: ${detail}`, 502, "CLIPDROP_ERROR");
  }
}

async function saveLocallyAsFallback(buffer, filename) {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  const filepath = path.join(GENERATED_DIR, filename);
  await fs.writeFile(filepath, buffer);
  return `/generated/${filename}`;
}

/**
 * Calls ClipDrop text-to-image and persists the result.
 *
 * Storage strategy:
 *   - If Cloudinary env vars are configured, upload there and return the
 *     secure_url. This is the production path — Cloudinary persists across
 *     Render redeploys, whereas Render's filesystem does not.
 *   - Otherwise fall back to writing under server/public/generated for local
 *     dev. This URL will not survive a redeploy on ephemeral hosts.
 *
 * The Image.imageUrl column is now expected to hold either a full https URL
 * (Cloudinary) or a relative /generated/... path (local fallback). The
 * absoluteImageUrl helper in utils/imageUrl.js handles both transparently.
 *
 * In NODE_ENV=production, Cloudinary must succeed — local disk is ephemeral on
 * hosts like Render and would produce URLs that vanish on redeploy.
 */
export async function resolveGeneratedImageUrl({ prompt, promptEnhanced }) {
  const apiKey = process.env.CLIPDROP_API?.trim();
  if (!apiKey) {
    throw new AppError("CLIPDROP_API is not configured", 500, "CLIPDROP_NOT_CONFIGURED");
  }

  const text = buildClipDropPrompt({ prompt, promptEnhanced });
  const buffer = await fetchClipDropBuffer(text, apiKey);

  if (!buffer?.length || buffer.length < 100) {
    throw new AppError("ClipDrop returned an invalid image", 502, "CLIPDROP_EMPTY");
  }

  const baseName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
  const isProd = process.env.NODE_ENV === "production";

  if (isCloudinaryConfigured()) {
    try {
      const cloudUrl = await uploadGeneratedImage(buffer, { publicId: baseName });
      console.log("Generated image uploaded to Cloudinary:", cloudUrl);
      return cloudUrl;
    } catch (err) {
      console.error("Cloudinary upload failed:", err.message);
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
    console.warn(
      "Cloudinary not configured (set CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET). " +
        "Saving to local disk — ok for development only."
    );
  }

  const relativeUrl = await saveLocallyAsFallback(buffer, `${baseName}.png`);
  console.log("Generated image stored at:", relativeUrl);
  return relativeUrl;
}
