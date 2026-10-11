"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToTarget, setLenis } from "@/lib/smooth-scroll";

/**
 * Inertial page scrolling (skipped for reduced-motion users) plus one handler
 * for every in-page "#section" link, so they all land at the same precise
 * spot: the section's content just below the navbar.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;

    if (!reduce) {
      lenis = new Lenis({ autoRaf: true, lerp: 0.1, wheelMultiplier: 1 });
      setLenis(lenis);
      // Keep GSAP ScrollTrigger (React Bits components) in lockstep with Lenis.
      gsap.registerPlugin(ScrollTrigger);
      lenis.on("scroll", ScrollTrigger.update);
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank") return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      if (scrollToTarget(url.hash)) {
        e.preventDefault();
        history.replaceState(null, "", url.hash === "#top" ? url.pathname : url.hash);
      }
    };
    document.addEventListener("click", onClick);

    // Arriving with a hash (e.g. /#work from a project page): settle precisely once laid out.
    if (window.location.hash) {
      const hash = window.location.hash;
      requestAnimationFrame(() => setTimeout(() => scrollToTarget(hash, { immediate: true }), 50));
    }

    return () => {
      document.removeEventListener("click", onClick);
      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
        setLenis(null);
        lenis.destroy();
      }
    };
  }, []);

  return null;
}
