import { getNextResetAt, getCreditsResetTimezoneLabel } from "../services/dailyCreditsService.js";
import { logError } from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";

  if (statusCode >= 500) {
    logError(`HTTP ${statusCode} ${req.method} ${req.originalUrl} (${code})`, err);
  }

  const errorPayload = {
    code,
    message: err.message || "Something went wrong",
    details: err.details || null,
  };

  if (code === "DAILY_LIMIT_REACHED" || code === "INSUFFICIENT_CREDITS") {
    errorPayload.nextResetAt = getNextResetAt();
    errorPayload.dailyResetTimezone = getCreditsResetTimezoneLabel();
  }

  res.status(statusCode).json({
    success: false,
    error: errorPayload,
  });
};

export default errorHandler;
