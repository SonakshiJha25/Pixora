import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import HistoryImageCard from "../components/HistoryImageCard";
import ConfirmModal from "../components/ConfirmModal";
import GalleryGridSkeleton from "../components/GalleryGridSkeleton";
import { resolveImageUrl } from "../config/api.js";

export default function Gallery() {
  const { token, setShowLogin, api, fetchHistory, history, setHistory, historyStatus } = useContext(AppContext);
  const [busyId, setBusyId] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState(null);
  const [view, setView] = useState("all"); // all | favorites

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
  const list = view === "favorites" ? history.filter((x) => x.isFavorite) : history;
  const showEmptyGrid = !showSkeleton && list.length === 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-2 pb-24 pt-10 sm:px-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">My gallery</h1>
        <p className="mt-2 text-slate-600">Your generations live here. Heart what you want to find fast.</p>
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
          {list.map((item) => (
            <li
              key={item._id}
              className="flex flex-col items-center gap-4 rounded-3xl border border-white/60 bg-white/50 p-4 shadow-lg backdrop-blur"
            >
              <div className="relative w-full max-w-[280px]">
                <HistoryImageCard item={item} onOpen={setLightbox} showFavoritePip={false} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item);
                  }}
                  className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/15 text-xl shadow backdrop-blur transition active:scale-95 ${
                    item.isFavorite
                      ? "border-red-400/80 text-red-500"
                      : "border-white/40 text-white/90 hover:bg-white/20"
                  }`}
                  aria-label="Toggle favorite"
                  title="Favorite"
                >
                  ♥
                </button>
              </div>

              <div className="flex w-full max-w-[280px] flex-wrap justify-center gap-2">
                <a
                  href={resolveImageUrl(item.imageUrl)}
                  download={`pixorify-${item._id}.png`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  Download
                </a>
                <button
                  type="button"
                  disabled={busyId === item._id}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
                  onClick={() => setPendingDeleteItem(item)}
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

      {lightbox ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <button type="button" className="absolute inset-0" aria-label="Close" onClick={() => setLightbox(null)} />
          <div className="relative z-[71] w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-slate-900 shadow-2xl">
            <img src={resolveImageUrl(lightbox.imageUrl)} alt="" className="max-h-[60vh] w-full object-contain" />
            <div className="p-5 text-left text-sm text-white/90">
              <p className="font-medium text-white">{lightbox.promptRaw}</p>
              <p className="mt-2 text-xs text-white/60">
                {new Date(lightbox.createdAt).toLocaleString()} · Style: {lightbox.style} · Pixorify
              </p>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="mt-4 w-full rounded-xl bg-white/10 py-2 text-sm font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
