import { CircleHelp, LayoutGrid, Sparkles, Wand2 } from "lucide-react";
import { assets } from "../assets/assets";

/** Same thumbnails everywhere (Help, Home, Studio cues). */
export const MARKETING_STYLE_TILES = [
  { img: assets.style_realistic, label: "Realistic" },
  { img: assets.style_anime, label: "Anime" },
  { img: assets.style_cyberpunk, label: "Cyberpunk" },
  { img: assets.style_fantasy, label: "Fantasy" },
  { img: assets.style_minimal, label: "Minimal" },
];

/** Style key → preview image (Studio picker). */
export const STUDIO_STYLE_THUMB_BY_KEY = {
  realistic: assets.style_realistic,
  anime: assets.style_anime,
  cyberpunk: assets.style_cyberpunk,
  fantasy: assets.style_fantasy,
  minimal: assets.style_minimal,
};

/** Home-only shortcuts (overlap with Help, tighter copy). */
export const HOME_SHORTCUT_TILES = [
  {
    to: "/studio",
    title: "Studio",
    desc: "Prompt, pick a look, generate.",
    icon: Wand2,
    grad: "from-cyan-500/15 via-sky-400/10 to-blue-500/15",
    border: "border-cyan-200/70",
    hoverRing: "hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)]",
  },
  {
    to: "/gallery",
    title: "Gallery",
    desc: "Threads you’ve saved and liked.",
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
