import { motion } from "motion/react";
import { HOME_HERO_FLOATS } from "../../content/homeLanding.js";

/** Five drifting hero cards — distinct marketing art, lightly spaced apart. */
export default function HomeHeroFloat() {
  return (
    <motion.div className="relative mx-auto aspect-[4/4.2] w-full max-w-[min(100%,320px)] sm:max-w-[380px]">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-[6%] rounded-[2rem] bg-gradient-to-br from-pastel-cyan/20 via-white/50 to-pastel-lavender/15 blur-2xl"
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {HOME_HERO_FLOATS.map((card, i) => (
        <motion.div
          key={card.src}
          className={`absolute ${card.className}`}
          style={{ zIndex: card.z }}
          initial={{ opacity: 0, y: 14, rotate: card.rotate - 2 }}
          animate={{
            opacity: 1,
            y: [0, card.drift, 0],
            rotate: [card.rotate, card.rotate + 0.8, card.rotate],
          }}
          transition={{
            opacity: { duration: 0.7, delay: 0.08 + i * 0.07, ease: [0.22, 1, 0.36, 1] },
            y: { duration: card.duration, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 },
            rotate: { duration: card.duration + 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
          }}
        >
          <motion.div
            className="overflow-hidden rounded-[1.2rem] bg-white/95 p-[3px] shadow-[0_20px_44px_-26px_rgba(111,203,255,0.45)] ring-1 ring-white/90"
            whileHover={{ scale: 1.05, y: -3 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={card.src}
              alt=""
              className={`block w-full rounded-[1.05rem] aspect-[4/5] ${
                card.contain ? "object-contain p-1.5" : "object-cover"
              }`}
              draggable={false}
            />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
