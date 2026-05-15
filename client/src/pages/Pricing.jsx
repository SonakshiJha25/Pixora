import { Link } from "react-router-dom";
import { motion } from "motion/react";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import { WORKSPACE_NAME } from "../lib/site.js";

export default function Pricing() {
  return (
    <MarketingPageShell className="pb-28 pt-8 sm:pt-12">
      <div className="mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="type-eyebrow-brand">Pricing</p>
          <h1 className="type-page-title mt-2">
            Start free, scale when it sticks
          </h1>
          <p className="type-body mx-auto mt-3 max-w-2xl">
            Daily credits, every style, your gallery on Free. Pro is for heavier weeks. Refills and timezones live on{" "}
            <Link to="/help" className="type-link-brand">
              Help
            </Link>
            .
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.04 }}
            className="relative flex flex-col rounded-[1.5rem] border border-slate-200/90 bg-white/70 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6"
          >
            <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-emerald-100/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-200/70">
              You&apos;re probably here
            </span>
            <p className="type-price-tier">Free</p>
            <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-slate-900 sm:text-3xl">₹0</p>
            <p className="type-meta">No card, no trial clock</p>
            <ul className="type-body-tight mt-5 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="type-emphasis">100 credits</span> back each day at midnight IST
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>About <span className="type-emphasis">ten new images</span> a day if each run costs 10 credits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="type-emphasis">Refine</span> on the same thread without spending again
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>Every look we ship (realistic, anime, the rest)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>Gallery + history so nothing floats away nameless</span>
              </li>
            </ul>
            <button
              type="button"
              disabled
              className="mt-7 w-full cursor-not-allowed rounded-full border border-emerald-200/90 bg-emerald-50/90 py-3 text-sm font-semibold text-emerald-800"
            >
              This is your plan
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="relative flex flex-col overflow-hidden rounded-[1.5rem] border border-brand-cyan/35 bg-gradient-to-br from-white via-cyan-50/25 to-sky-50/35 p-5 shadow-lg shadow-cyan-500/10 backdrop-blur-xl ring-1 ring-cyan-200/35 sm:p-6"
          >
            <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-cyan to-brand-sky px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Heavier weeks
            </span>
            <p className="type-price-tier">Pro</p>
            <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-slate-900 sm:text-3xl">
              ₹499<span className="type-price-tier ml-1 inline text-base font-semibold tabular-nums text-slate-500"> / month</span>
            </p>
            <p className="type-meta text-slate-600">Pause or cancel whenever</p>
            <ul className="type-body-tight mt-5 space-y-2.5 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-cyan" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="type-emphasis">1,000 credits</span> each day instead of 100
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-cyan" aria-hidden>
                  ✓
                </span>
                <span>Roughly <span className="type-emphasis">100 fresh images</span> a day at 10 credits each</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-cyan" aria-hidden>
                  ✓
                </span>
                <span>Faster lane when the queue piles up</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-cyan" aria-hidden>
                  ✓
                </span>
                <span>Sharper exports (think HD-ready)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-cyan" aria-hidden>
                  ✓
                </span>
                <span>Workspace-friendly usage rights — read the fine print before client work</span>
              </li>
            </ul>
            <Link
              to="/pricing/pro"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-sky py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-[1.04]"
            >
              Compare everything
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        <p className="type-body mt-12 text-center">
          <Link to="/studio" title={`Open ${WORKSPACE_NAME}`} className="type-link-brand">
            ← {WORKSPACE_NAME}
          </Link>
          <span className="mx-2 text-slate-300" aria-hidden>
            ·
          </span>
          <Link to="/gallery" className="type-link-muted">
            Gallery
          </Link>
        </p>
      </div>
    </MarketingPageShell>
  );
}
