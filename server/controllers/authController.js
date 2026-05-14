import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { login, register } from "../services/authService.js";
import { ensureDailyCredits } from "../services/dailyCreditsService.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  picture: user.picture || null,
  role: user.role,
  creditBalance: user.credits,
});

export const registerUser = asyncHandler(async (req, res) => {
  const { token, user } = await register(req.body);
  const fresh = await User.findById(user._id);
  if (fresh) await ensureDailyCredits(fresh);
  return res.status(201).json({
    success: true,
    token,
    user: sanitizeUser(fresh || user),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { token, user } = await login(req.body);
  const fresh = await User.findById(user._id);
  if (fresh) await ensureDailyCredits(fresh);
  return res.status(200).json({
    success: true,
    token,
    user: sanitizeUser(fresh || user),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  await ensureDailyCredits(user);

  return res.status(200).json({ success: true, user: sanitizeUser(user) });
});
