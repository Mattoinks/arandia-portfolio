"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Standard SSR hydration guard: resolvedTheme is undefined on the server, so
  // the icon can't be picked until after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-10 w-10 rounded-full glass" aria-hidden />;
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
      className="glass relative flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer"
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="h-[18px] w-[18px] text-foreground" strokeWidth={1.75} />
        ) : (
          <Sun className="h-[18px] w-[18px] text-foreground" strokeWidth={1.75} />
        )}
      </motion.span>
    </button>
  );
}
