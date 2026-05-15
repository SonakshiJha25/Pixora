import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import {
  getDailyCreditLimit,
  getCreditsPerImage,
  getCreditsResetTimezoneLabel,
} from "../services/dailyCreditsService.js";
import { useCreditsAtomic } from "../services/creditService.js";
import refreshUserCreditsFromDb from "../utils/refreshUserCreditsFromDb.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  credits: user.credits,
  creditBalance: user.credits,
  nextCreditResetAt: user.nextCreditResetAt
    ? user.nextCreditResetAt.toISOString()
    : null,
});

export const getCredits = asyncHandler(async (req, res) => {
  const user = await refreshUserCreditsFromDb(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  const nextResetAt = user.nextCreditResetAt
    ? user.nextCreditResetAt.toISOString()
    : null;

  return res.status(200).json({
    success: true,
    credits: user.credits,
    remainingCredits: user.credits,
    dailyLimit: getDailyCreditLimit(),
    creditsPerImage: getCreditsPerImage(),
    nextResetAt,
    dailyResetTimezone: getCreditsResetTimezoneLabel(),
    user: sanitizeUser(user),
  });
});

export const useCredits = asyncHandler(async (req, res) => {
  const cost = getCreditsPerImage();
  const raw = req.body?.amount;
  let amount = cost;
  if (raw !== undefined && raw !== null && raw !== "") {
    amount = Number(raw);
  }
  if (!Number.isInteger(amount) || amount !== cost) {
    throw new AppError(`amount must be exactly ${cost}`, 400, "VALIDATION_ERROR");
  }

  const remaining = await useCreditsAtomic({ userId: req.user.id, amount });

  return res.status(200).json({
    success: true,
    credits: remaining,
    remainingCredits: remaining,
  });
});
