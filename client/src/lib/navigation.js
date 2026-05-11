/** Scroll main window to top — use after navigating home via brand links. */
export function scrollPageTop(smooth = true) {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: smooth ? "smooth" : "instant",
  });
}
