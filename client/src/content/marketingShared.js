import { CircleHelp, LayoutGrid, Sparkles, Wand2 } from "lucide-react";
import { assets } from "../assets/assets";
import { WORKSPACE_NAME } from "../lib/site.js";

/**
 * Primary marketing column width (Tailwind `max-w-4xl` / 56rem) — matches the Steps section
 * (“The bit that matters”). Non-Studio app shell uses this so every page shares the same rail.
 */
export const MARKETING_CONTENT_MAX_WIDTH_CLASS = "max-w-4xl";

/** Page typography: use `type-*` classes from `index.css` (@layer components) for consistent scale. */

/** Style strip on Home + Help (marketing context). Studio uses gradients + tiny chips instead. */
export const MARKETING_STYLE_TILES = [
  { img: assets.style_realistic, label: "Realistic", studioStyle: "realistic" },
  { img: assets.style_anime, label: "Anime", studioStyle: "anime" },
  { img: assets.style_cyberpunk, label: "Cyberpunk", studioStyle: "cyberpunk" },
  { img: assets.style_fantasy, label: "Fantasy", studioStyle: "fantasy" },
  { img: assets.style_minimal, label: "Minimal", studioStyle: "minimal" },
];

/** Home shortcuts — one quiet surface (no rainbow tile gradients) */
export const HOME_SHORTCUT_TILES = [
  {
    to: "/studio",
    title: WORKSPACE_NAME,
    desc: "Write a prompt, pick a style, render your frame.",
    icon: Wand2,
  },
  {
    to: "/gallery",
    title: "Gallery",
    desc: "Threads and favourites in one grid.",
    icon: LayoutGrid,
  },
  {
    to: "/pricing",
    title: "Plans",
    desc: "Free today, room to grow when you need it.",
    icon: Sparkles,
  },
  {
    to: "/help",
    title: "Help",
    desc: "Credits, resets, refinements, and contact.",
    icon: CircleHelp,
  },
];
