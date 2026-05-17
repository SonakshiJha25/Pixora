import { logInfo } from "../utils/logger.js";

export const DAILY_CREDITS = 100;
export const CREDITS_PER_IMAGE = 10;
const DAY_MS = 86400000;
/** India Standard Time = UTC+5:30 (no DST). Daily reset at IST midnight only. */
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

const IST_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * IST calendar date as `YYYY-MM-DD` (reset bucket — no timestamps stored for logic).
 * @param {number} [utcMs]
 */
export function getIstDateString(utcMs = Date.now()) {
  const t = typeof utcMs === "number" ? utcMs : new Date(utcMs).getTime();
  const base = Number.isFinite(t) ? t : Date.now();
  const ist = new Date(base + IST_OFFSET_MS);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, "0");
  const d = String(ist.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isValidIstDateString(value) {
  return typeof value === "string" && IST_DATE_RE.test(value);
}

/**
 * UTC instant (ms) of the next 00:00 IST strictly after `fromMs` (API countdown only).
 */
export function getNextIstMidnightUtcMs(fromMs = Date.now()) {
  const t = typeof fromMs === "number" ? fromMs : new Date(fromMs).getTime();
  const startOfTodayIst = Math.floor((t + IST_OFFSET_MS) / DAY_MS) * DAY_MS - IST_OFFSET_MS;
  let next = startOfTodayIst + DAY_MS;
  if (next <= t) next += DAY_MS;
  return next;
}

/** Valid balances only: 0, 10, …, 100. */
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
 * Pure IST midnight rollover: compare stored `lastCreditResetDate` to today's IST date.
 * @returns {{ credits: number, lastCreditResetDate: string, didReset: boolean, initialized: boolean, creditsBefore?: number }}
 */
export function evaluateIstDailyCreditReset(
  rawCredits,
  lastCreditResetDate,
  nowMs = Date.now()
) {
  const todayIst = getIstDateString(nowMs);
  let credits = snapCreditsToLedger(rawCredits);
  const stored =
    typeof lastCreditResetDate === "string" ? lastCreditResetDate.trim() : "";

  if (!isValidIstDateString(stored)) {
    return {
      credits,
      lastCreditResetDate: todayIst,
      didReset: false,
      initialized: true,
    };
  }

  if (stored !== todayIst) {
    const creditsBefore = credits;
    credits = DAILY_CREDITS;
    return {
      credits,
      lastCreditResetDate: todayIst,
      didReset: true,
      initialized: false,
      creditsBefore,
    };
  }

  return {
    credits,
    lastCreditResetDate: stored,
    didReset: false,
    initialized: false,
  };
}

/**
 * IST calendar-day rollover in MongoDB. Source of truth: `lastCreditResetDate` (`YYYY-MM-DD`).
 */
export async function ensureDailyCredits(user, { session } = {}) {
  const saveOpts = session ? { session } : {};
  const nowMs = Date.now();
  const userIdShort = user?._id != null ? String(user._id) : "?";
  const who = formatCreditLogUser(user);
  const todayIst = getIstDateString(nowMs);
  const storedBefore = user.lastCreditResetDate ?? null;
  const creditsBefore = snapCreditsToLedger(user.credits);

  console.log("[Credits] check user", userIdShort, who);
  console.log("[Credits] current IST date:", todayIst);
  console.log("[Credits] stored reset date:", storedBefore ?? "(none)");
  console.log("[Credits] credits before reset:", creditsBefore);

  const outcome = evaluateIstDailyCreditReset(user.credits, user.lastCreditResetDate, nowMs);

  user.credits = outcome.credits;
  user.lastCreditResetDate = outcome.lastCreditResetDate;

  const dirty =
    outcome.didReset ||
    outcome.initialized ||
    creditsBefore !== outcome.credits ||
    storedBefore !== outcome.lastCreditResetDate;

  if (outcome.didReset) {
    console.log("[Credits] credits after reset:", user.credits);
    logInfo(
      `[Credit Reset IST midnight]\nUser: ${who}\nIST today: ${todayIst}\nStored date was: ${storedBefore}\nOld Credits: ${outcome.creditsBefore}\nNew Credits: ${user.credits}`
    );
  } else if (outcome.initialized) {
    console.log("[Credits] initialized lastCreditResetDate:", user.lastCreditResetDate);
    console.log("[Credits] credits after init (unchanged):", user.credits);
  } else {
    console.log("[Credits] no reset — same IST day");
    console.log("[Credits] credits after check:", user.credits);
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

/** Next IST midnight after `now` (ISO string) — computed for clients, not stored. */
export function getNextIstResetIso(nowInput = new Date()) {
  const t = nowInput instanceof Date ? nowInput : new Date(nowInput);
  return new Date(getNextIstMidnightUtcMs(t.getTime())).toISOString();
}

/** @deprecated alias */
export function getNextResetAt(nowInput = new Date()) {
  return getNextIstResetIso(nowInput);
}

export function getCreditsResetTimezoneLabel() {
  return "IST";
}
