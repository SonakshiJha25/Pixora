import { Zap } from "lucide-react";
import CreditsResetCountdown from "./CreditsResetCountdown.jsx";
import {
  CREDITS_PER_IMAGE,
  DAILY_CREDITS_LIMIT,
  normalizeCreditsPoints,
} from "../lib/credits.js";

function CreditRingMeter({ credits, size = 36, accentClass }) {
  const pts = normalizeCreditsPoints(credits);
  const ratio = Math.min(1, Math.max(0, pts / DAILY_CREDITS_LIMIT));
  const stroke = 2.5;
  const r = (size - stroke * 2) / 2;
  const cx = size / 2;
  const c = 2 * Math.PI * r;
  const dash = `${ratio * c} ${c}`;
  const baseOpacity = 0.14;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`shrink-0 ${accentClass}`}
      aria-hidden
    >
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeOpacity={baseOpacity}
        strokeWidth={stroke}
      />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeOpacity={1}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={dash}
        transform={`rotate(-90 ${cx} ${cx})`}
      />
    </svg>
  );
}

export default function NavbarCredits({
  workspace = false,
  credits,
  nextResetAtIso,
  onPress,
  showMeter = true,
}) {
  const pts = normalizeCreditsPoints(credits);
  const accent = workspace ? "text-slate-400" : "text-slate-600";

  const shell = workspace
    ? "rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 sm:px-3"
    : "rounded-full border border-slate-200/90 bg-white px-2.5 py-1.5 shadow-sm sm:px-3";

  return (
    <button
      type="button"
      className={`inline-flex max-w-[min(100vw-11rem,16rem)] items-center gap-2.5 text-left transition ${shell} ${
        workspace ? "hover:border-white/12" : "hover:border-slate-300"
      }`}
      title={`${pts} credits · ${CREDITS_PER_IMAGE} credits per new image · IST midnight refill`}
      aria-label={`${pts} credits. Opens account menu`}
      onClick={onPress}
    >
      {showMeter ? (
        <div className="relative shrink-0">
          <CreditRingMeter credits={pts} size={34} accentClass={accent} />
          <Zap
            className={`pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 stroke-[2.5] sm:size-[13px] ${
              workspace ? "fill-slate-500/15 stroke-slate-300/90" : "fill-slate-400/22 stroke-slate-600"
            }`}
            aria-hidden
          />
        </div>
      ) : (
        <Zap
          className={`mt-0.5 size-4 shrink-0 stroke-[2] sm:size-[15px] ${
            workspace ? "fill-slate-500/12 stroke-slate-300/90" : "fill-slate-400/22 stroke-slate-600"
          }`}
          aria-hidden
        />
      )}
      <span className="flex min-w-0 flex-col gap-0">
        <span
          className={`flex flex-wrap items-baseline gap-x-1 leading-none ${
            workspace ? "text-slate-100" : "text-slate-900"
          }`}
        >
          <span className="text-[13px] font-bold tabular-nums sm:text-[14px]">{pts}</span>
          <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">credits</span>
        </span>
        <span className="truncate text-[8.5px] font-medium leading-tight tracking-tight text-slate-500 sm:text-[9px]">
          <CreditsResetCountdown nextResetAtIso={nextResetAtIso} showIstSuffix={false} as="span" className="inline" />
        </span>
      </span>
    </button>
  );
}
