import { DAILY_CREDITS_LIMIT, normalizeCreditsPoints } from "../lib/credits.js";

/**
 * Minimal nav credits label — no countdowns or extra chrome.
 */
export default function NavbarCredits({ workspace = false, credits, onPress }) {
  const pts = normalizeCreditsPoints(credits);

  const strong = workspace ? "text-slate-100" : "text-slate-900";
  const muted = workspace ? "text-slate-400" : "text-slate-500";

  return (
    <button
      type="button"
      onClick={onPress}
      className={`rounded-full border px-3 py-1.5 text-left text-[12px] font-semibold tabular-nums transition focus-visible:outline-none focus-visible:ring-2 sm:text-[13px] ${
        workspace
          ? "border-white/12 bg-white/[0.06] text-slate-200 focus-visible:ring-cyan-400/35 focus-visible:ring-offset-[#13151c]"
          : "border-pastel-cyan/50 bg-gradient-to-r from-white via-pastel-mist to-[#eaf8ff] text-slate-800 focus-visible:ring-pastel-cyan/50 focus-visible:ring-offset-pastel-mist"
      }`}
      title={`${pts} of ${DAILY_CREDITS_LIMIT} credits remaining`}
      aria-label={`${pts} of ${DAILY_CREDITS_LIMIT} credits`}
    >
      <span className={strong}>{pts}</span>
      <span className={`font-medium ${muted}`}> / {DAILY_CREDITS_LIMIT} Credits</span>
    </button>
  );
}
