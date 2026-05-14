const DAY_MS = 86400000;

function dayKey(date, timeZone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Next moment (ms) when the calendar date changes in `timeZone`.
 * Used only as a UI fallback when the API does not send nextResetAt (older deploys).
 */
export function getNextCalendarBoundaryIso(from = new Date(), timeZone = "Asia/Kolkata") {
  try {
    const anchor = from instanceof Date ? from : new Date(from);
    const k0 = dayKey(anchor, timeZone);
    let lo = anchor.getTime();
    let hi = lo + DAY_MS;
    let guard = 0;
    while (dayKey(new Date(hi), timeZone) === k0 && guard++ < 400) hi += DAY_MS;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (dayKey(new Date(mid), timeZone) !== k0) hi = mid;
      else lo = mid;
    }
    return new Date(hi).toISOString();
  } catch {
    return null;
  }
}
