"use client";

/*
  Adapted from React Bits — Magnet (MIT, https://reactbits.dev).
  Changes: the original set React state on every window mousemove, re-rendering
  continuously. This version writes the transform straight to the element and
  only listens while the pointer is near; mouse-only and reduced-motion aware.
*/

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagnetProps {
  children: ReactNode;
  /** Extra px around the element that still attracts the pointer. */
  padding?: number;
  /** Higher = weaker pull. */
  strength?: number;
  className?: string;
}

export function Magnet({ children, padding = 40, strength = 3, className }: MagnetProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active = false;
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const near = Math.abs(e.clientX - cx) < r.width / 2 + padding && Math.abs(e.clientY - cy) < r.height / 2 + padding;
      if (near) {
        if (!active) {
          active = true;
          inner.style.transition = "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)";
        }
        inner.style.transform = `translate3d(${(e.clientX - cx) / strength}px, ${(e.clientY - cy) / strength}px, 0)`;
      } else if (active) {
        active = false;
        inner.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
        inner.style.transform = "translate3d(0, 0, 0)";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [padding, strength]);

  return (
    <span ref={wrapRef} className={cn("relative inline-block", className)}>
      <span ref={innerRef} className="block will-change-transform">
        {children}
      </span>
    </span>
  );
}
