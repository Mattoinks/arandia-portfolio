"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { experience, type ExperienceEntry } from "@/lib/data";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/*
  Scroll-driven timeline: an orange line fills down the rail as you read, a
  glowing comet rides its tip, and each stop lights up as the comet reaches it.
  Everything animates transform/opacity only.
*/

function Stop({ item, index }: { item: ExperienceEntry; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  // Lit once this stop's top has crossed the reading line (45% down the
  // viewport) — stays lit after it scrolls away, un-lights when scrolling back.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.47", "start 0.43"] });
  const [lit, setLit] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setLit(v > 0.5));
  const ongoing = item.period === "Ongoing";
  const number = String(index + 1).padStart(2, "0");

  return (
    <li ref={ref} className="relative grid gap-3 pb-14 pl-12 last:pb-0 lg:grid-cols-4 lg:gap-10 lg:pl-0">
      {/* Meta column */}
      <motion.div
        initial={{ opacity: 0, transform: "translateY(16px)" }}
        whileInView={{ opacity: 1, transform: "translateY(0px)" }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="lg:pr-10 lg:pt-6 lg:text-right"
      >
        <p
          className={cn(
            "font-serif text-4xl italic leading-none transition-colors duration-700 tabular",
            lit ? "text-primary" : "text-muted-foreground/30",
          )}
        >
          {number}
        </p>
        <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">{item.type}</p>
        <p className={cn("mt-1.5 inline-flex items-center gap-2 text-sm", ongoing ? "text-primary" : "text-muted-foreground")}>
          {ongoing && <span className="live-dot h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />}
          {item.period}
        </p>
      </motion.div>

      {/* Node on the rail */}
      <span aria-hidden className="absolute left-[0.6875rem] top-7 -translate-x-1/2 lg:left-[25%]">
        <span
          className={cn(
            "relative flex h-[1.125rem] w-[1.125rem] items-center justify-center rounded-full border-2 bg-background transition-[border-color,transform] duration-500 ease-out-strong",
            lit ? "scale-110 border-primary" : "scale-100 border-border",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full bg-primary transition-[transform,opacity] duration-500 ease-out-strong",
              lit ? "scale-100 opacity-100" : "scale-0 opacity-0",
            )}
          />
          {/* One-shot ripple each time the stop lights up */}
          {lit && <span key="ripple" className="exp-ripple absolute inset-[-2px] rounded-full border-2 border-primary" />}
          {lit && ongoing && <span className="live-dot absolute inset-1 rounded-full bg-primary/60" />}
        </span>
      </span>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, transform: "translateY(24px)" }}
        whileInView={{ opacity: 1, transform: "translateY(0px)" }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.08 }}
        className="lg:col-span-3 lg:pl-10"
      >
        <div
          className={cn(
            "relative rounded-[1.5rem] border p-6 transition-[background-color,border-color,box-shadow,transform] duration-700 ease-out-strong sm:p-7",
            lit
              ? "-translate-y-0.5 border-primary/25 bg-card shadow-[0_24px_60px_-32px_var(--glow)]"
              : "border-transparent bg-transparent",
          )}
        >
          {/* Connector from rail to card */}
          <span
            aria-hidden
            className={cn(
              "absolute -left-12 top-[1.9rem] hidden h-px w-10 origin-left bg-primary/50 transition-transform duration-700 ease-out-strong lg:block",
              lit ? "scale-x-100" : "scale-x-0",
            )}
          />
          <h3 className="font-heading text-2xl font-medium tracking-[-0.03em] sm:text-[1.75rem]">{item.role}</h3>
          <p className="mt-1 font-serif text-lg italic text-primary">{item.org}</p>
          <p className="mt-3 max-w-2xl text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">{item.summary}</p>
          <ul className="mt-4 space-y-2">
            {item.points.map((pt, i) => (
              <li
                key={pt}
                className={cn(
                  "flex gap-3 text-[0.9375rem] leading-relaxed transition-[opacity,transform] duration-500 ease-out-strong",
                  lit ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-60",
                )}
                style={{ transitionDelay: lit ? `${120 + i * 70}ms` : "0ms" }}
              >
                <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                <span className="text-foreground/90">{pt}</span>
              </li>
            ))}
          </ul>
          {item.project && (
            <Link
              href={`/work/${item.project}`}
              className="link-underline mt-5 inline-flex items-center gap-1.5 pb-0.5 text-sm font-medium"
            >
              Case study <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </Link>
          )}
        </div>
      </motion.div>
    </li>
  );
}

/** Rail + progress fill + comet, positioned behind the stops. */
function Rail({ progress, className }: { progress: MotionValue<number>; className: string }) {
  const railRef = useRef<HTMLDivElement>(null);
  const height = useMotionValue(0);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => height.set(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [height]);

  const fill = useTransform(progress, (p) => `scaleY(${p})`);
  const comet = useTransform(() => `translate(-50%, ${progress.get() * height.get()}px)`);
  const cometOpacity = useTransform(progress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  return (
    <div ref={railRef} aria-hidden className={cn("pointer-events-none absolute w-px", className)}>
      <span className="absolute inset-0 bg-border" />
      <motion.span
        style={{ transform: fill }}
        className="absolute inset-0 origin-top bg-gradient-to-b from-primary/40 via-primary to-primary"
      />
      <motion.span
        style={{ transform: comet, opacity: cometOpacity }}
        className="absolute left-1/2 top-0 -mt-1.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_0_4px_var(--glow),0_0_18px_4px_var(--primary)]"
      />
    </div>
  );
}

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.45", "end 0.45"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const full = useMotionValue(1);
  const progress = reduce ? full : smooth;

  return (
    <section id="experience" className="relative mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
      <SectionHeading
        index="03"
        eyebrow="Experience"
        title="Where I've"
        accent="contributed"
        description="Freelance, client and team work — what I owned and what it changed."
      />

      <ol ref={listRef} className="relative">
        <Rail progress={progress} className="bottom-8 left-[0.6875rem] top-7 lg:left-[25%]" />
        {experience.map((item, i) => (
          <Stop key={item.org} item={item} index={i} />
        ))}
      </ol>
    </section>
  );
}
