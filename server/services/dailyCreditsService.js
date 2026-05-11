const DAILY_CREDITS = 10;

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
