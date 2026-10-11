"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SurfaceProps {
  children: ReactNode;
  /** Classes for the inner core (padding, layout). */
  className?: string;
  /** Classes for the outer shell. */
  shellClassName?: string;
  as?: "div" | "article" | "li";
}

/**
 * Double-bezel card: a hairline outer tray holding an inner core with its own
 * highlight and a concentric, smaller radius. The core carries a
 * cursor-tracked spotlight drawn by two empty leaf spans; the pointer position
 * is written to those spans only (see `.surface-fill` in globals.css), so a
 * mouse move restyles two nodes instead of the whole card subtree, and never
 * re-renders React.
 */
export function Surface({ children, className, shellClassName, as: Tag = "div" }: SurfaceProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || frame.current) return;
    const { clientX, clientY } = e;
    // Coalesce to one write per frame — pointermove can fire faster than paint.
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const fill = fillRef.current;
      const ring = ringRef.current;
      if (!fill || !ring) return;
      const rect = fill.getBoundingClientRect();
      const x = `${clientX - rect.left}px`;
      const y = `${clientY - rect.top}px`;
      fill.style.setProperty("--mx", x);
      fill.style.setProperty("--my", y);
      ring.style.setProperty("--mx", x);
      ring.style.setProperty("--my", y);
    });
  };

  return (
    <Tag
      onPointerMove={handlePointerMove}
      className={cn(
        "h-full rounded-[2rem] bg-foreground/[0.025] p-1.5 ring-1 ring-border dark:bg-white/[0.02]",
        shellClassName,
      )}
    >
      <div className={cn("surface h-full rounded-[calc(2rem-0.375rem)]", className)}>
        <span ref={fillRef} className="surface-fill" aria-hidden />
        <span ref={ringRef} className="surface-ring" aria-hidden />
        {children}
      </div>
    </Tag>
  );
}
