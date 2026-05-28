import { logInfo } from "../utils/logger.js";

/** Same as tutorial `GENERATION_COST` — 10 credits per image. */
export const GENERATION_COST = 10;
const DAILY_CREDITS = 100;

/**
 * True when the server calendar day differs from the stored reset day.
 */
function isNewDay(lastCreditReset) {
  const today = new Date().toDateString();
  const lastReset = lastCreditReset ? new Date(lastCreditReset).toDateString() : "";
  if (!lastReset) return true;
  return lastReset !== today;
}

/**
 * If the calendar day changed → credits = 100, stamp last reset, save.
 * Call before deducting credits.
 */
export default async function resetCreditsIfNewDay(user, { session } = {}) {
  if (!user?._id) return 0;

  const saveOpts = session ? { session } : {};

  if (isNewDay(user.lastCreditReset)) {
    const before = user.credits;
    user.credits = DAILY_CREDITS;
    user.lastCreditReset = new Date();
    await user.save(saveOpts);
    const who = user.email?.trim() || String(user._id);
    logInfo(
      `[Credit Reset]\nUser: ${who}\nOld credits: ${before}\nNew credits: ${user.credits}`
    );
  }

  return user.credits;
}
