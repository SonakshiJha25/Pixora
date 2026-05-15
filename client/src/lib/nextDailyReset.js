const DAY_MS = 86400000;
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/**
 * UTC instant (milliseconds) for the next 00:00:00 IST wall time.
 * IST uses fixed UTC+5:30 (no DST); matches server daily credit rollover math.
 */
export function getNextIstMidnightUtcMs(fromMs = Date.now()) {
  const t = typeof fromMs === "number" ? fromMs : new Date(fromMs).getTime();
  const startOfTodayIst = Math.floor((t + IST_OFFSET_MS) / DAY_MS) * DAY_MS - IST_OFFSET_MS;
  let next = startOfTodayIst + DAY_MS;
  if (next <= t) next += DAY_MS;
  return next;
}

/** Countdown phrase until next IST midnight, e.g. "Resets in 5h 12m". */
export function formatResetsInCountdown(diffMs) {
  if (diffMs <= 0) return "Resets soon";
  const totalSec = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `Resets in ${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `Resets in ${m}m ${String(s).padStart(2, "0")}s`;
  return `Resets in ${s}s`;
}

/** Next India midnight after `from`, as ISO UTC string (API fallback). */
export function getNextCalendarBoundaryIso(from = new Date()) {
  try {
    const t = (from instanceof Date ? from : new Date(from)).getTime();
    return new Date(getNextIstMidnightUtcMs(t)).toISOString();
  } catch {
    return null;
  }
}
