import { useEffect } from "react";
import { motion } from "motion/react";

/**
 * Friendly "you're out of credits for today" popup.
 *
 * Props:
 *   open    - boolean
 *   onClose - () => void
 *   resetAt - ISO date string of when the daily limit refreshes (optional)
 */
export default function LimitReachedModal({ open, onClose, resetAt }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  let untilLabel = "tomorrow";
  if (resetAt) {
    try {
      const t = new Date(resetAt);
      untilLabel = t.toLocaleString(undefined, {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      untilLabel = "tomorrow";
    }
  }

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-[96] w-full max-w-md overflow-hidden rounded-3xl border border-white/40 bg-white/95 p-8 text-center shadow-2xl"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-orange-100 ring-1 ring-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="h-12 w-12 text-rose-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="32" cy="32" r="22" />
            <path d="M22 38c2.5 3 6 4.5 10 4.5s7.5-1.5 10-4.5" />
            <circle cx="24" cy="26" r="1.6" fill="currentColor" />
            <circle cx="40" cy="26" r="1.6" fill="currentColor" />
          </svg>
        </div>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900">
          Oops — you're all out for today!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          You've used up your daily image credits. Your free quota refreshes at
          midnight UTC — come back {untilLabel} to keep creating.
        </p>
        <div className="mt-5 rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 px-4 py-3 text-xs text-slate-700 ring-1 ring-cyan-100">
          You get <span className="font-bold text-slate-900">100 credits</span> per day.
          Each image costs <span className="font-bold text-slate-900">10 credits</span> —
          that's <span className="font-bold text-slate-900">10 free images</span> daily.
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-cyan to-brand-sky px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-105"
        >
          See you tomorrow!
        </button>
      </motion.div>
    </div>
  );
}
