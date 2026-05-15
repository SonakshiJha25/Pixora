import { Link } from "react-router-dom";
import { motion } from "motion/react";
import MarketingPageShell from "../components/MarketingPageShell.jsx";

export default function Pricing() {
  return (
    <MarketingPageShell className="pb-28 pt-8 sm:pt-12">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-sky">Pricing</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Start free, scale when it sticks
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            Free is real: daily credits, every style, your gallery. Pro is for days when ten fresh images isn&apos;t
            enough. Numbers for refills and timezones sit on{" "}
            <Link to="/help" className="font-semibold text-brand-cyan underline-offset-4 hover:underline">
              Help
            </Link>
            .
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.04 }}
            className="relative flex flex-col rounded-[1.75rem] border border-slate-200/90 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-7"
          >
            <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-emerald-100/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-200/70">
              You&apos;re probably here
            </span>
            <p className="text-lg font-bold text-slate-900">Free</p>
            <p className="mt-2 text-3xl font-extrabold tabular-nums text-slate-900">₹0</p>
            <p className="text-xs text-slate-500">No card, no trial clock</p>
            <ul className="mt-5 space-y-2.5 text-sm leading-snug text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="font-semibold text-slate-800">100 credits</span> back each day at midnight IST
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>About <span className="font-semibold text-slate-800">ten new images</span> a day if each run costs 10 credits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="font-semibold text-slate-800">Refine</span> on the same thread without spending again
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
            className="relative flex flex-col overflow-hidden rounded-[1.75rem] border border-brand-cyan/35 bg-gradient-to-br from-white via-cyan-50/25 to-sky-50/35 p-6 shadow-lg shadow-cyan-500/10 backdrop-blur-xl ring-1 ring-cyan-200/35 sm:p-7"
          >
            <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-cyan to-brand-sky px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Heavier weeks
            </span>
            <p className="text-lg font-bold text-slate-900">Pro</p>
            <p className="mt-2 text-3xl font-extrabold tabular-nums text-slate-900">
              ₹499<span className="text-base font-semibold text-slate-500"> / month</span>
            </p>
            <p className="text-xs text-slate-600">Pause or cancel whenever</p>
            <ul className="mt-5 space-y-2.5 text-sm leading-snug text-slate-800">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-cyan" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="font-semibold">1,000 credits</span> each day instead of 100
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-cyan" aria-hidden>
                  ✓
                </span>
                <span>Roughly <span className="font-semibold">100 fresh images</span> a day at 10 credits each</span>
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

        <p className="mt-12 text-center text-sm text-slate-600">
          <Link to="/studio" className="font-semibold text-brand-cyan underline-offset-4 hover:underline">
            ← Studio
          </Link>
          <span className="mx-2 text-slate-300" aria-hidden>
            ·
          </span>
          <Link to="/gallery" className="font-semibold text-slate-600 underline-offset-4 hover:text-brand-cyan hover:underline">
            Gallery
          </Link>
        </p>
      </div>
    </MarketingPageShell>
  );
}
