import mongoose from "mongoose";
import User from "../models/User.js";
import { ensureDailyCredits } from "../services/dailyCreditsService.js";

/**
 * On authenticated routes wired with authedCredits: IST calendar-day bucket vs `dailyPoolIstDay`,
 * persist rollover if needed, reload user so handlers see MongoDB-canonical credits.
 */
export default async function refreshUserCreditsFromDb(userId, { session } = {}) {
  if (userId == null || userId === "") return null;
  if (!mongoose.isValidObjectId(userId)) return null;

  let user = session
    ? await User.findById(userId).session(session)
    : await User.findById(userId);
  if (!user) return null;

  await ensureDailyCredits(user, { session });

  user = session ? await User.findById(userId).session(session) : await User.findById(userId);
  return user;
}
