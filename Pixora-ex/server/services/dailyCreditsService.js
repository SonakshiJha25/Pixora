import { logInfo } from "../utils/logger.js";

async function getUserModel() {
  const { default: User } = await import("../models/User.js");
  return User;
}

export const DAILY_CREDITS = 100;
export const CREDITS_PER_IMAGE = 10;
const DAY_MS = 86400000;
/** India Standard Time = UTC+5:30 (no DST). Daily reset at 00:00 IST only. */
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
 * IST 00:00 rollover — if stored date is not today's IST date → credits = 100.
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

  if (!isValidIstDateString(stored) || stored !== todayIst) {
    const creditsBefore = credits;
    const isNewDay = isValidIstDateString(stored) && stored !== todayIst;
    return {
      credits: DAILY_CREDITS,
      lastCreditResetDate: todayIst,
      didReset: true,
      initialized: !isValidIstDateString(stored),
      creditsBefore: isNewDay || !isValidIstDateString(stored) ? creditsBefore : undefined,
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
  if (!user?._id) return snapCreditsToLedger(user?.credits);

  const saveOpts = session ? { session } : {};
  const nowMs = Date.now();
  const userIdShort = user?._id != null ? String(user._id) : "?";
  const who = formatCreditLogUser(user);
  const todayIst = getIstDateString(nowMs);
  const storedBefore = user.lastCreditResetDate ?? null;
  const creditsBefore = snapCreditsToLedger(user.credits);

  const outcome = evaluateIstDailyCreditReset(user.credits, user.lastCreditResetDate, nowMs);

  const snapped = snapCreditsToLedger(outcome.credits);
  const dirty =
    outcome.didReset ||
    outcome.initialized ||
    creditsBefore !== snapped ||
    storedBefore !== outcome.lastCreditResetDate;

  if (outcome.didReset) {
    logInfo(
      `[Credit Reset IST 00:00]\nUser: ${who}\nIST today: ${todayIst}\nStored date was: ${storedBefore ?? "(none)"}\nOld credits: ${outcome.creditsBefore ?? creditsBefore}\nNew credits: ${snapped}`
    );
  }

  if (dirty) {
    const User = await getUserModel();
    await User.updateOne(
      { _id: user._id },
      { $set: { credits: snapped, lastCreditResetDate: outcome.lastCreditResetDate } },
      saveOpts
    );
    user.credits = snapped;
    user.lastCreditResetDate = outcome.lastCreditResetDate;
  } else {
    user.credits = snapped;
  }

  return user.credits;
}

/**
 * On API startup: anyone whose `lastCreditResetDate` is not today (IST) gets 100 credits.
 */
export async function refillStaleCreditPoolsForToday() {
  const User = await getUserModel();
  const todayIst = getIstDateString();
  const result = await User.updateMany(
    { lastCreditResetDate: { $ne: todayIst } },
    { $set: { credits: DAILY_CREDITS, lastCreditResetDate: todayIst } }
  );
  if (result.modifiedCount > 0) {
    logInfo(`[Credits] IST 00:00 bulk refill: ${result.modifiedCount} user(s) → ${DAILY_CREDITS} credits`);
  }
  return result.modifiedCount;
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
