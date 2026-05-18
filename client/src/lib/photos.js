/**
 * Raster assets — marketing art: `photos/bg-1.png` … `bg-6.png`.
 * Studio style modes: `photos/style-1.png` … `style-5.png` (unchanged).
 * SVG UI icons stay under `src/images/icons/`.
 */
import brandMark from "@photos/logo.png";
import faviconPng from "@photos/favicon.png";
import styleRealistic from "@photos/style-1.png";
import styleAnime from "@photos/style-2.png";
import styleCyberpunk from "@photos/style-3.png";
import styleFantasy from "@photos/style-4.png";
import styleMinimal from "@photos/style-5.png";
import bg1 from "@photos/bg-1.png";
import bg2 from "@photos/bg-2.png";
import bg3 from "@photos/bg-3.png";
import bg4 from "@photos/bg-4.png";
import bg5 from "@photos/bg-5.png";
import bg6 from "@photos/bg-6.png";
import profileIcon from "@photos/icon-profile.png";
import starGroup from "@photos/icon-stars.png";

export const photos = Object.freeze({
  bg1,
  bg2,
  bg3,
  bg4,
  bg5,
  bg6,
  brandMark,
  faviconPng,
  styleRealistic,
  styleAnime,
  styleCyberpunk,
  styleFantasy,
  styleMinimal,
  decorCloudTablet: bg1,
  decorKittenCloud: bg2,
  decorCloudEaselSunset: bg3,
  decorBunnyArtist: bg4,
  /** Hero moodboard — one distinct bg per card (bg-1 center … bg-6 bottom-right) */
  heroFloatTopLeft: bg2,
  heroFloatTopRight: bg5,
  heroFloatBottomLeft: bg4,
  heroFloatBottomRight: bg6,
  heroFloatCenter: bg1,
  tipRefineStep: bg3,
  tipPromptCamera: bg2,
  tipCreativeStudio: bg4,
  tipGalleryDeskRound: bg6,
  tipGalleryTimeline: bg3,
  tipHelpQuicktipsBanner: bg5,
  helpJourneyStudioDesk: bg1,
  homeJourneyCollectDesk: bg6,
  studioPreviewScreenshot: bg4,
  studioPreviewHome: bg4,
  profileIcon,
  starGroup,
  pixorifyBrandMark: bg1,
});
