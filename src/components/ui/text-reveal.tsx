"use client";

import { motion, type Variants } from "framer-motion";
import { EASE, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: (delay: number = 0) => ({
    transition: { staggerChildren: 0.055, delayChildren: delay },
  }),
};

const word: Variants = {
  hidden: { y: "110%", rotate: 4 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: EASE } },
};

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Extra classes for each word (e.g. the serif-italic accent style). */
  wordClassName?: string;
  delay?: number;
  /** Play on mount instead of on scroll (for above-the-fold copy). */
  immediate?: boolean;
}

/**
 * Masked word-by-word reveal: each word rises out of its own clipping box.
 * Reserve for headline-length text (a handful of words) — splitting long
 * paragraphs bloats the DOM for no gain.
 */
export function TextReveal({
  text,
  as = "span",
  className,
  wordClassName,
  delay = 0,
  immediate = false,
}: TextRevealProps) {
  const MotionTag = motion[as];
  const words = text.split(" ");
  const trigger = immediate
    ? { animate: "show" }
    : { whileInView: "show", viewport };

  return (
    <MotionTag initial="hidden" {...trigger} custom={delay} variants={container} className={className}>
      {/* Split words read as one run-together word to assistive tech, so they
          get the intact string and the animated copy is hidden from them. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={`${w}-${i}`}>
            <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span variants={word} className={cn("inline-block origin-bottom-left", wordClassName)}>
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </MotionTag>
  );
}
