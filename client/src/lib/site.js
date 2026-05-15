/** Public URLs (dummy until you have real socials). */
import { assets } from "../assets/assets";

export const SITE = {
  name: "Pixorify",
  tagline: "AI image generation for creators",
  helpEmail: "help@pixorify.app",
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
 * Studio placeholder samples (captions, optional image references).
 * Carousel-style previews are intentionally avoided in Studio UI — use MOODS for idle state.
 */
export const STUDIO_STYLE_SAMPLES = [
  {
    label: "Realistic",
    caption: "Photo look — name the light",
    image: assets.style_realistic,
  },
  {
    label: "Anime",
    caption: "Clean lines, illustration",
    image: assets.style_anime,
  },
  {
    label: "Cyberpunk",
    caption: "Neon, glass, grime",
    image: assets.style_cyberpunk,
  },
  {
    label: "Fantasy",
    caption: "Drama, epic mood",
    image: assets.style_fantasy,
  },
  {
    label: "Minimal",
    caption: "Space, flat colour",
    image: assets.style_minimal,
  },
];

/** Subtle idle-state gradients in Studio (no big shared marketing PNGs). */
export const STUDIO_STYLE_MOODS = {
  realistic: "from-slate-600/35 via-slate-950/95 to-[#020510]",
  anime: "from-sky-500/18 via-slate-950/92 to-[#050a14]",
  cyberpunk: "from-cyan-500/22 via-slate-950/90 to-[#03080f]",
  fantasy: "from-amber-400/12 via-slate-950/40 to-[#040b0e]",
  minimal: "from-slate-400/15 via-slate-900/95 to-[#060608]",
};

/** Home hero: what Pixorify offers (product-focused copy). */
export const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1920&q=85&auto=format&fit=crop",
    kicker: "What is Pixorify",
    title: "Create images from text",
    sub: `Prompts & styles in Pixora Studio · threads in ${SITE.name} gallery`,
  },
  {
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=85&auto=format&fit=crop",
    kicker: "Credits & limits",
    title: "10 credits refresh every day on Free",
    sub: "Spend in Pixora Studio · balance in your profile · scale on Pro",
  },
  {
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=85&auto=format&fit=crop",
    kicker: "Styles",
    title: "Realistic, anime, cyberpunk, and more",
    sub: "Pick a look so results feel intentional—not random.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0d7039?w=1920&q=85&auto=format&fit=crop",
    kicker: "Gallery & files",
    title: "Save, fave, export",
    sub: "Favs, PNGs, cleanup—My gallery.",
  },
];
