"use client";

/*
  Adapted from React Bits — SplitText (MIT, https://reactbits.dev).
  Changes: honours prefers-reduced-motion, IntersectionObserver instead of
  ScrollTrigger (no per-frame scroll work),
  defaults tuned to the site's expo-out rhythm, and a masked line wrapper so
  characters rise out of a clip instead of fading in mid-air.
*/

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(GSAPSplitText, useGSAP);

interface SplitTextProps {
  text: string;
  className?: string;
  /** Stagger between pieces, in ms. */
  delay?: number;
  /** Extra wait before the first piece, in seconds. */
  startDelay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  /** "load" plays immediately (above the fold); "scroll" waits for the viewport. */
  trigger?: "load" | "scroll";
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}

export function SplitText({
  text,
  className,
  delay = 28,
  startDelay = 0,
  duration = 1.1,
  ease = "expo.out",
  // "words, chars" keeps each word as an unbreakable group so lines never wrap mid-word.
  splitType = "words, chars",
  from = { yPercent: 110, opacity: 0, rotate: 6 },
  to = { yPercent: 0, opacity: 1, rotate: 0 },
  trigger = "scroll",
  tag: Tag = "span",
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [fontsReady, setFontsReady] = useState(false);

  // Splitting before webfonts load measures the fallback font and breaks lines.
  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => alive && setFontsReady(true));
    return () => {
      alive = false;
    };
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !fontsReady) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const split = new GSAPSplitText(el, {
        type: splitType,
        mask: splitType.includes("chars") ? "chars" : splitType === "lines" ? "lines" : "words",
        charsClass: "split-char",
        wordsClass: "split-word",
        linesClass: "split-line",
        aria: "auto",
      });
      const targets = splitType.includes("chars") ? split.chars : splitType === "lines" ? split.lines : split.words;

      const play = () =>
        gsap.fromTo(targets, from, {
          ...to,
          duration,
          ease,
          delay: startDelay,
          stagger: delay / 1000,
          force3D: true,
        });

      // Scroll trigger via IntersectionObserver (no per-frame scroll listener).
      let io: IntersectionObserver | undefined;
      if (trigger === "scroll") {
        gsap.set(targets, from);
        io = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            io?.disconnect();
            play();
          },
          { rootMargin: "0px 0px -12% 0px" },
        );
        io.observe(el);
      } else {
        play();
      }

      return () => {
        io?.disconnect();
        split.revert();
      };
    },
    { dependencies: [text, fontsReady], scope: ref },
  );

  return (
    <Tag ref={ref as React.RefObject<never>} className={cn("inline-block", className)}>
      {text}
    </Tag>
  );
}
