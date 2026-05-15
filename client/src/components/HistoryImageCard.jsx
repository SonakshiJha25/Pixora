import { useState } from "react";
import { resolveImageUrl } from "../config/api.js";

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
};

/** @param {'default' | 'workspace'} props.surface — workspace = Studio / premium gallery on dark BG */
export default function HistoryImageCard({ item, onOpen, showFavoritePip = true, surface = "default" }) {
  const [hover, setHover] = useState(false);
  const [failed, setFailed] = useState(false);
  const src = resolveImageUrl(item.imageUrl);

  const isWs = surface === "workspace";

  const tileClass = isWs
    ? "group relative aspect-square w-full max-w-[280px] mx-auto overflow-hidden rounded-2xl border border-white/[0.09] bg-slate-950/50 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.85)] shadow-black/70 ring-1 ring-white/[0.04] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-[0_20px_56px_-24px_rgba(6,182,212,0.22),0_0_0_1px_rgba(34,211,238,0.12)] hover:ring-cyan-400/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
    : "group relative aspect-square w-full max-w-[280px] mx-auto overflow-hidden rounded-2xl border border-white/40 bg-slate-100 shadow-lg ring-1 ring-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:ring-brand-cyan/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan";

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={tileClass}
    >
      {failed ? (
        <div
          className={`flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center ${
            isWs
              ? "bg-gradient-to-br from-slate-900 to-slate-950"
              : "bg-gradient-to-br from-slate-100 to-slate-200"
          }`}
        >
          <span aria-hidden="true" className={`text-2xl ${isWs ? "text-slate-500" : "text-slate-400"}`}>
            ⚠
          </span>
          <p className={`line-clamp-3 text-xs font-medium ${isWs ? "text-slate-400" : "text-slate-600"}`}>
            {item.promptRaw || "Image unavailable"}
          </p>
          <p className={`text-[10px] uppercase tracking-wider ${isWs ? "text-slate-500" : "text-slate-400"}`}>
            Preview unavailable
          </p>
        </div>
      ) : (
        <img
          src={src}
          alt={item.promptRaw || "Generated image"}
          className={`h-full w-full object-cover transition duration-500 ease-out md:duration-400 ${
            hover ? "scale-[1.04] brightness-[1.03]" : "scale-100"
          }`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-3 text-left text-white md:hidden">
        <p className="line-clamp-1 text-[11px] font-medium text-white/95">{item.promptRaw || "Image"}</p>
        <p className="text-[10px] text-white/60">
          {formatDate(item.createdAt)} · <span className="capitalize">{item.style}</span>
        </p>
      </div>
      <div
        className={`pointer-events-none absolute inset-0 hidden flex-col justify-end bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent p-4 text-left text-white transition-opacity duration-300 md:flex ${
          hover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <p className="line-clamp-2 text-xs font-medium leading-snug text-white/95">
          {item.promptRaw || "No prompt saved"}
        </p>
        <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-white/75 sm:text-xs">
          <div>
            <dt className="text-white/50">Created</dt>
            <dd>{formatDate(item.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-white/50">Style</dt>
            <dd className="capitalize">{item.style || "—"}</dd>
          </div>
        </dl>
      </div>
      {showFavoritePip && item.isFavorite ? (
        <span
          className={`absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border shadow ${
            isWs
              ? "border-cyan-400/40 bg-slate-950/65 text-base text-cyan-300"
              : "border-rose-200/55 bg-white/95 text-sm text-rose-500 shadow-md"
          }`}
          aria-label="Favorited"
        >
          ♥
        </span>
      ) : null}
    </button>
  );
}
