"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProfileCard } from "@/components/reactbits/profile-card";
import { ScrollReveal } from "@/components/reactbits/scroll-reveal";
import { scrollToTarget } from "@/lib/smooth-scroll";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { TextReveal } from "@/components/ui/text-reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { profile } from "@/lib/data";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

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
        <TextReveal text="Real clients." className="block" />{" "}
        <TextReveal
          text="Real systems."
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
              // Counts up (with any suffix, e.g. "%"); a year like 2027 is shown as-is.
              const [, digits, suffix] = /^(\d+)(\D*)$/.exec(stat.value) ?? [];
              const numericValue = Number(digits);
              const counts = digits !== undefined && numericValue < 1000;
              return (
                <div key={stat.label} className="flex flex-col-reverse px-4 py-6 first:pl-0 sm:px-6">
                  <dt className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="font-heading text-4xl font-medium tracking-[-0.05em] tabular sm:text-5xl">
                    {counts ? <AnimatedCounter value={numericValue} suffix={suffix} /> : stat.value}
                  </dd>
                </div>
              );
            })}
          </motion.dl>

          <motion.p variants={fadeUp} className="mt-10 text-lg text-muted-foreground">
            Want the full picture?{" "}
            <Link href="/resume" className="link-underline inline-flex items-center gap-1 pb-0.5 font-medium text-foreground">
              View my resume
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </Link>
          </motion.p>

          <motion.div variants={fadeUp} className="mt-16">
            <p className="mb-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">Currently</p>
            <ul className="divide-y divide-border border-y border-border">
              {profile.currently.map((item) => {
                const body = (
                  <>
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary sm:pt-1.5">
                      {item.label}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-heading text-lg font-medium leading-snug tracking-[-0.02em] transition-transform duration-500 ease-out-strong sm:group-hover:translate-x-1">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{item.detail}</span>
                    </span>
                    {item.href ? (
                      <ArrowUpRight
                        className="mt-1.5 h-4 w-4 text-muted-foreground transition-[color,transform] duration-300 ease-out-strong group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    ) : (
                      <span />
                    )}
                  </>
                );
                const row =
                  "group grid grid-cols-[1fr_auto] gap-x-6 gap-y-1.5 py-5 sm:grid-cols-[7.5rem_1fr_auto] [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1";
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <Link href={item.href} className={row}>
                        {body}
                      </Link>
                    ) : (
                      <div className={row}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-16">
            <p className="mb-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
              How I work
            </p>
            <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {profile.traits.map((trait, i) => (
                <li key={trait.name} className="grid grid-cols-[auto_1fr] items-baseline gap-x-3">
                  <span className="font-mono text-[0.6875rem] text-primary tabular">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-heading text-lg font-medium tracking-[-0.02em]">{trait.name}</p>
                  <p className="col-start-2 mt-1.5 text-sm leading-relaxed text-muted-foreground">{trait.detail}</p>
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
