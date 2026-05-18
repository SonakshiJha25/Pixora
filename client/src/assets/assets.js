/**
 * App asset registry — raster PNGs from repo `photos/` via `lib/photos.js`;
 * SVG UI icons under `src/images/icons/`.
 */

import { photos } from "../lib/photos.js";
import logo_icon from "../images/icons/logo_icon.svg";
import facebook_icon from "../images/icons/facebook_icon.svg";
import instagram_icon from "../images/icons/instagram_icon.svg";
import twitter_x_icon from "../images/icons/twitter_x_icon.svg";
import discord_icon from "../images/icons/discord_icon.svg";
import avatarDefault from "../images/icons/avatar-default.svg";
import star_icon from "../images/icons/star_icon.svg";
import rating_star from "../images/icons/rating_star.svg";
import step_icon_1 from "../images/icons/step_icon_1.svg";
import step_icon_2 from "../images/icons/step_icon_2.svg";
import email_icon from "../images/icons/email_icon.svg";
import lock_icon from "../images/icons/lock_icon.svg";
import cross_icon from "../images/icons/cross_icon.svg";
import credit_star from "../images/icons/credit_star.svg";

export const assets = {
  brandMark: photos.brandMark,
  brandDecorCloudTablet: photos.decorCloudTablet,
  brandDecorKittenCloud: photos.decorKittenCloud,
  brandDecorBunnyArtist: photos.decorBunnyArtist,
  logo_icon,
  facebook_icon,
  instagram_icon,
  twitter_x_icon,
  discord_icon,
  avatarDefault,
  star_icon,
  rating_star,
  sample_img_1: photos.tipPromptCamera,
  sample_img_2: photos.helpJourneyStudioDesk,
  email_icon,
  lock_icon,
  cross_icon,
  star_group: photos.starGroup,
  credit_star,
  profile_icon: photos.profileIcon,
  style_realistic: photos.styleRealistic,
  style_anime: photos.styleAnime,
  style_cyberpunk: photos.styleCyberpunk,
  style_fantasy: photos.styleFantasy,
  style_minimal: photos.styleMinimal,
  home_flow_refine: photos.tipRefineStep,
  home_mascot: photos.pixorifyMascotCloud,
  profile_img_1: photos.profileIcon,
  profile_img_2: photos.decorBunnyArtist,
  profile_img_3: photos.decorKittenCloud,
};

export const stepsData = [
  {
    title: "Describe the scene",
    description:
      "Start with the subject and setting: who or what is in frame, where they are, and what the light is doing. Mention colors and lens feel when it matters—“warm tans and deep blues” beats “nice colors.” Pixorify works best when you describe what a camera could see.",
    icon: step_icon_1,
  },
  {
    title: "Pick a style & generate",
    description:
      "Choose realistic, anime, cyberpunk, fantasy, or minimal before you hit create—each tilts shadows, edges, and detail level. There are no credit counters right now; just sign in and generate.",
    icon: step_icon_2,
  },
  {
    title: "Download & like",
    description:
      "Save a PNG to your device anytime, or tap ♥ in My gallery so your best pictures stay easy to find. Refine (edits on the same image) is coming soon.",
    icon: credit_star,
  },
];

export const testimonialsData = [
  {
    image: photos.profileIcon,
    name: "Maya Lin",
    role: "Designer",
    stars: 5,
    text: "Pixorify fits how I work — quick drafts in Pixora Studio, then download or favourite what lands.",
  },
  {
    image: photos.decorBunnyArtist,
    name: "Jordan Cole",
    role: "Content creator",
    stars: 4,
    text: "The studio feels calm. I sign in, generate, and my gallery stays organised when I'm trying ideas.",
  },
  {
    image: photos.decorKittenCloud,
    name: "Priya Nair",
    role: "Freelance art director",
    stars: 5,
    text: "Simple flow: create, download, heart the keepers—I focus on the pictures, not the controls.",
  },
];

export const plans = [
  {
    id: "Free",
    price: 0,
    credits: 10,
    desc: "Sign in, generate, download PNGs, and like favourites in your gallery.",
  },
  {
    id: "Pro",
    price: 9,
    credits: 200,
    desc: "More headroom and priority features (coming soon).",
  },
];
