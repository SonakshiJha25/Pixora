import { motion } from "motion/react";
import { assets } from "../assets/assets.js";

/** Gentle float + soft entrance — matches Help hero motion. */
export function AnimatedFloatImage({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  duration = 5.5,
  delay = 0,
}) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <motion.img
        src={src}
        alt={alt}
        draggable={false}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={imgClassName}
      />
    </motion.div>
  );
}

/**
 * Soft illustrative accents for light marketing surfaces — faded so blue/white stay dominant.
 */
export function HeroDecorBleed() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <img
        src={assets.brandDecorKittenCloud}
        alt=""
        className="absolute -right-[12%] -top-[8%] w-[min(52%,380px)] max-w-none opacity-[0.11]"
        draggable={false}
      />
      <img
        src={assets.brandDecorCloudTablet}
        alt=""
        className="absolute -bottom-[14%] -left-[10%] w-[min(48%,340px)] max-w-none opacity-[0.12]"
        draggable={false}
      />
      <img
        src={assets.brandDecorBunnyArtist}
        alt=""
        className="absolute left-[52%] top-[18%] w-[min(38%,260px)] max-w-none opacity-[0.06]"
        draggable={false}
      />
    </div>
  );
}

export function SidebarDecorCard({ dense = false }) {
  const wrap = dense ? "max-h-40" : "max-h-[14rem]";
  return (
    <div
      aria-hidden
      className={`pointer-events-none relative overflow-hidden rounded-2xl border border-pastel-cyan/35 bg-white/85 shadow-[0_14px_40px_-26px_rgba(111,203,255,0.55)]`}
    >
      <img
        src={assets.brandDecorBunnyArtist}
        alt=""
        className={`w-full object-cover object-center opacity-92 ${wrap}`}
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#F9FAFF]/50 via-transparent to-[#F6B6E8]/10" />
    </div>
  );
}

/** Very soft full-width wash for forms and secondary pages (keeps blues/white dominant). */
export function FloatingBrandWash() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <img
        src={assets.brandDecorKittenCloud}
        alt=""
        className="absolute -right-[8%] -top-[20%] w-[min(55%,340px)] max-w-none opacity-[0.085]"
        draggable={false}
      />
      <img
        src={assets.brandDecorCloudTablet}
        alt=""
        className="absolute -bottom-[35%] -left-[14%] w-[min(50%,300px)] max-w-none opacity-[0.09]"
        draggable={false}
      />
      <img
        src={assets.brandDecorBunnyArtist}
        alt=""
        className="absolute bottom-[-28%] right-[-14%] w-[min(45%,260px)] max-w-none opacity-[0.065]"
        draggable={false}
      />
    </div>
  );
}
