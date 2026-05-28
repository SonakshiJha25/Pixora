/** Tick display for countdowns — reset instants normally come from API; see `getNextIstMidnightIsoFallback`. */

const DAY_MS = 86400000;
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/**
 * Match `server/services/dailyCreditsService.js` — next IST 00:00 strictly after `fromMs` (UTC epoch).
 * Used only when the API has not yet returned `nextResetAt`.
 */
export function getNextIstMidnightUtcMs(fromMs = Date.now()) {
  const t = typeof fromMs === "number" ? fromMs : new Date(fromMs).getTime();
  const startOfTodayIst = Math.floor((t + IST_OFFSET_MS) / DAY_MS) * DAY_MS - IST_OFFSET_MS;
  let next = startOfTodayIst + DAY_MS;
  if (next <= t) next += DAY_MS;
  return next;
}

export function getNextIstMidnightIsoFallback(fromMs = Date.now()) {
  return new Date(getNextIstMidnightUtcMs(fromMs)).toISOString();
}

export function formatResetsInCountdown(diffMs) {
  if (diffMs <= 0) return "Updating…";
  const totalSec = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `Refills in ${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  }
  if (m > 0) return `Refills in ${m}m ${String(s).padStart(2, "0")}s`;
  return `Refills in ${s}s`;
}
