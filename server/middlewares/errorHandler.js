import { getNextResetAt } from "../services/dailyCreditsService.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";

  if (statusCode >= 500) {
    console.error("[ERROR]", err);
  }

  const errorPayload = {
    code,
    message: err.message || "Something went wrong",
    details: err.details || null,
  };

  if (code === "DAILY_LIMIT_REACHED" || code === "INSUFFICIENT_CREDITS") {
    errorPayload.nextResetAt = getNextResetAt();
  }

  res.status(statusCode).json({
    success: false,
    error: errorPayload,
  });
};

export default errorHandler;
