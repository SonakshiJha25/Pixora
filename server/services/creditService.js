import mongoose from "mongoose";
import User from "../models/User.js";
import Image from "../models/Image.js";
import AppError from "../utils/appError.js";
import { areCreditsEnforced } from "../config/creditsEnabled.js";
import {
  ensureDailyCredits,
  getCreditsPerImage,
  snapCreditsToLedger,
} from "./dailyCreditsService.js";
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

async function saveImageWithoutCreditDeduction(
  { userId, prompt, promptEnhanced, style, imageUrl, tags, isPublic, provider },
  session
) {
  const user = await User.findById(userId).session(session);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  const [image] = await Image.create([buildNewImageDoc({ userId, prompt, promptEnhanced, style, imageUrl, tags, isPublic, provider })], {
    session,
  });

  await Image.findByIdAndUpdate(image._id, { $set: { threadRootId: image._id } }, { session });

  const balance = snapCreditsToLedger(user.credits);
  logInfo(
    `Image saved (credits disabled): userId=${String(userId).slice(-8)} imageId=${String(image._id)}`
  );

  return { image, remainingCredits: balance, userEmail: user.email };
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
    if (!areCreditsEnforced()) {
      const result = await saveImageWithoutCreditDeduction(
        { userId, prompt, promptEnhanced, style, imageUrl, tags, isPublic, provider },
        session
      );
      await session.commitTransaction();
      return result;
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    await ensureDailyCredits(user, { session });

    const cost = getCreditsPerImage();
    const balanceBefore = snapCreditsToLedger(user.credits);

    if (balanceBefore < cost) {
      throw new AppError(
        "Daily image limit reached. Come back tomorrow.",
        402,
        "DAILY_LIMIT_REACHED"
      );
    }

    const updated = await User.findOneAndUpdate(
      { _id: userId, credits: { $gte: cost } },
      { $inc: { credits: -cost } },
      { session, new: true }
    );

    if (!updated) {
      throw new AppError(
        "Daily image limit reached. Come back tomorrow.",
        402,
        "DAILY_LIMIT_REACHED"
      );
    }

    let balanceAfter = Math.max(0, snapCreditsToLedger(updated.credits));
    if (balanceAfter !== updated.credits) {
      updated.credits = balanceAfter;
      await updated.save({ session });
    }

    const [image] = await Image.create(
      [buildNewImageDoc({ userId, prompt, promptEnhanced, style, imageUrl, tags, isPublic, provider })],
      { session }
    );

    await Image.findByIdAndUpdate(image._id, { $set: { threadRootId: image._id } }, { session });

    await session.commitTransaction();

    const who = creditLogUser(updated.email, userId);
    logInfo(
      `[Credit Deducted]\nUser: ${who}\nBefore: ${balanceBefore}\nAfter: ${balanceAfter}\nReason: new_generation`
    );
    logInfo(
      `Image saved: userId=${String(userId).slice(-8)} imageId=${String(image._id)} url=${String(imageUrl).slice(0, 120)}`
    );

    return { image, remainingCredits: balanceAfter, userEmail: updated.email };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

/** Atomic deduction for POST /api/credits/use; same ledger rules as new generation deduction. */
export async function useCreditsAtomic({ userId, amount }) {
  const cost = getCreditsPerImage();
  if (amount !== cost) {
    throw new AppError(`amount must be exactly ${cost}`, 400, "VALIDATION_ERROR");
  }

  if (!areCreditsEnforced()) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
    return snapCreditsToLedger(user.credits);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
    await ensureDailyCredits(user, { session });
    const balanceBefore = snapCreditsToLedger(user.credits);

    if (balanceBefore < cost) {
      throw new AppError("Insufficient credits", 402, "INSUFFICIENT_CREDITS");
    }

    const updated = await User.findOneAndUpdate(
      { _id: userId, credits: { $gte: cost } },
      { $inc: { credits: -cost } },
      { session, new: true }
    );

    if (!updated) {
      throw new AppError("Insufficient credits", 402, "INSUFFICIENT_CREDITS");
    }

    let balanceAfter = Math.max(0, snapCreditsToLedger(updated.credits));
    if (balanceAfter !== updated.credits) {
      updated.credits = balanceAfter;
      await updated.save({ session });
    }

    await session.commitTransaction();

    const who = creditLogUser(updated.email, userId);
    logInfo(
      `[Credit Deducted]\nUser: ${who}\nBefore: ${balanceBefore}\nAfter: ${balanceAfter}\nReason: manual_use_endpoint`
    );

    return balanceAfter;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
