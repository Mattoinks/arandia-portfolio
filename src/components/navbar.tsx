"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCommandMenu } from "@/components/command-menu";
import { HireButton } from "@/components/ui/hire-button";
import { useLocalTime } from "@/hooks/use-local-time";
import { socials } from "@/lib/data";
import { cn } from "@/lib/utils";
import { EASE, EASE_OUT } from "@/lib/motion";
import { isProgrammaticScroll, lockScroll, scrollToTarget } from "@/lib/smooth-scroll";

const NAV_LINKS = [
  { href: "#skills", label: "Capabilities" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#certifications", label: "Certifications" },
  { href: "#education", label: "Education" },
  { href: "#about", label: "About" },
];

// A section becomes "current" once its top has scrolled past this line below
// the floating navbar.
const TRIGGER_OFFSET = 160;

function Hamburger({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3 w-4" aria-hidden>
      <span
        className={cn(
          "absolute left-0 h-[1.5px] w-4 rounded-full bg-current transition-transform duration-500 ease-out-strong",
          open ? "top-[5px] rotate-45" : "top-0.5",
        )}
      />
      <span
        className={cn(
          "absolute left-0 h-[1.5px] rounded-full bg-current transition-[transform,width] duration-500 ease-out-strong",
          open ? "top-[5px] w-4 -rotate-45" : "top-[0.53125rem] w-2.5",
        )}
      />
    </span>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeHash, setActiveHash] = useState("#top");
  const { scrollY } = useScroll();
  const { open: openCommandMenu } = useCommandMenu();
  const time = useLocalTime();
  const isMac = useSyncExternalStore(
    () => () => {},
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true,
  );

  // Section tops are cached (document coordinates) and refreshed only when the
  // page resizes, so scrolling never forces a layout read.
  const sectionTopsRef = useRef<{ hash: string; top: number }[]>([]);
  useEffect(() => {
    const measure = () => {
      sectionTopsRef.current = NAV_LINKS.flatMap((l) => {
        const el = document.querySelector<HTMLElement>(l.href);
        return el ? [{ hash: l.href, top: el.getBoundingClientRect().top + window.scrollY }] : [];
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    // Tuck the bar away while reading downward; bring it back on any upward scroll.
    // Link-triggered glides keep the bar in place so it doesn't flicker away mid-jump.
    // Tiny deltas (the tail of a smooth-scroll glide) leave the state alone, so the
    // bar can't flicker back in while still moving down.
    if (isProgrammaticScroll() || y <= 240) setHidden(false);
    else if (y > prev + 2) setHidden(true);
    else if (y < prev - 2) setHidden(false);

    let current = "#top";
    for (const section of sectionTopsRef.current) {
      if (section.top - y <= TRIGGER_OFFSET) current = section.hash;
    }
    setActiveHash(current);
  });

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const showBar = !hidden || open;

  // Scrolling is locked while the menu is open, so close it first, then glide.
  const navigateFromMenu = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => scrollToTarget(href));
  };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: showBar ? 0 : -96, opacity: showBar ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="site-nav fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))]"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "flex w-full max-w-5xl items-center justify-between rounded-full border py-2 pl-3 pr-2 transition-[background-color,border-color,box-shadow] duration-500",
            scrolled && !open
              ? "glass border-card-border shadow-[0_12px_40px_-16px_rgb(var(--shadow-tint)/0.35)] backdrop-blur-md"
              : "border-transparent bg-transparent",
          )}
        >
          <div className="flex items-center gap-2.5 pl-1">
            <Logo />
            <span className="hidden font-mono text-xs font-medium uppercase tracking-[0.14em] sm:inline">
              Arandia<span className="text-primary">.</span>dev
            </span>
          </div>

          <div className="hidden items-center lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={activeHash === link.href ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors duration-200 cursor-pointer",
                  activeHash === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {activeHash === link.href && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-foreground/[0.07]"
                    transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Utility group: search + theme share one pill, split by a hairline */}
            <div className="flex h-10 items-center rounded-full border border-border p-1">
              <button
                type="button"
                onClick={openCommandMenu}
                aria-label="Search the site"
                aria-keyshortcuts="Control+K Meta+K"
                className="press hidden h-8 items-center gap-2 rounded-full pl-2.5 pr-1.5 text-[0.8125rem] text-muted-foreground transition-colors duration-200 hover:bg-foreground/[0.07] hover:text-foreground cursor-pointer md:inline-flex"
              >
                <Search className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                <span className="hidden xl:inline">Search</span>
                <span className="kbd" suppressHydrationWarning>
                  {isMac ? "⌘K" : "Ctrl K"}
                </span>
              </button>
              <span className="mx-1 hidden h-4 w-px bg-border md:block" aria-hidden />
              <ThemeToggle bare />
            </div>
            <HireButton href="#contact" className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="press flex h-10 w-10 items-center justify-center rounded-full border border-border cursor-pointer lg:hidden"
            >
              <Hamburger open={open} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3, ease: EASE_OUT } }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE_OUT, delay: 0.05 } }}
            className="fixed inset-0 z-40 flex flex-col bg-background/85 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-28 backdrop-blur-2xl lg:hidden"
          >
            <nav aria-label="Mobile" className="flex-1">
              <ul>
                {NAV_LINKS.map((link, i) => (
                  <li key={link.href} className="overflow-hidden border-b border-border">
                    <motion.a
                      href={link.href}
                      onClick={(e) => navigateFromMenu(e, link.href)}
                      initial={{ y: "100%" }}
                      animate={{ y: "0%", transition: { duration: 0.7, ease: EASE, delay: 0.05 + i * 0.05 } }}
                      exit={{ y: "100%", transition: { duration: 0.25, ease: EASE_OUT } }}
                      className="flex items-baseline justify-between py-4"
                    >
                      <span
                        className={cn(
                          "font-heading text-4xl font-medium tracking-[-0.04em]",
                          activeHash === link.href ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {link.label}
                      </span>
                      <span className="font-mono text-[0.6875rem] text-muted-foreground tabular">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.35 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="space-y-6"
            >
              <a
                href="#contact"
                onClick={(e) => navigateFromMenu(e, "#contact")}
                className="press flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-4 text-sm font-medium text-background"
              >
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                Hire me
              </a>
              <div className="flex items-center justify-between font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                <div className="flex gap-4">
                  {socials
                    .filter((s) => s.icon === "github" || s.icon === "linkedin")
                    .map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                        {s.label} <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                      </a>
                    ))}
                </div>
                <span className="tabular" suppressHydrationWarning>
                  {time && `${time} PHT`}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
