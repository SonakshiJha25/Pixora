import { resolveImageUrl } from "../config/api.js";

const CLOUDINARY_HOST = /res\.cloudinary\.com/i;

function cloudinaryDisplayUrl(url, width) {
  if (!url || !CLOUDINARY_HOST.test(url)) return url;
  if (/\/upload\/[^/]*f_auto/i.test(url)) return url;
  const w = Math.min(1200, Math.max(160, width || 640));
  return url.replace("/upload/", `/upload/f_auto,q_auto:good,w_${w},c_limit/`);
}

/**
 * URL for <img> — Cloudinary gets auto format/quality/width; other hosts use resolved URL as-is.
 */
export function displayImageUrl(stored, _imageId, opts = {}) {
  const width = opts.width ?? 640;
  const absolute = resolveImageUrl(stored);
  if (CLOUDINARY_HOST.test(absolute)) {
    return cloudinaryDisplayUrl(absolute, width);
  }
  return absolute;
}
