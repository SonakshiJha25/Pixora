import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import User from "../models/User.js";
import { applyDailyCreditReset } from "../utils/applyDailyCredits.js";

export const getCredits = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  await applyDailyCreditReset(user);

  return res.status(200).json({
    success: true,
    credits: user.credits,
    remainingCredits: user.credits,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      credits: user.credits,
      creditBalance: user.credits,
    },
  });
});
