import { photos } from "../lib/photos.js";
import { STYLE_IMAGES } from "../lib/styleTypes.js";
import { REFINE_COMING_SOON_COPY } from "./productMessaging.js";
import { WORKSPACE_NAME } from "../lib/site.js";

/** Hero moodboard — `photos/bg-*.png` only. */
export const HOME_HERO_FLOATS = [
  {
    src: photos.heroFloatTopLeft,
    className: "left-[-2%] top-[2%] w-[44%]",
    rotate: -5,
    z: 2,
    drift: -6,
    duration: 6.2,
    contain: true,
  },
  {
    src: photos.heroFloatTopRight,
    className: "right-[-2%] top-[4%] w-[44%]",
    rotate: 6,
    z: 2,
    drift: -5,
    duration: 5.9,
    contain: true,
  },
  {
    src: photos.heroFloatBottomLeft,
    className: "left-[2%] bottom-[-2%] w-[48%]",
    rotate: -4,
    z: 3,
    drift: -7,
    duration: 6.8,
    contain: true,
  },
  {
    src: photos.heroFloatBottomRight,
    className: "right-[2%] bottom-[6%] w-[42%]",
    rotate: 7,
    z: 3,
    drift: -6,
    duration: 6.4,
    contain: true,
  },
  {
    src: photos.heroFloatCenter,
    className: "left-[24%] top-[26%] w-[54%]",
    rotate: 1,
    z: 5,
    drift: -4,
    duration: 5.2,
    contain: true,
  },
];

/** “What is this?” blurb — directly under the home hero. */
export const HOME_WHAT_IS = {
  eyebrow: "NEW HERE?",
  title: "What is Pixorify?",
  intro:
    "Pixorify is a small, friendly place to turn words into pictures. Describe an idea, mood, scene, or dream, choose a style you like, and generate artwork in seconds.",
  highlights: [
    { label: "Save your favourites", to: "/gallery" },
    { label: "Download images", to: "/studio" },
    { label: "Explore different modes", to: "/studio" },
  ],
  image: photos.bg3,
  imageAlt: "Dreamy cloud studio with easel, flowers, and a pastel sunset",
};

export const HOME_JOURNEY = [
  {
    n: "1",
    title: "Sign in",
    body: "One account holds your gallery—sign in once and your pictures stay with you.",
    img: photos.bg1,
    bannerClass:
      "bg-gradient-to-br from-pastel-mist via-white to-[#eaf8ff] ring-1 ring-inset ring-pastel-cyan/35",
    imgClass: "object-contain object-center p-2 sm:p-3",
  },
  {
    n: "2",
    title: "Generate",
    body: `Pick a style, describe your scene in plain words, and create in ${WORKSPACE_NAME}.`,
    img: photos.bg2,
    bannerClass:
      "bg-gradient-to-br from-[#f3eeff] via-white to-[#eaf8ff] ring-1 ring-inset ring-pastel-lilac/35",
    imgClass: "object-contain object-center p-2 sm:p-3",
  },
  {
    n: "3",
    title: "Download & like",
    body: "Save a PNG to your device or tap ♥ in My gallery to find favourites fast.",
    img: photos.bg6,
    bannerClass:
      "bg-gradient-to-br from-pastel-sky/50 via-pastel-mist to-white ring-1 ring-inset ring-pastel-sky/40",
    imgClass: "object-contain object-center p-2 sm:p-3",
  },
];

export const HOME_REFINE_TEASER = REFINE_COMING_SOON_COPY;

export const HOME_MOOD_STRIP = [
  { label: "Realistic", hint: "Natural light", studioStyle: "realistic", image: STYLE_IMAGES.realistic },
  { label: "Anime", hint: "Soft colour", studioStyle: "anime", image: STYLE_IMAGES.anime },
  { label: "Cyberpunk", hint: "Neon mood", studioStyle: "cyberpunk", image: STYLE_IMAGES.cyberpunk },
  { label: "Fantasy", hint: "Myth & mist", studioStyle: "fantasy", image: STYLE_IMAGES.fantasy },
  { label: "Minimal", hint: "Quiet space", studioStyle: "minimal", image: STYLE_IMAGES.minimal },
];

export const HOME_STUDIO_CTA = {
  screenshot: photos.bg2,
  workspaceLabel: WORKSPACE_NAME,
};
