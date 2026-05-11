import User from "../models/User.js";
import AppError from "../utils/appError.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateAccessToken } from "../utils/generateToken.js";

export const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new AppError("Email is already in use", 409, "EMAIL_EXISTS");
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: passwordHash,
  });

  const token = generateAccessToken(user._id, user.role);
  return { token, user };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  if (!user) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
  }

  const token = generateAccessToken(user._id, user.role);
  user.password = undefined;
  return { token, user };
};
