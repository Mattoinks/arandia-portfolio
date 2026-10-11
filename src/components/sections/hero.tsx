"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SplitText } from "@/components/reactbits/split-text";
import { LogoLoop } from "@/components/reactbits/logo-loop";
import { PADDED_SKILL_ICONS, SKILL_ICON_SRC } from "@/components/icons/tech-icons";
import { useTypewriter } from "@/hooks/use-typewriter";
import { profile, skillGroups } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, delay, ease: EASE },
});

function NameMarquee() {
  const label = profile.name.toUpperCase();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-[22%] overflow-hidden lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2"
    >
      <div className="marquee-track" style={{ "--marquee-duration": "60s" } as React.CSSProperties}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="mx-[3vw] whitespace-nowrap font-heading text-[18vw] font-medium leading-none tracking-[-0.05em] text-transparent"
            style={{ WebkitTextStroke: "1px var(--muted-foreground)", opacity: 0.22 }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

const TOOLS = skillGroups.flatMap((g) => g.items);

function ToolLoop() {
  return (
    <LogoLoop
      items={TOOLS}
      getKey={(t) => t.name}
      ariaLabel="Tools I work with"
      speed={36}
      gap={36}
      hoverSpeed={8}
      className="py-4"
      renderItem={(tool) => (
        <span className="flex items-center gap-2.5">
          <span className="relative h-6 w-6 overflow-hidden rounded-[7px] bg-white ring-1 ring-black/5">
            {SKILL_ICON_SRC[tool.icon] && (
              <Image
                src={SKILL_ICON_SRC[tool.icon]}
                alt=""
                fill
                sizes="24px"
                className={PADDED_SKILL_ICONS.has(tool.icon) ? "object-contain p-1" : "object-contain"}
              />
            )}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{tool.name}</span>
        </span>
      )}
    />
  );
}

/**
 * Owns the typewriter state so its ~18 updates a second re-render this line
 * only — not the whole hero with its photo, scroll transforms and split text.
 */
function Typewriter() {
  const typed = useTypewriter({ words: profile.taglines });
  return (
    <div className="mt-5 flex h-6 items-center gap-2 font-mono text-sm text-muted-foreground">
      <span className="text-primary" aria-hidden>
        ~/
      </span>
      <span className="text-foreground">{typed}</span>
      <span className="inline-block h-4 w-[2px] animate-pulse bg-primary" aria-hidden />
    </div>
  );
}

const BADGE_INTERVAL = 2800;

/**
 * Cycles through the availability statuses. Sized to the longest phrase (an
 * invisible stack underneath) so the pill never jumps in width, and owns its
 * own state so each swap re-renders only the badge.
 */
function AvailabilityBadge() {
  const statuses = profile.availability;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % statuses.length);
    }, BADGE_INTERVAL);
    return () => clearInterval(id);
  }, [statuses.length, paused]);

  return (
    <span
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="inline-flex items-center gap-3 rounded-full border border-border bg-card py-1 pl-1 pr-3.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]"
    >
      {/* Status chip */}
      <span className="inline-flex items-center gap-2 rounded-full bg-primary/12 px-2.5 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-primary">
        <span className="live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
        Available
      </span>

      <span className="sr-only">{profile.greeting}</span>

      {/* Rotating status — sized to the longest phrase so the pill never jumps */}
      <span aria-hidden className="grid overflow-hidden text-[0.8125rem] leading-5 text-foreground">
        {statuses.map((s) => (
          <span key={s} className="invisible col-start-1 row-start-1 whitespace-nowrap">
            {s}
          </span>
        ))}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={statuses[index]}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: "80%", filter: "blur(4px)" }}
            animate={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: "-80%", filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="col-start-1 row-start-1 whitespace-nowrap"
          >
            {statuses[index]}
          </motion.span>
        </AnimatePresence>
      </span>

      {/* Progress ticks: which status is showing */}
      <span aria-hidden className="hidden items-center gap-1 sm:flex">
        {statuses.map((s, i) => (
          <span
            key={s}
            className={cn(
              "h-1 rounded-full transition-all duration-500 ease-out-strong",
              i === index ? "w-3.5 bg-primary" : "w-1 bg-foreground/20",
            )}
          />
        ))}
      </span>
    </span>
  );
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 90]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -40]);

  const [firstName, ...restName] = profile.name.split(" ");
  const [headlineLead, headlineAccent] = profile.headline.split(" & ");

  return (
    <section ref={heroRef} id="top" className="relative flex min-h-svh flex-col overflow-hidden pt-24 lg:h-svh lg:min-h-[35rem] lg:pt-[5.25rem]">
      <NameMarquee />

      <div className="relative mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-rows-[auto_minmax(18rem,1fr)] px-6 sm:px-10 lg:grid-cols-12 lg:grid-rows-1">
        {/* Copy */}
        <motion.div
          style={{ y: copyY }}
          className="relative z-20 flex flex-col justify-center pt-10 pb-6 lg:col-span-7 lg:pb-[4svh] lg:pt-0"
        >
          <motion.div {...rise(0.1)} className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <AvailabilityBadge />
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              Dasmariñas, PH
              <span className="text-border" aria-hidden>
                ·
              </span>
              <span className="text-foreground/80">GMT+8</span>
            </span>
          </motion.div>

          <h1 className="mt-8 font-heading text-[clamp(3rem,min(6.4vw,10.5svh),5.75rem)] lg:mt-[3svh] font-medium leading-[0.9] tracking-[-0.055em]">
            <SplitText text={firstName} trigger="load" startDelay={0.2} className="block pb-[0.08em]" />{" "}
            <SplitText text={restName.join(" ")} trigger="load" startDelay={0.35} className="block pb-[0.08em]" />
          </h1>

          <motion.p
            {...rise(0.55)}
            className="mt-8 max-w-xl text-balance text-xl lg:mt-[3svh] leading-snug text-muted-foreground sm:text-2xl"
          >
            <span className="text-foreground">{headlineLead}</span>
            {headlineAccent && (
              <>
                {" "}&amp;{" "}
                <span className="font-serif italic text-foreground">{headlineAccent}</span>
              </>
            )}
          </motion.p>

          <motion.div {...rise(0.65)}>
            <Typewriter />
          </motion.div>

          <motion.div {...rise(0.75)} className="mt-10 flex flex-wrap items-center gap-3 lg:mt-[4svh]">
            <MagneticButton href="#work" icon={<ArrowDownRight className="h-4 w-4" strokeWidth={1.5} />}>
              View selected work
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost" icon={<ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />}>
              Get in touch
            </MagneticButton>
          </motion.div>

          <motion.p {...rise(0.85)} className="mt-10 font-mono text-[0.6875rem] uppercase lg:mt-[3.5svh] tracking-[0.14em] text-muted-foreground">
            {profile.role}
          </motion.p>
        </motion.div>

        {/* Photo — bottom-anchored cutout, fades into the page at its base */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
          className="relative z-10 min-h-0 lg:col-span-5 lg:-mr-10"
        >
          {/* Glow lives outside the masked layer — a mask would clip its blur to a hard box. */}
          <div
            aria-hidden
            className="absolute bottom-0 left-1/2 aspect-square w-[80%] -translate-x-1/2 translate-y-1/4 rounded-full bg-primary/20 blur-[6.25rem]"
          />
          <motion.div
            style={{ y: photoY }}
            className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_78%,transparent)]"
          >
            <Image
              src={profile.avatarCutout}
              alt={`Portrait of ${profile.name}`}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-contain object-bottom"
              loading="eager"
              fetchPriority="high"
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-24 right-6 z-20 hidden flex-col items-center gap-3 sm:flex">
        <span
          className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <span className="scroll-cue h-14 w-px bg-border" aria-hidden />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-20 bg-background"
      >
        <div className="border-y border-border">
          <ToolLoop />
        </div>
      </motion.div>
    </section>
  );
}
