import type { Variants } from "framer-motion";

/** Signature decisive-deceleration curve (expo-out) used for every premium reveal on the site. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Shared scroll-reveal used across every section for one consistent entrance rhythm. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

/** Shared scroll-trigger offset — replays every time a section re-enters the viewport, not just once. */
export const viewport = { once: false, margin: "-80px" } as const;

/** Staggers a group of fadeUp children (cards, list items) by a fixed rhythm. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
