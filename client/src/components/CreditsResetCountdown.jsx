import { useEffect, useState } from "react";
import { formatResetsInCountdown } from "../lib/nextDailyReset.js";

/**
 * Tick using API `dailyCreditResetAt` / nextResetAt only — no frontend-computed reset instant.
 */
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
  return null;
}

/**
 * Countdown uses server-sent next reset ISO; missing/stale iso → neutral copy until refetch.
 */
export default function CreditsResetCountdown({
  className = "",
  as: Tag = "span",
  showIstSuffix = true,
  nextResetAtIso = null,
}) {
  const [computed, setComputed] = useState(() => computeLabel(nextResetAtIso));

  useEffect(() => {
    const tick = () => setComputed(computeLabel(nextResetAtIso));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [nextResetAtIso]);

  if (computed == null) {
    return (
      <Tag
        className={className.trim()}
        aria-live="polite"
        title="Next refill time arrives from your account sync with the server."
      >
        Daily refill · IST
      </Tag>
    );
  }

  return (
    <Tag className={className.trim()} aria-live="polite" title="Credits refresh on the schedule returned by Pixora.">
      {computed}
      {showIstSuffix ? <span className="font-normal text-slate-400"> · IST</span> : null}
    </Tag>
  );
}
