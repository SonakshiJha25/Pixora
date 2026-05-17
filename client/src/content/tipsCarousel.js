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
    alt: "Cloud character sketching on a glowing tablet — one change at a time",
    title: "One tweak, then another",
    text: "Refine adjusts the picture you already have—gentler than a fresh run.",
    tone: "from-pastel-mist via-[#f8f5ff]/90 to-[#fdf4fc]",
  },
  {
    image: photos.tipGalleryDeskRound,
    alt: "Cozy pastel desk by a round window — gallery keeps your work organized",
    title: "Versions stay lined up",
    text: "My gallery remembers each iteration so you can scroll backward fast.",
    tone: "from-white via-[#eaf8ff]/80 to-pastel-mist",
  },
];
