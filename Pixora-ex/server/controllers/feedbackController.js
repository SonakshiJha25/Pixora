import Feedback from "../models/Feedback.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

export const createFeedback = asyncHandler(async (req, res) => {
  const { message, rating } = req.body;

  const trimmed = typeof message === "string" ? message.trim() : "";
  if (!trimmed) {
    throw new AppError("Message is required", 400, "VALIDATION_ERROR");
  }

  let ratingNum = undefined;
  if (rating !== undefined && rating !== null && rating !== "") {
    ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      throw new AppError("Rating must be an integer between 1 and 5", 400, "VALIDATION_ERROR");
    }
  }

  const payload = {
    message: trimmed,
    ...(ratingNum !== undefined ? { rating: ratingNum } : {}),
  };

  if (req.user?.id) {
    payload.userId = req.user.id;
  }

  await Feedback.create(payload);

  return res.status(201).json({
    success: true,
    message: "Feedback submitted successfully",
  });
});
