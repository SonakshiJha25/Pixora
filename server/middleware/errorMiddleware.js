export default function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode >= 500) {
    console.error("[Server]", message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      message,
      code: err.code || "ERROR",
      ...(err.details ? { details: err.details } : {}),
    },
  });
}
