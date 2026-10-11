"use client";

import { motion } from "framer-motion";
import { useLocalTime } from "@/hooks/use-local-time";
import { EASE, viewport } from "@/lib/motion";

const WORDMARK = "Arandia";

/** Oversized surname that rises letter by letter as the page bottoms out. */
export function FooterWordmark() {
  return (
    <motion.p
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
      className="-ml-[0.04em] flex select-none overflow-hidden whitespace-nowrap pt-16 font-heading text-[27.5vw] font-medium leading-[0.8] tracking-[-0.075em] text-foreground/[0.07] xl:text-[23.5rem]"
    >
      {WORDMARK.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{ hidden: { y: "100%" }, show: { y: "0%", transition: { duration: 1.1, ease: EASE } } }}
          className="inline-block pb-[0.08em]"
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}

export function FooterClock() {
  const time = useLocalTime();
  return (
    <p className="flex items-center gap-2 font-mono uppercase tracking-[0.14em]">
      <span className="live-dot h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
      <span>Dasmariñas, PH</span>
      <span className="tabular text-foreground/80" suppressHydrationWarning>
        {time || "--:-- --"}
      </span>
    </p>
  );
}
