"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle2, FileText } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { certifications } from "@/lib/data";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

export function Certifications() {
  return (
    <section id="certifications" className="relative mx-auto max-w-7xl px-6 py-28 sm:px-10">
      <SectionHeading
        eyebrow="Certifications"
        title="Verified Credentials"
        description="Industry-recognized certifications validating my technical foundation."
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerContainer}
        className="grid gap-6 sm:grid-cols-2"
      >
        {certifications.map((cert) => (
          <motion.div key={cert.name} variants={fadeUp}>
            <GlassCard className="flex h-full flex-col gap-5 p-6">
              <div className="flex items-start justify-between">
                <span className="glass flex h-12 w-12 items-center justify-center rounded-xl">
                  <Award className="h-5 w-5 text-primary" strokeWidth={1.75} />
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
                  <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                  Pass
                </span>
              </div>

              <div>
                <h3 className="font-heading text-2xl font-semibold sm:text-3xl">{cert.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
              </div>

              <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground">
                    Score
                  </p>
                  <p className="font-heading text-2xl font-bold">
                    <AnimatedCounter value={cert.score} />
                    <span className="text-base font-medium text-muted-foreground">
                      /{cert.maxScore}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground">
                    Valid Thru
                  </p>
                  <p className="text-base font-medium">{cert.validThru}</p>
                </div>
              </div>

              <a
                href={cert.pdfUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="glass inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground active:scale-95"
              >
                <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
                View Certificate
              </a>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
