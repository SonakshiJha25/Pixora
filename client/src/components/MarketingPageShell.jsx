/** Light pages (Home-adjacent): shared top glow so Gallery / Pricing feel part of the same family as Help. */
export default function MarketingPageShell({ children, className = "" }) {
  return (
    <div className={`relative w-full overflow-x-hidden ${className}`.trim()}>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[min(360px,48vh)] w-[120vw] max-w-[1600px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_rgba(165,243,252,0.3),transparent_56%)]"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
