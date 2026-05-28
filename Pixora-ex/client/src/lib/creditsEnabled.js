/**
 * UI switch for credit surfaces (navbar, studio hint, limit modal).
 * - `VITE_CREDITS_UI_ENABLED=true` → always on
 * - Dev default: on unless `VITE_CREDITS_UI_ENABLED=false`
 */
const flag = import.meta.env.VITE_CREDITS_UI_ENABLED;
export const CREDITS_UI_ENABLED =
  flag === "true" || (import.meta.env.DEV && flag !== "false");
