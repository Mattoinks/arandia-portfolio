"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, FileDown } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { TextReveal } from "@/components/ui/text-reveal";
import { useTypewriter } from "@/hooks/use-typewriter";
import { profile, techStack } from "@/lib/data";
import { blurPlaceholders } from "@/lib/blur-placeholders";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

function NameMarquee() {
  const shouldReduceMotion = useReducedMotion();
  const label = profile.name.toUpperCase();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"
    >
      <motion.div
        className="flex shrink-0 whitespace-nowrap"
        animate={shouldReduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="mx-6 font-heading text-[16vw] font-bold leading-none text-transparent sm:mx-10"
            style={{ WebkitTextStroke: "1.5px var(--foreground)", opacity: 0.5 }}
          >
            {label}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Hero() {
  const typed = useTypewriter({ words: profile.taglines });
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 70]);

  return (
    <>
      {/* Full-screen intro: name marquee + huge cutout photo + scroll cue */}
      <section
        ref={heroRef}
        id="top"
        className="relative flex h-dvh flex-col overflow-hidden pt-24"
      >
        <NameMarquee />

        <motion.div style={{ y: parallaxY }} className="relative z-10 min-h-0 flex-1">
          <Image
            src={profile.avatarCutout}
            alt={profile.name}
            fill
            sizes="100vw"
            className="object-contain object-bottom"
            placeholder="blur"
            blurDataURL={blurPlaceholders.avatarCutout}
            priority
          />
        </motion.div>

        <div className="absolute bottom-8 right-6 hidden flex-col items-center gap-3 sm:flex">
          <span
            className="font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll Down
          </span>
          <span className="h-14 w-px bg-border" />
        </div>
      </section>

      {/* Details: greeting, tagline, CTAs, tech badges */}
      <section className="relative px-6 py-28 sm:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-100px" }}
          className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        >
          <motion.h1
            variants={item}
            className="text-balance font-heading text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl"
          >
            {profile.name}
          </motion.h1>

          <TextReveal
            as="p"
            text={profile.headline}
            delay={0.3}
            className="text-balance mt-4 max-w-xl font-heading text-lg font-medium leading-snug text-foreground sm:text-2xl"
          />

          <motion.p variants={item} className="mt-3 text-sm text-muted-foreground sm:text-base">
            {profile.role}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-5 flex h-8 items-center font-mono text-sm text-foreground sm:text-base"
          >
            <span>{typed}</span>
            <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-primary" aria-hidden />
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton href="#work">
              View Projects <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost">
              <FileDown className="h-4 w-4" strokeWidth={2} /> Get in Touch
            </MagneticButton>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-12 flex max-w-xl flex-wrap items-center justify-center gap-2.5"
          >
            {techStack.map((tech, i) => (
              <motion.span
                key={tech}
                className="glass rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
