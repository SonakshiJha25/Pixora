import axios from "axios";
import Image from "../models/Image.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { deductCreditAndSaveImage } from "../services/creditService.js";
import { resolveGeneratedImageUrl } from "../services/imageService.js";
import { PROMPT_STYLES, enhancePrompt } from "../utils/promptStyles.js";
import { serializeImage, absoluteImageUrl } from "../utils/imageUrl.js";
import { collectThreadFromAnyNode } from "../utils/imageThread.js";
import { runImageRefinement } from "../services/refinementService.js";
import { logInfo } from "../utils/logger.js";

export const generateImage = asyncHandler(async (req, res) => {
  if (Boolean(req.body?.isRefinement)) {
    throw new AppError(
      "Use POST /api/images/edit for refinements (no credits deducted).",
      400,
      "USE_EDIT_ENDPOINT"
    );
  }

  const { prompt, style, isPublic, tags } = req.body;

  const promptEnhanced = enhancePrompt(prompt, style);
  const relativeImageUrl = await resolveGeneratedImageUrl({ prompt, promptEnhanced });

  const { image, remainingCredits, userEmail } = await deductCreditAndSaveImage({
    userId: req.user.id,
    prompt,
    promptEnhanced,
    style,
    tags,
    isPublic,
    imageUrl: relativeImageUrl,
    provider: "clipdrop",
  });

  const serialized = serializeImage(image, req);

  logInfo(
    `Image generated: ${userEmail} style=${style || "realistic"} imageId=${String(image._id)}`
  );

  return res.status(200).json({
    success: true,
    message: "Image generated",
    creditBalance: remainingCredits,
    credits: remainingCredits,
    remainingCredits,
    imageUrl: serialized.imageUrl,
    resultImage: serialized.imageUrl,
    image: serialized,
  });
});

/** POST /api/images/edit — existing frontend contract (editPrompt + imageId). */
export const editImage = asyncHandler(runImageRefinement);

/** POST /api/images/refine — same handler; accepts refinementPrompt. */
export const refineImage = asyncHandler(runImageRefinement);

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

export const toggleImagePublic = asyncHandler(async (req, res) => {
  const image = await Image.findOne({
    _id: req.params.imageId,
    userId: req.user.id,
    deletedAt: null,
  });
  if (!image) {
    throw new AppError("Image not found", 404, "IMAGE_NOT_FOUND");
  }

  image.isPublic = !image.isPublic;
  await image.save();

  return res.status(200).json({ success: true, image: serializeImage(image, req) });
});

export const getPublicGallery = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 18), 50);
  const skip = (page - 1) * limit;

  const [images, total] = await Promise.all([
    Image.find({ isPublic: true, deletedAt: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "imageUrl prompt style provider isPublic likesCount viewsCount createdAt tags promptEnhanced"
      ),
    Image.countDocuments({ isPublic: true, deletedAt: null }),
  ]);

  return res.status(200).json({
    success: true,
    images: images.map((img) => serializeImage(img, req)),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const likePublicImage = asyncHandler(async (req, res) => {
  const image = await Image.findOneAndUpdate(
    { _id: req.params.imageId, isPublic: true, deletedAt: null },
    { $inc: { likesCount: 1 } },
    { new: true }
  );

  if (!image) {
    throw new AppError("Image not found", 404, "IMAGE_NOT_FOUND");
  }

  return res.status(200).json({ success: true, image: serializeImage(image, req) });
});

export const getPromptStyles = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    styles: Object.keys(PROMPT_STYLES).map((key) => ({ key, description: PROMPT_STYLES[key] })),
  });
});

export const previewEnhancedPrompt = asyncHandler(async (req, res) => {
  const { prompt, style } = req.body;
  return res.status(200).json({ success: true, promptEnhanced: enhancePrompt(prompt, style) });
});

/**
 * Cleanup helper: scans the caller's images and soft-deletes records whose
 * imageUrl points to a file that no longer exists. This is the recovery
 * path after Render redeploys wipe ephemeral /public/generated — we can't
 * restore the bytes, but we can purge the dead records so the gallery
 * looks consistent across accounts and devices.
 *
 * Optimization: any URL on res.cloudinary.com is trusted without a HEAD
 * request, both because Cloudinary is durable and because their endpoint
 * blocks unauthenticated HEAD on some plans.
 *
 * Returns { cleaned, checked, total }.
 */
const HEAD_TIMEOUT_MS = 6000;
const HEAD_CONCURRENCY = 6;

const isProbablyDurable = (url) => {
  if (typeof url !== "string") return false;
  return /\bres\.cloudinary\.com\b/i.test(url);
};

async function probeUrl(url) {
  try {
    const res = await axios.head(url, {
      timeout: HEAD_TIMEOUT_MS,
      validateStatus: () => true,
      maxRedirects: 3,
    });
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

async function pMapLimited(items, limit, mapper) {
  const out = new Array(items.length);
  let cursor = 0;
  const workers = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
    while (true) {
      const i = cursor++;
      if (i >= items.length) return;
      out[i] = await mapper(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

export const cleanupBrokenImages = asyncHandler(async (req, res) => {
  const images = await Image.find({ userId: req.user.id, deletedAt: null });

  const decisions = await pMapLimited(images, HEAD_CONCURRENCY, async (img) => {
    const url = absoluteImageUrl(img.imageUrl, req);
    if (isProbablyDurable(url)) return { img, broken: false, checked: false };
    const ok = await probeUrl(url);
    return { img, broken: !ok, checked: true };
  });

  const toDelete = decisions.filter((d) => d.broken).map((d) => d.img._id);
  if (toDelete.length) {
    await Image.updateMany(
      { _id: { $in: toDelete }, userId: req.user.id, deletedAt: null },
      { $set: { deletedAt: new Date() } }
    );
  }

  return res.status(200).json({
    success: true,
    total: images.length,
    checked: decisions.filter((d) => d.checked).length,
    cleaned: toDelete.length,
  });
});

