import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import MarketingPageShell from "../components/MarketingPageShell.jsx";

const FEATURES = [
  { label: "Credits per day", free: "100", pro: "1,000" },
  { label: "Roughly how many brand-new pictures / day", free: "~10", pro: "~100" },
  { label: "Credits per new picture", free: "10", pro: "10" },
  { label: "Output size", free: "Standard", pro: "HD (1024px+)" },
  { label: "When lots of people are creating", free: "Standard wait", pro: "Priority queue" },
  { label: "Client / commercial use", free: "Personal", pro: "Allowed (see terms)" },
  { label: "Gallery saved work", free: "Yes", pro: "Yes" },
  { label: "Styles", free: "All", pro: "All" },
  { label: "If you’re stuck", free: "Community + Help", pro: "Email-first" },
];

export default function PricingPro() {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <MarketingPageShell className="pb-28 pt-8 sm:pt-12">
      <div className="mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="type-eyebrow-muted">Pixorify Pro</p>
          <h1 className="type-page-title mt-2">
            Free and Pro, side by side
          </h1>
          <p className="type-body mx-auto mt-3 max-w-xl">
            Same app—Pro just gives you more credits each day. Billing isn&apos;t live yet; this table is here so you know
            what to expect when it is.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.05 }}
          className="mt-10 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card"
        >
          <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/80">
            <div className="px-3 py-4 sm:px-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">Detail</p>
            </div>
            <div className="border-l border-slate-100 px-3 py-4 text-center sm:px-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">Free</p>
              <p className="mt-1 text-base font-extrabold text-slate-900 sm:text-lg">₹0</p>
            </div>
            <div className="border-l border-slate-100 bg-slate-100/50 px-3 py-4 text-center sm:px-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-700 sm:text-xs">Pro</p>
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
              <div className="border-l border-slate-100 bg-slate-50/40 px-3 py-3 text-center text-xs font-semibold text-slate-900 sm:px-5 sm:py-3.5 sm:text-sm">
                {row.pro}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setShowComingSoon(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:text-base"
          >
            Unlock Pro — ₹499 / mo
          </button>
          <Link
            to="/pricing"
            className="type-link-muted"
          >
            ← Simpler pricing page
          </Link>
          <Link
            to="/help"
            className="text-xs font-medium text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline"
          >
            Credit answers in Help
          </Link>
        </div>

        {showComingSoon ? (
          <div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-900/50 p-4"
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
              className="relative z-[96] w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-slate-700"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h2 className="type-section-accent mt-5">Payments aren&apos;t live yet</h2>
              <p className="type-body mt-3">
                We&apos;re finishing checkout and receipts. Until then the free tier is the full experience—please try things
                out and tell us what you&apos;d pay for later.
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
