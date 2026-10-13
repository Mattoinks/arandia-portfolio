"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GithubIcon } from "@/components/icons/brand-icons";
import { TiltedCard } from "@/components/reactbits/tilted-card";
import { MetricTiles } from "@/components/project/metric-tiles";
import { cn } from "@/lib/utils";
import { projects, socials, type Project } from "@/lib/data";
import { blurPlaceholders } from "@/lib/blur-placeholders";
import { EASE, fadeUp, staggerContainer, viewport } from "@/lib/motion";

const githubProfile = socials.find((s) => s.icon === "github")?.href;

const STATUS: Record<Project["status"], { label: string; live: boolean }> = {
  production: { label: "Live", live: true },
  completed: { label: "Completed", live: false },
  "in-progress": { label: "In progress", live: true },
  archived: { label: "Archived", live: false },
};

function ProjectVisual({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ clipPath: "inset(12% 8% 12% 8% round 28px)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
      viewport={viewport}
      transition={{ duration: 1.2, ease: EASE }}
      className="group/visual relative aspect-video overflow-hidden rounded-[1.75rem] border border-border bg-muted"
    >
      {project.thumbnail ? (
        <motion.div
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1 }}
          viewport={viewport}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={project.thumbnail}
            alt={`${project.name} — interface screenshot`}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover object-top transition-transform duration-700 ease-out-strong group-hover/visual:scale-[1.03]"
            placeholder={blurPlaceholders[project.slug] ? "blur" : "empty"}
            blurDataURL={blurPlaceholders[project.slug]}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(80%_70%_at_50%_100%,var(--glow),transparent)]">
          <span className="font-serif text-5xl italic tracking-[-0.02em] text-foreground/80 sm:text-7xl">
            {project.name}
          </span>
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
            Preview in the works
          </span>
        </div>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10" />
    </motion.div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const flipped = index % 2 === 1;
  const status = STATUS[project.status];

  return (
    <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div className={cn("lg:col-span-7", flipped && "lg:order-2")}>
        <Link
          href={`/work/${project.slug}`}
          aria-label={`Read the ${project.name} case study`}
          className="block rounded-[1.75rem]"
        >
          <TiltedCard caption="Case study ↗">
            <ProjectVisual project={project} />
          </TiltedCard>
        </Link>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerContainer}
        className={cn("lg:col-span-5", flipped && "lg:order-1")}
      >
        <motion.div variants={fadeUp} className="flex items-center justify-between gap-4">
          <span className="font-mono text-xs text-muted-foreground tabular">
            <span className="text-foreground">{String(index + 1).padStart(2, "0")}</span>
            {" / "}
            {String(projects.length).padStart(2, "0")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
            <span
              className={cn("h-1.5 w-1.5 rounded-full", status.live ? "live-dot bg-primary" : "bg-foreground/50")}
              aria-hidden
            />
            {status.label}
          </span>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-8 font-serif text-xl italic text-primary">
          {project.tagline}
        </motion.p>
        <motion.h3
          variants={fadeUp}
          className="mt-2 text-balance font-heading text-3xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-4xl"
        >
          {project.name}
        </motion.h3>
        <motion.p
          variants={fadeUp}
          className="mt-4 font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground"
        >
          {project.role}
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="mt-6 line-clamp-4 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground"
        >
          {project.description}
        </motion.p>

        {project.metrics && (
          <motion.div variants={fadeUp} className="mt-6">
            <MetricTiles metrics={project.metrics} />
          </motion.div>
        )}

        <motion.ul variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-md border border-border px-2.5 py-1 font-mono text-[0.6875rem] text-muted-foreground">
              {tag}
            </li>
          ))}
        </motion.ul>

        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
          <MagneticButton
            href={`/work/${project.slug}`}
            variant="solid"
            icon={<ArrowRight className="h-4 w-4" strokeWidth={1.5} />}
          >
            Case study
          </MagneticButton>
          {project.liveUrl && (
            <MagneticButton href={project.liveUrl} variant="ghost" icon={<ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />}>
              Open site
            </MagneticButton>
          )}
          {project.codeUrl && (
            <MagneticButton href={project.codeUrl} variant="ghost">
              <GithubIcon className="h-4 w-4" /> Source
            </MagneticButton>
          )}
        </motion.div>
      </motion.div>
    </article>
  );
}

export function WorkGallery() {
  return (
    <section id="work" className="relative mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-2">
        <SectionHeading
          index="02"
          eyebrow="Selected work"
          title="Things I've"
          accent="built"
          description="Systems, mobile apps, and web platforms — from freelance client work to capstone research."
        />
        {githubProfile && (
          <a
            href={githubProfile}
            target="_blank"
            rel="noreferrer"
            className="link-underline mb-10 inline-flex items-center gap-1.5 pb-1 text-sm font-medium sm:mb-14"
          >
            More on GitHub <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </a>
        )}
      </div>

      <div className="flex flex-col gap-20 sm:gap-28">
        {projects.map((project, i) => (
          <ProjectRow key={project.slug} project={project} index={i} />
        ))}
      </div>

    </section>
  );
}
