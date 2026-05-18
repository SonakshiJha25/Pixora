import { Link } from "react-router-dom";
import { motion } from "motion/react";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import { FloatingBrandWash } from "../components/MarketingDecorPieces.jsx";
import { WORKSPACE_NAME } from "../lib/site.js";

export default function Pricing() {
  const card =
    "flex flex-col rounded-2xl border border-pastel-cyan/30 bg-white/95 p-5 shadow-[0_16px_40px_-24px_rgba(111,203,255,0.22)] backdrop-blur-sm sm:p-6";

  return (
    <MarketingPageShell className="pb-28 pt-8 sm:pt-12">
      <div className="relative mx-auto w-full max-w-6xl overflow-x-hidden pb-2">
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-[200px] w-[min(100%,720px)] -translate-x-1/2">
          <FloatingBrandWash />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative z-[1] text-center"
        >
          <p className="type-eyebrow-muted">Pricing</p>
          <h1 className="type-page-title mt-2">Free to create today</h1>
          <p className="type-body mx-auto mt-2 max-w-2xl">
            Pixorify is simple right now: sign in, generate in {WORKSPACE_NAME}, download PNGs, and like favourites. Pro
            extras are on the way—see{" "}
            <Link to="/help" className="font-semibold underline underline-offset-4 decoration-pastel-cyan/55 hover:decoration-pastel-lilac/80">
              Help
            </Link>
            .
          </p>
        </motion.div>

        <div className="relative z-[1] mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.03 }}
            className={`${card} relative`}
          >
            <span className="absolute right-4 top-4 rounded-full border border-pastel-cyan/40 bg-pastel-mist/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
              Start here
            </span>
            <p className="type-price-tier">Free</p>
            <p className="mt-1.5 text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">₹0</p>
            <p className="type-meta">Everything you need to try Pixorify</p>
            <ul className="type-body-tight mt-5 flex-1 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="type-emphasis">Generate images</span> in {WORKSPACE_NAME}—no credit counters for now
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>Download PNGs and heart favourites in My gallery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>Refine (edits on the same picture) — coming soon</span>
              </li>
            </ul>
            <button
              type="button"
              disabled
              className="mt-7 w-full cursor-not-allowed rounded-full border border-pastel-cyan/35 bg-pastel-mist/80 py-3 text-sm font-semibold text-slate-600"
            >
              Default plan
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 }}
            className={`${card} relative ring-1 ring-pastel-lilac/45`}
          >
            <span className="absolute right-4 top-4 rounded-full border border-pastel-lilac/50 bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-800">
              For heavy use
            </span>
            <p className="type-price-tier">Pro</p>
            <p className="mt-1.5 text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">
              ₹499<span className="type-price-tier ml-1 inline text-base font-semibold tabular-nums text-slate-500"> / mo</span>
            </p>
            <p className="type-meta text-slate-600">When you create lots, every week</p>
            <ul className="type-body-tight mt-5 flex-1 space-y-2.5 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="type-emphasis">More generation headroom</span> when billing goes live
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>Priority when many people are creating at once</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>Refine and other pro tools as they ship</span>
              </li>
            </ul>
            <Link
              to="/pricing/pro"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-pastel-cyan/55 bg-pastel-mist/70 py-3 text-sm font-semibold text-slate-900 transition hover:border-pastel-sky hover:bg-white"
            >
              Full comparison
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        <p className="type-body relative z-[1] mt-12 text-center">
          <Link to="/studio" title={`Open ${WORKSPACE_NAME}`} className="font-semibold underline underline-offset-4 decoration-slate-300 hover:decoration-slate-500">
            ← {WORKSPACE_NAME}
          </Link>
          <span className="mx-2 text-slate-300" aria-hidden>
            ·
          </span>
          <Link to="/gallery" className="type-link-muted">
            My gallery
          </Link>
        </p>
      </div>
    </MarketingPageShell>
  );
}
