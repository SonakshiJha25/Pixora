import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Download, Heart, Palette } from "lucide-react";
import { HOME_WHAT_IS } from "../../content/homeLanding.js";
import { HomeEmotionalHeading } from "../../lib/homeTypography.jsx";

const HIGHLIGHT_ICONS = [Heart, Download, Palette];

/** “What is Pixorify?” — heading + intro left of image; pills below. */
export default function HomeWhatIs() {
  const { eyebrow, title, intro, highlights, image, imageAlt } = HOME_WHAT_IS;

  return (
    <section
      className="relative mt-10 sm:mt-12 md:mt-14"
      aria-labelledby="home-what-is-title"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-6% 0px" }}
        transition={{ duration: 0.55, ease: [0.25, 1, 0.3, 1] }}
        className="rounded-3xl bg-pastel-mist/35 px-4 py-7 sm:px-6 sm:py-8"
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 sm:gap-5">
          <div className="flex w-full flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
            <motion.figure
              className="w-full max-w-[14rem] sm:w-[14rem] md:w-[16rem] lg:w-[17.5rem] shrink-0"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="overflow-hidden rounded-2xl border border-pastel-cyan/18 bg-gradient-to-b from-white/90 via-pastel-mist/60 to-[#eef7ff]/80 p-3 shadow-[0_12px_36px_-22px_rgba(143,216,255,0.32)] sm:p-3.5">
                <img
                  src={image}
                  alt={imageAlt}
                  className="aspect-[5/4] h-auto w-full object-contain object-center"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.figure>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                {eyebrow}
              </p>
              <HomeEmotionalHeading id="home-what-is-title" className="mt-2 sm:text-[1.75rem]">
                {title}
              </HomeEmotionalHeading>
              <p className="mt-2.5 text-[13px] leading-[1.65] text-slate-600 sm:mt-3 sm:text-sm sm:leading-relaxed">
                {intro}
              </p>
            </div>
          </div>

          <ul className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-2.5">
            {highlights.map((item, i) => {
              const Icon = HIGHLIGHT_ICONS[i] ?? Palette;
              return (
                <li key={item.label} className="min-w-0">
                  <Link
                    to={item.to}
                    className="flex h-full w-full items-center justify-center gap-2 rounded-full border border-pastel-cyan/28 bg-white/90 px-3 py-2.5 text-[11px] font-medium leading-snug text-slate-700 shadow-sm transition hover:border-pastel-sky/50 hover:bg-white hover:shadow-md sm:px-2.5 sm:py-3 sm:text-[12px]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pastel-mist/90 text-brand-cyan">
                      <Icon className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
