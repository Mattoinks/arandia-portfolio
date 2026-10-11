"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";
import { TextReveal } from "@/components/ui/text-reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Optional trailing words rendered in the serif-italic accent style. */
  accent?: string;
  description?: string;
  /** Two-digit section index shown before the eyebrow, e.g. "02". */
  index?: string;
  align?: "left" | "center";
  className?: string;
}

export function Eyebrow({ index, children }: { index?: string; children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
      {index && <span className="text-primary tabular">{index}</span>}
      {index && <span className="h-2.5 w-px bg-border" aria-hidden />}
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  index,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={staggerContainer}
      className={cn("mb-10 max-w-3xl sm:mb-14", align === "center" && "mx-auto text-center", className)}
    >
      <motion.div variants={fadeUp} className={cn("mb-6", align === "center" && "flex justify-center")}>
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
      </motion.div>
      <h2 className="text-balance font-heading text-5xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-[5.5rem]">
        <TextReveal text={title} delay={0.05} />
        {accent && (
          <>
            {" "}
            <TextReveal
              text={accent}
              delay={0.15}
              wordClassName="font-serif font-normal italic tracking-[-0.02em] text-primary"
            />
          </>
        )}
      </h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className={cn(
            "mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
