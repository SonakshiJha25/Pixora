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
  { img: assets.style_realistic, label: "Realistic" },
  { img: assets.style_anime, label: "Anime" },
  { img: assets.style_cyberpunk, label: "Cyberpunk" },
  { img: assets.style_fantasy, label: "Fantasy" },
  { img: assets.style_minimal, label: "Minimal" },
];

/** Home-only shortcuts (overlap with Help, tighter copy). */
export const HOME_SHORTCUT_TILES = [
  {
    to: "/studio",
    title: WORKSPACE_NAME,
    desc: "Prompt, pick a look, generate.",
    icon: Wand2,
    grad: "from-cyan-500/15 via-sky-400/10 to-blue-500/15",
    border: "border-cyan-200/70",
    hoverRing: "hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)]",
  },
  {
    to: "/gallery",
    title: "Gallery",
    desc: "Saved threads & favourites.",
    icon: LayoutGrid,
    grad: "from-violet-500/12 via-purple-400/10 to-fuchsia-500/12",
    border: "border-violet-200/70",
    hoverRing: "hover:shadow-[0_0_0_1px_rgba(167,139,250,0.35)]",
  },
  {
    to: "/pricing",
    title: "Plans",
    desc: "What’s included on Free vs paid.",
    icon: Sparkles,
    grad: "from-amber-400/14 via-orange-300/12 to-pink-400/14",
    border: "border-amber-200/70",
    hoverRing: "hover:shadow-[0_0_0_1px_rgba(251,191,36,0.4)]",
  },
  {
    to: "/help",
    title: "Help",
    desc: "Credits, refines, the boring bits explained.",
    icon: CircleHelp,
    grad: "from-rose-400/14 via-red-300/12 to-orange-400/14",
    border: "border-rose-200/70",
    hoverRing: "hover:shadow-[0_0_0_1px_rgba(251,113,133,0.35)]",
  },
];
