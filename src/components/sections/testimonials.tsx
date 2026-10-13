"use client";

import { motion } from "framer-motion";
import { Surface } from "@/components/ui/surface";
import { testimonials } from "@/lib/data";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

/** Kind words from people Matthew has worked with. Renders nothing until real quotes are added in data.ts. */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-title" className="relative mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
      <motion.h2
        id="testimonials-title"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={fadeUp}
        className="mb-10 font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl"
      >
        Kind <span className="font-serif font-normal italic tracking-[-0.02em] text-primary">words</span>
      </motion.h2>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerContainer}
        className="grid gap-4 md:grid-cols-2"
      >
        {testimonials.map((t) => (
          <motion.figure key={t.name} variants={fadeUp}>
            <Surface className="flex h-full flex-col p-7">
              <span aria-hidden className="font-serif text-6xl italic leading-[0.6] text-primary/80">
                &ldquo;
              </span>
              <blockquote className="mt-4 flex-1 text-pretty font-editorial text-xl font-light leading-snug">{t.quote}</blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-medium">{t.name}</p>
                <p className="mt-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">{t.title}</p>
              </figcaption>
            </Surface>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
