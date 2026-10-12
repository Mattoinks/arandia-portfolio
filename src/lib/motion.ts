import type { Variants } from "framer-motion";

/** Signature decisive-deceleration curve (expo-out) used for every reveal on the site. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Strong ease-out for small UI responses (menus, dialogs, tabs). */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * Shared scroll-reveal used across every section for one consistent entrance rhythm.
 * Uses full `transform` strings (not the x/y shorthands) so Motion hands the
 * animation to the compositor via WAAPI — the card is moved as an already-painted
 * layer instead of being repainted every frame while the page scrolls.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, transform: "translateY(28px)" },
  show: (delay: number = 0) => ({
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

/**
 * Shared scroll-trigger — replays every time a section re-enters the viewport,
 * not just once. The trigger line is a percentage of the viewport's bottom
 * edge rather than a fixed pixel inset, so small elements (like the About
 * avatar) can't get stuck "out of view" at high zoom or on short screens.
 */
export const viewport = { once: false, margin: "0px 0px -10% 0px" } as const;

/** Staggers a group of fadeUp children (cards, list items) by a fixed rhythm. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
