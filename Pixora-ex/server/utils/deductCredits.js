import AppError from "./appError.js";
import { GENERATION_COST } from "./resetCreditsIfNewDay.js";

export { GENERATION_COST };

/**
 * Deduct one generation (10 credits). Call after `resetCreditsIfNewDay`.
 */
export default async function deductCredits(user, { session } = {}) {
  const balance = user.credits;

  if (balance < GENERATION_COST) {
    throw new AppError(
      "Not enough credits. Resets at midnight.",
      402,
      "INSUFFICIENT_CREDITS"
    );
  }

  user.credits = balance - GENERATION_COST;
  const saveOpts = session ? { session } : {};
  await user.save(saveOpts);
  return user.credits;
}
