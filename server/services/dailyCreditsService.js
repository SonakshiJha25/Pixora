import { logError, logInfo, logWarn } from "../utils/logger.js";

const DAILY_CREDITS = 100;
const CREDITS_PER_IMAGE = 10;
const DAY_MS = 86400000;

/** Default: Indian Standard Time (IST). Set CREDITS_RESET_TIMEZONE=UTC to use UTC calendar days. */
const DEFAULT_CREDITS_RESET_IANA = "Asia/Kolkata";

/** IANA zone for daily rollover. Empty string means UTC calendar day. */
export function getCreditsResetTimezone() {
  const t = process.env.CREDITS_RESET_TIMEZONE?.trim();
  if (!t) return DEFAULT_CREDITS_RESET_IANA;
  if (t.toUpperCase() === "UTC") return "";
  return t;
}

function calendarDayKey(dateInput, tz) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (!tz || tz.toUpperCase() === "UTC") {
    const y = d.getUTCFullYear();
    const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${mo}-${day}`;
  }
  try {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return fmt.format(d);
  } catch (_err) {
    logWarn(`Invalid CREDITS_RESET_TIMEZONE "${tz}" — using Asia/Kolkata`);
    return calendarDayKey(d, DEFAULT_CREDITS_RESET_IANA);
  }
}

/** IST calendar date string YYYY-MM-DD (Asia/Kolkata wall clock). */
export function getTodayIstDateString(nowInput = new Date()) {
  return calendarDayKey(nowInput instanceof Date ? nowInput : new Date(nowInput), DEFAULT_CREDITS_RESET_IANA);
}

/**
 * Normalize DB value for last IST reset day — handles YYYY-MM-DD, ISO strings, or Dates.
 */
export function normalizeStoredIstDayKey(value) {
  if (value == null || value === "") return null;
  if (value instanceof Date) {
    const t = value.getTime();
    if (!Number.isFinite(t)) return null;
    return calendarDayKey(value, DEFAULT_CREDITS_RESET_IANA);
  }
  const s = String(value).trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const t = Date.parse(s);
  if (!Number.isFinite(t)) return null;
  return calendarDayKey(new Date(t), DEFAULT_CREDITS_RESET_IANA);
}

export async function ensureDailyCredits(user, { session } = {}) {
  if (user.credits == null && user.creditBalance != null) {
    user.credits = user.creditBalance;
  }

  let c = Math.round(Number(user.credits));
  if (!Number.isFinite(c)) c = 0;

  if (c > 0 && c < CREDITS_PER_IMAGE) {
    user.credits = c * CREDITS_PER_IMAGE;
    await user.save({ session });
  }

  const todayIst = getTodayIstDateString();

  let lastDay = normalizeStoredIstDayKey(user.lastCreditResetDate);

  // Backfill from legacy timestamp once per document so existing balances aren’t wiped mid–IST-day on deploy.
  if (!lastDay && user.dailyCreditResetAt) {
    lastDay = calendarDayKey(new Date(user.dailyCreditResetAt), DEFAULT_CREDITS_RESET_IANA);
  }

  const istDayChanged = !lastDay || lastDay !== todayIst;

  if (istDayChanged) {
    const who = user.email ? String(user.email) : `id:${String(user._id)}`;
    user.credits = DAILY_CREDITS;
    user.lastCreditResetDate = todayIst;
    user.dailyCreditResetAt = new Date();
    await user.save({ session });
    logInfo(`Daily credits reset for user: ${who} (IST day ${todayIst}, balance ${DAILY_CREDITS})`);
    return user.credits;
  }

  const storedKey = normalizeStoredIstDayKey(user.lastCreditResetDate);
  if (!storedKey && lastDay) {
    user.lastCreditResetDate = lastDay;
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

/** India Standard Time is fixed UTC+5:30 (no DST). */
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

function nextUtcMidnightAfter(nowMs) {
  const d = new Date(nowMs);
  const next = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0);
  return next;
}

/** Next 00:00:00 wall-clock in Asia/Kolkata, as an absolute UTC instant. */
function nextAsiaKolkataMidnightAfter(nowMs) {
  const startOfTodayIst = Math.floor((nowMs + IST_OFFSET_MS) / DAY_MS) * DAY_MS - IST_OFFSET_MS;
  let next = startOfTodayIst + DAY_MS;
  if (next <= nowMs) next += DAY_MS;
  return next;
}

/**
 * Next 00:00:00 in the configured zone (UTC or fixed-offset IST path for Asia/Kolkata).
 * ISO string for API/errors — refill is always “calendar midnight”, not a vague afternoon time.
 */
export function getNextResetAt(nowInput = new Date()) {
  const now = nowInput instanceof Date ? nowInput : new Date(nowInput);
  const tz = getCreditsResetTimezone();
  const t = now.getTime();

  if (!tz) {
    return new Date(nextUtcMidnightAfter(t)).toISOString();
  }

  if (tz === DEFAULT_CREDITS_RESET_IANA || tz === "Asia/Kolkata") {
    return new Date(nextAsiaKolkataMidnightAfter(t)).toISOString();
  }

  const keyNow = calendarDayKey(now, tz);
  let lo = t;
  let hi = lo + DAY_MS;
  let hops = 0;
  while (calendarDayKey(new Date(hi), tz) === keyNow) {
    hi += DAY_MS;
    hops += 1;
    if (hops > 400) {
      logError("Daily credits: getNextResetAt search bound exceeded — returning fallback instant", null);
      return new Date(hi).toISOString();
    }
  }

  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (calendarDayKey(new Date(mid), tz) !== keyNow) hi = mid;
    else lo = mid;
  }

  return new Date(hi).toISOString();
}

export function getCreditsResetTimezoneLabel() {
  const tz = getCreditsResetTimezone();
  if (!tz) return "UTC";
  if (tz === DEFAULT_CREDITS_RESET_IANA) return "IST";
  return tz;
}
