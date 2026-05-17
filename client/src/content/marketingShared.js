import { CircleHelp, LayoutGrid, Sparkles, Wand2 } from "lucide-react";
import { WORKSPACE_NAME } from "../lib/site.js";
import { marketingStyleTilesList } from "../lib/styleTypes.js";

/**
 * Homepage column — wider breathable canvas than other marketing rails.
 */
export const HOMEPAGE_CONTENT_MAX_WIDTH_CLASS = "max-w-[78rem]";

/**
 * Primary marketing column width — Help, Pricing, etc.
 */
export const MARKETING_CONTENT_MAX_WIDTH_CLASS = "max-w-5xl";

/** Page typography: use `type-*` classes from `index.css` (@layer components) for consistent scale. */

/** Style strip on Home + Help — labels & images match Studio / Gallery (`styleTypes.js`). */
export const MARKETING_STYLE_TILES = marketingStyleTilesList();

/** Home shortcuts — one quiet surface (no rainbow tile gradients) */
export const HOME_SHORTCUT_TILES = [
  {
    to: "/studio",
    title: WORKSPACE_NAME,
    desc: "Describe your picture, choose a look, and create.",
    icon: Wand2,
  },
  {
    to: "/gallery",
    title: "My gallery",
    desc: "All your images and starred favourites together.",
    icon: LayoutGrid,
  },
  {
    to: "/pricing",
    title: "Plans",
    desc: "Start free, upgrade when Pixorify is part of your day.",
    icon: Sparkles,
  },
  {
    to: "/help",
    title: "Help",
    desc: "How credits work, daily limits, edits, and how to reach us.",
    icon: CircleHelp,
  },
];
