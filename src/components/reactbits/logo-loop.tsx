"use client";

/*
  Adapted from React Bits — LogoLoop (MIT, https://reactbits.dev).
  Changes: trimmed to the horizontal case the site uses, edge fades take the
  theme's --background instead of hardcoded hex, items render through a
  caller-supplied renderer, and the rAF loop stops while off-screen.
*/

import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LogoLoopProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => string;
  /** px per second; negative scrolls right. */
  speed?: number;
  gap?: number;
  /** Speed while hovered (0 = pause). */
  hoverSpeed?: number;
  fadeOut?: boolean;
  ariaLabel: string;
  className?: string;
}

const SMOOTH_TAU = 0.25;

function LogoLoopInner<T>({
  items,
  renderItem,
  getKey,
  speed = 40,
  gap = 40,
  hoverSpeed = 0,
  fadeOut = true,
  ariaLabel,
  className,
}: LogoLoopProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);
  const [seqWidth, setSeqWidth] = useState(0);
  const [copies, setCopies] = useState(2);
  const hovered = useRef(false);

  const measure = useCallback(() => {
    const container = containerRef.current?.clientWidth ?? 0;
    const seq = seqRef.current?.getBoundingClientRect().width ?? 0;
    if (seq > 0) {
      setSeqWidth(Math.ceil(seq));
      setCopies(Math.max(2, Math.ceil(container / seq) + 2));
    }
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    if (seqRef.current) ro.observe(seqRef.current);
    measure();
    return () => ro.disconnect();
  }, [measure, items, gap]);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container || seqWidth === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last: number | null = null;
    let offset = 0;
    let velocity = 0;
    let visible = true;

    const frame = (t: number) => {
      const dt = last === null ? 0 : Math.max(0, t - last) / 1000;
      last = t;
      const target = hovered.current ? hoverSpeed : speed;
      velocity += (target - velocity) * (1 - Math.exp(-dt / SMOOTH_TAU));
      offset = (((offset + velocity * dt) % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    // No point spending frames on a band nobody can see.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        last = null;
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(container);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [seqWidth, speed, hoverSpeed]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      className={cn("group relative overflow-x-hidden", className)}
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
    >
      {fadeOut && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[clamp(24px,10%,140px)] bg-gradient-to-r from-background to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(24px,10%,140px)] bg-gradient-to-l from-background to-transparent" />
        </>
      )}
      <div ref={trackRef} className="relative flex w-max select-none will-change-transform">
        {Array.from({ length: copies }, (_, copy) => (
          <ul key={copy} ref={copy === 0 ? seqRef : undefined} aria-hidden={copy > 0} className="flex items-center">
            {items.map((item) => (
              <li key={`${copy}-${getKey(item)}`} className="flex-none" style={{ marginRight: gap }}>
                {renderItem(item)}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export const LogoLoop = memo(LogoLoopInner) as typeof LogoLoopInner;
