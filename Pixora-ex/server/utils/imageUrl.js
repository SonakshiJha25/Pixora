/**
 * Resolve the public base URL of this backend for serving /generated images.
 *
 * Order of preference:
 *   1. BACKEND_PUBLIC_URL env var (explicit override, e.g. production CDN)
 *   2. Derived from the incoming request: `${req.protocol}://${req.get("host")}`
 *      (works correctly on Render because `app.set("trust proxy", 1)` is set,
 *      so req.protocol returns "https" and req.get("host") returns the
 *      external Render hostname).
 *   3. Empty string (returns relative URLs as last resort).
 */
function publicBaseUrl(req) {
  const fromEnv = (process.env.BACKEND_PUBLIC_URL || "").trim().replace(/\/+$/, "");
  if (fromEnv) return fromEnv;

  if (req) {
    const host = req.get?.("host");
    const protocol = req.protocol || "http";
    if (host) return `${protocol}://${host}`;
  }

  return "";
}

const LOCALHOST_HOSTS =
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|::1)$/i;

/**
 * Convert any stored image URL into an absolute, production-safe URL.
 *
 * Heals legacy records whose imageUrl was persisted as
 *   http://localhost:4000/generated/foo.png
 * by stripping localhost and re-attaching the current public base URL.
 * Full URLs on other hosts (e.g. Cloudinary) are left unchanged — critical
 * so serializeImage never rewrites CDN links into bogus API-host paths.
 *
 * @param {string} stored - imageUrl value from DB (relative or absolute)
 * @param {import("express").Request} [req] - request, used to derive host when env var is absent
 */
export function absoluteImageUrl(stored, req) {
  if (!stored || typeof stored !== "string") return stored;

  const base = publicBaseUrl(req);

  let pathPart = stored;
  if (/^https?:\/\//i.test(stored)) {
    try {
      const u = new URL(stored);
      if (!LOCALHOST_HOSTS.test(u.hostname)) {
        return stored;
      }
      pathPart = `${u.pathname}${u.search}`;
    } catch {
      return stored;
    }
  }
  if (!pathPart.startsWith("/")) pathPart = `/${pathPart}`;

  return base ? `${base}${pathPart}` : pathPart;
}

/**
 * Return a plain image object with imageUrl normalized through absoluteImageUrl.
 * Accepts a Mongoose document or plain object. Pass the request so the helper
 * can derive the public host even if BACKEND_PUBLIC_URL is not configured.
 */
export function serializeImage(image, req) {
  if (!image) return image;
  const plain = typeof image.toJSON === "function" ? image.toJSON({ virtuals: true }) : { ...image };
  plain.imageUrl = absoluteImageUrl(plain.imageUrl, req);
  return plain;
}
