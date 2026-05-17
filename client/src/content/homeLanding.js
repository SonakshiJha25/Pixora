import { photos } from "../lib/photos.js";
import { STYLE_IMAGES } from "../lib/styleTypes.js";
import { WORKSPACE_NAME } from "../lib/site.js";

/** Hero moodboard — five unique scenes from `photos/hero/` (not style picker / tips art). */
export const HOME_HERO_FLOATS = [
  {
    src: photos.heroFloatTopLeft,
    className: "left-[0%] top-[4%] w-[40%]",
    rotate: -5,
    z: 2,
    drift: -5,
    duration: 6.2,
  },
  {
    src: photos.heroFloatTopRight,
    className: "right-[0%] top-[6%] w-[40%]",
    rotate: 6,
    z: 2,
    drift: -4,
    duration: 5.9,
  },
  {
    src: photos.heroFloatBottomLeft,
    className: "left-[5%] bottom-[0%] w-[44%]",
    rotate: -4,
    z: 3,
    drift: -6,
    duration: 6.8,
  },
  {
    src: photos.heroFloatBottomRight,
    className: "right-[5%] bottom-[8%] w-[38%]",
    rotate: 7,
    z: 3,
    drift: -5,
    duration: 6.4,
  },
  {
    src: photos.heroFloatCenter,
    className: "left-[28%] top-[30%] w-[46%]",
    rotate: 1,
    z: 5,
    drift: -3,
    duration: 5.2,
    contain: true,
  },
];

export const HOME_JOURNEY = [
  {
    n: "1",
    title: "Imagine",
    body: "Describe your idea naturally—light, texture, and mood in plain words.",
    img: photos.tipPromptCamera,
    bannerClass:
      "bg-gradient-to-br from-pastel-mist via-white to-[#eaf8ff] ring-1 ring-inset ring-pastel-cyan/35",
    imgClass: "object-contain object-center p-2 sm:p-3",
  },
  {
    n: "2",
    title: "Refine",
    body: "Continue the same image thread. Nudge detail without starting over.",
    img: photos.tipRefineStep,
    bannerClass:
      "bg-gradient-to-br from-pastel-sky/45 via-[#FBF9FF] to-[#fdf4fc] ring-1 ring-inset ring-[#F6B6E8]/35",
    imgClass: "object-contain object-center p-2 sm:p-3",
  },
  {
    n: "3",
    title: "Collect",
    body: "Keep your favorite generations organized in your gallery.",
    img: photos.homeJourneyCollectDesk,
    bannerClass:
      "bg-gradient-to-br from-pastel-sky/50 via-pastel-mist to-white ring-1 ring-inset ring-pastel-sky/40",
    imgClass: "object-contain object-center p-2 sm:p-3",
  },
];

export const HOME_MOOD_STRIP = [
  { label: "Realistic", hint: "Natural light", studioStyle: "realistic", image: STYLE_IMAGES.realistic },
  { label: "Anime", hint: "Soft colour", studioStyle: "anime", image: STYLE_IMAGES.anime },
  { label: "Cyberpunk", hint: "Neon mood", studioStyle: "cyberpunk", image: STYLE_IMAGES.cyberpunk },
  { label: "Fantasy", hint: "Myth & mist", studioStyle: "fantasy", image: STYLE_IMAGES.fantasy },
  { label: "Minimal", hint: "Quiet space", studioStyle: "minimal", image: STYLE_IMAGES.minimal },
];

export const HOME_STUDIO_CTA = {
  screenshot: photos.studioPreviewScreenshot,
  workspaceLabel: WORKSPACE_NAME,
};
