import { useEffect } from "react";
import { motion } from "motion/react";

/**
 * Shown when a guest finishes their browser trial or hits the server guest cap.
 *
 * variant:
 *   - browser — localStorage cap (5 previews)
 *   - network — per-IP guest rate limit on the API
 */
export default function GuestTrialEndedModal({ open, onClose, onSignIn, variant = "browser" }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const isNetwork = variant === "network";

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-trial-title"
    >
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="relative z-[96] w-full max-w-md overflow-hidden rounded-3xl border border-cyan-100/80 bg-white/95 p-8 text-center shadow-2xl shadow-cyan-900/10"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-cyan-100 ring-1 ring-white">
          <span className="text-3xl" aria-hidden="true">
            ✨
          </span>
        </div>
        <h2 id="guest-trial-title" className="mt-5 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          {isNetwork ? "A quick pause on previews" : "Hope you enjoyed your previews"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {isNetwork ? (
            <>
              Lots of free previews were used from this connection today — thanks for the interest. Sign in for your
              own daily quota, or come back tomorrow to try again without an account.
            </>
          ) : (
            <>
              You&apos;ve used all{" "}
              <span className="font-semibold text-slate-800">five free trial images</span>
              . Take a moment to create a free account when you&apos;re ready — then you get fresh credits every day and
              your gallery saves automatically.
            </>
          )}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSignIn?.();
            }}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-brand-cyan to-brand-sky px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105 sm:flex-none sm:min-w-[160px]"
          >
            Sign in — it&apos;s free
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none sm:min-w-[120px]"
          >
            Maybe later
          </button>
        </div>
      </motion.div>
    </div>
  );
}
