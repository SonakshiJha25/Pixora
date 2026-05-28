import { motion } from "motion/react";
import { TIP_CAROUSEL_SLIDES } from "../content/tipsCarousel.js";

/** Fixed frame — every Help tip card uses the same image box height. */
const IMG_FRAME =
  "flex h-[11rem] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-pastel-mist/80 to-white/90 p-2.5 ring-1 ring-pastel-cyan/28 sm:h-[12rem] sm:p-3";
const IMG_SIZE = "h-full w-full object-contain object-center";

function TipBrandCard({ image, alt, title, text, tone, className = "" }) {
  return (
    <div
      className={`flex h-full flex-col rounded-[1.35rem] border border-pastel-cyan/22 bg-gradient-to-br ${tone} p-5 sm:p-[1.35rem] shadow-md ring-1 ring-white/85 ${className}`.trim()}
    >
      <div className={IMG_FRAME}>
        <img
          src={image}
          alt={alt}
          className={IMG_SIZE}
          draggable={false}
          loading="lazy"
        />
      </div>
      <h3 className="type-tile-title mt-4">{title}</h3>
      <p className="type-body-tight mt-1.5 flex-1 leading-snug text-slate-700">{text}</p>
    </div>
  );
}

export function TipBrandCardGrid({ slides = TIP_CAROUSEL_SLIDES }) {
  return (
    <div className="mt-6 grid items-stretch gap-5 sm:grid-cols-3 lg:gap-6">
      {slides.map((tip, idx) => (
        <motion.div
          key={tip.title}
          className="flex h-full"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 * idx }}
        >
          <TipBrandCard {...tip} className="w-full" />
        </motion.div>
      ))}
    </div>
  );
}
