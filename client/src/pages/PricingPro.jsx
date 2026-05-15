import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import MarketingPageShell from "../components/MarketingPageShell.jsx";

const FEATURES = [
  { label: "Daily credits", free: "100", pro: "1,000" },
  { label: "New images / day (at 10 cr. each)", free: "~10", pro: "~100" },
  { label: "Credits per fresh image", free: "10", pro: "10" },
  { label: "Output size", free: "Standard", pro: "HD (1024px+)" },
  { label: "When the queue backs up", free: "Regular", pro: "Priority" },
  { label: "Client / commercial use", free: "Personal", pro: "Allowed (see terms)" },
  { label: "Gallery & threads", free: "Yes", pro: "Yes" },
  { label: "Styles", free: "All", pro: "All" },
  { label: "If you’re stuck", free: "Community + Help", pro: "Email-first" },
];

export default function PricingPro() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <MarketingPageShell className="pb-28 pt-8 sm:pt-12">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-sky">Pixorify Pro</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Free beside Pro — no mystery columns
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            Same product, bigger daily budget. Billing isn&apos;t switched on yet; the table&apos;s here so you know what
            you&apos;re walking into later.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.05 }}
          className="mt-10 overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white/75 shadow-xl shadow-slate-900/5 backdrop-blur-xl"
        >
          <div className="grid grid-cols-3 border-b border-slate-100 bg-gradient-to-br from-slate-50/95 to-white">
            <div className="px-3 py-4 sm:px-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">Detail</p>
            </div>
            <div className="border-l border-slate-100 px-3 py-4 text-center sm:px-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">Free</p>
              <p className="mt-1 text-base font-extrabold text-slate-900 sm:text-lg">₹0</p>
            </div>
            <div className="border-l border-slate-100 bg-gradient-to-br from-cyan-50/50 to-sky-50/50 px-3 py-4 text-center sm:px-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-cyan sm:text-xs">Pro</p>
              <p className="mt-1 text-base font-extrabold text-slate-900 sm:text-lg">
                ₹499<span className="text-xs font-medium text-slate-500">/mo</span>
              </p>
            </div>
          </div>

          {FEATURES.map((row, idx) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 ${idx % 2 === 0 ? "bg-white/95" : "bg-slate-50/50"}`}
            >
              <div className="px-3 py-3 text-left text-xs font-medium text-slate-700 sm:px-5 sm:py-3.5 sm:text-sm">
                {row.label}
              </div>
              <div className="border-l border-slate-100 px-3 py-3 text-center text-xs text-slate-700 sm:px-5 sm:py-3.5 sm:text-sm">
                {row.free}
              </div>
              <div className="border-l border-slate-100 bg-cyan-50/25 px-3 py-3 text-center text-xs font-semibold text-slate-900 sm:px-5 sm:py-3.5 sm:text-sm">
                {row.pro}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setShowComingSoon(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-sky px-8 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-[1.04] sm:text-base"
          >
            Unlock Pro — ₹499 / mo
          </button>
          <Link
            to="/pricing"
            className="text-sm font-medium text-slate-600 underline-offset-4 hover:text-brand-cyan hover:underline"
          >
            ← Simpler plan view
          </Link>
          <Link
            to="/help"
            className="text-xs font-medium text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
          >
            Credit FAQ on Help
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
              className="relative z-[96] w-full max-w-md overflow-hidden rounded-[1.65rem] border border-white/50 bg-white/95 p-8 text-center shadow-2xl"
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
              <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">Checkout isn&apos;t live yet</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                We&apos;re finishing payments and receipts. Until then your free tier is the full playground — poke
                around, break things, tell us what you need.
              </p>
              <button
                type="button"
                onClick={() => setShowComingSoon(false)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Sounds good
              </button>
            </motion.div>
          </div>
        ) : null}
      </div>
    </MarketingPageShell>
  );
}
