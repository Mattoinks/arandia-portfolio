"use client";

/*
  Adapted from React Bits — ScrollReveal (MIT, https://reactbits.dev).
  Changes: scoped cleanup via gsap.context (the original killed every
  ScrollTrigger on the page), a valid <p> wrapper instead of <h2><p>, screen
  readers get the intact sentence, and reduced-motion users see plain text.
*/

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: string;
  className?: string;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  /** Phrases (exact substrings of the text) to set in the italic accent style. */
  emphasize?: string[];
  emphasisClassName?: string;
}

export function ScrollReveal({
  children,
  className,
  enableBlur = true,
  baseOpacity = 0.15,
  baseRotation = 2,
  blurStrength = 4,
  emphasize = [],
  emphasisClassName = "italic text-primary",
}: ScrollRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  const words = useMemo(() => {
    // Character ranges covered by each emphasized phrase.
    const ranges = emphasize.flatMap((phrase) => {
      const start = children.indexOf(phrase);
      return start === -1 ? [] : [[start, start + phrase.length] as const];
    });
    const tokens = children.split(/(\s+)/);
    const starts = tokens.reduce<number[]>((acc, _, i) => [...acc, i === 0 ? 0 : acc[i - 1] + tokens[i - 1].length], []);
    return tokens.map((word, i) => {
      const start = starts[i];
      if (/^\s+$/.test(word)) return word;
      const emphasized = ranges.some(([a, b]) => start >= a && start < b);
      return (
        <span key={i} className={cn("rb-word inline-block", emphasized && emphasisClassName)}>
          {word}
        </span>
      );
    });
  }, [children, emphasize, emphasisClassName]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const wordEls = el.querySelectorAll<HTMLElement>(".rb-word");

      gsap.fromTo(
        el,
        { transformOrigin: "0% 50%", rotate: baseRotation },
        {
          ease: "none",
          rotate: 0,
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom 60%", scrub: true },
        },
      );

      gsap.fromTo(
        wordEls,
        { opacity: baseOpacity, ...(enableBlur && { filter: `blur(${blurStrength}px)` }) },
        {
          ease: "none",
          opacity: 1,
          ...(enableBlur && { filter: "blur(0px)" }),
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 55%", scrub: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [enableBlur, baseOpacity, baseRotation, blurStrength]);

  return (
    <p ref={ref} className={cn("relative", className)}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>{words}</span>
    </p>
  );
}
