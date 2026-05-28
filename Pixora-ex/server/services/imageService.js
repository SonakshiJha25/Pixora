import axios from "axios";
import FormData from "form-data";
import crypto from "crypto";
import AppError from "../utils/appError.js";
import { logInfo } from "../utils/logger.js";
import { persistImageBuffer } from "./imageStorageService.js";

const CLIPDROP_ENDPOINT = "https://clipdrop-api.co/text-to-image/v1";
const MAX_PROMPT_LEN = 1000;

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

/**
 * Calls ClipDrop text-to-image and persists the result (Cloudinary or local).
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
  const url = await persistImageBuffer(buffer, { publicId: baseName });
  logInfo(`ClipDrop image persisted (${baseName})`);
  return url;
}
