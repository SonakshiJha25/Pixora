const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";

  if (statusCode >= 500) {
    console.error("[ERROR]", err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: err.message || "Something went wrong",
      details: err.details || null,
    },
  });
};

export default errorHandler;
