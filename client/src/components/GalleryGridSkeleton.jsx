/** Minimal loading placeholders for gallery/history grids (no layout shift). */
export default function GalleryGridSkeleton({ className, count = 8 }) {
  return (
    <ul
      className={className}
      aria-busy="true"
      aria-label="Loading gallery"
    >
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="animate-pulse rounded-2xl bg-gradient-to-br from-slate-200/70 to-slate-100/60 ring-1 ring-slate-200/40"
          style={{ minHeight: "11rem" }}
        />
      ))}
    </ul>
  );
}
