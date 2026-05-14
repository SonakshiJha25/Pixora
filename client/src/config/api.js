/** Strip trailing slashes for origins. */
function normalizeOrigin(raw) {
  return String(raw ?? "")
    .trim()
    .replace(/\/+$/, "");
}

/** Applies <meta name="pixora-api-base"> so split deploys can steer the API origin without another JS rebuild. */
export function hydrateApiBaseFromMeta() {
  try {
    if (typeof document === "undefined") return;
    const existing = normalizeOrigin(globalThis.__PIXORA_API_BASE__);
    if (existing) return;
    const el = document.querySelector('meta[name="pixora-api-base"]');
    const raw = el?.getAttribute("content")?.trim() ?? "";
    if (!raw) return;
    globalThis.__PIXORA_API_BASE__ = normalizeOrigin(raw);
  } catch {
    // ignore
  }
}

if (typeof document !== "undefined") {
  hydrateApiBaseFromMeta();
}

/**
 * Backend origin without trailing slash. Empty string means same-origin
 * (Vite proxies /api in dev; production works when Express serves client/dist).
 *
 * Overrides (first match wins): localStorage pixora_api_base,
 * window.__PIXORA_API_BASE__ (hydrated from meta — see vite.config — or `/pixora-runtime.js`),
 * then build-time VITE_BACKEND_URL.
 */
export function getApiBase() {
  const fromEnvBuild = normalizeOrigin(import.meta.env.VITE_BACKEND_URL ?? "");

  if (typeof window === "undefined") return fromEnvBuild;

  try {
    const ls = window.localStorage.getItem("pixora_api_base");
    if (ls != null && String(ls).trim() !== "") return normalizeOrigin(ls);
  } catch {
    /* private mode etc. */
  }

  const injected = globalThis.__PIXORA_API_BASE__;
  if (injected != null && String(injected).trim() !== "") return normalizeOrigin(injected);

  return fromEnvBuild;
}

if (import.meta.env.PROD && typeof window !== "undefined") {
  queueMicrotask(() => {
    if (!getApiBase()) {
      console.warn(
        "[Pixora] Backend URL is unset (same-origin /api). Works when the Node server serves this SPA from client/dist; " +
          "if frontend and API are on different domains, build with VITE_BACKEND_URL set or inject <meta name=\"pixora-api-base\" …>."
      );
    }
  });
}

/**
 * Normalize any image URL the backend returns into an absolute URL that the
 * browser can fetch from the API origin. Handles three legacy / edge shapes:
 *
 *   - Already absolute, non-localhost  -> return as-is (e.g. a CDN URL)
 *   - Absolute but localhost-baked     -> strip the host, re-prefix with base
 *   - Relative path (starts with "/")  -> prefix with base
 *   - Bare filename                    -> prefix with effective origin + "/"
 *
 * If no configured API base exists, `/…` resolves against the SPA origin so
 * relative /generated URLs still work behind the same host as Express.
 */
export function resolveImageUrl(stored) {
  if (!stored || typeof stored !== "string") return stored;
  const base = normalizeOrigin(getApiBase());
  let pathPart = stored;

  if (/^https?:\/\//i.test(stored)) {
    try {
      const u = new URL(stored);
      const isLocalhost =
        /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|::1)$/i.test(u.hostname);
      if (!isLocalhost) return stored;
      pathPart = `${u.pathname}${u.search}`;
    } catch {
      return stored;
    }
  }

  if (!pathPart.startsWith("/")) pathPart = `/${pathPart}`;

  const origin =
    base ||
    (typeof window !== "undefined" ? window.location.origin.replace(/\/+$/, "") : "");

  return origin ? `${origin}${pathPart}` : stored;
}
