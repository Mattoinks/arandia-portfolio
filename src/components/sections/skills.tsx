"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Code2, Smartphone } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlassCard } from "@/components/ui/glass-card";
import { SKILL_ICON_SRC } from "@/components/icons/tech-icons";
import { skillGroups, capabilities } from "@/lib/data";
import { fadeUp, viewport } from "@/lib/motion";

const CAPABILITY_ICONS = { code: Code2, smartphone: Smartphone } as const;

const allSkills = skillGroups.flatMap((g) => g.items);

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-7xl px-6 py-28 sm:px-10">
      <SectionHeading
        eyebrow="My Capabilities"
        title="What I Can Do"
        description="I combine technical, problem-solving, and digital skills to build reliable systems, design interfaces, and ship full-stack products."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr_1fr]">
        <div className="grid grid-cols-4 content-start gap-4">
          {allSkills.map((item, i) => {
            const src = SKILL_ICON_SRC[item.icon];
            return (
              <div key={item.name} className="group relative">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{ duration: 0.35, delay: i * 0.03, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                  aria-label={item.name}
                  className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white/95 shadow-sm transition-shadow hover:shadow-md dark:bg-white/90"
                >
                  {src && (
                    <Image
                      src={src}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 25vw, 120px"
                      className="object-contain"
                    />
                  )}
                </motion.div>
                <span className="pointer-events-none absolute -bottom-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-foreground px-2.5 py-1 text-[10px] font-medium text-background opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        {capabilities.map((cap, i) => {
          const Icon = CAPABILITY_ICONS[cap.icon];
          return (
            <motion.div
              key={cap.number}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              custom={0.1 + i * 0.1}
              variants={fadeUp}
            >
              <GlassCard className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between">
                  <span className="font-heading text-4xl font-bold text-muted-foreground/40">
                    {cap.number}
                  </span>
                  <span className="max-w-[9rem] text-right font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground">
                    {cap.caption}
                  </span>
                </div>

                <span className="glass mt-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                </span>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {cap.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {cap.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
