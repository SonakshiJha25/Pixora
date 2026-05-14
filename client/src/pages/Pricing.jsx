import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Pricing() {
  return (
    <div className="mx-auto w-full max-w-4xl px-2 pb-24 pt-10 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">Pricing</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Pricing Plans</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
          Start free. Upgrade when you need more daily images.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative flex flex-col rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-md backdrop-blur"
        >
          <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Current plan
          </span>
          <p className="text-lg font-bold text-slate-900">Free</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">₹0</p>
          <p className="text-xs text-slate-500">forever</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">✓</span>
              <span>
                <span className="font-semibold">100 credits</span> every day
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">✓</span>
              <span>10 credits per image — 10 free images / day</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">✓</span>
              <span>Auto-refreshes at midnight UTC</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">✓</span>
              <span>All styles included</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-500">✓</span>
              <span>Personal gallery & history</span>
            </li>
          </ul>
          <button
            type="button"
            disabled
            className="mt-6 w-full cursor-not-allowed rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700"
          >
            You're on this plan
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="relative flex flex-col overflow-hidden rounded-3xl border border-brand-cyan/40 bg-gradient-to-br from-white via-cyan-50/30 to-sky-50/30 p-6 shadow-glow backdrop-blur"
        >
          <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-cyan to-brand-sky px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Most popular
          </span>
          <p className="text-lg font-bold text-slate-900">Pro</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            ₹499<span className="text-sm font-medium text-slate-500"> / mo</span>
          </p>
          <p className="text-xs text-slate-500">cancel anytime</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-cyan">✓</span>
              <span>
                <span className="font-semibold">1,000 credits</span> every day
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-cyan">✓</span>
              <span>100 images / day</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-cyan">✓</span>
              <span>Priority generation queue</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-cyan">✓</span>
              <span>HD output</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-cyan">✓</span>
              <span>Commercial usage rights</span>
            </li>
          </ul>
          <Link
            to="/pricing/pro"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-sky py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
          >
            See details
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>

      <p className="mt-10 text-center text-sm">
        <Link to="/studio" className="font-semibold text-brand-cyan underline-offset-4 hover:underline">
          ← Back to Studio
        </Link>
      </p>
    </div>
  );
}
