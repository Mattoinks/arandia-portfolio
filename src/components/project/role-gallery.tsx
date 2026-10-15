"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Monitor,
  Smartphone,
  X,
} from "lucide-react";
import type { Project, ProjectGalleryGroup, ProjectShot } from "@/lib/data";
import { EASE, EASE_OUT, fadeUp, viewport } from "@/lib/motion";
import { lockScroll } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n + 1).padStart(2, "0");

/** True when most of a role's screens are from the mobile app. */
const isApp = (shots: ProjectShot[]) =>
  shots.filter((s) => s.kind === "mobile").length > shots.length / 2;

/**
 * A guided tour of the system, one tab per user role (e.g. Admin / Nurse /
 * Family). Desktop: a numbered list of screens beside a large preview — web
 * screens in a browser frame, app screens on a three-phone stage. Phones and
 * tablets: a swipeable carousel. Every screen opens full-size in a viewer.
 */
export function RoleGallery({ project }: { project: Project }) {
  const groups = (project.galleryGroups ?? []).filter((g) =>
    project.gallery?.some((s) => s.group === g.id),
  );
  const [active, setActive] = useState(groups[0]?.id);
  const [viewer, setViewer] = useState<number | null>(null);

  const group = groups.find((g) => g.id === active) ?? groups[0];
  if (!group) return null;
  const shots = (project.gallery ?? []).filter((s) => s.group === group.id);

  return (
    <section className="mt-20" aria-labelledby="gallery">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={fadeUp}
        className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h2
            id="gallery"
            className="font-heading text-3xl font-medium tracking-[-0.04em] sm:text-4xl"
          >
            In{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-primary">
              the wild
            </span>
          </h2>
          <p className="mt-3 max-w-md text-[0.9375rem] text-muted-foreground">
            One system, {groups.length} roles — each sees only what their job
            needs.
          </p>
        </div>
        <RoleTabs
          project={project}
          groups={groups}
          active={group.id}
          onChange={setActive}
        />
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={group.id}
          id={`panel-${group.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${group.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="mt-8"
        >
          <RoleIntro group={group} shots={shots} />
          <Tour shots={shots} group={group} onOpen={setViewer} />
          <Carousel shots={shots} group={group} onOpen={setViewer} />
        </motion.div>
      </AnimatePresence>

      <Viewer shots={shots} index={viewer} onChange={setViewer} />
    </section>
  );
}

function RoleTabs({
  project,
  groups,
  active,
  onChange,
}: {
  project: Project;
  groups: ProjectGalleryGroup[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Screens by role"
      className="inline-flex w-full rounded-full border border-border bg-card p-1 sm:w-auto"
    >
      {groups.map((g) => {
        const selected = g.id === active;
        const groupShots =
          project.gallery?.filter((s) => s.group === g.id) ?? [];
        const Icon = isApp(groupShots) ? Smartphone : Monitor;
        return (
          <button
            key={g.id}
            type="button"
            role="tab"
            id={`tab-${g.id}`}
            aria-selected={selected}
            aria-controls={`panel-${g.id}`}
            onClick={() => onChange(g.id)}
            className={cn(
              "relative flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 sm:flex-none sm:px-5",
              selected
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {selected && (
              <motion.span
                layoutId="role-tab"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
              />
            )}
            <span className="relative inline-flex items-center justify-center gap-2">
              <Icon
                className="hidden h-3.5 w-3.5 sm:block"
                strokeWidth={1.5}
                aria-hidden
              />
              {g.label}
              <span
                className={cn(
                  "font-mono text-[0.625rem] tabular",
                  selected ? "opacity-80" : "opacity-60",
                )}
              >
                {groupShots.length}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function RoleIntro({
  group,
  shots,
}: {
  group: ProjectGalleryGroup;
  shots: ProjectShot[];
}) {
  const Icon = isApp(shots) ? Smartphone : Monitor;
  return (
    <div className="flex flex-col gap-2 border-y border-border py-5 sm:flex-row sm:items-center sm:gap-6">
      <span className="inline-flex shrink-0 items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-primary">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        {group.label} · {group.platform}
      </span>
      <p className="text-[0.9375rem] text-muted-foreground">
        {group.description}
      </p>
    </div>
  );
}

/* ---------- Frames ---------- */

function BrowserFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-[0_40px_80px_-48px_rgb(var(--shadow-tint)/0.7)]">
      <div className="flex h-9 items-center gap-3 border-b border-border bg-foreground/[0.03] px-4">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        </span>
        <span className="mx-auto truncate rounded-full bg-background/70 px-3 py-0.5 font-mono text-[0.625rem] text-muted-foreground">
          {label}
        </span>
        <span className="w-[2.625rem]" aria-hidden />
      </div>
      <div className="relative aspect-[16/9] bg-muted">{children}</div>
    </div>
  );
}

function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[2.4rem] border-[6px] border-foreground/10 bg-background p-1 shadow-[0_32px_64px_-32px_rgb(var(--shadow-tint)/0.7)]",
        className,
      )}
    >
      <div className="relative aspect-[9/19] overflow-hidden rounded-[1.95rem] bg-muted">
        {children}
      </div>
    </div>
  );
}

function ExpandHint() {
  return (
    <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
      <Maximize2 className="h-3 w-3" strokeWidth={1.5} aria-hidden />
      Expand
    </span>
  );
}

/* ---------- Desktop: screen list + large preview ---------- */

function Tour({
  shots,
  group,
  onOpen,
}: {
  shots: ProjectShot[];
  group: ProjectGalleryGroup;
  onOpen: (i: number) => void;
}) {
  const [current, setCurrent] = useState(0);
  const shot = shots[current];
  const step = (dir: 1 | -1) =>
    setCurrent((current + dir + shots.length) % shots.length);

  return (
    <div className="mt-10 hidden gap-10 lg:grid lg:grid-cols-12">
      <ol className="lg:col-span-4" aria-label={`${group.label} screens`}>
        {shots.map((s, i) => {
          const selected = i === current;
          return (
            <li key={s.src}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-current={selected ? "true" : undefined}
                className={cn(
                  "relative w-full cursor-pointer rounded-2xl px-5 py-3.5 text-left transition-colors duration-300",
                  selected ? "bg-card" : "hover:bg-foreground/[0.03]",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId={`tour-bar-${group.id}`}
                    className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-primary"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                  />
                )}
                <span className="flex items-baseline gap-3">
                  <span
                    className={cn(
                      "font-mono text-[0.6875rem] tabular",
                      selected ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {pad(i)}
                  </span>
                  <span
                    className={cn(
                      "font-heading text-[1.0625rem] font-medium tracking-[-0.02em] transition-colors duration-300",
                      selected ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.title ?? s.alt}
                  </span>
                </span>
                <AnimatePresence initial={false}>
                  {selected && s.title && (
                    <motion.span
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                      className="block overflow-hidden pl-[1.875rem] text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="block pt-1.5">{s.alt}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="lg:col-span-8">
        {shot.kind === "mobile" ? (
          <PhoneStage
            shots={shots}
            current={current}
            onSelect={setCurrent}
            onOpen={onOpen}
          />
        ) : (
          <button
            type="button"
            onClick={() => onOpen(current)}
            aria-label={`View ${shot.title ?? "screenshot"} full size`}
            className="group relative block w-full cursor-zoom-in text-left"
          >
            <BrowserFrame label={`${group.label} portal`}>
              {/* Every screen stays mounted and cross-fades, so switching is instant. */}
              {shots.map((s, i) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={i === current ? s.alt : ""}
                  fill
                  quality={95}
                  sizes="(max-width: 1280px) 66vw, 860px"
                  className={cn(
                    "object-cover object-top transition-opacity duration-500 ease-out-strong",
                    i === current ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              <ExpandHint />
            </BrowserFrame>
          </button>
        )}
        <div className="mt-4 flex items-center justify-between font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
          <span className="tabular">
            <span className="text-primary">{pad(current)}</span> /{" "}
            {pad(shots.length - 1)}
          </span>
          <span className="flex gap-2">
            <StepButton dir={-1} onClick={() => step(-1)} />
            <StepButton dir={1} onClick={() => step(1)} />
          </span>
        </div>
      </div>
    </div>
  );
}

function StepButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  const Icon = dir === 1 ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? "Next screen" : "Previous screen"}
      className="press flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-foreground/25"
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );
}

/** The current phone in front, its neighbours tucked behind — click one to bring it forward. */
function PhoneStage({
  shots,
  current,
  onSelect,
  onOpen,
}: {
  shots: ProjectShot[];
  current: number;
  onSelect: (i: number) => void;
  onOpen: (i: number) => void;
}) {
  const n = shots.length;
  return (
    <div className="relative h-[36rem] overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(60%_55%_at_50%_100%,var(--glow),transparent)]">
      {shots.map((s, i) => {
        // Shortest signed distance around the loop, so the stage wraps.
        let offset = i - current;
        if (offset > n / 2) offset -= n;
        if (offset < -n / 2) offset += n;
        const visible = Math.abs(offset) <= 1;
        const front = offset === 0;
        return (
          <motion.button
            key={s.src}
            type="button"
            tabIndex={visible ? 0 : -1}
            aria-hidden={!visible}
            aria-label={
              front
                ? `View ${s.title ?? "screen"} full size`
                : `Show ${s.title ?? "screen"}`
            }
            onClick={() => (front ? onOpen(i) : onSelect(i))}
            initial={false}
            animate={{
              x: `${offset * 64}%`,
              scale: front ? 1 : 0.8,
              opacity: front ? 1 : visible ? 0.4 : 0,
            }}
            transition={{ type: "spring", duration: 0.55, bounce: 0.12 }}
            style={{ zIndex: front ? 3 : visible ? 2 : 1 }}
            className={cn(
              "group absolute left-1/2 top-1/2 -ml-[7.5rem] -mt-[16.4rem] w-[15rem]",
              front ? "cursor-zoom-in" : "cursor-pointer",
              !visible && "pointer-events-none",
            )}
          >
            <PhoneFrame>
              <Image
                src={s.src}
                alt={front ? s.alt : ""}
                fill
                quality={95}
                sizes="240px"
                className="object-cover object-top"
              />
              {front && <ExpandHint />}
            </PhoneFrame>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ---------- Phones and tablets: swipe carousel ---------- */

function Carousel({
  shots,
  group,
  onOpen,
}: {
  shots: ProjectShot[];
  group: ProjectGalleryGroup;
  onOpen: (i: number) => void;
}) {
  return (
    <div className="mt-8 lg:hidden">
      <ol
        aria-label={`${group.label} screens`}
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 sm:scroll-px-10 [scrollbar-width:none] sm:-mx-10 sm:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {shots.map((s, i) => {
          const app = s.kind === "mobile";
          return (
            <li
              key={s.src}
              className={cn(
                "shrink-0 snap-start",
                app ? "w-[62vw] max-w-[15rem]" : "w-[86vw] max-w-[36rem]",
              )}
            >
              <button
                type="button"
                onClick={() => onOpen(i)}
                aria-label={`View ${s.title ?? "screenshot"} full size`}
                className="relative block w-full cursor-zoom-in text-left"
              >
                {app ? (
                  <PhoneFrame>
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      quality={95}
                      sizes="62vw"
                      className="object-cover object-top"
                    />
                  </PhoneFrame>
                ) : (
                  <BrowserFrame label={`${group.label} portal`}>
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      quality={95}
                      sizes="86vw"
                      className="object-cover object-top"
                    />
                  </BrowserFrame>
                )}
              </button>
              <p className="mt-4 flex items-baseline gap-2.5">
                <span className="font-mono text-[0.6875rem] text-primary tabular">
                  {pad(i)}
                </span>
                <span className="font-heading text-base font-medium tracking-[-0.02em]">
                  {s.title ?? s.alt}
                </span>
              </p>
              {s.title && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {s.alt}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
        Swipe · tap to expand
      </p>
    </div>
  );
}

/** Full-size viewer: ←/→ to browse, Esc or the backdrop to close. */
function Viewer({
  shots,
  index,
  onChange,
}: {
  shots: ProjectShot[];
  index: number | null;
  onChange: (i: number | null) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const isOpen = index !== null;
  const shot = isOpen ? shots[index] : null;

  const step = useCallback(
    (dir: 1 | -1) =>
      index !== null && onChange((index + dir + shots.length) % shots.length),
    [index, onChange, shots.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    lockScroll(true);
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      lockScroll(false);
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onChange, step]);

  // Portaled to <body>: the page content is its own stacking context, which
  // would otherwise keep the viewer under the chat launcher.
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {shot && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={shot.title ?? shot.alt}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="fixed inset-0 z-[300] flex flex-col bg-background/92 backdrop-blur-md"
          onClick={() => onChange(null)}
        >
          <div
            className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="min-w-0 truncate text-sm">
              <span className="font-mono text-[0.6875rem] text-primary tabular">
                {pad(index)} / {pad(shots.length - 1)}
              </span>
              <span className="ml-3 font-medium">{shot.title}</span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={() => onChange(null)}
              aria-label="Close"
              className="press flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-card"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={shot.src}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="relative h-full w-full max-w-6xl touch-pan-y"
                onClick={(e) => e.stopPropagation()}
                // Swipe between screenshots on touch screens.
                drag={shots.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) step(1);
                  else if (info.offset.x > 60) step(-1);
                }}
              >
                {/* Original file, untouched — the place to read the fine print. */}
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
            {shots.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => (e.stopPropagation(), step(-1))}
                  aria-label="Previous screenshot"
                  className="press absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-card sm:left-6 sm:flex"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={(e) => (e.stopPropagation(), step(1))}
                  aria-label="Next screenshot"
                  className="press absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-card sm:right-6 sm:flex"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>

          <p
            className="mx-auto max-w-2xl px-6 pb-6 pt-4 text-center text-sm text-muted-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {shot.alt}
            {shots.length > 1 && (
              <span className="mt-1 block text-xs opacity-70 sm:hidden">
                Swipe for more
              </span>
            )}
          </p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
