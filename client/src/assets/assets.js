/**
 * Remote mood imagery — soft, positive Unsplash photography (no bundled style PNGs).
 * Tiles stay on-brand: minimal, serene, pastel, cozy — never grim or “monster” energy.
 */

import brandMark from "./pixorify-brand-mark.png";
import logo_icon from "./logo_icon.svg";
import facebook_icon from "./facebook_icon.svg";
import instagram_icon from "./instagram_icon.svg";
import twitter_x_icon from "./twitter_x_icon.svg";
import discord_icon from "./discord_icon.svg";
import avatarDefault from "./avatar-default.svg";
import star_icon from "./star_icon.svg";
import rating_star from "./rating_star.svg";
import step_icon_1 from "./step_icon_1.svg";
import step_icon_2 from "./step_icon_2.svg";
import email_icon from "./email_icon.svg";
import lock_icon from "./lock_icon.svg";
import cross_icon from "./cross_icon.svg";
import star_group from "./star_group.png";
import credit_star from "./credit_star.svg";
import profile_icon from "./profile_icon.png";

const IMG = {
  style_minimal:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=960&q=88",
  style_realistic:
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=960&q=88",
  style_anime:
    "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=960&q=88",
  /** Soft pastel gradient — evokes glow / digital mood without noir city grit */
  style_cyberpunk:
    "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=960&q=88",
  style_fantasy:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=960&q=88",
  sample_img_1:
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=960&q=88",
  sample_img_2:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=960&q=88",
  home_mascot:
    "https://images.unsplash.com/photo-1484480974693-6ca894a757d5?auto=format&fit=crop&w=960&q=88",
  profile_img_1:
    "https://images.unsplash.com/photo-1544005313-94ddf0286ad2?auto=format&fit=crop&w=280&h=280&q=88&crop=faces",
  profile_img_2:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=280&h=280&q=88&crop=faces",
};

export const assets = {
  brandMark,
  logo_icon,
  facebook_icon,
  instagram_icon,
  twitter_x_icon,
  discord_icon,
  avatarDefault,
  star_icon,
  rating_star,
  sample_img_1: IMG.sample_img_1,
  sample_img_2: IMG.sample_img_2,
  email_icon,
  lock_icon,
  cross_icon,
  star_group,
  credit_star,
  profile_icon,
  style_realistic: IMG.style_realistic,
  style_anime: IMG.style_anime,
  style_cyberpunk: IMG.style_cyberpunk,
  style_fantasy: IMG.style_fantasy,
  style_minimal: IMG.style_minimal,
  home_mascot: IMG.home_mascot,
  profile_img_1: IMG.profile_img_1,
  profile_img_2: IMG.profile_img_2,
};

export const stepsData = [
  {
    title: "Describe the scene",
    description:
      "Mention who is in frame, the light, and the palette — a few concrete beats over one vague adjective every time.",
    icon: step_icon_1,
  },
  {
    title: "Style + generate",
    description:
      "Lock a look (realistic, anime, cyberpunk, and the rest) before you hit go. Further polish lives in Refine on that same thread.",
    icon: step_icon_2,
  },
  {
    title: "Save what works",
    description: "Download PNGs, star favourites, or reopen a thread when you think of the next micro-tweak.",
    icon: credit_star,
  },
];

export const testimonialsData = [
  {
    image: IMG.profile_img_1,
    name: "Maya Lin",
    role: "Designer",
    stars: 5,
    text: `Pixorify fits how I work — quick first frames, then gentle refinements without starting from scratch every time.`,
  },
  {
    image: IMG.profile_img_2,
    name: "Jordan Cole",
    role: "Content creator",
    stars: 4,
    text: `The studio feels calm. Credits are clear, and the gallery keeps threads tidy when you're experimenting.`,
  },
  {
    image: IMG.profile_img_1,
    name: "Maya Lin",
    role: "Designer",
    stars: 5,
    text: `IST resets and same-thread edits mean I spend time on taste, not on fighting the UI.`,
  },
];

export const plans = [
  {
    id: "Free",
    price: 0,
    credits: 10,
    desc: "10 credits every day. Private gallery + downloads.",
  },
  {
    id: "Pro",
    price: 9,
    credits: 200,
    desc: "More credits + priority generation (coming soon).",
  },
];
