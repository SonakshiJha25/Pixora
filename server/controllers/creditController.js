import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import {
  getDailyCreditLimit,
  getCreditsPerImage,
  getNextResetAt,
  getCreditsResetTimezoneLabel,
} from "../services/dailyCreditsService.js";
import { useCreditsAtomic } from "../services/creditService.js";
import refreshUserCreditsFromDb from "../utils/refreshUserCreditsFromDb.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  picture: user.picture || null,
  role: user.role,
  creditBalance: user.credits,
});

export const getCredits = asyncHandler(async (req, res) => {
  const user = await refreshUserCreditsFromDb(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return res.status(200).json({
    success: true,
    credits: user.credits,
    remainingCredits: user.credits,
    dailyLimit: getDailyCreditLimit(),
    creditsPerImage: getCreditsPerImage(),
    nextResetAt: getNextResetAt(),
    dailyResetTimezone: getCreditsResetTimezoneLabel(),
    user: sanitizeUser(user),
  });
});

export const useCredits = asyncHandler(async (req, res) => {
  const raw = req.body.amount;
  let amount = 1;
  if (raw !== undefined && raw !== null && raw !== "") {
    amount = Number(raw);
  }
  if (!Number.isInteger(amount) || amount < 1) {
    throw new AppError("amount must be a positive integer", 400, "VALIDATION_ERROR");
  }

  const remaining = await useCreditsAtomic({ userId: req.user.id, amount });

  return res.status(200).json({
    success: true,
    credits: remaining,
    remainingCredits: remaining,
  });
});
