import { useEffect, useState } from "react";
import { formatResetsInCountdown, getNextIstMidnightUtcMs } from "../lib/nextDailyReset.js";

function computeLabel() {
  const target = getNextIstMidnightUtcMs();
  const diff = target - Date.now();
  return formatResetsInCountdown(diff);
}

/**
 * Live countdown to the next IST (Asia/Kolkata) calendar midnight — matches daily credit rollover.
 */
export default function CreditsResetCountdown({
  className = "",
  as: Tag = "span",
  showIstSuffix = true,
}) {
  const [label, setLabel] = useState(computeLabel);

  useEffect(() => {
    const tick = () => setLabel(computeLabel());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

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
