import mongoose from "mongoose";
import User from "../models/User.js";
import Image from "../models/Image.js";
import AppError from "../utils/appError.js";
import { ensureDailyCredits, getCreditsPerImage } from "./dailyCreditsService.js";
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
    if (user.credits < cost) {
      throw new AppError(
        "Daily image limit reached. Come back tomorrow.",
        402,
        "DAILY_LIMIT_REACHED"
      );
    }

    user.credits -= cost;
    await user.save({ session });

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
        },
      ],
      { session }
    );

    return { image, remainingCredits: user.credits, userEmail: user.email };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

export async function useCreditsAtomic({ userId, amount = 1 }) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
    await ensureDailyCredits(user, { session });
    if (user.credits < amount) {
      throw new AppError("Insufficient credits", 402, "INSUFFICIENT_CREDITS");
    }
    user.credits -= amount;
    await user.save({ session });
    await session.commitTransaction();
    logInfo(`Credits deducted: ${amount} (user: ${user.email}, remaining balance: ${user.credits})`);
    return user.credits;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
