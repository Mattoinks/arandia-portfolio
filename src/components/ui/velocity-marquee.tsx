"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";

interface VelocityMarqueeProps {
  items: string[];
  /** Base drift in % of one copy per second; negative drifts right. */
  baseVelocity?: number;
  className?: string;
}

/**
 * Text band that drifts on its own and surges with scroll speed (direction
 * flips with scroll direction). Purely decorative, so it's hidden from
 * assistive tech and frozen for reduced-motion users.
 */
export function VelocityMarquee({ items, baseVelocity = 2, className }: VelocityMarqueeProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // The frame loop does nothing useful off-screen, so it idles there.
  const inView = useInView(ref, { margin: "100px 0px" });
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(1);

  // Four copies; wrapping across one copy's width (25%) makes the loop seamless.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={ref} aria-hidden className={className}>
      <motion.div style={{ x }} className="flex w-max whitespace-nowrap will-change-transform">
        {Array.from({ length: 4 }).map((_, copy) => (
          <span key={copy} className="flex items-center">
            {items.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center">
                <span className="px-[0.35em]">{item}</span>
                <span className="px-[0.3em] text-[0.45em] text-primary">✦</span>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
