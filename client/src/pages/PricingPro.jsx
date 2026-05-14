import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const FEATURES = [
  { label: "Daily credits", free: "100", pro: "1,000" },
  { label: "Images per day", free: "10", pro: "100" },
  { label: "Credits per image", free: "10", pro: "10" },
  { label: "Resolution", free: "Standard", pro: "HD (1024px+)" },
  { label: "Priority queue", free: "—", pro: "Yes" },
  { label: "Commercial usage", free: "Personal only", pro: "Allowed" },
  { label: "Gallery history", free: "Yes", pro: "Yes" },
  { label: "All styles", free: "Yes", pro: "Yes" },
  { label: "Support", free: "Community", pro: "Email priority" },
];

export default function PricingPro() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <div className="mx-auto w-full max-w-4xl px-2 pb-24 pt-10 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">
          Pixorify Pro
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Pro vs Free
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
          See exactly what you get when you upgrade.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mt-10 overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 shadow-md backdrop-blur"
      >
        <div className="grid grid-cols-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="px-3 py-4 sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
              Feature
            </p>
          </div>
          <div className="border-l border-slate-100 px-3 py-4 text-center sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
              Free
            </p>
            <p className="mt-1 text-base font-extrabold text-slate-900 sm:text-lg">₹0</p>
          </div>
          <div className="border-l border-slate-100 bg-gradient-to-br from-cyan-50/60 to-sky-50/60 px-3 py-4 text-center sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-cyan sm:text-xs">
              Pro
            </p>
            <p className="mt-1 text-base font-extrabold text-slate-900 sm:text-lg">
              ₹499<span className="text-xs font-medium text-slate-500">/mo</span>
            </p>
          </div>
        </div>

        {FEATURES.map((row, idx) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
          >
            <div className="px-3 py-3 text-xs font-medium text-slate-700 sm:px-6 sm:py-4 sm:text-sm">
              {row.label}
            </div>
            <div className="border-l border-slate-100 px-3 py-3 text-center text-xs text-slate-700 sm:px-6 sm:py-4 sm:text-sm">
              {row.free}
            </div>
            <div className="border-l border-slate-100 bg-cyan-50/30 px-3 py-3 text-center text-xs font-semibold text-slate-900 sm:px-6 sm:py-4 sm:text-sm">
              {row.pro}
            </div>
          </div>
        ))}
      </motion.div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => setShowComingSoon(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-sky px-8 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-105 sm:text-base"
        >
          Buy Pixorify Pro — ₹499 / mo
        </button>
        <Link
          to="/pricing"
          className="text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
        >
          ← Back to plans
        </Link>
      </div>

      {showComingSoon ? (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close"
            onClick={() => setShowComingSoon(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-[96] w-full max-w-md overflow-hidden rounded-3xl border border-white/40 bg-white/95 p-8 text-center shadow-2xl"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-sky-100 ring-1 ring-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10 text-brand-cyan"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
              Coming soon
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Pro checkout isn't live yet — we're setting up payments. In the
              meantime, enjoy 100 daily credits free!
            </p>
            <button
              type="button"
              onClick={() => setShowComingSoon(false)}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Got it
            </button>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
