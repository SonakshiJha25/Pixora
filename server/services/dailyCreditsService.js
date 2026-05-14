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
  } catch (err) {
    console.warn("[dailyCredits] Invalid CREDITS_RESET_TIMEZONE — using IST (Asia/Kolkata):", tz, err?.message ?? err);
    return calendarDayKey(d, DEFAULT_CREDITS_RESET_IANA);
  }
}

export function sameCreditsCalendarDay(last, nowInput, tz) {
  if (!last) return false;
  const a = last instanceof Date ? last : new Date(last);
  const b = nowInput instanceof Date ? nowInput : new Date(nowInput);
  const zone = tz && tz.toUpperCase() !== "UTC" ? tz : "";
  return calendarDayKey(a, zone) === calendarDayKey(b, zone);
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

  const now = new Date();
  const tz = getCreditsResetTimezone();
  const last = user.dailyCreditResetAt ? new Date(user.dailyCreditResetAt) : null;

  if (!last || !sameCreditsCalendarDay(last, now, tz)) {
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
 * First instant strictly after now when the daily calendar key changes in the configured zone,
 * serialized as UTC ISO — used so users see when credits refresh next.
 */
export function getNextResetAt(nowInput = new Date()) {
  const now = nowInput instanceof Date ? nowInput : new Date(nowInput);
  const tz = getCreditsResetTimezone();

  if (!tz) {
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
    ).toISOString();
  }

  const keyNow = calendarDayKey(now, tz);
  let lo = now.getTime();
  let hi = lo + DAY_MS;
  let hops = 0;
  while (calendarDayKey(new Date(hi), tz) === keyNow) {
    hi += DAY_MS;
    hops += 1;
    if (hops > 400) {
      console.error("[dailyCredits] getNextResetAt: could not advance day key");
      return new Date(lo + DAY_MS).toISOString();
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
