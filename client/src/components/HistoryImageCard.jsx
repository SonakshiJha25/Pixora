import { useState } from "react";
import { Heart, PenLine } from "lucide-react";
import { resolveImageUrl } from "../config/api.js";
import DownloadPngButton from "./DownloadPngButton.jsx";
import { labelForStyleKey } from "../lib/styleTypes.js";

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

/**
 * @param {'default' | 'workspace'} props.surface
 * @param {boolean} [props.showActionBar]
 */
export default function HistoryImageCard({
  item,
  onOpen,
  showFavoritePip = true,
  surface = "default",
  showActionBar = false,
  onContinueEdit,
  openActionLabel,
}) {
  const [hover, setHover] = useState(false);
  const [failed, setFailed] = useState(false);

  const isWs = surface === "workspace";
  const dl = resolveImageUrl(item.imageUrl);
  const src = dl;

  const interactive = typeof onOpen === "function";
  const promptText = item.promptRaw || item.prompt || "";
  const promptShort = promptText.slice(0, 120);
  const hasActionStrip = Boolean(showActionBar && (dl || onContinueEdit));
  const openHitBottom = hasActionStrip ? "bottom-[3.45rem]" : "bottom-0";

  const tileClass = isWs
    ? "group relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#14161d] shadow-[0_14px_40px_-28px_rgba(0,0,0,0.9)] transition duration-300 hover:-translate-y-[1px] hover:border-white/15"
    : "group relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm transition duration-300 hover:-translate-y-[1px] hover:border-slate-300";

  const open = () => {
    if (!interactive) return;
    onOpen(item);
  };

  return (
    <div className={tileClass} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {failed ? (
        <div
          className={`flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center ${
            isWs ? "bg-gradient-to-br from-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-100 to-slate-200"
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
          {interactive ? (
            <button
              type="button"
              className={`mt-2 rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                isWs
                  ? "border border-white/15 bg-white/10 text-slate-200 hover:bg-white/15"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
            >
              View in Gallery
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <img
            src={src}
            alt={item.promptRaw || "Generated image"}
            className={`absolute inset-0 h-full w-full object-cover transition duration-500 ease-out ${
              hover ? "scale-[1.03]" : "scale-100"
            }`}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            draggable={false}
          />

          {isWs ? (
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex items-start justify-between gap-2 bg-gradient-to-b from-slate-950/90 via-slate-950/25 to-transparent px-2.5 pb-9 pt-2">
              <p className="min-w-0 flex-1 truncate text-left text-[10px] font-semibold leading-tight text-white/95">
                {promptShort}
                {promptText.length > 120 ? "…" : ""}
              </p>
              <span className="shrink-0 rounded-full bg-white/[0.09] px-2 py-0.5 text-[9px] font-bold tracking-wide text-cyan-50/95 ring-1 ring-white/12">
                {item.style ? labelForStyleKey(item.style) : "Frame"}
              </span>
            </div>
          ) : null}

          {interactive ? (
            <button
              type="button"
              aria-label={
                openActionLabel ||
                (promptShort ? `Open preview: ${promptShort}` : "Open image preview")
              }
              className={`absolute inset-x-0 top-0 z-[5] bg-transparent outline-none ring-0 transition focus-visible:ring-2 ${
                isWs ? "focus-visible:ring-white/30" : "focus-visible:ring-slate-400/40"
              } ${openHitBottom}`}
              onClick={open}
            />
          ) : null}

          {hasActionStrip ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] px-2 pb-2 opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:pointer-events-auto sm:group-hover:opacity-100">
              <div className="pointer-events-auto flex gap-1.5 rounded-[0.65rem] border border-white/[0.1] bg-slate-950/88 p-1 shadow-lg backdrop-blur-md">
                {dl ? (
                  <DownloadPngButton
                    imageId={String(item._id)}
                    imageUrl={item.imageUrl}
                    className="inline-flex flex-1 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.06] py-1.5 text-[10px] font-semibold text-white/95 transition hover:border-white/18 hover:bg-white/[0.09]"
                  >
                    Save
                  </DownloadPngButton>
                ) : null}
                {typeof onContinueEdit === "function" ? (
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-[#5a8fa3]/28 bg-[#5a8fa3]/14 py-1.5 text-[10px] font-semibold text-slate-100 transition hover:border-[#6a9fb3]/40 hover:bg-[#5a8fa3]/22"
                    onClick={(e) => {
                      e.stopPropagation();
                      onContinueEdit(item);
                    }}
                  >
                    <PenLine className="size-3.5 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
                    Refine
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </>
      )}
      {isWs ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] bg-gradient-to-t from-slate-950/[0.92] to-transparent p-3 text-left text-white md:hidden">
          <p className="line-clamp-1 text-[11px] font-medium text-white/95">{item.promptRaw || "Image"}</p>
          <p className="text-[10px] text-white/60">
            {formatDate(item.createdAt)} · <span>{item.style ? labelForStyleKey(item.style) : "—"}</span>
          </p>
        </div>
      ) : null}
      {isWs ? (
        <div
          className={`pointer-events-none absolute inset-0 z-[4] hidden flex-col justify-end bg-gradient-to-t from-slate-950/[0.97] via-slate-950/35 to-transparent p-4 pb-10 text-left text-white transition-opacity duration-400 md:flex ${
            hasActionStrip ? "pb-[3.85rem]" : ""
          } ${hover ? "opacity-100" : "opacity-0 group-hover:opacity-85"}`}
        >
          <p className="line-clamp-2 text-xs font-medium leading-snug text-white/95">
            {item.promptRaw || "No prompt saved"}
          </p>
          <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-white/75 sm:text-[11px]">
            <div>
              <dt className="text-white/48">Created</dt>
              <dd>{formatDate(item.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-white/48">Style</dt>
              <dd>{item.style ? labelForStyleKey(item.style) : "—"}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-[4] bg-gradient-to-t from-slate-900/82 to-transparent p-3 text-left text-white opacity-90 transition-opacity duration-400 md:flex md:flex-col ${
            hover ? "md:opacity-100" : "md:opacity-0 md:group-hover:opacity-100"
          }`}
        >
          <p className="line-clamp-2 text-[11px] font-medium leading-snug text-white">{item.promptRaw || "No prompt"}</p>
          <p className="mt-1 text-[10px] text-white/80">
            {formatDate(item.createdAt)} · <span>{item.style ? labelForStyleKey(item.style) : "—"}</span>
          </p>
        </div>
      )}
      {showFavoritePip && item.isFavorite ? (
        <span
          className={`absolute right-2 top-2 z-[7] inline-flex h-7 w-7 items-center justify-center rounded-full border shadow-md ${
            isWs
              ? "border-red-400/40 bg-[#171a22]/95"
              : "border-rose-200/55 bg-white/95"
          }`}
          aria-label="Favorited"
        >
          <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" strokeWidth={2.25} aria-hidden />
        </span>
      ) : null}
    </div>
  );
}
