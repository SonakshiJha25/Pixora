/**
 * Convert any stored image URL into an absolute, production-safe URL by
 * prepending process.env.BACKEND_PUBLIC_URL. This also heals legacy records
 * whose imageUrl was persisted as http://localhost:4000/... — we strip the
 * stored host and re-attach the current public base URL.
 */
export function absoluteImageUrl(stored) {
  if (!stored || typeof stored !== "string") return stored;

  const base = (process.env.BACKEND_PUBLIC_URL || "").replace(/\/+$/, "");

  let pathPart = stored;
  if (/^https?:\/\//i.test(stored)) {
    try {
      pathPart = new URL(stored).pathname;
    } catch {
      pathPart = stored;
    }
  }
  if (!pathPart.startsWith("/")) pathPart = `/${pathPart}`;

  return base ? `${base}${pathPart}` : pathPart;
}

/**
 * Return a plain image object with imageUrl normalized through
 * absoluteImageUrl. Accepts either a Mongoose document or a plain object.
 */
export function serializeImage(image) {
  if (!image) return image;
  const plain = typeof image.toJSON === "function" ? image.toJSON({ virtuals: true }) : { ...image };
  plain.imageUrl = absoluteImageUrl(plain.imageUrl);
  return plain;
}
