import { Zap } from "lucide-react";
import CreditsResetCountdown from "./CreditsResetCountdown.jsx";
import {
  CREDITS_PER_IMAGE,
  DAILY_CREDITS_LIMIT,
  normalizeCreditsPoints,
} from "../lib/credits.js";

/** Thin ring showing daily pool remaining — compact navbar meter. */
function CreditRingMeter({ credits, size = 36, accentClass }) {
  const pts = normalizeCreditsPoints(credits);
  const ratio = Math.min(1, Math.max(0, pts / DAILY_CREDITS_LIMIT));
  const stroke = 2.5;
  const r = (size - stroke * 2) / 2;
  const cx = size / 2;
  const c = 2 * Math.PI * r;
  const dash = `${ratio * c} ${c}`;
  const baseOpacity = 0.16;

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

/** Premium compact balance: ⚡ NN credits · refill countdown (+ optional meter). */
export default function NavbarCredits({
  workspace = false,
  credits,
  nextResetAtIso,
  onPress,
  showMeter = true,
}) {
  const pts = normalizeCreditsPoints(credits);
  const accent = workspace ? "text-cyan-200/95" : "text-sky-600";

  const shell = workspace
    ? "rounded-full border border-white/14 bg-white/[0.045] px-2.5 py-1.5 ring-1 ring-white/[0.06] backdrop-blur-sm sm:px-3"
    : "rounded-full border border-slate-200/95 bg-white/90 px-2.5 py-1.5 shadow-sm ring-1 ring-sky-100/80 backdrop-blur-sm sm:px-3";

  return (
    <button
      type="button"
      className={`inline-flex max-w-[min(100vw-11rem,16rem)] items-center gap-2.5 text-left transition ${shell} hover:border-cyan-400/35`}
      title={`${pts} credits · ${CREDITS_PER_IMAGE} credits per new image · IST midnight refill`}
      aria-label={`${pts} credits. Opens account menu`}
      onClick={onPress}
    >
      {showMeter ? (
        <div className="relative shrink-0">
          <CreditRingMeter credits={pts} size={34} accentClass={accent} />
          <Zap
            className={`pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 stroke-[2.5] sm:size-[13px] ${
              workspace ? "fill-cyan-400/20 stroke-cyan-200/95" : "fill-sky-400/25 stroke-sky-600"
            }`}
            aria-hidden
          />
        </div>
      ) : (
        <Zap
          className={`mt-0.5 size-4 shrink-0 stroke-[2] sm:size-[15px] ${
            workspace ? "fill-cyan-400/15 stroke-cyan-200/95" : "fill-sky-400/22 stroke-sky-600"
          }`}
          aria-hidden
        />
      )}
      <span className="flex min-w-0 flex-col gap-0">
        <span
          className={`flex flex-wrap items-baseline gap-x-1 leading-none ${
            workspace ? "text-slate-50" : "text-slate-900"
          }`}
        >
          <span className="text-[13px] font-bold tabular-nums sm:text-[14px]">{pts}</span>
          <span
            className={`text-[9px] font-semibold uppercase tracking-wide ${
              workspace ? "text-slate-500" : "text-slate-500"
            }`}
          >
            credits
          </span>
        </span>
        <span
          className={`truncate text-[8.5px] font-medium leading-tight tracking-tight sm:text-[9px] ${
            workspace ? "text-slate-500" : "text-slate-600"
          }`}
        >
          <CreditsResetCountdown nextResetAtIso={nextResetAtIso} showIstSuffix={false} as="span" className="inline" />
        </span>
      </span>
    </button>
  );
}
