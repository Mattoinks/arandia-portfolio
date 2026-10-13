"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { education } from "@/lib/data";
import { EASE, fadeUp, staggerContainer, viewport } from "@/lib/motion";

export function Education() {
  return (
    <section id="education" className="relative mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
      <SectionHeading
        index="05"
        eyebrow="Education"
        title="Academic"
        accent="journey"
        description="The foundation behind the systems I build."
      />

      <ol className="relative">
        {education.map((entry) => (
          <motion.li
            key={entry.institution}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={staggerContainer}
            className="relative grid gap-6 pt-10 lg:grid-cols-12 lg:gap-10"
          >
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewport}
              transition={{ duration: 1.2, ease: EASE }}
              className="absolute inset-x-0 top-0 h-px origin-left bg-border"
            />
            <div className="flex items-center gap-5 lg:col-span-3 lg:flex-col lg:items-start lg:gap-8">
              {entry.logo && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.85, rotate: -6 },
                    show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", duration: 0.9, bounce: 0.3 } },
                  }}
                  className="group rounded-[1.75rem] bg-foreground/[0.025] p-1.5 ring-1 ring-border dark:bg-white/[0.02]"
                >
                  <div className="surface flex h-24 w-24 items-center justify-center rounded-[calc(1.75rem-0.375rem)] sm:h-32 sm:w-32">
                    <div className="relative h-[70%] w-[70%] transition-transform duration-500 ease-out-strong group-hover:-rotate-3 group-hover:scale-105">
                      <Image
                        src={entry.logo}
                        alt={`${entry.institution} logo`}
                        fill
                        sizes="(max-width: 640px) 68px, 90px"
                        className="object-contain drop-shadow-[0_8px_16px_rgb(var(--shadow-tint)/0.25)]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <motion.p variants={fadeUp} className="font-mono text-sm text-muted-foreground tabular">
                {entry.period}
              </motion.p>
            </div>

            <div className="lg:col-span-9">
              <motion.h3
                variants={fadeUp}
                className="text-balance font-heading text-3xl font-medium tracking-[-0.04em] sm:text-5xl"
              >
                {entry.institution}
              </motion.h3>
              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-lg text-foreground">
                {entry.degree}
              </motion.p>
              {entry.description && (
                <motion.p
                  variants={fadeUp}
                  className="mt-4 max-w-2xl text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground"
                >
                  {entry.description}
                </motion.p>
              )}
              {entry.highlights && entry.highlights.length > 0 && (
                <motion.ul variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                  {entry.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card py-2 pl-2.5 pr-4 text-sm"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/12 text-primary">
                        <Award className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                      </span>
                      {highlight}
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
