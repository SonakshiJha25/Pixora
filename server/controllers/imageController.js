import Image from "../models/Image.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { deductCreditAndSaveImage } from "../services/creditService.js";
import { resolveGeneratedImageUrl } from "../services/imageService.js";
import { PROMPT_STYLES, enhancePrompt } from "../utils/promptStyles.js";

export const generateImage = asyncHandler(async (req, res) => {
  const { prompt, style, isPublic, tags } = req.body;

  const promptEnhanced = enhancePrompt(prompt, style);
  const imageUrl = await resolveGeneratedImageUrl({ prompt, promptEnhanced });

  const { image, remainingCredits } = await deductCreditAndSaveImage({
    userId: req.user.id,
    prompt,
    promptEnhanced,
    style,
    tags,
    isPublic,
    imageUrl,
    provider: "clipdrop",
  });

  return res.status(200).json({
    success: true,
    message: "Image generated",
    creditBalance: remainingCredits,
    imageUrl: image.imageUrl,
    remainingCredits,
    resultImage: image.imageUrl,
    image,
  });
});

export const getMyImages = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 12), 50);
  const skip = (page - 1) * limit;

  const [images, total] = await Promise.all([
    Image.find({ userId: req.user.id, deletedAt: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Image.countDocuments({ userId: req.user.id, deletedAt: null }),
  ]);

  return res.status(200).json({
    success: true,
    images,
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

  return res.status(200).json({ success: true, image });
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

  return res.status(200).json({ success: true, image });
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

  const mapped = images.map((doc) => {
    const j = doc.toJSON({ virtuals: true });
    return j;
  });

  return res.status(200).json({
    success: true,
    images: mapped,
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

  return res.status(200).json({ success: true, image });
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
