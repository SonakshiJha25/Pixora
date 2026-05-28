import jwt from "jsonwebtoken";

export default function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const legacyHeaderToken = req.headers.token;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : legacyHeaderToken;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.id) {
      req.user = { id: decoded.id, role: decoded.role || "user" };
    }
  } catch {
    req.user = undefined;
  }

  next();
}
