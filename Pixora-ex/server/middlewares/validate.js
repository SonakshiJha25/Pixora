import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    error: {
      code: "VALIDATION_ERROR",
      message: "Invalid request body",
      details: result.array(),
    },
  });
};

export default validate;
