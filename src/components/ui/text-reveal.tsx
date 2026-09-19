"use client";

import { motion, type Variants } from "framer-motion";
import { EASE, viewport } from "@/lib/motion";

const container: Variants = {
  hidden: {},
  show: (delay: number = 0) => ({
    transition: { staggerChildren: 0.04, delayChildren: delay },
  }),
};

const word: Variants = {
  hidden: { opacity: 0, y: "0.5em" },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

interface TextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
}

/**
 * Splits short headline copy into words and reveals them with a per-word
 * stagger instead of one flat fade. Reserve for headline-length text (a
 * handful of words) — splitting long paragraphs bloats the DOM for no gain.
 */
export function TextReveal({ text, as = "span", className, delay = 0 }: TextRevealProps) {
  const MotionTag = motion[as];
  const words = text.split(" ");

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      custom={delay}
      variants={container}
      className={className}
      style={{ perspective: 600 }}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          variants={word}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}
