import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { resolveImageUrl } from "../config/api.js";

export default function GalleryThreadModal({ open, imageId, api, onClose }) {
  const [thread, setThread] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || !imageId) {
      setThread([]);
      setError(false);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    api
      .get(`/api/images/thread/${imageId}`)
      .then(({ data }) => {
        if (!cancelled) setThread(data.thread || []);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setThread([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, imageId, api]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-md sm:p-6">
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="relative z-[91] flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/25 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Refinement chain</h2>
            <p className="text-xs text-slate-500">Original and each edit, in order</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            Done
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-cyan" />
            </div>
          ) : error ? (
            <p className="py-10 text-center text-sm text-slate-600">
              We couldn&apos;t load this chain. Try again later.
            </p>
          ) : thread.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">Nothing here yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {thread.map((item, idx) => (
                <li key={String(item._id ?? idx)}>
                  <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50">
                    <div className="relative aspect-square w-full max-h-[420px] sm:aspect-video sm:max-h-[280px]">
                      <img
                        src={resolveImageUrl(item.imageUrl)}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="border-t border-slate-200/70 bg-white/90 px-3 py-2.5 text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {idx === 0 ? "Original" : `Edit ${idx}`}
                        {item.isEdit ? (
                          <span className="ml-2 rounded-full bg-cyan-50 px-2 py-0.5 font-medium normal-case tracking-normal text-brand-cyan">
                            Refinement
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-snug text-slate-800">
                        {item.promptRaw || item.prompt || item.editPrompt || "—"}
                      </p>
                    </div>
                  </div>
                  {idx < thread.length - 1 ? (
                    <div className="flex justify-center py-1 text-brand-cyan" aria-hidden>
                      <ArrowDown className="h-5 w-5 opacity-70" strokeWidth={2} />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}
