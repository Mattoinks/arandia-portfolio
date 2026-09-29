"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Code2, FlaskConical, Rocket } from "lucide-react";
import { TraitStack } from "@/components/ui/trait-stack";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useTypewriter } from "@/hooks/use-typewriter";
import { profile } from "@/lib/data";
import { EASE, fadeUp, viewport } from "@/lib/motion";
import { blurPlaceholders } from "@/lib/blur-placeholders";

const CURRENTLY_ICONS = { code: Code2, flask: FlaskConical, rocket: Rocket } as const;

export function About() {
  const typedHeading = useTypewriter({
    words: ["Problem Solver. Digital Craftsman."],
    loop: false,
    typingSpeed: 45,
  });

  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-28 sm:px-10">
      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={fadeUp}
        className="mb-4 font-mono text-sm uppercase tracking-[0.2em] text-primary"
      >
        About Me
      </motion.p>
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        custom={0.05}
        variants={fadeUp}
        className="text-balance font-heading text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
      >
        {typedHeading}
        <span
          className="ml-1 inline-block h-[0.85em] w-[4px] translate-y-[4px] animate-pulse bg-primary"
          aria-hidden
        />
      </motion.h2>

      <div className="mt-16 grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={0.1}
            variants={fadeUp}
            className="flex flex-col gap-6 sm:flex-row sm:items-center"
          >
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border sm:h-28 sm:w-28"
            >
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                sizes="112px"
                className="object-cover"
                placeholder="blur"
                blurDataURL={blurPlaceholders.avatar}
                priority
              />
            </motion.div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xl font-semibold uppercase tracking-wide sm:text-2xl">
                  {profile.name}
                </h3>
                <BadgeCheck className="h-5 w-5 text-primary" aria-label="Verified" />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-10 gap-y-2">
                {profile.stats.map((stat) => {
                  const numericValue = Number(stat.value);
                  return (
                    <div key={stat.label}>
                      <p className="font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="font-heading text-2xl font-bold">
                        {Number.isFinite(numericValue) ? (
                          <AnimatedCounter value={numericValue} />
                        ) : (
                          stat.value
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={0.15}
            variants={fadeUp}
            className="mt-10 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            {profile.bio}
          </motion.p>

          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={0.2}
            variants={fadeUp}
            className="mt-5 text-base text-muted-foreground sm:text-lg"
          >
            Want to know more about my experience?{" "}
            <a
              href={profile.resumeUrl}
              download
              className="group relative font-medium text-foreground cursor-pointer"
            >
              Download my resume
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-100 bg-foreground transition-transform duration-300 ease-out group-hover:scale-x-0" />
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
            .
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={0.25}
            variants={fadeUp}
            className="mt-14"
          >
            <p className="mb-5 font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground">
              Currently
            </p>
            <div className="flex flex-nowrap gap-3 sm:gap-10">
              {profile.currently.map((item) => {
                const Icon = CURRENTLY_ICONS[item.icon as keyof typeof CURRENTLY_ICONS];
                return (
                  <div key={item.label} className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none sm:gap-4">
                    <span className="glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12">
                      <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium sm:text-base">{item.label}</p>
                      <p className="truncate text-xs text-muted-foreground sm:text-sm">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          custom={0.2}
          variants={fadeUp}
          className="flex justify-center lg:justify-end"
        >
          <TraitStack traits={profile.traits} />
        </motion.div>
      </div>
    </section>
  );
}
