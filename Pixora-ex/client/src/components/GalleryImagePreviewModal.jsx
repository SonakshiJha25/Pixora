import { useEffect } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { displayImageUrl } from "../lib/imageDelivery.js";
import DownloadPngButton from "./DownloadPngButton.jsx";
import { labelForStyleKey } from "../lib/styleTypes.js";

/** Full-size preview — matches Studio result sizing. */
export default function GalleryImagePreviewModal({ open, item, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !item) return null;

  const prompt = item.promptRaw || item.prompt || "";
  const src = displayImageUrl(item.imageUrl, item._id, { width: 1040 });

  return (
    <motion.div
      className="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        aria-label="Close preview"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-preview-title"
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-[96] flex w-full max-w-[min(100%,36rem)] flex-col items-center"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-1 -top-1 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#171a22] text-slate-300 shadow-lg transition hover:border-white/25 hover:text-white sm:-right-2 sm:-top-2"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        </button>

        <motion.div className="studio-shell w-full overflow-hidden rounded-2xl p-1.5 ring-1 ring-white/20 sm:p-2">
          <img
            src={src}
            alt={prompt || "Generated image"}
            className="mx-auto block max-h-[min(52vh,520px)] w-auto max-w-[min(92vw,520px)] rounded-xl object-contain"
            decoding="async"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.25 }}
          className="mt-4 w-full max-w-[min(92vw,520px)] rounded-xl border border-white/[0.1] bg-[#171a22]/95 px-4 py-3 text-center shadow-xl backdrop-blur-sm"
        >
          <h2 id="gallery-preview-title" className="sr-only">
            Image preview
          </h2>
          {prompt ? (
            <p className="line-clamp-3 text-[12px] leading-snug text-slate-300 sm:text-sm">
              <span className="font-semibold text-slate-100">Prompt:</span> {prompt}
            </p>
          ) : null}
          <p className="mt-1.5 text-[11px] text-slate-500">
            {item.style ? labelForStyleKey(item.style) : "—"}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <DownloadPngButton
              imageId={String(item._id)}
              imageUrl={item.imageUrl}
              className="rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-white/22 hover:bg-white/[0.1]"
            />
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-white/18 hover:text-slate-100"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
