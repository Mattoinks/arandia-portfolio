"use client";

/*
  Adapted from React Bits — ScrollReveal (MIT, https://reactbits.dev).
  Changes: driven by a cached framer-motion scroll value instead of GSAP ScrollTrigger,
  so no scroll listener reads layout every frame (ScrollTrigger's did, synced
  to Lenis, and it was the main scroll-jank source). Opacity + a slight
  settle-in rotation only — both compositor-friendly. Screen readers get the
  intact sentence; phrases in `emphasize` get the accent style.
*/

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { useElementScrollProgress } from "@/hooks/use-element-scroll";

interface ScrollRevealProps {
  children: string;
  className?: string;
  baseOpacity?: number;
  baseRotation?: number;
  /** Phrases (exact substrings of the text) to set in the italic accent style. */
  emphasize?: string[];
  emphasisClassName?: string;
}

function Word({
  children,
  progress,
  range,
  baseOpacity,
  className,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  baseOpacity: number;
  className?: string;
}) {
  const opacity = useTransform(progress, range, [baseOpacity, 1]);
  return (
    <motion.span style={{ opacity }} className={cn("inline-block", className)}>
      {children}
    </motion.span>
  );
}

export function ScrollReveal({
  children,
  className,
  baseOpacity = 0.15,
  baseRotation = 2,
  emphasize = [],
  emphasisClassName = "italic text-primary",
}: ScrollRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const scrollYProgress = useElementScrollProgress(ref, ["start 0.85", "end 0.55"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : baseRotation, 0]);

  const tokens = useMemo(() => {
    const ranges = emphasize.flatMap((phrase) => {
      const start = children.indexOf(phrase);
      return start === -1 ? [] : [[start, start + phrase.length] as const];
    });
    const parts = children.split(/(\s+)/);
    const starts = parts.reduce<number[]>((acc, _, i) => [...acc, i === 0 ? 0 : acc[i - 1] + parts[i - 1].length], []);
    const words = parts.filter((w) => !/^\s+$/.test(w)).length;
    let wordIndex = 0;
    return parts.map((part, i) => {
      if (/^\s+$/.test(part)) return { kind: "space" as const, text: part };
      const idx = wordIndex++;
      return {
        kind: "word" as const,
        text: part,
        range: [idx / words, (idx + 1) / words] as [number, number],
        emphasized: ranges.some(([a, b]) => starts[i] >= a && starts[i] < b),
      };
    });
  }, [children, emphasize]);

  return (
    <motion.p ref={ref} style={{ rotate, transformOrigin: "0% 50%" }} className={cn("relative", className)}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {tokens.map((t, i) =>
          t.kind === "space" ? (
            t.text
          ) : reduce ? (
            <span key={i} className={cn(t.emphasized && emphasisClassName)}>
              {t.text}
            </span>
          ) : (
            <Word
              key={i}
              progress={scrollYProgress}
              range={t.range}
              baseOpacity={baseOpacity}
              className={t.emphasized ? emphasisClassName : undefined}
            >
              {t.text}
            </Word>
          ),
        )}
      </span>
    </motion.p>
  );
}
