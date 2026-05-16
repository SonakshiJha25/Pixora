/** Tick display for countdowns — does not derive reset instants (those come only from API). */

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
