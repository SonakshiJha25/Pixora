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

/**
 * Studio placeholder: real photos illustrating each look (not “AI” promo art).
 * Shown before the first generation in the same layout size as the preview area.
 */
export const STUDIO_STYLE_SAMPLES = [
  {
    label: "Realistic",
    caption: "Skews toward photo-real lighting when you spell out the shot",
    image: assets.style_realistic,
  },
  {
    label: "Anime",
    caption: "Cleaner lines and illustration energy — good characters and props",
    image: assets.style_anime,
  },
  {
    label: "Cyberpunk",
    caption: "Neon, gritty glass, futuristic city palettes",
    image: assets.style_cyberpunk,
  },
  {
    label: "Fantasy",
    caption: "Drama, atmosphere, big scenes that read like a still from a film",
    image: assets.style_fantasy,
  },
  {
    label: "Minimal",
    caption: "Breathing room, blocks of colour, less noise on screen",
    image: assets.style_minimal,
  },
];

/** Home hero: what Pixorify offers (product-focused copy). */
export const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1920&q=85&auto=format&fit=crop",
    kicker: "What is Pixorify",
    title: "A studio for text-to-image creation",
    sub: "Type a prompt, choose a look, and generate. Your work stays in one place: Studio and My gallery.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=85&auto=format&fit=crop",
    kicker: "Credits & limits",
    title: "10 credits refresh every day on Free",
    sub: "Use them in the Studio, track the balance in your profile, and top up with Pro when you are ready to scale.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=85&auto=format&fit=crop",
    kicker: "Styles",
    title: "Realistic, anime, cyberpunk, and more",
    sub: "Pick a style that matches the story—so outputs feel intentional, not random.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0d7039?w=1920&q=85&auto=format&fit=crop",
    kicker: "Gallery & files",
    title: "Save, favorite, and download your runs",
    sub: "Open My gallery to filter favorites, download PNGs, and remove what you do not need.",
  },
];
