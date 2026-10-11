"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThemeToggle({ bare = false }: { bare?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Standard SSR hydration guard: resolvedTheme is undefined on the server, so
  // the icon can't be picked until after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={bare ? "h-8 w-8" : "h-10 w-10 rounded-full border border-border"} aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";

    if (shouldReduceMotion || !document.startViewTransition) {
      setTheme(next);
      return;
    }

    document.documentElement.style.setProperty("--x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--y", `${e.clientY}px`);
    document.startViewTransition(() => setTheme(next));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={cn(
        "press relative flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-foreground/[0.07] cursor-pointer",
        bare ? "h-8 w-8" : "h-10 w-10 border border-border",
      )}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ opacity: 0, rotate: -60, scale: 0.8, filter: "blur(3px)" }}
        animate={{ opacity: 1, rotate: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-foreground" strokeWidth={1.5} />
        ) : (
          <Sun className="h-4 w-4 text-foreground" strokeWidth={1.5} />
        )}
      </motion.span>
    </button>
  );
}
