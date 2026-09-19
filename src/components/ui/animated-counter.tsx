"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  suffix?: string;
}

/** Counts up to `value` every time it scrolls into view, resetting to 0 when it scrolls back out. */
export function AnimatedCounter({ value, className, suffix = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 85, damping: 22 });

  useEffect(() => {
    if (shouldReduceMotion) {
      if (ref.current) ref.current.textContent = `${inView ? value : 0}${suffix}`;
      return;
    }
    motionValue.set(inView ? value : 0);
  }, [inView, value, suffix, shouldReduceMotion, motionValue]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    return spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = `${Math.round(latest)}${suffix}`;
    });
  }, [spring, suffix, shouldReduceMotion]);

  return (
    <span ref={ref} className={className} aria-label={`${value}${suffix}`}>
      0{suffix}
    </span>
  );
}
