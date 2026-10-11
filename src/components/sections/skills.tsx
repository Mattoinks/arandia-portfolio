"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Code2, Smartphone } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import { MobileAppVisual, WebSystemsVisual } from "@/components/sections/capability-visuals";
import { PADDED_SKILL_ICONS, SKILL_ICON_SRC } from "@/components/icons/tech-icons";
import { skillGroups, capabilities, type SkillGroupId, type SkillItem } from "@/lib/data";
import { cn } from "@/lib/utils";
import { fadeUp, viewport } from "@/lib/motion";

const CAPABILITY_ICONS = { code: Code2, smartphone: Smartphone } as const;

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
      <SectionHeading
        index="01"
        eyebrow="Capabilities"
        title="What I"
        accent="can do"
        description="Technical depth, problem-solving, and an eye for interfaces — applied end-to-end, from the database schema to the deployed screen."
      />

      {/* Capabilities — asymmetric pair, each with an illustration of the work itself */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {capabilities.map((cap, i) => {
          const Icon = CAPABILITY_ICONS[cap.icon];
          const Visual = cap.icon === "code" ? WebSystemsVisual : MobileAppVisual;
          return (
            <motion.div
              key={cap.number}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              custom={i * 0.1}
              variants={fadeUp}
              className={cap.icon === "code" ? "lg:col-span-7" : "lg:col-span-5"}
            >
              <Surface as="article" shellClassName="group/cap" className="flex h-full flex-col overflow-hidden">
                <div className="p-7 sm:p-9">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/60">
                      <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </span>
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground tabular">
                      <span className="text-primary">{cap.number}</span> / Capability
                    </span>
                  </div>

                  <h3 className="mt-7 font-heading text-2xl font-medium tracking-[-0.04em] sm:text-[2rem] sm:leading-[1.1]">
                    {cap.caption}
                  </h3>
                  <p className="mt-3 max-w-lg text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {cap.description}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {cap.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-border bg-background/40 px-2.5 py-1 font-mono text-[0.65625rem] text-muted-foreground transition-colors duration-200 hover:border-foreground/25 hover:text-foreground"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Illustration sits flush on the card's bottom edge */}
                <div className="flex flex-1 flex-col justify-end px-7 sm:px-9">
                  <Visual />
                </div>
              </Surface>
            </motion.div>
          );
        })}
      </div>

      {/* Toolkit — asymmetric bento: each category is a card sized to its tool count */}
      <div className="mt-20 sm:mt-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={fadeUp}
          className="mb-8 flex items-end justify-between gap-6"
        >
          <div>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">Toolkit</p>
            <h3 className="mt-3 font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl">
              The stack I <span className="font-serif font-normal italic tracking-[-0.02em] text-primary">reach for</span>
            </h3>
          </div>
          <p className="shrink-0 rounded-full border border-border px-3 py-1 font-mono text-[0.6875rem] text-muted-foreground tabular">
            {skillGroups.reduce((n, g) => n + g.items.length, 0)} tools
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          {TOOLKIT_ORDER.map((id, i) => {
            const group = skillGroups.find((g) => g.id === id);
            if (!group) return null;
            const meta = TOOLKIT_META[id];
            return (
              <motion.div
                key={id}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                custom={(i % 3) * 0.08}
                variants={fadeUp}
                className={meta.span}
              >
                <Surface as="article" className="flex h-full flex-col p-6">
                  <header className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-primary tabular">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h4 className="mt-2 text-lg font-medium tracking-[-0.02em]">{group.label}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{meta.caption}</p>
                    </div>
                    <span className="font-serif text-4xl italic leading-none text-muted-foreground/30 tabular">
                      {String(group.items.length).padStart(2, "0")}
                    </span>
                  </header>

                  <motion.ul
                    variants={tileStagger}
                    className="mt-8 grid grid-cols-4 gap-x-3 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-4"
                  >
                    {group.items.map((item) => (
                      <ToolTile key={item.name} item={item} />
                    ))}
                  </motion.ul>
                </Surface>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Row 1: languages + the big backend card; row 2: frontend, devops, tools.
const TOOLKIT_ORDER: SkillGroupId[] = ["languages", "backend", "frontend", "devops", "tools"];

const TOOLKIT_META: Record<SkillGroupId, { caption: string; span: string }> = {
  languages: { caption: "What I think in.", span: "lg:col-span-5" },
  backend: { caption: "Where the data lives and stays correct.", span: "lg:col-span-7" },
  frontend: { caption: "Interfaces for web and mobile.", span: "lg:col-span-5" },
  devops: { caption: "Version, ship, repeat.", span: "lg:col-span-3" },
  tools: { caption: "Plan, design, deploy.", span: "md:col-span-2 lg:col-span-4" },
};

const tileStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.15 } },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.6, bounce: 0.25 } },
};

function ToolTile({ item }: { item: SkillItem }) {
  const src = SKILL_ICON_SRC[item.icon];
  const padded = PADDED_SKILL_ICONS.has(item.icon);
  return (
    <motion.li variants={tileVariants} className="group min-w-0 sm:w-[3.75rem]">
      <div className="relative aspect-square overflow-hidden rounded-[1.125rem] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08),0_10px_24px_-14px_rgb(var(--shadow-tint)/0.5)] ring-1 ring-black/[0.06] transition-[transform,box-shadow] duration-300 ease-out-strong group-hover:-translate-y-1 group-hover:shadow-[0_2px_4px_rgb(0_0_0/0.08),0_16px_30px_-12px_var(--glow)] dark:ring-white/10">
        {src && (
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 640px) 22vw, 60px"
            className={cn(
              "object-contain transition-transform duration-500 ease-out-strong group-hover:scale-105",
              padded && "p-2.5",
            )}
          />
        )}
        {/* Glassy top-edge highlight so mismatched icon art reads as one family. */}
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgb(255_255_255/0.6),inset_0_-8px_16px_-12px_rgb(0_0_0/0.25)]" />
      </div>
      <p className="-mx-2 mt-2 line-clamp-2 text-balance text-center text-[0.6875rem] leading-tight text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
        {item.name}
      </p>
    </motion.li>
  );
}
