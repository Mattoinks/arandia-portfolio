"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpRight, Database, GitBranch, Layers, Smartphone, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/icons/brand-icons";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Surface } from "@/components/ui/surface";
import { TextReveal } from "@/components/ui/text-reveal";
import { TiltedCard } from "@/components/reactbits/tilted-card";
import { MetricTiles } from "@/components/project/metric-tiles";
import { RoleGallery } from "@/components/project/role-gallery";
import { blurPlaceholders } from "@/lib/blur-placeholders";
import { OPEN_ASSISTANT_EVENT } from "@/lib/contact-prefill";
import { publishedNotes } from "@/lib/notes";
import type { Project, ProjectShot } from "@/lib/data";
import { EASE, fadeUp, staggerContainer, viewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STATUS: Record<Project["status"], { label: string; live: boolean }> = {
  production: { label: "Live", live: true },
  completed: { label: "Completed", live: false },
  "in-progress": { label: "In progress", live: true },
  archived: { label: "Archived", live: false },
};

/** "Try it on your phone": scan the QR code, or download directly. Phones get just the button. */
function AndroidDownload({ project, qr }: { project: Project; qr?: string }) {
  const android = project.android;
  if (!android) return null;
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={fadeUp}
      aria-labelledby="android-app"
      className="mt-10 grid gap-8 border-y border-border py-10 lg:grid-cols-12 lg:gap-10"
    >
      <div className="lg:col-span-5">
        <p className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
          <Smartphone className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Android app
        </p>
        <h2 id="android-app" className="mt-3 font-heading text-3xl font-medium tracking-[-0.04em]">
          Try it on your <span className="font-serif font-normal italic tracking-[-0.02em] text-primary">phone</span>
        </h2>
        <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-muted-foreground">
          {android.playStoreUrl
            ? `Install ${project.name} from Google Play, or download the APK directly.`
            : `Install the ${project.name} Android app directly — the Google Play version is in review.`}
        </p>
      </div>

      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center lg:col-span-7 lg:justify-end">
        {qr && (
          <>
            {/* Scanning only makes sense from another screen, so phones skip straight to the link. */}
            <figure className="hidden shrink-0 flex-col items-center gap-3 sm:flex">
              <div
                className="h-[10.5rem] w-[10.5rem] rounded-[1.25rem] bg-white p-3.5 shadow-[0_24px_48px_-28px_rgb(var(--shadow-tint)/0.6)] [&>svg]:h-full [&>svg]:w-full"
                role="img"
                aria-label={`QR code to download the ${project.name} Android app`}
                dangerouslySetInnerHTML={{ __html: qr }}
              />
              <figcaption className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                Scan with Android
              </figcaption>
            </figure>
            <span
              aria-hidden
              className="hidden items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground sm:flex sm:flex-col"
            >
              <span className="h-10 w-px bg-border" />
              or
              <span className="h-10 w-px bg-border" />
            </span>
          </>
        )}
        <div className="flex flex-col items-start gap-3">
          <MagneticButton
            href={`/apk/${project.slug}`}
            download
            icon={<ArrowDownToLine className="h-4 w-4" strokeWidth={1.5} />}
          >
            Download APK
          </MagneticButton>
          <p className="font-mono text-[0.6875rem] text-muted-foreground tabular">
            {android.size ? `${android.size} · ` : ""}Android APK
          </p>
          {android.playStoreUrl ? (
            <a href={android.playStoreUrl} className="link-underline pb-0.5 text-sm font-medium">
              Get it on Google Play
            </a>
          ) : (
            <p className="max-w-[16rem] text-xs leading-relaxed text-muted-foreground">
              Android may ask you to allow installs from your browser — that&apos;s normal for apps outside Google Play.
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
}

/** Starter questions on every case study — Matte gets the page's project details with them. */
const PROJECT_QUESTIONS = ["How does it work?", "What did Matthew build?", "What tech was used?"];

const askMatte = (question: string) =>
  window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT, { detail: { question } }));

/** "Ask Matte about this project" — sits after the case study, before prev/next. */
function AskAboutProject({ project }: { project: Project }) {
  const label = project.name.length > 24 ? `the ${project.tagline} project` : project.name;
  const note = publishedNotes.find((n) => n.project === project.slug);
  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={fadeUp}
      aria-label={`Ask about ${label}`}
      className="mt-24 flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-center md:justify-between"
    >
      <div className="flex items-center gap-4">
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-primary">
          <Image src="/assets/avatar/assistant-icon-v4.webp" alt="" fill sizes="48px" className="object-cover" />
        </span>
        <div>
          <p className="font-heading text-xl font-medium tracking-[-0.02em]">Questions about {label}?</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Ask Matte, Matthew&apos;s AI assistant — it knows this project.
            {note && (
              <>
                {" "}Or{" "}
                <Link href={`/notes/${note.slug}`} className="link-underline pb-0.5 text-foreground">
                  read the write-up
                </Link>
                .
              </>
            )}
          </p>
        </div>
      </div>
      <ul className="flex flex-wrap gap-2">
        {PROJECT_QUESTIONS.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => askMatte(q)}
              className="press inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors duration-300 hover:border-primary/40 hover:text-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} aria-hidden />
              {q}
            </button>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

const ARCHITECTURE = [
  { key: "database", label: "Database design", icon: Database },
  { key: "workflow", label: "System workflow", icon: GitBranch },
  { key: "logic", label: "Logic structure", icon: Layers },
] as const;

interface ProjectDetailProps {
  project: Project;
  index: number;
  total: number;
  prev: Project;
  next: Project;
  /** Build-time SVG markup of the QR code for `project.android.apkUrl`. */
  apkQr?: string;
}

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[2rem] bg-foreground/[0.025] p-1.5 ring-1 ring-border dark:bg-white/[0.02]", className)}>
      <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-muted">{children}</div>
    </div>
  );
}

