import { useCallback, useEffect, useState } from "react";
import { STUDIO_STYLE_SAMPLES } from "../lib/site";

const AUTO_MS = 4500;

/**
 * Cycles through example "looks" before the first generation.
 *
 * Implementation note: every slide is rendered up-front as a sibling <img>
 * with absolute positioning; switching slides only toggles opacity. We do NOT
 * key the <img> on the slide label, because doing so would unmount and remount
 * the element on every cycle, causing the page to "blink" as the browser
 * fetched and decoded the next image. Cross-fading mounted elements is smooth.
 */
export default function StylePreviewCarousel({ className = "" }) {
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
    <div className={`mx-auto w-full max-w-[min(92vw,520px)] ${className}`.trim()}>
      <div className="glass relative w-full overflow-hidden rounded-3xl p-2 shadow-glow">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100/80">
          {STUDIO_STYLE_SAMPLES.map((s, idx) => (
            <img
              key={s.label}
              src={s.image}
              alt={s.label}
              className={`absolute inset-0 h-full w-full rounded-2xl object-cover transition-opacity duration-700 ease-in-out ${
                idx === i ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable="false"
              aria-hidden={idx !== i}
            />
          ))}

          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/55 via-slate-900/5 to-transparent" />

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-3 pb-10 sm:p-4 sm:pb-11">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-100/90 sm:text-xs">Preview</p>
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
