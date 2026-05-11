import { validationResult } from "express-validator";

export default function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  return res.status(400).json({
    success: false,
    message: "Validation failed",
    error: {
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: result.array(),
    },
  });
}
