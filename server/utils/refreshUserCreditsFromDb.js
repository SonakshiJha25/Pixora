import mongoose from "mongoose";
import User from "../models/User.js";
import resetCreditsIfNewDay from "./resetCreditsIfNewDay.js";

/**
 * On authenticated routes wired with authedCredits: compare `lastCreditReset` (server date)
 * to today; refill if needed, reload user so handlers see MongoDB-canonical credits.
 */
export default async function refreshUserCreditsFromDb(userId, { session } = {}) {
  if (userId == null || userId === "") return null;
  if (!mongoose.isValidObjectId(userId)) return null;

  let user = session
    ? await User.findById(userId).session(session)
    : await User.findById(userId);
  if (!user) return null;

  await resetCreditsIfNewDay(user, { session });

  user = session ? await User.findById(userId).session(session) : await User.findById(userId);
  return user;
}
