import mongoose from "mongoose";
import User from "../models/User.js";
import Image from "../models/Image.js";
import AppError from "../utils/appError.js";
import {
  ensureDailyCredits,
  getCreditsPerImage,
  snapCreditsToLedger,
} from "./dailyCreditsService.js";
import { logInfo } from "../utils/logger.js";

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

    await ensureDailyCredits(user, { session });

    const cost = getCreditsPerImage();

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

    const ledger = snapCreditsToLedger(updated.credits);
    if (ledger !== updated.credits) {
      updated.credits = ledger;
      await updated.save({ session });
    }

    const [image] = await Image.create(
      [
        {
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
          editPrompt: null,
          originalPrompt: prompt.trim(),
        },
      ],
      { session }
    );

    await Image.findByIdAndUpdate(image._id, { $set: { threadRootId: image._id } }, { session });

    await session.commitTransaction();

    const who = updated.email ? String(updated.email) : String(userId);
    logInfo(
      `Credit deduction: user=${who} -${cost} remaining=${updated.credits} imageId=${String(image._id)}`
    );
    logInfo(
      `Image saved: userId=${String(userId).slice(-8)} imageId=${String(image._id)} url=${String(imageUrl).slice(0, 120)}`
    );

    return { image, remainingCredits: updated.credits, userEmail: updated.email };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

/**
 * Atomic deduction used by POST /api/credits/use. Only the per-image cost is allowed.
 */
export async function useCreditsAtomic({ userId, amount }) {
  const cost = getCreditsPerImage();
  if (amount !== cost) {
    throw new AppError(`amount must be exactly ${cost}`, 400, "VALIDATION_ERROR");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
    await ensureDailyCredits(user, { session });

    const updated = await User.findOneAndUpdate(
      { _id: userId, credits: { $gte: cost } },
      { $inc: { credits: -cost } },
      { session, new: true }
    );

    if (!updated) {
      throw new AppError("Insufficient credits", 402, "INSUFFICIENT_CREDITS");
    }

    const ledger = snapCreditsToLedger(updated.credits);
    if (ledger !== updated.credits) {
      updated.credits = ledger;
      await updated.save({ session });
    }

    await session.commitTransaction();
    logInfo(
      `Credit deduction (use endpoint): user=${updated.email || userId} -${cost} remaining=${updated.credits}`
    );
    return updated.credits;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
