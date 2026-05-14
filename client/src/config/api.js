/** Backend origin without trailing slash. Empty string = same origin (use Vite proxy in dev). */
export const BASE_URL = String(import.meta.env.VITE_BACKEND_URL ?? "").trim().replace(/\/+$/, "");

if (import.meta.env.PROD && !BASE_URL) {
  console.warn(
    "[Pixorify] VITE_BACKEND_URL is unset — requests use this page’s origin (works when the API serves the built client). For a separate API host, set VITE_BACKEND_URL before building the client."
  );
}

/**
 * Normalize any image URL the backend returns into an absolute URL that the
 * browser can fetch from BASE_URL. Handles three legacy / edge shapes:
 *
 *   - Already absolute, non-localhost  -> return as-is (e.g. a CDN URL)
 *   - Absolute but localhost-baked     -> strip the host, re-prefix with BASE_URL
 *     (heals records persisted as http://localhost:4000/generated/foo.png)
 *   - Relative path (starts with "/")  -> prefix with BASE_URL
 *   - Bare filename                    -> prefix with BASE_URL + "/"
 *
 * If BASE_URL is empty (which would be a misconfiguration), returns the input
 * unchanged so the browser at least tries the original value.
 */
export function resolveImageUrl(stored) {
  if (!stored || typeof stored !== "string") return stored;
  const base = (BASE_URL || "").replace(/\/+$/, "");
  if (!base) return stored;

  let pathPart = stored;
  if (/^https?:\/\//i.test(stored)) {
    try {
      const u = new URL(stored);
      const isLocalhost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(u.hostname);
      if (!isLocalhost) return stored;
      pathPart = u.pathname;
    } catch {
      return stored;
    }
  }
  if (!pathPart.startsWith("/")) pathPart = `/${pathPart}`;
  return `${base}${pathPart}`;
}
