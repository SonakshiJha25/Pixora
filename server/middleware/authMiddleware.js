import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token =
    authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.headers.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      error: { message: "Authentication required", code: "UNAUTHORIZED" },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        error: { message: "Invalid token", code: "INVALID_TOKEN" },
      });
    }
    req.user = { id: decoded.id, role: decoded.role || "user" };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token",
      error: { message: "Session expired or invalid token", code: "TOKEN_INVALID" },
    });
  }
}
