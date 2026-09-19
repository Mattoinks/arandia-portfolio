"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";
import { TextReveal } from "@/components/ui/text-reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={staggerContainer}
      className={cn("mb-12 max-w-2xl", align === "center" && "mx-auto text-center")}
    >
      <motion.p
        variants={fadeUp}
        className="mb-4 font-mono text-sm uppercase tracking-[0.2em] text-primary"
      >
        {eyebrow}
      </motion.p>
      <TextReveal
        as="h2"
        text={title}
        delay={0.05}
        className="text-balance font-heading text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
      />
      {description && (
        <motion.p variants={fadeUp} className="mt-4 text-base text-muted-foreground sm:text-lg">
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
