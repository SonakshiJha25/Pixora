import { useEffect, useState } from "react";
import { formatResetsInCountdown, getNextIstMidnightIsoFallback } from "../lib/nextDailyReset.js";

/**
 * Live countdown to the next daily credit refill.
 * Prefers server `nextResetAtIso`; falls back to IST midnight math (same as server) until API syncs.
 */
function resolveIso(nextResetAtIso) {
  if (nextResetAtIso && typeof nextResetAtIso === "string") {
    const trimmed = nextResetAtIso.trim();
    if (trimmed !== "") return trimmed;
  }
  return getNextIstMidnightIsoFallback();
}

function computeLabel(nextResetAtIso) {
  const iso = resolveIso(nextResetAtIso);
  const parsed = Date.parse(iso);
  if (!Number.isFinite(parsed)) return null;
  const now = Date.now();
  if (now < parsed) {
    return formatResetsInCountdown(parsed - now);
  }
  return "Updating…";
}

export default function CreditsResetCountdown({
  className = "",
  as: Tag = "span",
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
      <Tag className={className.trim()} aria-live="polite">
        …
      </Tag>
    );
  }

  return (
    <Tag
      className={className.trim()}
      aria-live="polite"
      title="Daily credits refill countdown (IST midnight, full balance)."
    >
      {computed}
    </Tag>
  );
}
