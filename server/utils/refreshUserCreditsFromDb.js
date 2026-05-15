import User from "../models/User.js";
import { ensureDailyCredits } from "../services/dailyCreditsService.js";

/**
 * On every authenticated credits/guard path: IST-midnight check via dailyCreditResetAt,
 * persist if needed, reload user from MongoDB so responses show the canonical balance.
 */
export default async function refreshUserCreditsFromDb(userId, { session } = {}) {
  let user = session
    ? await User.findById(userId).session(session)
    : await User.findById(userId);
  if (!user) return null;

  await ensureDailyCredits(user, { session });

  user = session ? await User.findById(userId).session(session) : await User.findById(userId);
  return user;
}
