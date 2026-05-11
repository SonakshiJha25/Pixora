import { useCallback, useEffect, useState } from "react";
import { HERO_SLIDES } from "../lib/site";

const AUTO_MS = 6000;

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const n = HERO_SLIDES.length;

  const next = useCallback(() => setI((x) => (x + 1) % n), [n]);
  const prev = useCallback(() => setI((x) => (x - 1 + n) % n), [n]);

  useEffect(() => {
    const t = setInterval(next, AUTO_MS);
    return () => clearInterval(t);
  }, [next]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-card sm:rounded-3xl">
      <div className="relative aspect-[16/9] min-h-[200px] w-full sm:min-h-[240px] md:min-h-[280px]">
        {HERO_SLIDES.map((s, idx) => (
          <div
            key={s.image}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === i ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={idx !== i}
          >
            <img
              src={s.image}
              alt=""
              className="h-full w-full object-cover"
              loading={idx === 0 ? "eager" : "lazy"}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/25 to-slate-900/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-200/90 sm:text-xs">{s.kicker}</p>
              <h2 className="mt-1.5 max-w-2xl text-lg font-extrabold leading-snug text-white sm:text-2xl md:text-3xl">
                {s.title}
              </h2>
              <p className="mt-1.5 max-w-xl text-xs text-white/85 sm:text-sm">{s.sub}</p>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={prev}
          className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white shadow-sm backdrop-blur transition hover:bg-white/30 sm:left-4 sm:h-12 sm:w-12"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white shadow-sm backdrop-blur transition hover:bg-white/30 sm:right-4 sm:h-12 sm:w-12"
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              className={`h-2.5 w-2.5 rounded-full border border-white/40 transition ${
                idx === i ? "bg-white" : "bg-white/25"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
