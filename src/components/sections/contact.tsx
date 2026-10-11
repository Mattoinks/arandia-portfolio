"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpRight, Check, Copy } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/brand-icons";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ContactForm } from "@/components/contact-form";
import { TextReveal } from "@/components/ui/text-reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { Magnet } from "@/components/reactbits/magnet";
import { profile, socials } from "@/lib/data";
import { fadeUp, staggerContainer, viewport } from "@/lib/motion";

function displayHref(href: string) {
  return href.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email copied" : "Copy email address"}
      className="press relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border transition-colors hover:bg-foreground/5"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.7, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          className="flex"
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary" strokeWidth={2} />
          ) : (
            <Copy className="h-4 w-4" strokeWidth={1.5} />
          )}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </button>
  );
}

export function Contact() {
  const githubHref = socials.find((s) => s.icon === "github")?.href ?? "#";
  const linkedinHref = socials.find((s) => s.icon === "linkedin")?.href ?? "#";

  const links = [
    { label: "GitHub", value: displayHref(githubHref), href: githubHref, icon: GithubIcon },
    { label: "LinkedIn", value: displayHref(linkedinHref), href: linkedinHref, icon: LinkedinIcon },
  ];

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-6 pb-16 pt-14 sm:px-10 sm:pt-16 lg:pt-20">
      <motion.div initial="hidden" whileInView="show" viewport={viewport} variants={fadeUp} className="mb-8">
        <Eyebrow index="06">Get in touch</Eyebrow>
      </motion.div>

      <h2 className="font-heading text-[clamp(3.5rem,11vw,10rem)] font-medium leading-[0.88] tracking-[-0.055em]">
        <TextReveal text="Let's work" className="block" />{" "}
        <TextReveal
          text="together."
          delay={0.15}
          className="block"
          wordClassName="font-serif font-normal italic tracking-[-0.03em] text-primary"
        />
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={staggerContainer}
          className="lg:col-span-7"
        >
          <motion.p variants={fadeUp} className="max-w-md text-pretty text-xl leading-snug text-foreground">
            Looking for the next problem worth solving.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-md text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground"
          >
            I&apos;m open to roles and projects in full-stack development, scalable systems, and
            digital products built end-to-end.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10">
            <ContactForm />
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={staggerContainer}
          className="lg:col-span-5 lg:pt-1"
        >
          <motion.div variants={fadeUp} className="border-t border-border pt-6">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">Email</p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="link-underline min-w-0 truncate pb-1 font-heading text-xl font-medium tracking-[-0.02em] sm:text-3xl"
              >
                {profile.email}
              </a>
              <Magnet padding={30} strength={3}>
                <CopyEmailButton />
              </Magnet>
            </div>
          </motion.div>

          <ul className="mt-8">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <motion.li key={link.label} variants={fadeUp} className="border-t border-border last:border-b">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 py-5"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                    <span className="hidden w-24 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground sm:inline">
                      {link.label}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-base font-medium transition-transform duration-500 ease-out-strong group-hover:translate-x-1.5">
                      {link.value}
                    </span>
                    <span className="relative h-5 w-5 overflow-hidden" aria-hidden>
                      <ArrowUpRight className="absolute inset-0 h-5 w-5 transition-transform duration-500 ease-out-strong group-hover:-translate-y-full group-hover:translate-x-full" strokeWidth={1.5} />
                      <ArrowUpRight className="absolute inset-0 h-5 w-5 -translate-x-full translate-y-full text-primary transition-transform duration-500 ease-out-strong group-hover:translate-x-0 group-hover:translate-y-0" strokeWidth={1.5} />
                    </span>
                  </a>
                </motion.li>
              );
            })}
          </ul>

          <motion.div variants={fadeUp} className="mt-8">
            <MagneticButton
              href={profile.resumeUrl}
              variant="ghost"
              download
              icon={<ArrowDownToLine className="h-4 w-4" strokeWidth={1.5} />}
            >
              Download resume
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
