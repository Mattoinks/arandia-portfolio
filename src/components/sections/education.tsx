"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { education } from "@/lib/data";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

export function Education() {
  return (
    <section id="education" className="relative mx-auto max-w-7xl px-6 py-28 sm:px-10">
      <SectionHeading
        eyebrow="Education"
        title="Academic Journey"
        description="The foundation behind the systems I build."
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerContainer}
        className="max-w-3xl"
      >
        {education.map((entry, i) => (
          <motion.div key={entry.institution} variants={fadeUp} className="relative flex gap-6">
            <div className="flex flex-col items-center">
              <span className="glass glow-border flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                <GraduationCap className="h-5 w-5 text-primary" strokeWidth={1.75} />
              </span>
              {i < education.length - 1 && <span className="mt-2 w-px flex-1 bg-border" aria-hidden />}
            </div>

            <GlassCard tilt={false} className="mb-8 flex-1 p-6">
              <p className="font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground">
                {entry.period}
              </p>
              <h3 className="mt-1 font-heading text-2xl font-semibold sm:text-3xl">
                {entry.institution}
              </h3>
              <p className="mt-1 text-base font-medium text-foreground">{entry.degree}</p>
              {entry.description && (
                <p className="mt-3 text-sm text-muted-foreground">{entry.description}</p>
              )}
              {entry.highlights && entry.highlights.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
