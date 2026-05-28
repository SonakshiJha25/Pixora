/** Minimal loading placeholders for gallery/history grids (no layout shift). */
export default function GalleryGridSkeleton({ className, count = 8, workspace = false }) {
  const pill = workspace
    ? "animate-pulse rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] ring-1 ring-white/[0.08]"
    : "animate-pulse rounded-2xl bg-gradient-to-br from-slate-200/70 to-slate-100/60 ring-1 ring-slate-200/40";
  return (
    <ul className={className} aria-busy="true" aria-label="Loading gallery">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className={pill} style={{ minHeight: "11rem" }} />
      ))}
    </ul>
  );
}
