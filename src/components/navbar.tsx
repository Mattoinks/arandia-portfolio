"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#skills", label: "What I Can Do" },
  { href: "#work", label: "Work" },
  { href: "#certifications", label: "Certifications" },
  { href: "#education", label: "Education" },
  { href: "#about", label: "About Me" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("#top");

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is HTMLElement => !!el,
    );

    // A section becomes "current" once its top has scrolled past this line
    // below the fixed navbar — not just while it's centered in the viewport.
    // This tracks scroll position directly instead of intersection ratios,
    // so it can't get stuck on a stale section when one part of the page
    // (e.g. the second half of the hero) isn't itself a nav target.
    const TRIGGER_OFFSET = 160;

    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (sections.length === 0) return;

      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= TRIGGER_OFFSET) current = section;
      }
      setActiveHash(`#${current.id}`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-4xl items-center justify-between rounded-full border border-border bg-background px-5 py-2.5 transition-shadow duration-300",
          scrolled && "shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)]",
        )}
      >
        <div className="flex items-center gap-2.5">
          <Logo />
          <span className="hidden font-heading text-sm font-semibold tracking-tight sm:inline">
            MATTHEW<span className="text-primary">.</span>DEV
          </span>
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={activeHash === link.href ? "page" : undefined}
              className={cn(
                "relative rounded-full px-3.5 py-1.5 text-sm transition-colors cursor-pointer",
                activeHash === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {activeHash === link.href && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-foreground/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden items-center rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition-transform hover:scale-105 active:scale-95 cursor-pointer sm:inline-flex"
          >
            Hire Me
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="glass flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer lg:hidden"
          >
            {open ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </nav>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "absolute left-4 right-4 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-border bg-background lg:hidden",
        )}
      >
        <div className="flex flex-col gap-1 p-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg bg-foreground px-3 py-2.5 text-center text-sm font-semibold text-background transition-transform active:scale-95 cursor-pointer"
          >
            Hire Me
          </a>
        </div>
      </motion.div>
    </motion.header>
  );
}
