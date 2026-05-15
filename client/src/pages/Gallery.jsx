import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import HistoryImageCard from "../components/HistoryImageCard";
import ConfirmModal from "../components/ConfirmModal";
import GalleryGridSkeleton from "../components/GalleryGridSkeleton";
import GalleryThreadModal from "../components/GalleryThreadModal.jsx";
import { resolveImageUrl } from "../config/api.js";
import { groupGalleryItems, threadMatchesFavoriteFilter } from "../lib/groupGalleryThreads.js";

export default function Gallery() {
  const { token, setShowLogin, api, fetchHistory, history, setHistory, historyStatus } = useContext(AppContext);
  const [busyId, setBusyId] = useState(null);
  const [threadBrowseId, setThreadBrowseId] = useState(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState(null);
  const [view, setView] = useState("all"); // all | favorites

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
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900">My gallery</h1>
        <p className="mt-2 text-slate-600">Sign in to view and manage your images.</p>
        <button
          type="button"
          onClick={() => setShowLogin(true)}
          className="btn-primary mt-6 rounded-full px-8 py-3 text-sm font-semibold"
        >
          Sign in
        </button>
        <Link to="/" className="mt-3 text-sm font-medium text-slate-500 hover:text-slate-800">
          Back home
        </Link>
      </div>
    );
  }

  const showSkeleton = historyStatus === "loading" && history.length === 0;
  const showEmptyGrid = !showSkeleton && visibleGroups.length === 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-2 pb-24 pt-10 sm:px-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">My gallery</h1>
        <p className="mt-2 text-slate-600">
          Your generations live here. Threads group each original with its free refinements.
        </p>
        <Link
          to="/studio"
          className="mt-4 inline-block text-sm font-semibold text-brand-cyan underline-offset-4 hover:underline"
        >
          ← Back to studio
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setView("all")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            view === "all" ? "bg-slate-900 text-white" : "border border-slate-200 bg-white/80 text-slate-700"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setView("favorites")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            view === "favorites" ? "bg-slate-900 text-white" : "border border-slate-200 bg-white/80 text-slate-700"
          }`}
        >
          Favorites ♥
        </button>
      </div>

      {showSkeleton ? (
        <GalleryGridSkeleton className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" count={6} />
      ) : showEmptyGrid ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 py-16 text-center text-slate-500">
          {historyStatus === "error" && history.length === 0 ? (
            <div className="px-4">
              <p className="text-sm text-slate-600">We couldn&apos;t load your gallery.</p>
              <button
                type="button"
                onClick={() => fetchHistory()}
                className="mt-4 text-sm font-semibold text-brand-cyan hover:underline"
              >
                Try again
              </button>
            </div>
          ) : view === "favorites" ? (
            <p className="text-sm">
              No favorites yet. Heart images from the <span className="font-medium text-slate-700">All</span> tab.
            </p>
          ) : (
            <p className="text-sm">
              Nothing here yet.{" "}
              <Link className="font-semibold text-brand-cyan hover:underline" to="/studio">
                Generate something
              </Link>
            </p>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGroups.map((group) => (
            <li
              key={group.key}
              className="flex flex-col items-center gap-4 rounded-3xl border border-white/60 bg-white/50 p-4 shadow-lg backdrop-blur"
            >
              <div className="relative w-full max-w-[280px]">
                {group.refinements > 0 ? (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow backdrop-blur-sm">
                    {group.refinements} refinement{group.refinements === 1 ? "" : "s"}
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
                  className={`absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/15 text-xl shadow backdrop-blur transition active:scale-95 ${
                    group.latest.isFavorite
                      ? "border-red-400/80 text-red-500"
                      : "border-white/40 text-white/90 hover:bg-white/20"
                  }`}
                  aria-label="Toggle favorite"
                  title="Favorite"
                >
                  ♥
                </button>
              </div>

              <button
                type="button"
                onClick={() => setThreadBrowseId(String(group.latest._id))}
                className="w-full max-w-[280px] rounded-full border border-slate-200 bg-white/90 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-brand-cyan/40"
              >
                View thread
              </button>

              <div className="flex w-full max-w-[280px] flex-wrap justify-center gap-2">
                <a
                  href={resolveImageUrl(group.latest.imageUrl)}
                  download={`pixorify-${group.latest._id}.png`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  Download
                </a>
                <button
                  type="button"
                  disabled={busyId === group.latest._id}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                  onClick={() => setPendingDeleteItem(group.latest)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={pendingDeleteItem !== null}
        title="Delete this image?"
        description="You can't undo this. It will be removed from your gallery."
        confirmLabel="Delete"
        cancelLabel="Keep"
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
  );
}
