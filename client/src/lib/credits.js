/** Match server/services/dailyCreditsService.js — UI helpers only */
export const DAILY_CREDITS_LIMIT = 100;
export const CREDITS_PER_IMAGE = 10;

/** Snap to valid ledger values 0, 10, …, 100 (matches server dailyCreditsService). */
export function normalizeCreditsPoints(raw) {
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n)) return 0;
  const capped = Math.min(DAILY_CREDITS_LIMIT, Math.max(0, n));
  return Math.floor(capped / CREDITS_PER_IMAGE) * CREDITS_PER_IMAGE;
}

export function generationsRemaining(creditBalancePoints) {
  const pts = normalizeCreditsPoints(creditBalancePoints);
  if (pts <= 0) return 0;
  return Math.floor(pts / CREDITS_PER_IMAGE);
}

/** Shared copy for navbar + menus: “100 left” (uses normalized points). */
export function formatCreditsLeftLabel(rawOrPoints) {
  return `${normalizeCreditsPoints(rawOrPoints)} left`;
}
