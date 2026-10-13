"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { ArrowDownToLine, Code2, FlaskConical, Sparkles } from "lucide-react";
import { ProfileCard } from "@/components/reactbits/profile-card";
import { ScrollReveal } from "@/components/reactbits/scroll-reveal";
import { scrollToTarget } from "@/lib/smooth-scroll";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { TextReveal } from "@/components/ui/text-reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { profile } from "@/lib/data";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

const CURRENTLY_ICONS = { code: Code2, flask: FlaskConical, rocket: Sparkles } as const;

export function About() {
  const { resolvedTheme } = useTheme();
  // The theme is only known in the browser; render the dark card on the server
  // and the first client pass, then switch, so hydration matches.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isDark = !mounted || resolvedTheme !== "light";

  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-16 lg:py-20">
      <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={fadeUp} className="mb-6">
        <Eyebrow index="06">About me</Eyebrow>
      </motion.div>
      <h2 className="max-w-4xl text-balance font-heading text-5xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-[5.5rem]">
        <TextReveal text="Problem solver." className="block" />{" "}
        <TextReveal
          text="Digital craftsman."
          delay={0.15}
          className="block"
          wordClassName="font-serif font-normal italic tracking-[-0.02em] text-primary"
        />
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-start">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={staggerContainer}
          className="lg:col-span-7"
        >
          <motion.div variants={fadeUp}>
            <ScrollReveal
              emphasize={profile.bioEmphasis}
              className="max-w-2xl text-pretty font-editorial text-[1.75rem] font-light leading-[1.22] tracking-[-0.018em] text-foreground sm:text-[2.35rem]"
            >
              {profile.bio}
            </ScrollReveal>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-12 grid grid-cols-3 divide-x divide-border border-y border-border"
          >
            {profile.stats.map((stat) => {
              const numericValue = Number(stat.value);
              return (
                <div key={stat.label} className="flex flex-col-reverse px-4 py-6 first:pl-0 sm:px-6">
                  <dt className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="font-heading text-4xl font-medium tracking-[-0.05em] tabular sm:text-5xl">
                    {Number.isFinite(numericValue) ? <AnimatedCounter value={numericValue} /> : stat.value}
                  </dd>
                </div>
              );
            })}
          </motion.dl>

          <motion.p variants={fadeUp} className="mt-10 text-lg text-muted-foreground">
            Want the full picture?{" "}
            <a
              href={profile.resumeUrl}
              download
              className="link-underline inline-flex items-center gap-1 pb-0.5 font-medium text-foreground"
            >
              Download my resume
              <ArrowDownToLine className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </a>{" "}
            or{" "}
            <Link href="/resume" className="link-underline inline-flex items-center gap-1 pb-0.5 font-medium text-foreground">
              view it online
            </Link>
            .
          </motion.p>

          <motion.div variants={fadeUp} className="mt-14">
            <p className="mb-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
              Currently
            </p>
            <ul className="grid gap-3 sm:grid-cols-3">
              {profile.currently.map((item) => {
                const Icon = CURRENTLY_ICONS[item.icon as keyof typeof CURRENTLY_ICONS];
                return (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10">
            <p className="mb-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">Traits</p>
            <ul className="flex flex-wrap gap-2">
              {profile.traits.map((trait, i) => (
                <li
                  key={trait}
                  className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card py-2 pl-3 pr-4 text-sm transition-colors duration-300 hover:border-foreground/30"
                >
                  <span className="font-mono text-[0.625rem] text-primary tabular">{String(i + 1).padStart(2, "0")}</span>
                  {trait}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          custom={0.15}
          variants={fadeUp}
          className="flex justify-center lg:sticky lg:top-28 lg:col-span-5 lg:justify-end"
        >
          <ProfileCard
            avatarUrl={profile.avatarCutout}
            miniAvatarUrl={profile.avatar}
            name={profile.name}
            title={profile.role}
            handle="mattoinks"
            status="Open to work"
            statusColor={isDark ? "#f26b3a" : "#c2410c"}
            contactText="Contact"
            onContactClick={() => scrollToTarget("#contact")}
            theme={isDark ? "dark" : "light"}
            radius={22}
            holo={0.55}
            glare={0.4}
            tiltStrength={10}
          />
        </motion.div>
      </div>
    </section>
  );
}
