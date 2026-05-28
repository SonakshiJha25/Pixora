/** Public URLs (dummy until you have real socials). */
import { studioStyleSamplesList } from "./styleTypes.js";

export const SITE = {
  name: "Pixorify",
  /** Browser tab title (keep in sync with client/index.html). */
  browserTitle: "Pixorify — Ideas in, pixels out",
  tagline: "Sign in, generate, download, and save what you love",
  helpEmail: "pixorify.help@gmail.com",
  twitter: "https://example.com/pixorify-twitter",
  instagram: "https://example.com/pixorify-instagram",
  facebook: "https://example.com/pixorify-facebook",
  discord: "https://example.com/pixorify-discord",
};

/** Creative workspace inside Pixorify (route `/studio`). Not the product name; not an image model. */
export const WORKSPACE_NAME = "Pixora Studio";

/**
 * Style chips in Studio idle row + Gallery filters — `{ id, label, image, caption }`.
 * Same labels/thumbnails everywhere; swap art in `assets/assets.js` only.
 */
export const STUDIO_STYLE_SAMPLES = studioStyleSamplesList();

/** Subtle idle-state gradients in Studio (no big shared marketing PNGs). */
export const STUDIO_STYLE_MOODS = {
  realistic: "from-slate-800/40 via-[#161920] to-[#0f1218]",
  anime: "from-slate-800/38 via-[#151820] to-[#0f1218]",
  cyberpunk: "from-slate-700/35 via-[#141820] to-[#10141a]",
  fantasy: "from-slate-800/32 via-[#161820] to-[#101418]",
  minimal: "from-slate-800/42 via-[#14161c] to-[#101114]",
};

