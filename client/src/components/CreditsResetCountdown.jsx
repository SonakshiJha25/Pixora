import { useEffect, useState } from "react";
import { formatResetsInCountdown, getNextIstMidnightUtcMs } from "../lib/nextDailyReset.js";

/** Use API `nextResetAt` when still in the future; if it is stale (midnight passed, refetch pending), show “Resets soon”. */
function computeLabel(nextResetAtIso) {
  const now = Date.now();
  if (nextResetAtIso && typeof nextResetAtIso === "string") {
    const parsed = Date.parse(nextResetAtIso);
    if (Number.isFinite(parsed)) {
      if (now < parsed) {
        return formatResetsInCountdown(parsed - now);
      }
      return "Resets soon";
    }
  }
  const target = getNextIstMidnightUtcMs();
  return formatResetsInCountdown(target - now);
}

/**
 * Live countdown to the next IST (Asia/Kolkata) calendar midnight — matches daily credit rollover.
 */
export default function CreditsResetCountdown({
  className = "",
  as: Tag = "span",
  showIstSuffix = true,
  nextResetAtIso = null,
}) {
  const [label, setLabel] = useState(() => computeLabel(nextResetAtIso));

  useEffect(() => {
    const tick = () => setLabel(computeLabel(nextResetAtIso));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [nextResetAtIso]);

  return (
    <Tag
      className={className.trim()}
      aria-live="polite"
      title="Daily credits refill at midnight India Standard Time (IST)."
    >
      {label}
      {showIstSuffix ? (
        <span className="font-normal text-slate-400"> · IST</span>
      ) : null}
    </Tag>
  );
}
