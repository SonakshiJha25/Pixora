import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import axios from "axios";
import FormData from "form-data";
import AppError from "../utils/appError.js";

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

/**
 * Calls ClipDrop text-to-image, saves PNG under /public/generated, and returns
 * a relative URL path (e.g. "/generated/<filename>.png"). The absolute URL is
 * constructed at response time using process.env.BACKEND_PUBLIC_URL — see
 * server/utils/imageUrl.js. Storing relative paths keeps DB records portable
 * across environments.
 */
export async function resolveGeneratedImageUrl({ prompt, promptEnhanced }) {
  const apiKey = process.env.CLIPDROP_API?.trim();
  if (!apiKey) {
    throw new AppError("CLIPDROP_API is not configured", 500, "CLIPDROP_NOT_CONFIGURED");
  }

  const text = buildClipDropPrompt({ prompt, promptEnhanced });

  await fs.mkdir(GENERATED_DIR, { recursive: true });

  const form = new FormData();
  form.append("prompt", text);

  let buffer;
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
    buffer = Buffer.from(response.data);
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

  if (!buffer?.length || buffer.length < 100) {
    throw new AppError("ClipDrop returned an invalid image", 502, "CLIPDROP_EMPTY");
  }

  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.png`;
  const filepath = path.join(GENERATED_DIR, filename);
  await fs.writeFile(filepath, buffer);

  const relativeUrl = `/generated/${filename}`;
  console.log("Generated image stored at:", relativeUrl);
  return relativeUrl;
}
