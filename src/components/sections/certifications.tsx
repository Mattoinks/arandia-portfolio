"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { certifications } from "@/lib/data";
import { EASE, fadeUp, staggerContainer, viewport } from "@/lib/motion";

export function Certifications() {
  return (
    <section id="certifications" className="relative mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
      <SectionHeading
        index="03"
        eyebrow="Certifications"
        title="Verified"
        accent="credentials"
        description="Industry-recognized exams validating the foundation behind everything I ship."
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerContainer}
        className="grid gap-5 md:grid-cols-2"
      >
        {certifications.map((cert) => {
          const pct = cert.score / cert.maxScore;
          return (
            <motion.div key={cert.name} variants={fadeUp}>
              <Surface as="article" className="flex h-full flex-col p-8 sm:p-10">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {cert.issuer}
                  </p>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-primary">
                    <BadgeCheck className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    Passed
                  </span>
                </div>

                <h3 className="mt-8 font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
                  {cert.name}
                </h3>

                <div className="mt-10">
                  <div className="flex items-baseline justify-between">
                    <p className="font-heading text-5xl font-medium tracking-[-0.04em] tabular">
                      <AnimatedCounter value={cert.score} />
                      <span className="ml-1 text-lg font-normal tracking-normal text-muted-foreground">
                        / {cert.maxScore}
                      </span>
                    </p>
                    <span className="font-mono text-xs text-muted-foreground tabular">
                      {Math.round(pct * 100)}%
                    </span>
                  </div>
                  <div
                    className="mt-4 h-1 overflow-hidden rounded-full bg-foreground/[0.07]"
                    role="img"
                    aria-label={`Score ${cert.score} out of ${cert.maxScore}`}
                  >
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: pct }}
                      viewport={viewport}
                      transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
                      className="h-full origin-left rounded-full bg-primary"
                    />
                  </div>
                </div>

                <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6">
                  <div>
                    <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                      Valid thru
                    </dt>
                    <dd className="mt-1.5 text-sm font-medium">{cert.validThru}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                      Credential ID
                    </dt>
                    <dd className="mt-1.5 font-mono text-sm tabular">{cert.credentialId}</dd>
                  </div>
                </dl>

                <a
                  href={cert.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline mt-8 inline-flex w-fit items-center gap-1.5 pb-0.5 text-sm font-medium"
                >
                  View certificate <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </a>
              </Surface>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
