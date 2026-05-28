/**
 * Lightweight daily credits — reset if calendar day changed, then optional deduct.
 * Used by generate (deduct) and me/credits (reset only).
 */
const GENERATION_COST = 10;

function lastResetDay(user) {
  if (user.lastCreditReset) {
    return new Date(user.lastCreditReset).toDateString();
  }
  const legacy = user.lastCreditResetDate;
  if (typeof legacy === "string" && /^\d{4}-\d{2}-\d{2}$/.test(legacy.trim())) {
    const [y, m, d] = legacy.trim().split("-").map(Number);
    return new Date(y, m - 1, d).toDateString();
  }
  return new Date(0).toDateString();
}

/** Reset to 100 on a new calendar day; saves when changed. */
export async function applyDailyCreditReset(user) {
  const today = new Date().toDateString();
  const lastReset = lastResetDay(user);

  if (today !== lastReset) {
    user.credits = 100;
    user.lastCreditReset = new Date();
    await user.save();
  }

  return user.credits;
}

/** Call after reset. Returns remaining credits or throws 403-shaped payload. */
export function deductDailyCredits(user) {
  if (user.credits < GENERATION_COST) {
    return {
      ok: false,
      status: 403,
      body: { success: false, message: "Come back tomorrow 💫" },
    };
  }
  user.credits -= GENERATION_COST;
  return { ok: true };
}

export { GENERATION_COST };
