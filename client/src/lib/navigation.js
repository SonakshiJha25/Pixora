/** Studio entry — always lands at page top (header), not mid-page anchors. */
export function studioComposePath(style) {
  const key = style != null ? String(style).trim() : "";
  const query = key ? `?style=${encodeURIComponent(key)}` : "";
  return `/studio${query}`;
}

/** Scroll main window to top — use after navigating home via brand links. */
export function scrollPageTop(smooth = true) {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: smooth ? "smooth" : "instant",
  });
}

/** Open Pixora Studio and show the header / canvas area first. */
export function openStudio(navigate, options = {}) {
  const { style, replace = false, continueId } = options;
  let path = studioComposePath(style);
  const id = continueId != null ? String(continueId).trim() : "";
  if (id) {
    path = `/studio?continue=${encodeURIComponent(id)}`;
  }
  navigate(path, { replace });
  requestAnimationFrame(() => scrollPageTop(false));
}
