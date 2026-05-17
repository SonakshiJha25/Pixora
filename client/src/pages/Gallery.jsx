import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, LayoutGrid, Search } from "lucide-react";
import { AppContext } from "../context/AppContext";
import HistoryImageCard from "../components/HistoryImageCard";
import ConfirmModal from "../components/ConfirmModal";
import GalleryGridSkeleton from "../components/GalleryGridSkeleton";
import GalleryThreadModal from "../components/GalleryThreadModal.jsx";
import MarketingPageShell from "../components/MarketingPageShell.jsx";
import { resolveImageUrl } from "../config/api.js";
import DownloadPngButton from "../components/DownloadPngButton.jsx";
import { groupGalleryItems, groupThreadsByCalendarDay, threadMatchesFavoriteFilter, threadSearchHaystack } from "../lib/groupGalleryThreads.js";
import { STUDIO_STYLE_SAMPLES, WORKSPACE_NAME } from "../lib/site.js";

const MONGO_ID_RE = /^[a-f\d]{24}$/i;

export default function Gallery() {
  const { token, setShowLogin, api, fetchHistory, history, setHistory, historyStatus } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [busyId, setBusyId] = useState(null);
  const [threadBrowseId, setThreadBrowseId] = useState(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState(null);
  const [view, setView] = useState("all");
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState(null);

  const searchNorm = search.trim().toLowerCase();

  const groups = useMemo(() => groupGalleryItems(history), [history]);
  const viewFiltered = useMemo(() => {
    if (view === "favorites") return groups.filter(threadMatchesFavoriteFilter);
    return groups;
  }, [groups, view]);

  const filteredGroups = useMemo(() => {
    let g = viewFiltered;
    if (styleFilter) {
      g = g.filter((x) => String(x.latest.style || "").toLowerCase() === styleFilter);
    }
    if (searchNorm) {
      g = g.filter((x) => threadSearchHaystack(x).includes(searchNorm));
    }
    return g;
  }, [viewFiltered, styleFilter, searchNorm]);

  const daySections = useMemo(() => groupThreadsByCalendarDay(filteredGroups), [filteredGroups]);
  const hasThreadsInView = viewFiltered.length > 0;
  const filtersExcludeAll = hasThreadsInView && filteredGroups.length === 0;

  /** Deep-link from Studio Recent (or shared URL): `/gallery?thread=<imageId>`. */
  useEffect(() => {
    const raw = searchParams.get("thread")?.trim() ?? "";
    if (!token || !raw || !MONGO_ID_RE.test(raw)) return;
    setThreadBrowseId(raw);
  }, [searchParams, token]);

  const closeThreadModal = () => {
    setThreadBrowseId(null);
    if (!searchParams.get("thread")) return;
    const next = new URLSearchParams(searchParams);
    next.delete("thread");
    setSearchParams(next, { replace: true });
  };

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
            className="rounded-2xl border border-slate-200/90 bg-white px-8 py-10 shadow-card sm:py-11"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-700">
              <LayoutGrid className="h-6 w-6" strokeWidth={2} aria-hidden />
            </span>
            <h1 className="type-page-title mt-5">Your Pixorify gallery</h1>
            <p className="type-body mx-auto mt-3 max-w-md">
              Sign in once and everything you create in {WORKSPACE_NAME} shows up here—downloads, starred favourites, and
              each edited version neatly grouped together.
            </p>
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
  const showEmptyGrid = !showSkeleton && filteredGroups.length === 0;

  return (
    <div className="relative w-full pb-28 pt-8 sm:pt-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-5">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-8 max-w-2xl text-center sm:mb-10"
        >
          <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">My gallery</h1>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-slate-400 sm:text-sm">
            Each card shows one journey—the latest snapshot is on top. Tap{" "}
            <span className="font-medium text-slate-300">View versions</span> to browse every step, use the ♥ icon to save to{" "}
            <span className="font-medium text-slate-300">Saved</span>.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link to="/studio" className="font-medium text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline">
              ← {WORKSPACE_NAME}
            </Link>
            <span className="text-slate-600" aria-hidden>
              ·
            </span>
            <Link to="/help" className="font-medium text-slate-500 underline-offset-4 transition hover:text-slate-200 hover:underline">
              How credits work
            </Link>
          </div>
        </motion.header>

        <div className="mb-8 flex flex-nowrap items-center justify-center gap-2 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setView("all")}
            className={`shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${
              view === "all"
                ? "bg-white/[0.09] text-slate-100 ring-1 ring-white/15"
                : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/14 hover:text-slate-200"
            }`}
          >
            All pictures
          </button>
          <button
            type="button"
            onClick={() => setView("favorites")}
            className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${
              view === "favorites"
                ? "bg-white/[0.09] text-slate-100 ring-1 ring-white/15"
                : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/14 hover:text-slate-200"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                view === "favorites" ? "fill-red-500 text-red-500" : "fill-transparent text-red-400"
              }`}
              strokeWidth={2}
              aria-hidden
            />
            Saved
          </button>
        </div>

        <div className="mx-auto mb-10 w-full max-w-full space-y-4">
          <label className="relative mx-auto block max-w-2xl text-left">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              strokeWidth={2}
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your prompts or edits…"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none ring-0 transition focus:border-white/18 focus:ring-1 focus:ring-white/10"
            />
          </label>
          <div
            className="flex flex-nowrap items-center justify-start gap-2 overflow-x-auto py-1 pl-1 pr-3 sm:justify-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="toolbar"
            aria-label="Filter by style"
          >
            <button
              type="button"
              onClick={() => setStyleFilter(null)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition sm:text-sm ${
                styleFilter === null
                  ? "bg-white/[0.09] text-slate-100 ring-1 ring-white/15"
                  : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/14 hover:text-slate-200"
              }`}
            >
              All styles
            </button>
            {STUDIO_STYLE_SAMPLES.map((s) => {
              const id = s.id;
              const on = styleFilter === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setStyleFilter(on ? null : id)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition sm:text-sm ${
                    on
                      ? "bg-white/[0.09] text-slate-100 ring-1 ring-white/15"
                      : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/14 hover:text-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {showSkeleton ? (
          <GalleryGridSkeleton
            workspace
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            count={6}
          />
        ) : showEmptyGrid ? (
          <div className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-12 text-center">
            {historyStatus === "error" && history.length === 0 ? (
              <div className="mx-auto max-w-sm px-2">
                <p className="font-display text-base font-semibold text-slate-200">We&apos;re having trouble loading your gallery</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Nothing was deleted—your pictures are still safe. Give it another try in a moment.
                </p>
                <button
                  type="button"
                  onClick={() => fetchHistory()}
                  className="mx-auto mt-6 rounded-full border border-white/[0.12] bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-white/22 hover:bg-white/[0.09]"
                >
                  Try again
                </button>
              </div>
            ) : filtersExcludeAll ? (
              <div className="mx-auto max-w-sm px-2">
                <p className="font-display text-base font-semibold text-slate-200">Nothing matches those filters</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Try a different search, pick another style, or clear filters to see everything in this tab.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStyleFilter(null);
                  }}
                  className="mx-auto mt-6 rounded-full border border-white/[0.12] bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-white/22 hover:bg-white/[0.09]"
                >
                  Clear search & style
                </button>
              </div>
            ) : view === "favorites" ? (
              <p className="mx-auto max-w-sm text-sm leading-snug text-slate-400">
                Nothing saved.{" "}
                <button
                  type="button"
                  onClick={() => setView("all")}
                  className="font-medium text-slate-200 underline underline-offset-2 hover:text-white"
                >
                  All pictures
                </button>
                {" "}· ♥ a cover
              </p>
            ) : (
              <>
                <p className="font-display text-base font-semibold text-slate-200">Your gallery is ready for its first piece</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
                  Create in{" "}
                  <Link className="font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline" to="/studio">
                    {WORKSPACE_NAME}
                  </Link>{" "}
                  — new pictures and favourites appear here as you go.
                </p>
              </>
            )}
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {daySections.map((section) => (
              <Fragment key={section.sortKey}>
                <li className="col-span-full">
                  <h2 className="mb-1 text-center font-display text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500 sm:mb-2 sm:text-left sm:text-xs sm:tracking-[0.22em]">
                    {section.heading}
                  </h2>
                </li>
                {section.groups.map((group) => (
                  <motion.li
                    layout
                    key={group.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="studio-shell flex flex-col items-center gap-5 rounded-2xl p-5"
                  >
                    <div className="relative w-full max-w-[280px]">
                      {group.refinements > 0 ? (
                        <span className="absolute left-3 top-3 z-10 rounded-full border border-white/[0.08] bg-[#13151c]/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                          +{group.refinements} edit{group.refinements === 1 ? "" : "s"}
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
                        className={`absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border transition duration-300 active:scale-95 hover:-translate-y-px ${
                          group.latest.isFavorite
                            ? "border-red-400/45 bg-[#171a22] shadow-[0_0_14px_-4px_rgba(248,113,113,0.55)]"
                            : "border-white/12 bg-[#171a22]/90 hover:border-red-400/35 hover:bg-[#171a22]"
                        }`}
                        aria-label={group.latest.isFavorite ? "Remove from saved" : "Save to favorites"}
                        title={group.latest.isFavorite ? "Saved" : "Save"}
                      >
                        <Heart
                          className={`h-5 w-5 transition-colors ${
                            group.latest.isFavorite
                              ? "fill-red-500 text-red-500"
                              : "fill-transparent text-slate-400 hover:text-red-400"
                          }`}
                          strokeWidth={2.25}
                          aria-hidden
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setThreadBrowseId(String(group.latest._id))}
                      className="btn-primary w-full max-w-[280px] rounded-full py-2.5 text-xs font-semibold"
                    >
                      View versions
                    </button>

                    <div className="flex w-full max-w-[280px] flex-wrap justify-center gap-2">
                  <Link
                    to={`/studio?continue=${encodeURIComponent(String(group.latest._id))}`}
                    className="rounded-full border border-[rgba(90,143,163,0.35)] bg-[rgba(90,143,163,0.12)] px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-[rgba(106,159,179,0.45)] hover:bg-[rgba(90,143,163,0.18)]"
                  >
                    Continue editing
                  </Link>
                      <DownloadPngButton
                        imageId={String(group.latest._id)}
                        className="rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/18 hover:bg-white/[0.08]"
                      />
                      <button
                        type="button"
                        disabled={busyId === group.latest._id}
                        className="rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-red-400/35 hover:bg-red-500/10 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => setPendingDeleteItem(group.latest)}
                      >
                        Delete
                      </button>
                    </div>
                  </motion.li>
                ))}
              </Fragment>
            ))}
          </ul>
        )}

        <ConfirmModal
          open={pendingDeleteItem !== null}
          title="Delete this from your gallery?"
          description="It’ll disappear from your list and we can’t bring the file back. If you’re unsure, download a PNG first."
          confirmLabel="Yes, delete it"
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
          onClose={closeThreadModal}
        />
      </div>
    </div>
  );
}