function Cover({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
    >
      <TiltedCard rotateAmplitude={3} scaleOnHover={1.01}>
        <Frame>
          <div className="relative aspect-video">
            {project.thumbnail ? (
              <Image
                src={project.thumbnail}
                alt={`${project.name} — interface screenshot`}
                fill
                sizes="(max-width: 1280px) 100vw, 1200px"
                quality={95}
                className="object-cover object-top"
                placeholder={blurPlaceholders[project.slug] ? "blur" : "empty"}
                blurDataURL={blurPlaceholders[project.slug]}
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(80%_70%_at_50%_100%,var(--glow),transparent)]">
                <span className="font-serif text-6xl italic tracking-[-0.02em] text-foreground/80 sm:text-8xl">
                  {project.name}
                </span>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Preview in the works
                </span>
              </div>
            )}
          </div>
        </Frame>
      </TiltedCard>
    </motion.div>
  );
}

function GalleryShot({ shot }: { shot: ProjectShot }) {
  if (shot.kind === "mobile") {
    return (
      <figure className="flex w-[16.25rem] flex-col items-center gap-4">
        <div className="w-full rounded-[2.75rem] border-[7px] border-foreground/10 bg-background p-1 shadow-[0_32px_64px_-32px_rgb(var(--shadow-tint)/0.6)]">
          <div className="relative aspect-[415/852] overflow-hidden rounded-[2.2rem]">
            <Image src={shot.src} alt={shot.alt} fill sizes="300px" quality={95} className="object-cover object-top" />
          </div>
        </div>
        <figcaption className="text-balance text-center font-mono leading-relaxed text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
          {shot.alt}
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="flex flex-col gap-4">
      <Frame>
        <div className="relative aspect-video">
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            quality={95}
            className="object-cover object-top"
          />
        </div>
      </Frame>
      <figcaption className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">{shot.alt}</figcaption>
    </figure>
  );
}

export function ProjectDetail({ project, index, total, prev, next, apkQr }: ProjectDetailProps) {
  const status = STATUS[project.status];

  return (
    <article id="top" className="relative mx-auto max-w-7xl px-6 pb-16 pt-28 sm:px-10 sm:pt-32">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="grid gap-12 lg:grid-cols-12 lg:items-end"
      >
        <div className="lg:col-span-8">
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground tabular">
              <span className="text-foreground">{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
              <span className={cn("h-1.5 w-1.5 rounded-full", status.live ? "live-dot bg-primary" : "bg-foreground/50")} aria-hidden />
              {status.label}
            </span>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-10 font-serif text-2xl italic text-primary sm:text-3xl">
            {project.tagline}
          </motion.p>
          <h1 className="mt-3 text-balance font-heading text-5xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-7xl">
            <TextReveal text={project.name} immediate delay={0.15} />
          </h1>
        </div>

        <motion.dl variants={fadeUp} className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-6 lg:col-span-4">
          <div className="col-span-2">
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">Role</dt>
            <dd className="mt-1.5 text-sm">{project.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">Platform</dt>
            <dd className="mt-1.5 text-sm">{project.tags.join(" · ")}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">Status</dt>
            <dd className="mt-1.5 text-sm">{status.label}</dd>
          </div>
        </motion.dl>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        className="mt-10 flex flex-wrap gap-3"
      >
        {project.liveUrl && (
          <MagneticButton href={project.liveUrl} icon={<ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />}>
            Open site
          </MagneticButton>
        )}
        {project.android && (
          <MagneticButton href="#android-app" variant="ghost">
            <Smartphone className="h-4 w-4" strokeWidth={1.5} /> Android app
          </MagneticButton>
        )}
        {project.codeUrl && (
          <MagneticButton href={project.codeUrl} variant="ghost">
            <GithubIcon className="h-4 w-4" /> View source
          </MagneticButton>
        )}
      </motion.div>

      <div className="mt-14">
        <Cover project={project} />
      </div>

      {project.metrics && (
        <motion.section
          aria-label="Results"
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={fadeUp}
          className="mt-10"
        >
          <MetricTiles metrics={project.metrics} size="lg" className="sm:max-w-2xl" />
        </motion.section>
      )}

      <AndroidDownload project={project} qr={apkQr} />

      {/* Overview */}
      <section className="mt-20 grid gap-8 lg:grid-cols-12 lg:gap-10" aria-labelledby="overview">
        <motion.h2
          id="overview"
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={fadeUp}
          className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground lg:col-span-3 lg:pt-2"
        >
          Overview
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={fadeUp}
          className="text-pretty font-editorial text-xl font-light leading-[1.45] tracking-[-0.01em] text-foreground sm:text-2xl lg:col-span-9"
        >
          {project.description}
        </motion.p>
      </section>

      {/* Architecture */}
      {project.architecture && (
        <section className="mt-20" aria-labelledby="architecture">
          <motion.h2
            id="architecture"
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={fadeUp}
            className="font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl"
          >
            System <span className="font-serif font-normal italic tracking-[-0.02em] text-primary">architecture</span>
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={staggerContainer}
            className="mt-10 grid gap-4 md:grid-cols-3"
          >
            {ARCHITECTURE.map(({ key, label, icon: Icon }) => (
              <motion.div key={key} variants={fadeUp}>
                <Surface as="article" className="flex h-full flex-col p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60">
                    <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 text-lg font-medium tracking-[-0.02em]">{label}</h3>
                  <p className="mt-3 text-pretty font-mono text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {project.architecture![key]}
                  </p>
                </Surface>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Gallery — split by user role when the project defines roles */}
      {project.galleryGroups?.length ? (
        <RoleGallery project={project} />
      ) : project.gallery && project.gallery.length > 0 && (
        <section className="mt-20" aria-labelledby="gallery">
          <motion.h2
            id="gallery"
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={fadeUp}
            className="font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl"
          >
            In <span className="font-serif font-normal italic tracking-[-0.02em] text-primary">the wild</span>
          </motion.h2>
          <div className="mt-10 space-y-10">
            {project.gallery
              .filter((shot) => shot.kind === "desktop")
              .map((shot) => (
                <motion.div key={shot.src} initial="hidden" whileInView="show" viewport={viewport} variants={fadeUp}>
                  <GalleryShot shot={shot} />
                </motion.div>
              ))}
            {project.gallery.some((shot) => shot.kind === "mobile") && (
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                variants={staggerContainer}
                className="flex flex-wrap items-start justify-center gap-x-8 gap-y-14 rounded-[2rem] border border-border bg-[radial-gradient(60%_60%_at_50%_100%,var(--glow),transparent)] px-6 py-14 sm:py-20"
              >
                {project.gallery
                  .filter((shot) => shot.kind === "mobile")
                  .map((shot) => (
                    <motion.div key={shot.src} variants={fadeUp}>
                      <GalleryShot shot={shot} />
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      <AskAboutProject project={project} />

      {/* Prev / next */}
      <nav aria-label="More projects" className="mt-12 grid gap-4 border-t border-border pt-10 md:grid-cols-12">
        <Link
          href={`/work/${prev.slug}`}
          className="group flex flex-col justify-between rounded-[1.75rem] border border-border p-6 transition-colors duration-300 hover:border-foreground/25 md:col-span-4"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 ease-out-strong group-hover:-translate-x-1" strokeWidth={1.5} />
            Previous
          </span>
          <span className="mt-8 font-heading text-xl font-medium tracking-[-0.03em]">{prev.name}</span>
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-border p-6 transition-colors duration-300 hover:border-foreground/25 md:col-span-8"
        >
          <span className="inline-flex items-center gap-2 self-end font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            Next project
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out-strong group-hover:translate-x-1" strokeWidth={1.5} />
          </span>
          <span className="mt-8 flex items-end justify-between gap-6">
            <span>
              <span className="block font-serif text-lg italic text-primary">{next.tagline}</span>
              <span className="mt-1 block font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl">{next.name}</span>
            </span>
            {next.thumbnail && (
              <span className="relative hidden aspect-video w-48 shrink-0 overflow-hidden rounded-xl border border-border sm:block">
                <Image
                  src={next.thumbnail}
                  alt=""
                  fill
                  sizes="192px"
                  className="object-cover object-top transition-transform duration-700 ease-out-strong group-hover:scale-105"
                />
              </span>
            )}
          </span>
        </Link>
      </nav>
    </article>
  );
}
