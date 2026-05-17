import { Zap } from "lucide-react";
import CreditsResetCountdown from "./CreditsResetCountdown.jsx";
import { CREDITS_PER_IMAGE, normalizeCreditsPoints } from "../lib/credits.js";

/**
 * Nav credits ribbon — balances + countdown (richer pill; avoids stripping account context).
 */
export default function NavbarCredits({
  workspace = false,
  credits,
  nextResetAtIso,
  onPress,
}) {
  const pts = normalizeCreditsPoints(credits);

  const muted = workspace ? "text-slate-500" : "text-slate-600";
  const strong = workspace ? "text-slate-100" : "text-slate-900";
  const zapClass = workspace
    ? "mt-0.5 size-[0.9375rem] shrink-0 stroke-[2] sm:size-4 fill-cyan-400/15 stroke-cyan-300/90"
    : "mt-0.5 size-[0.9375rem] shrink-0 stroke-[2] sm:size-4 fill-brand-cyan/20 stroke-brand-cyan";

  return (
    <button
      type="button"
      className={`inline-flex max-w-[min(14rem,calc(100vw-13rem))] flex-col rounded-full px-2.5 py-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 sm:flex-row sm:items-start sm:gap-2 sm:px-3 sm:py-2 lg:max-w-none ${
        workspace
          ? "border border-white/12 bg-gradient-to-r from-slate-900/90 to-slate-800/70 shadow-none ring-1 ring-white/10 hover:ring-cyan-400/30 focus-visible:ring-cyan-400/35 focus-visible:ring-offset-[#13151c]"
          : "border border-pastel-cyan/55 bg-gradient-to-r from-white via-pastel-mist to-[#eaf8ff] shadow-[0_6px_20px_-10px_rgba(111,203,255,0.45)] ring-1 ring-pastel-sky/50 hover:brightness-[1.015] focus-visible:ring-pastel-cyan/50 focus-visible:ring-offset-pastel-mist"
      }`}
      title={`${pts} credits · ${CREDITS_PER_IMAGE} credits per new picture · tap for account`}
      aria-label={`${pts} credits — tap for account`}
      onClick={onPress}
    >
      <span className="inline-flex items-start gap-1.5 sm:gap-2">
        <Zap className={zapClass} aria-hidden strokeWidth={2} />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className={`flex flex-wrap items-baseline gap-x-1 leading-none ${strong}`}>
            <span className="text-[13px] font-bold tabular-nums sm:text-sm">{pts}</span>
            <span className={`text-[9px] font-semibold uppercase tracking-wide ${workspace ? "text-slate-400" : "text-slate-500"}`}>
              credits
            </span>
          </span>
          <span className={`min-w-0 max-w-[min(11rem,calc(100vw-9rem))] text-[8.5px] font-semibold tabular-nums leading-snug sm:max-w-[13.5rem] sm:text-[9px] ${muted}`}>
            <CreditsResetCountdown nextResetAtIso={nextResetAtIso} as="span" className="inline" />
          </span>
        </span>
      </span>
    </button>
  );
}
