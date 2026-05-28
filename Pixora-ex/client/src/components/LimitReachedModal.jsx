import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

/**
 * Friendly "you're out of credits for today" popup.
 *
 * Props:
 *   open                 - boolean
 *   onClose              - () => void
 *   dailyResetTimezone   - label from API, e.g. "IST", "UTC", or another zone id (optional)
 */
export default function LimitReachedModal({ open, onClose, dailyResetTimezone }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const tzPhrase =
    dailyResetTimezone === "UTC" || dailyResetTimezone === "Etc/UTC"
      ? "midnight UTC"
      : dailyResetTimezone === "IST" || dailyResetTimezone === "Asia/Kolkata"
        ? "midnight India time"
      : dailyResetTimezone
        ? `midnight (${dailyResetTimezone})`
        : "midnight India time";

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-900/50 p-4"
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
        className="relative z-[96] w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-100">
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
          Oops — you&apos;re all out for today!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          You&apos;ve used up your daily image credits. Your pool refills at the next calendar{" "}
          <strong>{tzPhrase}</strong> (00:00).
        </p>
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-700">
          You get <span className="font-bold text-slate-900">100 credits</span> per day.
          Each image costs <span className="font-bold text-slate-900">10 credits</span> —
          that&apos;s <span className="font-bold text-slate-900">10 free images</span> daily.
        </div>
        <Link
          to="/pricing"
          onClick={onClose}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Upgrade
        </Link>
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">Your balance returns at the next reset.</p>
      </motion.div>
    </div>
  );
}
