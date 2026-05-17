import { assets } from "../assets/assets.js";

/**
 * Full-bleed, low-contrast brand illustrations behind marketing pages — blue/white stays dominant.
 * Uses every bundled brand illustration (decors + mascot), placed at different scroll depths.
 */
export default function MarketingPageBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 z-0 min-h-full w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden"
    >
      <div className="absolute -top-32 right-[-8%] h-[min(52vw,420px)] w-[min(52vw,420px)] rounded-full bg-gradient-to-br from-pastel-cyan/25 via-pastel-sky/12 to-transparent blur-3xl" />
      <div className="absolute left-[-12%] top-[28%] h-[min(48vw,380px)] w-[min(48vw,380px)] rounded-full bg-gradient-to-tr from-pastel-lavender/18 via-pastel-blush/10 to-transparent blur-3xl" />
      <div className="absolute bottom-[8%] right-[-6%] h-[min(44vw,360px)] w-[min(44vw,360px)] rounded-full bg-gradient-to-tl from-pastel-baby/12 via-pastel-cyan/10 to-transparent blur-3xl" />

      <img
        src={assets.brandDecorKittenCloud}
        alt=""
        className="absolute -left-[6%] top-[6%] w-[min(42%,340px)] max-w-none opacity-[0.068] saturate-[1.08]"
        draggable={false}
      />
      <img
        src={assets.brandDecorCloudTablet}
        alt=""
        className="absolute -right-[4%] top-[22%] w-[min(38%,280px)] max-w-none opacity-[0.075] saturate-[1.06]"
        draggable={false}
      />
      <img
        src={assets.brandDecorBunnyArtist}
        alt=""
        className="absolute bottom-[14%] left-[-2%] w-[min(40%,300px)] max-w-none opacity-[0.06] saturate-[1.06]"
        draggable={false}
      />
      <img
        src={assets.home_mascot}
        alt=""
        className="absolute bottom-[22%] right-[-8%] w-[min(36%,260px)] max-w-none opacity-[0.05] saturate-[1.05]"
        draggable={false}
      />
    </div>
  );
}
