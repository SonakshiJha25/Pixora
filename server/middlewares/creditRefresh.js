import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import { areCreditsEnforced } from "../config/creditsEnabled.js";
import refreshUserCreditsFromDb from "../utils/refreshUserCreditsFromDb.js";

/** IST 00:00 rollover runs in Mongo via ensureDailyCredits — must run after JWT so req.user.id is set. */
export default async function creditRefreshMiddleware(req, res, next) {
  if (!areCreditsEnforced()) return next();

  try {
    if (!req.user?.id) return next();

    if (mongoose.connection.readyState !== 1) {
      throw new AppError(
        "Database is not connected. Set MONGODB_URI in server/.env and ensure MongoDB Atlas is reachable.",
        503,
        "DATABASE_UNAVAILABLE"
      );
    }

    await refreshUserCreditsFromDb(req.user.id);
    next();
  } catch (err) {
    next(err);
  }
}
