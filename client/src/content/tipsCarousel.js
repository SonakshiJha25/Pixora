import { photos } from "../lib/photos.js";

/**
 * Minimal copy — visuals carry the pastel “dream studio” theme.
 */
export const TIP_CAROUSEL_SLIDES = [
  {
    image: photos.tipPromptCamera,
    alt: "Pastel celestial kitten motif — specificity in prompts",
    title: "Point the lens",
    text: "Say what you’d frame: light, surface, palette—not just mood words.",
    tone: "from-pastel-sky/40 via-pastel-mist to-white",
  },
  {
    image: photos.tipRefineStep,
    alt: "Cloud character sketching on a glowing tablet — refine coming soon",
    title: "Refine (soon)",
    text: "Gentle edits on the same picture are on the way—for now, generate and save what you love.",
    tone: "from-pastel-mist via-[#f8f5ff]/90 to-[#fdf4fc]",
  },
  {
    image: photos.tipGalleryDeskRound,
    alt: "Cozy pastel desk by a round window — gallery keeps your work organized",
    title: "Download & like",
    text: "My gallery stores your pictures—export PNGs or heart favourites anytime.",
    tone: "from-white via-[#eaf8ff]/80 to-pastel-mist",
  },
];
