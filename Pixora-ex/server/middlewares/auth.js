import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const legacyHeaderToken = req.headers.token;
  const queryToken =
    typeof req.query?.token === "string" && req.query.token.trim()
      ? req.query.token.trim()
      : null;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : legacyHeaderToken || queryToken;

  if (!token) {
    return next(new AppError("Not authorized. Login again.", 401, "UNAUTHORIZED"));
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecode?.id) {
      return next(new AppError("Invalid token payload", 401, "INVALID_TOKEN"));
    }

    req.user = { id: tokenDecode.id, role: tokenDecode.role || "user" };

    next();
  } catch (error) {
    return next(new AppError("Session expired. Login again.", 401, "TOKEN_EXPIRED"));
  }
};

export default userAuth;