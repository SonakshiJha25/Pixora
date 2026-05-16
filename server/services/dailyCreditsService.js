import { logInfo } from "../utils/logger.js";

export const DAILY_CREDITS = 100;
export const CREDITS_PER_IMAGE = 10;
const DAY_MS = 86400000;
/** India Standard Time = UTC+5:30 (no DST). All daily resets use IST midnight only (calendar, not rolling 24h). */
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/** Integer bucket for which IST calendar day a UTC instant falls into (deterministic daily rollover). */
export function istCalendarDayIndexUtc(utcMs = Date.now()) {
  const t = typeof utcMs === "number" ? utcMs : new Date(utcMs).getTime();
  if (!Number.isFinite(t)) return Math.floor((Date.now() + IST_OFFSET_MS) / DAY_MS);
  return Math.floor((t + IST_OFFSET_MS) / DAY_MS);
}

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
 * Migrate legacy docs: derive last IST pool bucket from legacy `dailyCreditResetAt`.
 * Before that instant → assume pool matches today's IST bucket; once past → previous bucket triggers rollover next line.
 */
function deriveInitialDailyPoolDayFromLegacy(user, nowMs, currKey) {
  if (!user.dailyCreditResetAt) return currKey;
  const n = new Date(user.dailyCreditResetAt).getTime();
  if (!Number.isFinite(n)) return currKey;
  if (nowMs < n) return currKey;
  return currKey - 1;
}

/**
 * IST calendar-day rollover in MongoDB (source of truth). Also keeps `dailyCreditResetAt`
 * aligned as the upcoming IST midnight for API/countdown UX.
 */
export async function ensureDailyCredits(user, { session } = {}) {
  const saveOpts = session ? { session } : {};
  let dirty = false;
  const nowMs = Date.now();
  const userIdShort = user?._id != null ? String(user._id) : "?";
  const who = formatCreditLogUser(user);

  const snapped = snapCreditsToLedger(user.credits);
  if (snapped !== user.credits) {
    user.credits = snapped;
    dirty = true;
  }

  const currKey = istCalendarDayIndexUtc(nowMs);
  console.log("[Credits] Checking credit reset for user", userIdShort, who);

  let poolDay =
    typeof user.dailyPoolIstDay === "number" && Number.isFinite(user.dailyPoolIstDay)
      ? user.dailyPoolIstDay
      : null;

  if (poolDay === null || poolDay === undefined) {
    poolDay = deriveInitialDailyPoolDayFromLegacy(user, nowMs, currKey);
    user.dailyPoolIstDay = poolDay;
    dirty = true;
  }

  let nextMs = user.dailyCreditResetAt ? new Date(user.dailyCreditResetAt).getTime() : NaN;
  const canonicalNext = getNextIstMidnightUtcMs(nowMs);
  const STUCK_ZERO_SCHEDULE_EPS_MS = 60 * 1000;

  if (
    snapCreditsToLedger(user.credits) === 0 &&
    Number.isFinite(nextMs) &&
    nextMs > canonicalNext + STUCK_ZERO_SCHEDULE_EPS_MS
  ) {
    user.dailyCreditResetAt = new Date(canonicalNext);
    user.credits = DAILY_CREDITS;
    user.dailyPoolIstDay = currKey;
    user.lastCreditResetAt = new Date(nowMs);
    dirty = true;
    nextMs = canonicalNext;
    console.log("[Credits] Repaired skewed zero-balance reset schedule → user", userIdShort);
    logInfo(
      `[Credit Reset — schedule repair]\nUser: ${who}\nReason: 0 credits but dailyCreditResetAt was ahead of IST\nNew Credits: ${user.credits}\nNext Reset: ${user.dailyCreditResetAt.toISOString()}`
    );
  }

  if (!Number.isFinite(nextMs) || !user.dailyCreditResetAt) {
    user.dailyCreditResetAt = new Date(getNextIstMidnightUtcMs(nowMs));
    dirty = true;
  }

  if (currKey > poolDay) {
    const oldCredits = snapCreditsToLedger(user.credits);
    user.credits = DAILY_CREDITS;
    user.dailyPoolIstDay = currKey;
    user.lastCreditResetAt = new Date(nowMs);
    user.dailyCreditResetAt = new Date(getNextIstMidnightUtcMs(nowMs));
    dirty = true;
    console.log("[Credits] Credits reset successfully — user:", userIdShort, "was", oldCredits, "→", user.credits);
    console.log("[Credits] Next reset at:", user.dailyCreditResetAt.toISOString());
    logInfo(
      `[Credit Reset IST day]\nUser: ${who}\nOld Credits: ${oldCredits}\nNew Credits: ${user.credits}\nPool IST day idx: ${currKey}\nNext Reset: ${user.dailyCreditResetAt.toISOString()}`
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
