import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const PLACEHOLDERS = [
  "Add warm window light from the left",
  "Make colours a little more saturated",
  "Change the sky to late sunset",
  "Soften the background, keep the subject sharp",
  "Remove the small logo in the corner",
  "Give it a calmer, matte finish",
];

const QUICK_ACTIONS = [
  "Warm rim light from camera-left",
  "Lift shadows slightly, keep highlights",
  "Sharpen the subject, soften the backdrop",
  "Cooler colour grade, film contrast",
  "Crop feel: a touch tighter on the hero subject",
];

function appendInstruction(prev, line) {
  const t = line.trim();
  const base = prev.trim();
  if (!base) return t;
  return `${base}, ${t}`;
}

function usePlaceholderRotate(active) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    const t = window.setInterval(() => {
      setIdx((v) => (v + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => window.clearInterval(t);
  }, [active]);
  return PLACEHOLDERS[idx];
}

export default function RefineImagePanel({ open, previewSrc, onClose, onApply, submitting }) {
  const ph = usePlaceholderRotate(open && !submitting);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!open) setText("");
  }, [open]);

  const footerHint = useMemo(
    () =>
      "These edits stay tied to one picture—they usually skip the full charge of generating something brand new. Credits are spelled out under Help.",
    []
  );

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-slate-950/40 backdrop-blur-sm md:bg-slate-950/25"
            aria-label="Close refine this image"
            onClick={() => !submitting && onClose()}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="refine-panel-title"
            initial={{ opacity: 0, x: 380 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 380 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 right-0 top-0 z-[85] flex w-full flex-col bg-white/96 shadow-2xl ring-1 ring-slate-200/80 md:left-auto md:max-w-md"
          >
            <header className="relative shrink-0 border-b border-slate-100 px-5 pb-3 pt-4 pr-16">
              <h2 id="refine-panel-title" className="font-display text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                Refine this image
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Paint a picture with words: mention light direction, colour tweaks, or subjects to nudge while keeping
                composition mostly intact.
              </p>
              <button
                type="button"
                disabled={submitting}
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 md:top-5"
              >
                Close
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-5">
              {previewSrc ? (
                <motion.div
                  layout
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-inner"
                >
                  <img
                    src={previewSrc}
                    alt="Frame you are refining"
                    className="max-h-[40vh] w-full object-contain md:max-h-[32vh]"
                  />
                </motion.div>
              ) : (
                <div className="flex h-36 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-500 sm:text-sm">
                  Preview after a render completes.
                </div>
              )}

              <label htmlFor="refine-instruction" className="mt-6 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                What to change
              </label>
              <textarea
                id="refine-instruction"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                disabled={submitting}
                placeholder={ph}
                className="mt-2 min-h-[7rem] max-h-[min(36vh,18rem)] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-brand-cyan/50 focus:ring-2 focus:ring-brand-cyan/20 disabled:opacity-60 sm:min-h-[7.5rem]"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((line) => (
                  <button
                    key={line}
                    type="button"
                    disabled={submitting}
                    onClick={() => setText((p) => appendInstruction(p, line))}
                    className="rounded-full border border-slate-200/90 bg-slate-50 px-3 py-1.5 text-left text-[11px] font-medium leading-snug text-slate-700 shadow-sm transition hover:border-brand-cyan/35 hover:bg-white hover:text-slate-900 disabled:pointer-events-none disabled:opacity-50 sm:text-xs"
                  >
                    {line}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] leading-snug text-slate-500 sm:text-[11px]">{footerHint}</p>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white/95 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                disabled={submitting || text.trim().length < 3}
                onClick={() => onApply(text.trim())}
                className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold shadow-md disabled:pointer-events-none disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Applying…
                  </>
                ) : (
                  "Refine this image"
                )}
              </button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
