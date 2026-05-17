import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TIP_CAROUSEL_SLIDES } from "../content/tipsCarousel.js";

const CARD_CLIP = "mx-auto w-full max-w-[20rem] sm:max-w-[21.5rem]";

/** Tall frame — full illustration visible via object-contain. */
const IMG_FRAME =
  "flex min-h-[12rem] w-full items-center justify-center sm:min-h-[13rem]";
const IMG_SIZE = "h-[11rem] w-auto max-w-full sm:h-[12rem]";

/** Matches Help Quick tips tile: rounded-[1.25rem], p-5, soft gradient shell. */
function TipBrandCard({ image, alt, title, text, tone, className = "" }) {
  return (
    <div
      className={`rounded-[1.35rem] border border-pastel-cyan/22 bg-gradient-to-br ${tone} p-5 sm:p-[1.35rem] shadow-md ring-1 ring-white/85 ${className}`.trim()}
    >
      <div
        className={`relative ${IMG_FRAME} overflow-hidden rounded-xl bg-gradient-to-b from-pastel-mist/80 to-white/90 ring-1 ring-pastel-cyan/28`}
      >
        <img
          src={image}
          alt={alt}
          className={`${IMG_SIZE} object-contain object-center p-2 sm:p-2.5`}
          draggable={false}
          loading="lazy"
        />
      </div>
      <h3 className="type-tile-title mt-4">{title}</h3>
      <p className="type-body-tight mt-1.5 leading-snug text-slate-700">{text}</p>
    </div>
  );
}

export function TipBrandCardGrid({ slides = TIP_CAROUSEL_SLIDES }) {
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-3 lg:gap-6">
      {slides.map((tip, idx) => (
        <motion.div
          key={tip.title}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 * idx }}
        >
          <TipBrandCard {...tip} />
        </motion.div>
      ))}
    </div>
  );
}

export default function TipsCarousel({ slides = TIP_CAROUSEL_SLIDES }) {
  const len = slides.length;
  const [i, setI] = useState(0);

  const go = useCallback(
    (d) => {
      setI((v) => (v + d + len) % len);
    },
    [len],
  );

  useEffect(() => {
    const t = window.setInterval(() => go(1), 6500);
    return () => window.clearInterval(t);
  }, [go]);

  const active = useMemo(() => slides[i], [slides, i]);

  return (
    <div className={`relative ${CARD_CLIP}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active.title}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.3, 1] }}
        >
          <TipBrandCard {...active} />
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        aria-label="Previous tip"
        onClick={() => go(-1)}
        className="absolute left-0 top-[42%] z-[2] sm:left-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/90 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden strokeWidth={2.25} />
      </button>
      <button
        type="button"
        aria-label="Next tip"
        onClick={() => go(1)}
        className="absolute right-0 top-[42%] z-[2] sm:right-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/90 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" aria-hidden strokeWidth={2.25} />
      </button>

      <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Tips">
        {slides.map((s, idx) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            aria-selected={idx === i}
            aria-label={`Tip ${idx + 1}: ${s.title}`}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === i ? "w-7 bg-[#6FCBFF]" : "w-2 bg-pastel-cyan/30 hover:bg-pastel-cyan/55"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
