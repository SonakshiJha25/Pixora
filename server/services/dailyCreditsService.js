import { logInfo } from "../utils/logger.js";

export const DAILY_CREDITS = 100;
export const CREDITS_PER_IMAGE = 10;
const DAY_MS = 86400000;
/** India Standard Time = UTC+5:30 (no DST). All daily resets use IST midnight only. */
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/**
 * UTC instant (ms) of the next 00:00 IST strictly after `fromMs`.
 */
export function getNextIstMidnightUtcMs(fromMs = Date.now()) {
  const t = typeof fromMs === "number" ? fromMs : new Date(fromMs).getTime();
  const startOfTodayIst = Math.floor((t + IST_OFFSET_MS) / DAY_MS) * DAY_MS - IST_OFFSET_MS;
  let next = startOfTodayIst + DAY_MS;
  if (next <= t) next += DAY_MS;
  return next;
}

/**
 * Valid balances: 0, 10, …, 100 only.
 */
export function snapCreditsToLedger(raw) {
  let n = Math.round(Number(raw));
  if (!Number.isFinite(n) || n < 0) return 0;
  n = Math.min(DAILY_CREDITS, n);
  return Math.floor(n / CREDITS_PER_IMAGE) * CREDITS_PER_IMAGE;
}

/**
 * Ensures daily pool is current for IST calendar boundaries and credits are on-ledger.
 * Uses `nextCreditResetAt` (UTC Date): when `now >= nextCreditResetAt`, credits reset to 100
 * and `nextCreditResetAt` advances to the following IST midnight.
 */
export async function ensureDailyCredits(user, { session } = {}) {
  const saveOpts = session ? { session } : {};
  let dirty = false;
  const nowMs = Date.now();

  const snapped = snapCreditsToLedger(user.credits);
  if (snapped !== user.credits) {
    user.credits = snapped;
    dirty = true;
  }

  let nextMs = user.nextCreditResetAt ? new Date(user.nextCreditResetAt).getTime() : NaN;
  if (!Number.isFinite(nextMs)) {
    user.nextCreditResetAt = new Date(getNextIstMidnightUtcMs(nowMs));
    dirty = true;
  } else if (nowMs >= nextMs) {
    user.credits = DAILY_CREDITS;
    user.nextCreditResetAt = new Date(getNextIstMidnightUtcMs(nowMs));
    dirty = true;
    const who = user.email ? String(user.email) : String(user._id);
    logInfo(
      `IST credit reset: user=${who} balance=${DAILY_CREDITS} nextResetAt=${user.nextCreditResetAt.toISOString()}`
    );
  }

  if (dirty) {
    await user.save(saveOpts);
  }

  user.credits = snapCreditsToLedger(user.credits);
  return user.credits;
}

export function getDailyCreditLimit() {
  return DAILY_CREDITS;
}

export function getCreditsPerImage() {
  return CREDITS_PER_IMAGE;
}

/** API helper: next IST midnight after `now` (ISO string). */
export function getNextIstResetIso(nowInput = new Date()) {
  const t = nowInput instanceof Date ? nowInput : new Date(nowInput);
  return new Date(getNextIstMidnightUtcMs(t.getTime())).toISOString();
}

/** @deprecated use getNextIstResetIso — kept for internal error payload compatibility */
export function getNextResetAt(nowInput = new Date()) {
  return getNextIstResetIso(nowInput);
}

export function getCreditsResetTimezoneLabel() {
  return "IST";
}
