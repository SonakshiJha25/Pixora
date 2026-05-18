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

/** Subtle attribution for footer or helpers — renders use Clipdrop APIs. */
export const CLIPDROP_ATTRIBUTION = "Powered by Clipdrop AI";

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

/** Home hero carousel — calm, high-aesthetic stills (no busy or harsh stock). */
/** Unique Unsplash URLs per slide — avoids repeating Home flow / sample stills elsewhere on the page. */
export const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1469474968028-4fad6c27e9bf?w=1920&q=85&auto=format&fit=crop",
    kicker: "What is Pixorify",
    title: "Create images from text",
    sub: `Describe a scene in ${WORKSPACE_NAME}, then keep finished art in your gallery`,
  },
  {
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920&q=85&auto=format&fit=crop",
    kicker: "Simple flow",
    title: "Sign in and start creating",
    sub: "No credit counters—just generate, download PNGs, and heart the pictures you want to find again.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=85&auto=format&fit=crop",
    kicker: "Styles",
    title: "Realistic, Anime, Cyberpunk, Fantasy, Minimal",
    sub: "Pick a look so results feel intentional—not random.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0d7039?w=1920&q=85&auto=format&fit=crop",
    kicker: "Gallery",
    title: "Download and like",
    sub: "Save PNGs anytime and mark favourites in My gallery.",
  },
];
