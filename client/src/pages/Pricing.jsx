import { Link } from "react-router-dom";
import { motion } from "motion/react";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import { WORKSPACE_NAME } from "../lib/site.js";

export default function Pricing() {
  const card =
    "flex flex-col rounded-2xl border border-slate-200/85 bg-white p-5 shadow-sm sm:p-6";

  return (
    <MarketingPageShell className="pb-28 pt-8 sm:pt-12">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-center"
        >
          <p className="type-eyebrow-muted">Pricing</p>
          <h1 className="type-page-title mt-2">Free to start · room to grow</h1>
          <p className="type-body mx-auto mt-2 max-w-2xl">
            Directional numbers — see{" "}
            <Link to="/help" className="font-semibold underline underline-offset-4 decoration-slate-300 hover:decoration-slate-500">
              Help
            </Link>{" "}
            for the live credit ledger.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.03 }}
            className={`${card} relative`}
          >
            <span className="absolute right-4 top-4 rounded-full border border-slate-200/90 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
              Start here
            </span>
            <p className="type-price-tier">Free</p>
            <p className="mt-1.5 text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">₹0</p>
            <p className="type-meta">Full workflow included</p>
            <ul className="type-body-tight mt-5 flex-1 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="type-emphasis">~100 credits</span> / day · midnight IST refill
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>~10 fresh runs / day · same-thread refinements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>Private gallery · conversational thread</span>
              </li>
            </ul>
            <button
              type="button"
              disabled
              className="mt-7 w-full cursor-not-allowed rounded-full border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-600"
            >
              Default plan
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 }}
            className={`${card} relative ring-1 ring-slate-300/70`}
          >
            <span className="absolute right-4 top-4 rounded-full border border-slate-900/90 bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              Coming soon
            </span>
            <p className="type-price-tier">Creator</p>
            <p className="mt-1.5 text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">
              ₹149<span className="type-price-tier ml-1 inline text-base font-semibold tabular-nums text-slate-500"> / mo</span>
            </p>
            <p className="type-meta text-slate-600">Personal projects</p>
            <ul className="type-body-tight mt-5 flex-1 space-y-2.5 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="type-emphasis">~300 credits</span> / day (3× Free pool)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>More throughput for heavy iteration days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>Higher fidelity exports when available</span>
              </li>
            </ul>
            <Link
              to="/coming-soon?channel=pricing"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Notify me
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.09 }} className={`${card} relative`}>
            <span className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-800">
              Teams · power users
            </span>
            <p className="type-price-tier">Pro</p>
            <p className="mt-1.5 text-xl font-bold tabular-nums text-slate-900 sm:text-2xl">
              ₹499<span className="type-price-tier ml-1 inline text-base font-semibold tabular-nums text-slate-500"> / mo</span>
            </p>
            <p className="type-meta text-slate-600">When the studio stays open late</p>
            <ul className="type-body-tight mt-5 flex-1 space-y-2.5 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>
                  <span className="type-emphasis">~1,000 credits</span> / day — serious batching
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>Priority lane when queues stack</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-slate-500" aria-hidden>
                  ✓
                </span>
                <span>Usage clarity built for client work</span>
              </li>
            </ul>
            <Link
              to="/pricing/pro"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-900 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Full comparison
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        <p className="type-body mt-12 text-center">
          <Link to="/studio" title={`Open ${WORKSPACE_NAME}`} className="font-semibold underline underline-offset-4 decoration-slate-300 hover:decoration-slate-500">
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
