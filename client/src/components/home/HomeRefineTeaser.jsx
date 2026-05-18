import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { HOME_REFINE_TEASER } from "../../content/homeLanding.js";
import { photos } from "../../lib/photos.js";

/** Landing callout — Refine is coming; core flow works today without it. */
export default function HomeRefineTeaser() {
  const { title, teaser, path } = HOME_REFINE_TEASER;

  return (
    <section className="relative mt-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.45 }}
        className="grid gap-5 overflow-hidden rounded-[1.65rem] border border-pastel-lilac/35 bg-gradient-to-br from-white via-[#f8f5ff]/90 to-[#eef6ff] p-5 shadow-[0_24px_56px_-38px_rgba(183,156,255,0.35)] sm:grid-cols-[1fr_minmax(0,11rem)] sm:items-center sm:gap-6 sm:p-6"
      >
        <div className="min-w-0">
          <p className="type-eyebrow-muted inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan" aria-hidden />
            On the roadmap
          </p>
          <h2 className="type-subsection-title mt-2">{title}</h2>
          <p className="type-body mt-2 max-w-xl text-slate-600">{teaser}</p>
          <Link
            to={path}
            className="btn-secondary-soft btn-lift mt-4 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            What to expect
          </Link>
        </div>
        <motion.div
          className="relative mx-auto flex h-[7.5rem] w-full max-w-[11rem] items-center justify-center overflow-hidden rounded-2xl border border-pastel-lilac/30 bg-white/80 sm:h-[8.5rem]"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={photos.tipRefineStep}
            alt=""
            className="h-full w-full object-contain object-center p-2"
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
