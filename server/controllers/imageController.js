import axios from "axios";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import Image from "../models/Image.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { applyDailyCreditReset, deductDailyCredits } from "../utils/applyDailyCredits.js";
import { resolveGeneratedImageUrl } from "../services/imageService.js";
import { enhancePrompt } from "../utils/promptStyles.js";
import { serializeImage, absoluteImageUrl } from "../utils/imageUrl.js";
import { collectThreadFromAnyNode } from "../utils/imageThread.js";
import { runImageRefinement } from "../services/refinementService.js";
import { logInfo } from "../utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = path.join(__dirname, "..", "public", "generated");

// ---------------------------------------------------------------------------
// Helpers — local files and remote fetch for download
// ---------------------------------------------------------------------------

function localGeneratedFilePath(storedUrl) {
  let pathname = String(storedUrl || "").trim();
  if (!pathname) return null;
  if (/^https?:\/\//i.test(pathname)) {
    try {
      pathname = new URL(pathname).pathname;
    } catch {
      return null;
    }
  }
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  const match = pathname.match(/^\/generated\/([^/?#]+)$/i);
  if (!match?.[1]) return null;
  const name = path.basename(match[1]);
  if (!/^[a-zA-Z0-9._-]+\.(png|jpe?g|webp)$/i.test(name)) return null;
  return path.join(GENERATED_DIR, name);
}

function resolveDownloadFetchUrl(storedUrl, req) {
  const absolute = absoluteImageUrl(storedUrl, req);
  if (!absolute || typeof absolute !== "string") return null;
  if (/^https?:\/\//i.test(absolute)) return absolute;

  const pathPart = absolute.startsWith("/") ? absolute : `/${absolute}`;
  if (req?.get?.("host")) {
    return `${req.protocol || "http"}://${req.get("host")}${pathPart}`;
  }

  const base = (process.env.BACKEND_PUBLIC_URL || "").trim().replace(/\/+$/, "");
  return base ? `${base}${pathPart}` : pathPart;
}

async function fetchRemoteImageBuffer(url) {
  const resp = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 120_000,
    maxContentLength: 25 * 1024 * 1024,
    validateStatus: (status) => status >= 200 && status < 300,
  });
  return Buffer.from(resp.data);
}

async function loadImageBytesForDownload(storedUrl, req) {
  const localPath = localGeneratedFilePath(storedUrl);
  if (localPath && fs.existsSync(localPath)) {
    return { buffer: fs.readFileSync(localPath) };
  }

  const fetchUrl = resolveDownloadFetchUrl(storedUrl, req);
  if (fetchUrl && /^https?:\/\//i.test(fetchUrl)) {
    try {
      return { buffer: await fetchRemoteImageBuffer(fetchUrl) };
    } catch {
      /* try disk below */
    }
  }

  const pathPart = String(storedUrl || "").trim();
  let rel = pathPart;
  if (/^https?:\/\//i.test(pathPart)) {
    try {
      rel = new URL(pathPart).pathname;
    } catch {
      rel = pathPart;
    }
  }
  if (!rel.startsWith("/")) rel = `/${rel}`;

  if (rel.startsWith("/generated/")) {
    const filePath = path.join(GENERATED_DIR, path.basename(rel));
    if (fs.existsSync(filePath)) {
      return { buffer: fs.readFileSync(filePath) };
    }
  }

  throw new AppError("Could not fetch image file for download", 502, "IMAGE_DOWNLOAD_FAILED");
}

// ---------------------------------------------------------------------------
// Download
// ---------------------------------------------------------------------------

/** GET /api/images/:imageId/download — attachment PNG (Cloudinary-safe). */
export const downloadImageFile = asyncHandler(async (req, res) => {
  const imageId = String(req.params.imageId || "").trim();
  const image = await Image.findOne({
    _id: imageId,
    userId: req.user.id,
    deletedAt: null,
  });
  if (!image) {
    throw new AppError("Image not found", 404, "IMAGE_NOT_FOUND");
  }

  const { buffer } = await loadImageBytesForDownload(image.imageUrl, req);
  const pngBuffer = await sharp(buffer).png().toBuffer();
  const safeName = `pixorify-${image._id}.png`;

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);
  res.setHeader("Content-Length", String(pngBuffer.length));
  res.setHeader("Cache-Control", "private, no-store");
  return res.send(pngBuffer);
});

// ---------------------------------------------------------------------------
// Generation — daily credits reset, then deduct, then generate
// ---------------------------------------------------------------------------

export const generateImage = asyncHandler(async (req, res) => {
  if (Boolean(req.body?.isRefinement)) {
    throw new AppError(
      "Use POST /api/images/edit for refinements (no credits deducted).",
      400,
      "USE_EDIT_ENDPOINT"
    );
  }

  const { prompt, style, isPublic, tags } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  await applyDailyCreditReset(user);

  const deduct = deductDailyCredits(user);
  if (!deduct.ok) {
    return res.status(deduct.status).json(deduct.body);
  }
  await user.save();

  const promptEnhanced = enhancePrompt(prompt, style);
  const relativeImageUrl = await resolveGeneratedImageUrl({ prompt, promptEnhanced });

  const [image] = await Image.create([
    {
      userId: req.user.id,
      prompt: prompt.trim(),
      promptEnhanced: (promptEnhanced || prompt).trim(),
      style: style || "realistic",
      tags: Array.isArray(tags) ? tags.slice(0, 8) : [],
      isPublic: Boolean(isPublic),
      imageUrl: relativeImageUrl,
      provider: "clipdrop",
      parentImageId: null,
      isEdit: false,
      generationKind: "generate",
      editPrompt: null,
      refinementPrompt: null,
      originalPrompt: prompt.trim(),
      version: 1,
    },
  ]);

  await Image.findByIdAndUpdate(image._id, { $set: { threadRootId: image._id } });

  const serialized = serializeImage(image, req);

  logInfo(
    `Image generated: ${user.email} style=${style || "realistic"} imageId=${String(image._id)} credits=${user.credits}`
  );

  return res.status(200).json({
    success: true,
    message: "Image generated",
    creditBalance: user.credits,
    credits: user.credits,
    remainingCredits: user.credits,
    imageUrl: serialized.imageUrl,
    resultImage: serialized.imageUrl,
    image: serialized,
  });
});

// ---------------------------------------------------------------------------
// Refinement (no credit deduction — refinementService)
// ---------------------------------------------------------------------------

/** POST /api/images/edit — refinement (editPrompt + imageId). */
export const editImage = asyncHandler(runImageRefinement);

export const getImageThread = asyncHandler(async (req, res) => {
  const packed = await collectThreadFromAnyNode(req.params.imageId, req.user.id);
  if (!packed) {
    throw new AppError("Image not found", 404, "IMAGE_NOT_FOUND");
  }

  const thread = packed.ordered.map((img) => serializeImage(img, req));
  logInfo(`Thread fetch: user=…${String(req.user.id).slice(-8)} root=${String(packed.root._id)} len=${thread.length}`);

  return res.status(200).json({
    success: true,
    rootId: String(packed.root._id),
    thread,
    refinementCount: packed.ordered.filter((i) => i.isEdit).length,
  });
});

// ---------------------------------------------------------------------------
// User gallery (authenticated)
// ---------------------------------------------------------------------------

export const getMyImages = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 12), 50);
  const skip = (page - 1) * limit;

  const userId = req.user.id;

  const [images, total] = await Promise.all([
    Image.find({ userId, deletedAt: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Image.countDocuments({ userId, deletedAt: null }),
  ]);

  const payload = images.map((img) => serializeImage(img, req));

  logInfo(
    `Gallery fetch: user=…${String(userId).slice(-8)} page=${page} batch=${payload.length} total=${total}`
  );

  return res.status(200).json({
    success: true,
    images: payload,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

// ---------------------------------------------------------------------------
// Per-image mutations (authenticated)
// ---------------------------------------------------------------------------

export const deleteImage = asyncHandler(async (req, res) => {
  const image = await Image.findOne({
    _id: req.params.imageId,
    userId: req.user.id,
    deletedAt: null,
  });
  if (!image) {
    throw new AppError("Image not found", 404, "IMAGE_NOT_FOUND");
  }

  image.deletedAt = new Date();
  await image.save();

  return res.status(200).json({ success: true, message: "Image deleted" });
});

export const toggleFavoriteImage = asyncHandler(async (req, res) => {
  const image = await Image.findOne({
    _id: req.params.imageId,
    userId: req.user.id,
    deletedAt: null,
  });
  if (!image) {
    throw new AppError("Image not found", 404, "IMAGE_NOT_FOUND");
  }

  image.isFavorite = !image.isFavorite;
  await image.save();

  return res.status(200).json({ success: true, image: serializeImage(image, req) });
});
