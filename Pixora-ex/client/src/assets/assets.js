/**
 * App asset registry — raster PNGs from repo `photos/` via `lib/photos.js`;
 * SVG UI icons under `src/images/icons/`.
 */

import { photos } from "../lib/photos.js";
import avatarDefault from "../images/icons/avatar-default.svg";
import email_icon from "../images/icons/email_icon.svg";
import lock_icon from "../images/icons/lock_icon.svg";
import cross_icon from "../images/icons/cross_icon.svg";

export const assets = {
  brandMark: photos.brandMark,
  brandDecorCloudTablet: photos.decorCloudTablet,
  brandDecorKittenCloud: photos.decorKittenCloud,
  brandDecorBunnyArtist: photos.decorBunnyArtist,
  avatarDefault,
  email_icon,
  lock_icon,
  cross_icon,
  profile_icon: photos.profileIcon,
  style_realistic: photos.styleRealistic,
  style_anime: photos.styleAnime,
  style_cyberpunk: photos.styleCyberpunk,
  style_fantasy: photos.styleFantasy,
  style_minimal: photos.styleMinimal,
};
