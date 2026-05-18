/**
 * Single source of truth for the five generation styles (must match API / image `style` field).
 *
 * Display names are identical everywhere (Studio, Gallery, Home, Help).
 * Thumbnails: `photos/style-1.png` … `style-5.png` (via `lib/photos.js`).
 */
import { assets } from "../assets/assets.js";

/** @type {readonly ("realistic" | "anime" | "cyberpunk" | "fantasy" | "minimal")[]} */
export const STYLE_KEYS = Object.freeze(["realistic", "anime", "cyberpunk", "fantasy", "minimal"]);

/** Exact user-facing title per key (no alternate nicknames like “Photo” / “Neon” / “Clean”). */
export const STYLE_LABELS = Object.freeze({
  realistic: "Realistic",
  anime: "Anime",
  cyberpunk: "Cyberpunk",
  fantasy: "Fantasy",
  minimal: "Minimal",
});

/** Thumbnail for style cards — always from `assets`. */
export const STYLE_IMAGES = Object.freeze({
  realistic: assets.style_realistic,
  anime: assets.style_anime,
  cyberpunk: assets.style_cyberpunk,
  fantasy: assets.style_fantasy,
  minimal: assets.style_minimal,
});

/** Short line under the idle canvas for each style (Studio). */
export const STYLE_STUDIO_CAPTIONS = Object.freeze({
  realistic: "Natural light, believable detail",
  anime: "Illustrated colour and soft edges",
  cyberpunk: "Neon-tinged atmosphere, future mood",
  fantasy: "Ethereal scenes, rich imagination",
  minimal: "Clean blooms, soft light, open frame",
});

/** `{ realistic: { key, label, image }, ... }` */
export const STYLE_META = Object.freeze(
  Object.fromEntries(STYLE_KEYS.map((key) => [key, { key, label: STYLE_LABELS[key], image: STYLE_IMAGES[key] }]))
);

export function labelForStyleKey(key) {
  if (key != null && STYLE_LABELS[String(key)]) return STYLE_LABELS[String(key)];
  return key != null ? String(key) : "";
}

/** Studio + Gallery filter chips — use `sample.id` (not label string matching). */
export function studioStyleSamplesList() {
  return STYLE_KEYS.map((id) => ({
    id,
    label: STYLE_LABELS[id],
    image: STYLE_IMAGES[id],
    caption: STYLE_STUDIO_CAPTIONS[id],
  }));
}

/** Header / Help mood strip — matches `marketingShared` consumer shape */
export function marketingStyleTilesList() {
  return STYLE_KEYS.map((studioStyle) => ({
    img: STYLE_IMAGES[studioStyle],
    label: STYLE_LABELS[studioStyle],
    studioStyle,
  }));
}
