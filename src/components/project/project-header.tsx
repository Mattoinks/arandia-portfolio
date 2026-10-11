"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCommandMenu } from "@/components/command-menu";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Slim floating header for project pages: back to the work list, ⌘K, theme, hire. */
export function ProjectHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { open } = useCommandMenu();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="site-nav fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))]"
    >
      <nav
        aria-label="Project"
        className={cn(
          "flex w-full max-w-5xl items-center justify-between rounded-full border py-2 pl-3 pr-2 transition-[background-color,border-color,box-shadow] duration-500",
          scrolled
            ? "glass border-card-border shadow-[0_12px_40px_-16px_rgb(var(--shadow-tint)/0.35)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="flex items-center gap-3 pl-1">
          <Logo href="/" />
          <Link
            href="/#work"
            className="group inline-flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 ease-out-strong group-hover:-translate-x-0.5" strokeWidth={1.5} />
            All work
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={open}
            aria-label="Open command menu"
            className="press hidden h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground cursor-pointer sm:flex"
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <ThemeToggle />
          <Link
            href="/#contact"
            className="press inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-[0.8125rem] font-medium text-background"
          >
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            Hire me
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
