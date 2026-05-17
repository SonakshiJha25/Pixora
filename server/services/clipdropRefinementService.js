import axios from "axios";
import FormData from "form-data";
import sharp from "sharp";
import AppError from "../utils/appError.js";
import { logInfo, logWarn } from "../utils/logger.js";

const FETCH_TIMEOUT_MS = 45_000;
const CLIP_TIMEOUT_MS = 120_000;
const MAX_EDIT_PROMPT_LEN = 2000;

const ENDPOINTS = {
  replaceBackground: "https://clipdrop-api.co/replace-background/v1",
  textInpainting: "https://clipdrop-api.co/text-inpainting/v1",
  reimagine: "https://clipdrop-api.co/reimagine/v1/reimagine",
};

function getApiKey() {
  const key = process.env.CLIPDROP_API?.trim();
  if (!key) {
    throw new AppError("CLIPDROP_API is not configured", 500, "CLIPDROP_NOT_CONFIGURED");
  }
  return key;
}

function normalizeEditPrompt(editPrompt) {
  const text = String(editPrompt || "").trim().replace(/\s+/g, " ");
  if (text.length < 3) {
    throw new AppError("Edit instruction is required", 400, "VALIDATION_ERROR");
  }
  return text.slice(0, MAX_EDIT_PROMPT_LEN);
}

/**
 * Prompt for replace-background: scene edit while keeping subject separation.
 */
export function buildReplaceBackgroundPrompt(editPrompt) {
  const edit = normalizeEditPrompt(editPrompt);
  return (
    `Photorealistic scene matching the original photograph. ` +
    `Apply this refinement: ${edit}. ` +
    `Preserve subjects, framing, and composition unless the edit explicitly requires a change.`
  ).slice(0, 5000);
}

/**
 * Prompt for text-inpainting (full-frame mask): describe the desired result image.
 */
export function buildInpaintingPrompt(editPrompt) {
  const edit = normalizeEditPrompt(editPrompt);
  return (
    `High-quality photograph. Apply this change to the image: ${edit}. ` +
    `Keep the same composition, subjects, and camera perspective unless the edit requires otherwise.`
  ).slice(0, 5000);
}

async function postClipdropMultipart(url, form, apiKey) {
  try {
    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
        "x-api-key": apiKey,
        accept: "image/png",
      },
      responseType: "arraybuffer",
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: CLIP_TIMEOUT_MS,
    });
    const buffer = Buffer.from(response.data);
    if (!buffer?.length || buffer.length < 100) {
      throw new AppError("Clipdrop returned an invalid image", 502, "CLIPDROP_EMPTY");
    }
    return buffer;
  } catch (err) {
    let detail = err.message;
    if (axios.isAxiosError(err) && err.response?.data) {
      const raw = err.response.data;
      detail =
        typeof raw === "string"
          ? raw
          : Buffer.from(raw).toString("utf8").slice(0, 500);
    }
    const code = err?.code || "CLIPDROP_ERROR";
    throw new AppError(`Clipdrop request failed: ${detail}`, 502, code);
  }
}

/**
 * @param {Buffer} imageBuffer
 * @param {string} mime e.g. image/png
 */
async function callTextInpainting(imageBuffer, editPrompt, apiKey) {
  const meta = await sharp(imageBuffer).metadata();
  const width = meta.width || 1024;
  const height = meta.height || 1024;

  const maskBuffer = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  const form = new FormData();
  const ext = formatToExt(meta);
  form.append("image_file", imageBuffer, {
    filename: `source.${ext}`,
    contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
  });
  form.append("mask_file", maskBuffer, {
    filename: "mask.png",
    contentType: "image/png",
  });
  form.append("text_prompt", buildInpaintingPrompt(editPrompt));

  logInfo("[Refine] sending image-to-image request (Clipdrop text-inpainting, full-frame edit)");
  return postClipdropMultipart(ENDPOINTS.textInpainting, form, apiKey);
}

async function callReplaceBackground(imageBuffer, editPrompt, apiKey) {
  const meta = await sharp(imageBuffer).metadata();
  const ext = formatToExt(meta);
  const form = new FormData();
  form.append("image_file", imageBuffer, {
    filename: `source.${ext}`,
    contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
  });
  form.append("prompt", buildReplaceBackgroundPrompt(editPrompt));

  logInfo("[Refine] sending image-to-image request (Clipdrop replace-background)");
  return postClipdropMultipart(ENDPOINTS.replaceBackground, form, apiKey);
}

async function callReimagine(imageBuffer, apiKey) {
  const meta = await sharp(imageBuffer).metadata();
  const ext = formatToExt(meta);
  const form = new FormData();
  form.append("image_file", imageBuffer, {
    filename: `source.${ext}`,
    contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
  });

  logInfo("[Refine] sending image-to-image request (Clipdrop reimagine)");
  return postClipdropMultipart(ENDPOINTS.reimagine, form, apiKey);
}

function formatToExt(meta) {
  const f = (meta?.format || "png").toLowerCase();
  if (f === "jpeg" || f === "jpg") return "jpg";
  if (f === "webp") return "webp";
  return "png";
}

/**
 * True image-to-image refinement: source pixels + edit instruction (never text-only generation).
 * @returns {Promise<{ buffer: Buffer, mode: string }>}
 */
export async function refineImageWithClipdrop(imageBuffer, editPrompt) {
  const apiKey = getApiKey();
  const prompt = normalizeEditPrompt(editPrompt);

  const attempts = [
    {
      mode: "text_inpainting",
      run: () => callTextInpainting(imageBuffer, prompt, apiKey),
    },
    {
      mode: "replace_background",
      run: () => callReplaceBackground(imageBuffer, prompt, apiKey),
    },
    {
      mode: "reimagine",
      run: () => callReimagine(imageBuffer, apiKey),
    },
  ];

  let lastErr;
  for (const { mode, run } of attempts) {
    try {
      const buffer = await run();
      logInfo(`[Refine] refined image received (mode=${mode})`);
      return { buffer, mode };
    } catch (err) {
      lastErr = err;
      logWarn(
        `[Refine] Clipdrop ${mode} failed: ${err?.code || err?.message || "error"} — trying next`
      );
    }
  }

  throw lastErr || new AppError("Refinement failed", 502, "EDIT_FAILED");
}

export { FETCH_TIMEOUT_MS };
