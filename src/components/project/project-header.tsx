"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCommandMenu } from "@/components/command-menu";
import { HireButton } from "@/components/ui/hire-button";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Slim floating header for project pages: back to the work list, ⌘K, theme, hire. */
export function ProjectHeader({ backHref = "/#work", backLabel = "All work" }: { backHref?: string; backLabel?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { open } = useCommandMenu();
  const isMac = useSyncExternalStore(
    () => () => {},
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => true,
  );

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="site-nav fixed inset-x-0 top-0 z-50 print:hidden flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))]"
    >
      <nav
        aria-label="Project"
        className={cn(
          "flex w-full max-w-5xl items-center justify-between rounded-full border py-2 pl-3 pr-2 transition-[background-color,border-color,box-shadow] duration-500",
          scrolled
            ? "glass border-card-border shadow-[0_12px_40px_-16px_rgb(var(--shadow-tint)/0.35)] backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="flex items-center gap-3 pl-1">
          <Logo href="/" />
          <Link
            href={backHref}
            className="group inline-flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 ease-out-strong group-hover:-translate-x-0.5" strokeWidth={1.5} />
            {backLabel}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {/* Utility group: search + theme share one pill, split by a hairline */}
          <div className="flex h-10 items-center rounded-full border border-border p-1">
            <button
              type="button"
              onClick={open}
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
          <HireButton href="/#contact" />
        </div>
      </nav>
    </motion.header>
  );
}
