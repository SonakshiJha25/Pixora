import User from "../models/User.js";
import { ensureDailyCredits } from "../services/dailyCreditsService.js";

/**
 * Runs IST-midnight credit rollover via `nextCreditResetAt`, persists if needed, then reloads
 * the user so API responses reflect the canonical balance.
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
