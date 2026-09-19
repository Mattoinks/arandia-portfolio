"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/brand-icons";
import { GlassCard } from "@/components/ui/glass-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { TextReveal } from "@/components/ui/text-reveal";
import { profile, socials } from "@/lib/data";
import { fadeUp, viewport } from "@/lib/motion";

function displayHref(href: string) {
  return href.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function Contact() {
  const githubHref = socials.find((s) => s.icon === "github")?.href ?? "#";
  const linkedinHref = socials.find((s) => s.icon === "linkedin")?.href ?? "#";

  const contactLinks = [
    {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: Mail,
      external: false,
    },
    {
      label: "GitHub",
      value: displayHref(githubHref),
      href: githubHref,
      icon: GithubIcon,
      external: true,
    },
    {
      label: "LinkedIn",
      value: displayHref(linkedinHref),
      href: linkedinHref,
      icon: LinkedinIcon,
      external: true,
    },
  ];

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-6 py-28 sm:px-10">
      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={fadeUp}
        className="mb-4 font-mono text-sm uppercase tracking-[0.2em] text-primary"
      >
        Get in Touch
      </motion.p>

      <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div>
          <h2 className="font-heading text-4xl font-bold uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
            <TextReveal as="span" text="Let's" className="block" />
            <TextReveal as="span" text="Work" delay={0.12} className="block" />
            <TextReveal as="span" text="Together" delay={0.24} className="block" />
          </h2>

          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={0.15}
            variants={fadeUp}
            className="mt-10 max-w-md text-xl font-bold leading-snug text-foreground sm:text-2xl"
          >
            Looking for the next problem worth solving.
          </motion.p>

          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={0.2}
            variants={fadeUp}
            className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg"
          >
            I&apos;m open to opportunities where I can contribute to full-stack development,
            scalable systems, and digital products end-to-end.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={0.25}
            variants={fadeUp}
            className="mt-10"
          >
            <MagneticButton href={profile.resumeUrl} variant="light" className="px-8 py-4">
              Download Resume <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          custom={0.15}
          variants={fadeUp}
          className="flex flex-col gap-5"
        >
          {contactLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <GlassCard key={link.label} tilt={false} className="relative rounded-3xl p-6">
                <span className="absolute right-6 top-6 font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  data-cursor="hover"
                  className="flex items-center gap-4 pr-8 cursor-pointer transition-transform active:scale-[0.98]"
                >
                  <span className="glass flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                    <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground">
                      {link.label}
                    </span>
                    <span className="mt-1.5 flex items-center gap-1.5 truncate text-base font-semibold sm:text-lg">
                      {link.value}
                      {link.external && (
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-muted-foreground"
                          aria-hidden
                        />
                      )}
                    </span>
                  </span>
                </a>
              </GlassCard>
            );
          })}

          <MagneticButton
            href={`mailto:${profile.email}`}
            variant="ghost"
            className="w-full justify-center py-5"
          >
            Send Me a Message <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
