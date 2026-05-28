import { Link } from "react-router-dom";
import { useLayoutEffect } from "react";
import { motion } from "motion/react";
import { Image, MessageSquare, Palette, SlidersHorizontal, Sparkles, Wand2 } from "lucide-react";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import { REFINE_COMING_SOON_PAGE, REFINE_PLAN_CARDS } from "../content/refineComingSoon.js";
import { HomeSerif } from "../lib/homeTypography.jsx";
import { scrollPageTop } from "../lib/navigation.js";
import { WORKSPACE_NAME } from "../lib/site.js";

const PLAN_ICONS = [Image, MessageSquare, Palette, SlidersHorizontal, Sparkles, Wand2];

/** `/coming-soon?feature=refine` — hero plus planning cards. */
export default function RefineComingSoon() {
  const { eyebrow, lede, planHeading, planIntro } = REFINE_COMING_SOON_PAGE;

  useLayoutEffect(() => {
    scrollPageTop(false);
  }, []);

  return (
    <MarketingPageShell className="pb-24 pt-8 sm:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto w-full max-w-3xl px-1"
      >
        <div className="text-center">
          <p className="type-eyebrow-muted inline-flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan" aria-hidden />
            {eyebrow}
          </p>
          <h1 className="type-page-title mt-3">
            Refine — <HomeSerif>coming soon</HomeSerif>
          </h1>
          <p className="type-body mx-auto mt-4 max-w-xl text-slate-600">{lede}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/studio" className="btn-primary btn-lift rounded-full px-8 py-2.5 text-sm font-semibold">
              Open {WORKSPACE_NAME}
            </Link>
            <Link
              to="/"
              className="btn-secondary-soft btn-lift rounded-full px-7 py-2.5 text-sm font-semibold"
            >
              Back home
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-12 sm:mt-14"
        >
          <div className="px-1 text-left">
            <p className="type-eyebrow-muted">{planHeading}</p>
            <h2 className="type-subsection-title mt-1">{planIntro}</h2>
          </div>

          <ul className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-3.5">
            {REFINE_PLAN_CARDS.map((card, i) => {
              const Icon = PLAN_ICONS[i] ?? Sparkles;
              return (
                <motion.li
                  key={card.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.38 }}
                  className="flex gap-3.5 rounded-[1.25rem] border border-pastel-cyan/28 bg-white/90 p-4 shadow-[0_18px_44px_-32px_rgba(111,203,255,0.35)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-pastel-cyan/30 bg-pastel-mist/80 text-brand-cyan">
                    <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <h3 className="type-card-title-sm">{card.title}</h3>
                    <p className="type-body mt-1.5 leading-snug text-slate-600">{card.body}</p>
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>

        <p className="type-body mx-auto mt-10 max-w-xl text-center text-slate-500">
          Questions?{" "}
          <Link to="/help#contact" className="type-link-brand">
            Contact us
          </Link>
          .
        </p>
      </motion.div>
    </MarketingPageShell>
  );
}
