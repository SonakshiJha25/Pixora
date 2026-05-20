import mongoose from "mongoose";
import User from "../models/User.js";
import Image from "../models/Image.js";
import AppError from "../utils/appError.js";
import resetCreditsIfNewDay from "../utils/resetCreditsIfNewDay.js";
import deductCredits from "../utils/deductCredits.js";
import { logInfo } from "../utils/logger.js";

function creditLogUser(email, fallbackId) {
  const e = email && String(email).trim();
  return e || String(fallbackId ?? "unknown");
}

function buildNewImageDoc({ userId, prompt, promptEnhanced, style, imageUrl, tags, isPublic, provider }) {
  return {
    userId,
    prompt: prompt.trim(),
    promptEnhanced: (promptEnhanced || prompt).trim(),
    style: style || "realistic",
    tags: Array.isArray(tags) ? tags.slice(0, 8) : [],
    isPublic: Boolean(isPublic),
    imageUrl,
    provider,
    parentImageId: null,
    isEdit: false,
    generationKind: "generate",
    editPrompt: null,
    refinementPrompt: null,
    originalPrompt: prompt.trim(),
    version: 1,
  };
}

export async function deductCreditAndSaveImage({
  userId,
  prompt,
  promptEnhanced,
  style,
  imageUrl,
  tags,
  isPublic,
  provider = "mock",
}) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    await resetCreditsIfNewDay(user, { session });

    const balanceBefore = user.credits;
    await deductCredits(user, { session });
    const balanceAfter = user.credits;

    const [image] = await Image.create(
      [buildNewImageDoc({ userId, prompt, promptEnhanced, style, imageUrl, tags, isPublic, provider })],
      { session }
    );

    await Image.findByIdAndUpdate(image._id, { $set: { threadRootId: image._id } }, { session });

    await session.commitTransaction();

    const who = creditLogUser(user.email, userId);
    logInfo(
      `[Credit Deducted]\nUser: ${who}\nBefore: ${balanceBefore}\nAfter: ${balanceAfter}\nReason: new_generation`
    );
    logInfo(
      `Image saved: userId=${String(userId).slice(-8)} imageId=${String(image._id)} url=${String(imageUrl).slice(0, 120)}`
    );

    return { image, remainingCredits: balanceAfter, userEmail: user.email };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
