/** Match server/services/dailyCreditsService.js — UI helpers only */
export const DAILY_CREDITS_LIMIT = 100;
export const CREDITS_PER_IMAGE = 10;

export function generationsRemaining(creditBalancePoints) {
  const n = Number(creditBalancePoints);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n / CREDITS_PER_IMAGE);
}
