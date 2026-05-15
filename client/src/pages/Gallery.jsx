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
import { WORKSPACE_NAME } from "../lib/site.js";

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
            className="rounded-[2rem] border border-white/70 bg-white/65 px-8 py-10 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:py-11"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-sky/15 text-brand-cyan ring-1 ring-white/80">
              <LayoutGrid className="h-6 w-6" strokeWidth={2} aria-hidden />
            </span>
            <h1 className="type-page-title mt-5">Your gallery · sign in</h1>
            <p className="type-body mt-2">{WORKSPACE_NAME} threads and refinements sync here.</p>
            <button
              type="button"
              onClick={() => setShowLogin(true)}
              className="btn-primary mt-8 rounded-full px-8 py-3 text-sm font-semibold shadow-md"
            >
              Sign in
            </button>
            <Link to="/" className="type-link-brand mt-4 block">
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
    <div className="relative w-full pb-28 pt-8 sm:pt-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-5">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-8 max-w-2xl text-center sm:mb-10"
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Gallery</h1>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-snug text-slate-400 sm:text-sm">
            {WORKSPACE_NAME} threads · cover = latest · stack in{" "}
            <span className="font-medium text-slate-300">Open thread</span> · ♥ → Saved
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link to="/studio" className="font-semibold text-cyan-300 underline-offset-4 hover:underline">
              ← {WORKSPACE_NAME}
            </Link>
            <span className="text-slate-600" aria-hidden>
              ·
            </span>
            <Link to="/help" className="font-semibold text-slate-400 underline-offset-4 transition hover:text-cyan-300 hover:underline">
              How credits work
            </Link>
          </div>
        </motion.header>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setView("all")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition duration-300 ${
              view === "all"
                ? "bg-cyan-500/18 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.35)] backdrop-blur-sm"
                : "border border-white/10 bg-white/[0.04] text-slate-300 backdrop-blur-sm hover:border-cyan-400/25 hover:text-white"
            }`}
          >
            All threads
          </button>
          <button
            type="button"
            onClick={() => setView("favorites")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition duration-300 ${
              view === "favorites"
                ? "bg-cyan-500/18 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.35)] backdrop-blur-sm"
                : "border border-white/10 bg-white/[0.04] text-slate-300 backdrop-blur-sm hover:border-cyan-400/25 hover:text-white"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${view === "favorites" ? "fill-cyan-400 text-cyan-300" : "text-cyan-400/70"}`}
              strokeWidth={2}
              aria-hidden
            />
            Saved
          </button>
        </div>

        {showSkeleton ? (
          <GalleryGridSkeleton
            workspace
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            count={6}
          />
        ) : showEmptyGrid ? (
          <div className="rounded-[1.85rem] border border-dashed border-white/12 bg-white/[0.03] px-6 py-12 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
            {historyStatus === "error" && history.length === 0 ? (
              <div className="mx-auto max-w-sm">
                <p className="text-sm leading-snug text-slate-400">
                  Can&apos;t load gallery — your work is safe.
                </p>
                <button
                  type="button"
                  onClick={() => fetchHistory()}
                  className="mt-5 text-sm font-semibold text-cyan-300 underline-offset-4 hover:underline"
                >
                  Refresh
                </button>
              </div>
            ) : view === "favorites" ? (
              <p className="mx-auto max-w-sm text-sm leading-snug text-slate-400">
                Nothing saved.{" "}
                <button
                  type="button"
                  onClick={() => setView("all")}
                  className="font-medium text-slate-200 underline underline-offset-2 hover:text-cyan-300"
                >
                  All threads
                </button>
                {" "}· ♥ a cover
              </p>
            ) : (
              <p className="mx-auto max-w-sm text-sm leading-snug text-slate-400">
                Empty — {" "}
                <Link className="font-medium text-cyan-300 underline-offset-4 hover:underline" to="/studio">
                  {WORKSPACE_NAME}
                </Link>
              </p>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGroups.map((group) => (
              <motion.li
                layout
                key={group.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="studio-shell flex flex-col items-center gap-5 rounded-[1.85rem] p-5 ring-1 ring-white/[0.05]"
              >
                <div className="relative w-full max-w-[280px]">
                  {group.refinements > 0 ? (
                    <span className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-slate-950/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-200 shadow-lg backdrop-blur-md">
                      +{group.refinements} refine{group.refinements === 1 ? "" : "s"}
                    </span>
                  ) : null}
                  <HistoryImageCard
                    item={group.latest}
                    onOpen={() => setThreadBrowseId(String(group.latest._id))}
                    showFavoritePip={false}
                    surface="workspace"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(group.latest);
                    }}
                    className={`absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border text-lg shadow-lg backdrop-blur-md transition duration-300 active:scale-95 hover:-translate-y-0.5 ${
                      group.latest.isFavorite
                        ? "border-cyan-400/45 bg-slate-950/75 text-cyan-300"
                        : "border-white/15 bg-slate-950/55 text-slate-300 hover:border-cyan-400/35 hover:bg-slate-900/65 hover:text-white"
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
                  className="btn-primary studio-glow w-full max-w-[280px] rounded-full py-2.5 text-xs font-semibold"
                >
                  Open thread
                </button>

                <div className="flex w-full max-w-[280px] flex-wrap justify-center gap-2">
                  <a
                    href={resolveImageUrl(group.latest.imageUrl)}
                    download={`pixorify-${group.latest._id}.png`}
                    className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-100 shadow-sm transition duration-300 hover:border-cyan-400/35 hover:bg-white/[0.09]"
                  >
                    Download PNG
                  </a>
                  <button
                    type="button"
                    disabled={busyId === group.latest._id}
                    className="rounded-full border border-white/10 bg-transparent px-3 py-2 text-xs font-semibold text-slate-400 shadow-sm transition duration-300 hover:border-slate-500/45 hover:bg-white/[0.04] hover:text-slate-200 disabled:opacity-50"
                    onClick={() => setPendingDeleteItem(group.latest)}
                  >
                    Remove
                  </button>
                </div>
              </motion.li>
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
    </div>
  );
}
