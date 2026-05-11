import mongoose from "mongoose";
import User from "../models/User.js";
import Image from "../models/Image.js";
import AppError from "../utils/appError.js";
import { ensureDailyCredits } from "./dailyCreditsService.js";

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

    if (user.credits < 1) {
      throw new AppError("Insufficient credits", 402, "INSUFFICIENT_CREDITS");
    }

    user.credits -= 1;
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

    await session.commitTransaction();
    return { image, remainingCredits: user.credits };
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
    return user.credits;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
