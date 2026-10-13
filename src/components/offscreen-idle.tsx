"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Marks page sections that are off-screen with `data-idle`, which stops their
 * looping CSS animations (live dots, scroll cue, marquees — see globals.css).
 *
 * A running transform animation gets its own GPU layer, and the browser can't
 * predict where it moves, so it also promotes everything painted after it that
 * might overlap. On the home page that was ~40 extra layers to repaint and
 * composite on every scroll frame, for animations nobody could see.
 */
export function OffscreenIdle() {
  const pathname = usePathname();

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("main section, main > div, footer");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.toggleAttribute("data-idle", !entry.isIntersecting);
      },
      { rootMargin: "200px 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      sections.forEach((s) => s.removeAttribute("data-idle"));
    };
  }, [pathname]);

  return null;
}
