/**
 * Homepage-only typography — Instrument Serif for emotional lines.
 * UI chrome stays Plus Jakarta Sans (see `index.css` type-* classes).
 */

/** Inline italic serif emphasis (hero lines, key words in headings). */
export function HomeSerif({ children, className = "" }) {
  return (
    <span
      className={`font-serif font-normal italic tracking-[-0.01em] text-inherit ${className}`.trim()}
    >
      {children}
    </span>
  );
}

/** Section headings with editorial serif — not for nav, cards, or body. */
export function HomeEmotionalHeading({ id, children, className = "", as: Tag = "h2" }) {
  return (
    <Tag
      id={id}
      className={`home-emotional-heading ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}

/** Eyebrow + title block for homepage sections (left by default). */
export function HomeSectionHeading({ eyebrow, className = "", centered = false, children }) {
  return (
    <div className={`px-1 ${centered ? "text-center" : "text-left"} ${className}`.trim()}>
      {eyebrow != null && eyebrow !== "" ? (
        typeof eyebrow === "string" ? (
          <p className="type-eyebrow-muted">{eyebrow}</p>
        ) : (
          <div className="type-eyebrow-muted">{eyebrow}</div>
        )
      ) : null}
      {children}
    </div>
  );
}
