/**
 * Runtime switch for credit enforcement (not schema removal).
 * Set CREDITS_ENABLED=true in server/.env to re-enable limits and deductions.
 */
export function areCreditsEnforced() {
  const v = String(process.env.CREDITS_ENABLED ?? "")
    .trim()
    .toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}
