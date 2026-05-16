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
  realistic: "from-slate-800/40 via-[#161920] to-[#0f1218]",
  anime: "from-slate-800/38 via-[#151820] to-[#0f1218]",
  cyberpunk: "from-slate-700/35 via-[#141820] to-[#10141a]",
  fantasy: "from-slate-800/32 via-[#161820] to-[#101418]",
  minimal: "from-slate-800/42 via-[#14161c] to-[#101114]",
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
