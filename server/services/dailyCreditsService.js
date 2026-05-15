import { logInfo } from "../utils/logger.js";

export const DAILY_CREDITS = 100;
export const CREDITS_PER_IMAGE = 10;
const DAY_MS = 86400000;
/** India Standard Time = UTC+5:30 (no DST). All daily resets use IST midnight only (calendar, not rolling 24h). */
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
 * Valid balances only: 0, 10, …, 100. Never negative.
 */
export function snapCreditsToLedger(raw) {
  let n = Math.round(Number(raw));
  if (!Number.isFinite(n)) n = 0;
  n = Math.max(0, Math.min(DAILY_CREDITS, n));
  return Math.floor(n / CREDITS_PER_IMAGE) * CREDITS_PER_IMAGE;
}

function formatCreditLogUser(user) {
  if (user?.email) return String(user.email).trim();
  return String(user?._id ?? user?.id ?? "unknown");
}

/**
 * Ensures daily pool matches IST midnight cutover and credits snap to ledger.
 * `dailyCreditResetAt` holds the UTC instant of the upcoming IST midnight when credits reset.
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

  let nextMs = user.dailyCreditResetAt ? new Date(user.dailyCreditResetAt).getTime() : NaN;

  const who = formatCreditLogUser(user);

  if (!Number.isFinite(nextMs)) {
    user.dailyCreditResetAt = new Date(getNextIstMidnightUtcMs(nowMs));
    dirty = true;
  } else if (nowMs >= nextMs) {
    const oldCredits = snapCreditsToLedger(user.credits);
    user.credits = DAILY_CREDITS;
    user.dailyCreditResetAt = new Date(getNextIstMidnightUtcMs(nowMs));
    dirty = true;
    logInfo(
      `[Credit Reset]\nUser: ${who}\nOld Credits: ${oldCredits}\nNew Credits: ${user.credits}\nNext Reset: ${user.dailyCreditResetAt.toISOString()}`
    );
  }

  if (dirty) {
    await user.save(saveOpts);
    user.credits = snapCreditsToLedger(user.credits);
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
