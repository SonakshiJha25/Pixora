import { useCallback, useEffect, useState } from "react";
import { STUDIO_STYLE_SAMPLES } from "../lib/site";

const AUTO_MS = 4500;

/**
 * Cycles through example “looks” before first generation. Same max frame as the previous single preview.
 */
export default function StylePreviewCarousel() {
  const [i, setI] = useState(0);
  const n = STUDIO_STYLE_SAMPLES.length;

  const next = useCallback(() => setI((x) => (x + 1) % n), [n]);
  const prev = useCallback(() => setI((x) => (x - 1 + n) % n), [n]);

  useEffect(() => {
    const t = setInterval(next, AUTO_MS);
    return () => clearInterval(t);
  }, [next]);

  const slide = STUDIO_STYLE_SAMPLES[i];

  return (
    <div className="mx-auto w-fit max-w-[min(92vw,520px)]">
      <div className="glass relative inline-block w-fit overflow-hidden rounded-3xl p-2 shadow-glow">
        <div className="relative inline-block max-w-full overflow-hidden rounded-2xl leading-none">
          <img
            key={slide.label}
            src={slide.image}
            alt={slide.label}
            className="block h-auto max-h-[min(52vh,520px)] w-auto max-w-[min(92vw,520px)] rounded-2xl object-contain bg-slate-100/80"
            loading="eager"
            decoding="async"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/5 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-3 pb-9 sm:p-4 sm:pb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-100/90 sm:text-xs">Look</p>
            <p className="mt-0.5 text-base font-extrabold text-white sm:text-lg">{slide.label}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-white/90 sm:line-clamp-1 sm:text-sm">{slide.caption}</p>
          </div>

          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white shadow-sm backdrop-blur transition hover:bg-white/30 sm:left-3 sm:h-12 sm:w-12"
            aria-label="Previous look"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white shadow-sm backdrop-blur transition hover:bg-white/30 sm:right-3 sm:h-12 sm:w-12"
            aria-label="Next look"
          >
            ›
          </button>

          <div className="pointer-events-auto absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1.5 sm:bottom-2.5">
            {STUDIO_STYLE_SAMPLES.map((s, idx) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setI(idx)}
                className={`h-1.5 rounded-full border border-white/60 transition sm:h-2 ${
                  idx === i ? "w-5 bg-white sm:w-6" : "w-1.5 bg-white/35 hover:bg-white/70"
                }`}
                aria-label={`${s.label} — ${s.caption}`}
                aria-current={idx === i}
              />
            ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {slide.label}, {slide.caption}
        </p>
      </div>
    </div>
  );
}
