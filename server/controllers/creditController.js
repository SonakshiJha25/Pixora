import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import {
  getDailyCreditLimit,
  getCreditsPerImage,
  getCreditsResetTimezoneLabel,
  getNextIstResetIso,
} from "../services/dailyCreditsService.js";
import { useCreditsAtomic } from "../services/creditService.js";
import refreshUserCreditsFromDb from "../utils/refreshUserCreditsFromDb.js";

const nextResetIso = () => getNextIstResetIso();

const sanitizeUser = (user) => {
  const nextResetAt = nextResetIso();
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    credits: user.credits,
    creditBalance: user.credits,
    lastCreditResetDate: user.lastCreditResetDate,
    dailyCreditResetAt: nextResetAt,
    nextCreditResetAt: nextResetAt,
    nextResetAt,
  };
};

export const getCredits = asyncHandler(async (req, res) => {
  const user = await refreshUserCreditsFromDb(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  const nextResetAt = nextResetIso();

  return res.status(200).json({
    success: true,
    credits: user.credits,
    remainingCredits: user.credits,
    dailyLimit: getDailyCreditLimit(),
    creditsPerImage: getCreditsPerImage(),
    lastCreditResetDate: user.lastCreditResetDate,
    nextResetAt,
    dailyCreditResetAt: nextResetAt,
    nextCreditResetAt: nextResetAt,
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
