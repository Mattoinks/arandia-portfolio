"use client";

import { useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, ImageOff, Layers } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GithubIcon } from "@/components/icons/brand-icons";
import { ProjectModal } from "@/components/project-modal";
import { cn } from "@/lib/utils";
import { projects, socials, type Project } from "@/lib/data";
import { blurPlaceholders } from "@/lib/blur-placeholders";

const githubProfile = socials.find((s) => s.icon === "github")?.href;
const SWIPE_THRESHOLD = 60;

export function WorkGallery() {
  const [active, setActive] = useState(0);
  const [deepDive, setDeepDive] = useState<Project | null>(null);
  const project = projects[active];

  const next = () => setActive((a) => (a + 1) % projects.length);
  const prev = () => setActive((a) => (a - 1 + projects.length) % projects.length);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) next();
    else if (info.offset.x > SWIPE_THRESHOLD) prev();
  };

  return (
    <section id="work" className="relative mx-auto max-w-7xl px-6 py-28 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Selected Work"
          title="Work Gallery"
          description="A collection of systems, mobile apps, and web projects I've built."
        />
        {githubProfile && (
          <MagneticButton href={githubProfile} variant="light">
            View More Projects <ExternalLink className="h-4 w-4" strokeWidth={2} />
          </MagneticButton>
        )}
      </div>

      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative h-72 select-none focus:outline-none sm:h-[26rem]"
        role="region"
        aria-roledescription="carousel"
        aria-label="Project gallery — use arrow keys or drag to browse"
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {projects.map((p, i) => {
            const n = projects.length;
            let diff = i - active;
            if (diff > n / 2) diff -= n;
            if (diff < -n / 2) diff += n;
            const isActive = diff === 0;
            return (
              <motion.button
                key={p.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${p.name}`}
                aria-current={isActive}
                data-cursor="hover"
                initial={false}
                animate={{
                  x: diff * 190,
                  y: Math.abs(diff) * 14,
                  rotate: diff * 5,
                  scale: isActive ? 1 : 0.86,
                  opacity: Math.abs(diff) > 2 ? 0 : isActive ? 1 : 0.75,
                  filter: isActive ? "brightness(1)" : "brightness(0.82)",
                  zIndex: 10 - Math.abs(diff),
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="glass glow-border absolute left-1/2 top-1/2 h-64 w-[22rem] -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-2xl sm:h-96 sm:w-[34rem]"
                style={{ pointerEvents: Math.abs(diff) > 2 ? "none" : "auto" }}
              >
                {p.thumbnail ? (
                  <Image
                    src={p.thumbnail}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 352px, 544px"
                    className="pointer-events-none object-cover"
                    placeholder={blurPlaceholders[p.slug] ? "blur" : "empty"}
                    blurDataURL={blurPlaceholders[p.slug]}
                    priority={isActive}
                  />
                ) : (
                  <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/15 to-accent/10 text-muted-foreground">
                    <ImageOff className="h-6 w-6" strokeWidth={1.5} />
                    <span className="font-mono text-xs">Preview coming soon</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous project"
          className="glass flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-90 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to ${p.name}`}
              aria-current={i === active}
              className={cn(
                "h-2 rounded-full transition-all cursor-pointer active:scale-90",
                i === active ? "w-6 bg-primary" : "w-2 bg-foreground/20 hover:bg-foreground/40",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next project"
          className="glass flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-90 cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mx-auto mt-10 max-w-4xl text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-balance mt-4 font-heading text-3xl font-bold leading-tight sm:text-4xl">
            {project.name}
          </h3>
          <p className="mt-2 text-base font-medium text-muted-foreground sm:text-lg">
            {project.tagline}
          </p>
          <p className="mt-2 font-mono text-sm uppercase tracking-[0.15em] text-primary">
            {project.role}
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground/80 sm:text-lg">
            {project.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {project.liveUrl && (
              <MagneticButton href={project.liveUrl}>
                View Project <ExternalLink className="h-4 w-4" strokeWidth={2} />
              </MagneticButton>
            )}
            {project.codeUrl && (
              <MagneticButton href={project.codeUrl} variant="ghost">
                <GithubIcon className="h-4 w-4" /> View Code
              </MagneticButton>
            )}
            {project.architecture && (
              <button
                type="button"
                onClick={() => setDeepDive(project)}
                data-cursor="hover"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground active:scale-95 cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5" strokeWidth={2} /> Deep-Dive
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <ProjectModal project={deepDive} onClose={() => setDeepDive(null)} />
    </section>
  );
}
