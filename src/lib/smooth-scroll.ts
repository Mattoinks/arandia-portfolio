import type Lenis from "lenis";

/**
 * Module-level handle to the page's Lenis instance so overlays (menu, dialogs,
 * command palette) can pause smooth scrolling and in-page links can glide.
 * Null when smooth scrolling is off (reduced motion, SSR, tests).
 */
let instance: Lenis | null = null;
let programmatic = false;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/** True while a link-triggered glide is running (the navbar stays visible meanwhile). */
export function isProgrammaticScroll() {
  return programmatic;
}

/** Breathing room between the bottom of the floating navbar and the section's first line. */
const GAP_BELOW_NAV = 20;

/**
 * Where to scroll so a section's *content* (its eyebrow/heading, not its top
 * padding) starts just below the floating navbar. Measured live, so it stays
 * exact across breakpoints, padding changes and navbar height.
 */
function targetY(el: HTMLElement) {
  if (el === document.body) return 0;
  const paddingTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
  const header = document.querySelector<HTMLElement>("header");
  // Rendered size (the navbar is zoomed down on big screens), ignoring its slide-in transform.
  const navBottom = header ? header.getBoundingClientRect().height + Math.max(0, header.getBoundingClientRect().top) : 0;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(max, top + paddingTop - navBottom - GAP_BELOW_NAV));
}

/** Scroll to an in-page target, smoothly when Lenis is running. */
export function scrollToTarget(target: string, { immediate = false } = {}) {
  const el = target === "#top" ? document.body : document.querySelector<HTMLElement>(target);
  if (!el) return false;
  const y = targetY(el);

  if (instance) {
    programmatic = true;
    instance.scrollTo(y, {
      immediate,
      duration: immediate ? 0 : 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      onComplete: () => {
        programmatic = false;
      },
    });
  } else {
    window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
  }
  return true;
}

/** Pause/resume page scrolling for overlays, with or without Lenis. */
export function lockScroll(locked: boolean) {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  }
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = locked ? "hidden" : "";
  document.body.style.paddingRight = locked && scrollbar > 0 ? `${scrollbar}px` : "";
}
