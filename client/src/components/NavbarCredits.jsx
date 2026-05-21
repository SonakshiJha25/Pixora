import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { DAILY_CREDITS_LIMIT, normalizeCreditsPoints } from "../lib/credits.js";
import { getNextIstMidnightUtcMs } from "../lib/nextDailyReset.js";

/**
 * Modern pill-style credits indicator matching the mock image.
 * Shows remaining credits with a lightning bolt and a live reset countdown.
 */
export default function NavbarCredits({ workspace = false, credits, onPress }) {
  const pts = normalizeCreditsPoints(credits);
  const [timeLeft, setTimeLeft] = useState("Resets in --h --m");

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const nextReset = getNextIstMidnightUtcMs(now);
      const diffMs = nextReset - now;
      if (diffMs <= 0) {
        setTimeLeft("Updating…");
        return;
      }
      const totalSec = Math.floor(diffMs / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      setTimeLeft(`Resets in ${h}h ${m}m`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 15000); // update every 15s to keep fresh
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      type="button"
      onClick={onPress}
      className={`rounded-full border px-4 py-1.5 flex flex-col items-center justify-center text-center transition focus-visible:outline-none focus-visible:ring-2 select-none ${
        workspace
          ? "border-cyan-500/20 bg-cyan-950/20 text-slate-200 hover:bg-cyan-950/30 focus-visible:ring-cyan-500/35"
          : "border-[#d9f2ff] bg-[#f0f9ff] text-slate-800 hover:bg-[#e0f4ff] focus-visible:ring-sky-300"
      }`}
      title={`${pts} of ${DAILY_CREDITS_LIMIT} credits remaining. Resets daily.`}
      aria-label={`${pts} credits left. ${timeLeft}`}
    >
      <span className="flex items-center justify-center gap-1 text-[12px] sm:text-[13px] font-bold">
        <Zap
          className={`h-3.5 w-3.5 ${
            workspace ? "fill-cyan-400 stroke-cyan-400" : "fill-sky-500 stroke-sky-500"
          }`}
          aria-hidden="true"
        />
        <span>{pts} left</span>
      </span>
      <span className={`text-[10px] font-medium leading-none mt-0.5 tracking-tight ${workspace ? "text-slate-400/90" : "text-slate-500/90"}`}>
        {timeLeft}
      </span>
    </button>
  );
}

