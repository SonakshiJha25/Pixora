import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";
import { login, register } from "../services/authService.js";
import refreshUserCreditsFromDb from "../utils/refreshUserCreditsFromDb.js";
import { logInfo } from "../utils/logger.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  credits: user.credits,
  creditBalance: user.credits,
  dailyCreditResetAt: user.dailyCreditResetAt
    ? user.dailyCreditResetAt.toISOString()
    : null,
});

export const registerUser = asyncHandler(async (req, res) => {
  const { token, user } = await register(req.body);
  const fresh = await refreshUserCreditsFromDb(user._id);
  if (!fresh) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  logInfo(`User signed up: ${fresh.email}`);
  return res.status(201).json({
    success: true,
    token,
    user: sanitizeUser(fresh),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { token, user } = await login(req.body);
  const fresh = await refreshUserCreditsFromDb(user._id);
  if (!fresh) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }
  logInfo(`User logged in: ${fresh.email}`);
  return res.status(200).json({
    success: true,
    token,
    user: sanitizeUser(fresh),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await refreshUserCreditsFromDb(req.user.id);
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return res.status(200).json({ success: true, user: sanitizeUser(user) });
});
