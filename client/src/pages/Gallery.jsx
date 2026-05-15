import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, LayoutGrid } from "lucide-react";
import { AppContext } from "../context/AppContext";
import HistoryImageCard from "../components/HistoryImageCard";
import ConfirmModal from "../components/ConfirmModal";
import GalleryGridSkeleton from "../components/GalleryGridSkeleton";
import GalleryThreadModal from "../components/GalleryThreadModal.jsx";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import { resolveImageUrl } from "../config/api.js";
import { groupGalleryItems, threadMatchesFavoriteFilter } from "../lib/groupGalleryThreads.js";

export default function Gallery() {
  const { token, setShowLogin, api, fetchHistory, history, setHistory, historyStatus } = useContext(AppContext);
  const [busyId, setBusyId] = useState(null);
  const [threadBrowseId, setThreadBrowseId] = useState(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState(null);
  const [view, setView] = useState("all");

  const groups = useMemo(() => groupGalleryItems(history), [history]);
  const visibleGroups = useMemo(() => {
    if (view === "favorites") return groups.filter(threadMatchesFavoriteFilter);
    return groups;
  }, [groups, view]);

  const run = async (id, fn) => {
    setBusyId(id);
    try {
      await fn();
      await fetchHistory();
    } catch {
      await fetchHistory({ silent: true });
    } finally {
      setBusyId(null);
    }
  };

  const toggleFavorite = (item) => {
    const id = item._id;
    const next = !item.isFavorite;
    setHistory((prev) => prev.map((x) => (x._id === id ? { ...x, isFavorite: next } : x)));
    api.patch(`/api/image/${id}/favorite`).catch(() => {
      setHistory((prev) => prev.map((x) => (x._id === id ? { ...x, isFavorite: !next } : x)));
    });
  };

  if (!token) {
    return (
      <MarketingPageShell className="pb-28 pt-10 sm:pt-14">
        <div className="mx-auto flex min-h-[52vh] max-w-lg flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/70 bg-white/65 px-8 py-12 shadow-xl shadow-slate-900/5 backdrop-blur-xl"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-sky/15 text-brand-cyan ring-1 ring-white/80">
              <LayoutGrid className="h-6 w-6" strokeWidth={2} aria-hidden />
            </span>
            <h1 className="mt-5 text-2xl font-extrabold text-slate-900">Your gallery lives behind a login</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Sign in and we&apos;ll show every thread you&apos;ve run—original render plus refinements in one stack.
            </p>
            <button
              type="button"
              onClick={() => setShowLogin(true)}
              className="btn-primary mt-8 rounded-full px-8 py-3 text-sm font-semibold shadow-md"
            >
              Sign in
            </button>
            <Link to="/" className="mt-4 block text-sm font-medium text-brand-cyan underline-offset-4 hover:underline">
              Back to home
            </Link>
          </motion.div>
        </div>
      </MarketingPageShell>
    );
  }

  const showSkeleton = historyStatus === "loading" && history.length === 0;
  const showEmptyGrid = !showSkeleton && visibleGroups.length === 0;

  return (
    <MarketingPageShell className="pb-28 pt-8 sm:pt-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-sky">Gallery</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Your threads</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            Each card is one idea: the newest picture is on the cover, refinements sit behind{" "}
            <span className="font-medium text-slate-700">Open thread</span>. Heart something and it shows up under Saved.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/studio"
              className="text-sm font-semibold text-brand-cyan underline-offset-4 hover:underline"
            >
              ← Studio
            </Link>
            <span className="text-slate-300" aria-hidden>
              ·
            </span>
            <Link to="/help" className="text-sm font-semibold text-slate-600 underline-offset-4 hover:text-brand-cyan hover:underline">
              How credits work
            </Link>
          </div>
        </motion.header>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setView("all")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              view === "all"
                ? "bg-slate-900 text-white shadow-md"
                : "border border-slate-200/90 bg-white/80 text-slate-700 shadow-sm hover:border-brand-cyan/35"
            }`}
          >
            All threads
          </button>
          <button
            type="button"
            onClick={() => setView("favorites")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
              view === "favorites"
                ? "bg-slate-900 text-white shadow-md"
                : "border border-slate-200/90 bg-white/80 text-slate-700 shadow-sm hover:border-rose-200/90"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${view === "favorites" ? "fill-red-400 text-red-400" : "text-rose-400"}`}
              strokeWidth={2}
              aria-hidden
            />
            Saved
          </button>
        </div>

        {showSkeleton ? (
          <GalleryGridSkeleton className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" count={6} />
        ) : showEmptyGrid ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300/90 bg-white/55 px-6 py-16 text-center backdrop-blur-md">
            {historyStatus === "error" && history.length === 0 ? (
              <div className="mx-auto max-w-sm">
                <p className="text-sm leading-relaxed text-slate-600">
                  Couldn&apos;t reach your gallery — connection hiccup on our side or yours.
                </p>
                <button
                  type="button"
                  onClick={() => fetchHistory()}
                  className="mt-5 text-sm font-semibold text-brand-cyan underline-offset-4 hover:underline"
                >
                  Try loading again
                </button>
              </div>
            ) : view === "favorites" ? (
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-600">
                Nothing starred yet. Switch to{" "}
                <button
                  type="button"
                  onClick={() => setView("all")}
                  className="font-semibold text-slate-800 underline underline-offset-2 hover:text-brand-cyan"
                >
                  All threads
                </button>{" "}
                and tap the heart on a cover card.
              </p>
            ) : (
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-600">
                Quiet in here. When you&apos;re ready,{" "}
                <Link className="font-semibold text-brand-cyan underline-offset-4 hover:underline" to="/studio">
                  make something in Studio
                </Link>{" "}
                and it&apos;ll land here.
              </p>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGroups.map((group) => (
              <li
                key={group.key}
                className="flex flex-col items-center gap-4 rounded-[1.85rem] border border-white/70 bg-white/55 p-4 shadow-xl shadow-slate-900/[0.04] backdrop-blur-xl ring-1 ring-slate-200/45"
              >
                <div className="relative w-full max-w-[280px]">
                  {group.refinements > 0 ? (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-slate-900/88 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow backdrop-blur-sm">
                      +{group.refinements} refine{group.refinements === 1 ? "" : "s"}
                    </span>
                  ) : null}
                  <HistoryImageCard
                    item={group.latest}
                    onOpen={() => setThreadBrowseId(String(group.latest._id))}
                    showFavoritePip={false}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(group.latest);
                    }}
                    className={`absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/20 text-lg shadow backdrop-blur-md transition active:scale-95 ${
                      group.latest.isFavorite
                        ? "border-rose-300/90 text-rose-500"
                        : "border-white/50 text-white hover:bg-white/25"
                    }`}
                    aria-label={group.latest.isFavorite ? "Remove from saved" : "Save to favorites"}
                    title={group.latest.isFavorite ? "Saved" : "Save"}
                  >
                    ♥
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setThreadBrowseId(String(group.latest._id))}
                  className="w-full max-w-[280px] rounded-full border border-slate-200/90 bg-white/90 py-2.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-brand-cyan/45 hover:text-slate-900"
                >
                  Open thread
                </button>

                <div className="flex w-full max-w-[280px] flex-wrap justify-center gap-2">
                  <a
                    href={resolveImageUrl(group.latest.imageUrl)}
                    download={`pixorify-${group.latest._id}.png`}
                    className="rounded-full border border-slate-200/90 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-brand-cyan/35"
                  >
                    Download PNG
                  </a>
                  <button
                    type="button"
                    disabled={busyId === group.latest._id}
                    className="rounded-full border border-slate-200/90 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-rose-200/80 hover:text-rose-700 disabled:opacity-50"
                    onClick={() => setPendingDeleteItem(group.latest)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <ConfirmModal
          open={pendingDeleteItem !== null}
          title="Remove this from your gallery?"
          description="It’ll disappear from your list and we can’t bring the file back. If you’re unsure, download a PNG first."
          confirmLabel="Yes, remove it"
          cancelLabel="Cancel"
          danger
          onCancel={() => setPendingDeleteItem(null)}
          onConfirm={() => {
            const item = pendingDeleteItem;
            setPendingDeleteItem(null);
            if (item) run(item._id, () => api.delete(`/api/image/${item._id}`));
          }}
        />

        <GalleryThreadModal
          open={Boolean(threadBrowseId)}
          imageId={threadBrowseId}
          api={api}
          onClose={() => setThreadBrowseId(null)}
        />
      </div>
    </MarketingPageShell>
  );
}
