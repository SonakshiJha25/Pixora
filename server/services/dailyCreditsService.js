const DAILY_CREDITS = 100;
const CREDITS_PER_IMAGE = 10;

const sameUtcDay = (a, b) => {
  if (!a || !b) return false;
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
};

export async function ensureDailyCredits(user, { session } = {}) {
  if (user.credits == null && user.creditBalance != null) {
    user.credits = user.creditBalance;
  }

  const now = new Date();
  const last = user.dailyCreditResetAt ? new Date(user.dailyCreditResetAt) : null;

  if (!last || !sameUtcDay(last, now)) {
    user.credits = DAILY_CREDITS;
    user.dailyCreditResetAt = now;
    await user.save({ session });
  }

  return user.credits;
}

export function getDailyCreditLimit() {
  return DAILY_CREDITS;
}

export function getCreditsPerImage() {
  return CREDITS_PER_IMAGE;
}

/**
 * UTC midnight of the next day — used to tell users when their credits reset.
 */
export function getNextResetAt(now = new Date()) {
  const next = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
  );
  return next.toISOString();
}
