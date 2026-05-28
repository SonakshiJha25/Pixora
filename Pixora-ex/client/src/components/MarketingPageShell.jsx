/** Light pages: shared breathable column — backgrounds come from App `bg-market` (no extra glow stack). */
export default function MarketingPageShell({ children, className = "" }) {
  return <div className={`relative w-full overflow-x-hidden ${className}`.trim()}>{children}</div>;
}
