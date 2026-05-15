/** Light pages (Home-adjacent): shared top glow so Gallery / Pricing feel part of the same family as Help. */
export default function MarketingPageShell({ children, className = "" }) {
  return (
    <div className={`relative w-full overflow-x-hidden ${className}`.trim()}>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[min(360px,48vh)] w-[120vw] max-w-[1600px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,211,238,0.22),transparent_58%),radial-gradient(ellipse_at_85%_15%,rgba(244,114,182,0.14),transparent_45%),radial-gradient(ellipse_at_12%_35%,rgba(168,85,247,0.12),transparent_48%)]"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
