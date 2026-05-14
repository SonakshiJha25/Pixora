/** Match server/services/dailyCreditsService.js — UI helpers only */
export const DAILY_CREDITS_LIMIT = 100;
export const CREDITS_PER_IMAGE = 10;

/**
 * Some legacy rows stored “images left” (1–9) in the credits field instead of points.
 * Snap those to credit points so the UI matches “100 daily · 10 per image”.
 */
export function normalizeCreditsPoints(raw) {
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n) || n < 0) return 0;
  if (n > 0 && n < CREDITS_PER_IMAGE) return n * CREDITS_PER_IMAGE;
  return n;
}

export function generationsRemaining(creditBalancePoints) {
  const pts = normalizeCreditsPoints(creditBalancePoints);
  if (pts <= 0) return 0;
  return Math.floor(pts / CREDITS_PER_IMAGE);
}
