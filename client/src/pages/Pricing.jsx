import { Link } from "react-router-dom";
import { motion } from "motion/react";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import { WORKSPACE_NAME } from "../lib/site.js";

export default function Pricing() {
  return (
    <MarketingPageShell className="pb-28 pt-8 sm:pt-12">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="type-eyebrow-brand">Pricing</p>
          <h1 className="type-page-title mt-2">Free to start. Room to grow.</h1>
          <p className="type-body mx-auto mt-2 max-w-2xl">
            Pixorify is calm creative AI — iterate on a thread without dashboard noise. Numbers below are directional
            placeholders; flip to{" "}
            <Link to="/help" className="type-link-brand">
              Help
            </Link>{" "}
            for the real credit ledger.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:gap-5">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.04 }}
            className="relative flex flex-col rounded-[1.5rem] border border-slate-200/90 bg-white/70 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6"
          >
            <span className="absolute right-5 top-5 inline-flex rounded-full bg-emerald-100/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 ring-1 ring-emerald-200/70">
              Start here
            </span>
            <p className="type-price-tier">Free</p>
            <p className="mt-1.5 text-xl font-extrabold tabular-nums text-slate-900 sm:text-2xl">₹0</p>
            <p className="type-meta">Explore the full workflow</p>
            <ul className="type-body-tight mt-5 flex-1 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="type-emphasis">~100 credits</span> / day · midnight IST refill
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>~10 fresh runs / day · same-thread refinements favored</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>Private gallery · IST daily credits · conversational refinements</span>
              </li>
            </ul>
            <button
              type="button"
              disabled
              className="mt-7 w-full cursor-not-allowed rounded-full border border-emerald-200/90 bg-emerald-50/90 py-3 text-sm font-semibold text-emerald-800"
            >
              Default plan
            </button>
          </motion.div>

          {/* Creator */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="relative flex flex-col overflow-hidden rounded-[1.5rem] border border-sky-300/65 bg-white/82 p-5 shadow-xl shadow-sky-500/12 ring-1 ring-sky-200/65 backdrop-blur-xl sm:p-6"
          >
            <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Sweet spot
            </span>
            <p className="type-price-tier">Creator</p>
            <p className="mt-1.5 text-xl font-extrabold tabular-nums text-slate-900 sm:text-2xl">
              ₹149<span className="type-price-tier ml-1 inline text-base font-semibold tabular-nums text-slate-500"> / mo</span>
            </p>
            <p className="type-meta text-slate-600">For steady personal projects</p>
            <ul className="type-body-tight mt-5 flex-1 space-y-2.5 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-cyan" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="type-emphasis">~300 credits</span> / day (3× Free pool)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-cyan" aria-hidden>
                  ✓
                </span>
                <span>Higher throughput when you iterate a lot</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-cyan" aria-hidden>
                  ✓
                </span>
                <span>Higher fidelity exports · priority lane (when live)</span>
              </li>
            </ul>
            <Link
              to="/coming-soon?channel=pricing"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 py-3 text-sm font-semibold text-white shadow-md shadow-sky-600/25 transition hover:brightness-[1.04]"
            >
              Notify me
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="relative flex flex-col rounded-[1.5rem] border border-slate-200/85 bg-white/75 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-6"
          >
            <span className="absolute right-5 top-5 inline-flex rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
              Teams & power
            </span>
            <p className="type-price-tier">Pro</p>
            <p className="mt-1.5 text-xl font-extrabold tabular-nums text-slate-900 sm:text-2xl">
              ₹499<span className="type-price-tier ml-1 inline text-base font-semibold tabular-nums text-slate-500"> / mo</span>
            </p>
            <p className="type-meta text-slate-600">When the studio never closes</p>
            <ul className="type-body-tight mt-5 flex-1 space-y-2.5 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-900" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="type-emphasis">~1,000 credits</span> / day — serious batching
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-900" aria-hidden>
                  ✓
                </span>
                <span>Priority lane when the queue stacks up</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-900" aria-hidden>
                  ✓
                </span>
                <span>HD / print-minded exports + usage clarity for client work</span>
              </li>
            </ul>
            <Link
              to="/pricing/pro"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-900 bg-slate-900 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
            >
              Full comparison
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
