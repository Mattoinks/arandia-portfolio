"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useMotionValue, useScroll, type MotionValue } from "framer-motion";

/** "<element edge> <viewport line>", e.g. "start 0.85" or "end start" — same syntax as useScroll's offset. */
type Offset = `${string} ${string}`;

const EDGES: Record<string, number> = { start: 0, center: 0.5, end: 1 };
const edge = (v: string) => EDGES[v] ?? Number(v);

/** Document-space top of an element, ignoring CSS transforms (like useScroll does). */
function documentTop(el: HTMLElement) {
  let top = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) top += node.offsetTop;
  return top;
}

/**
 * Drop-in for `useScroll({ target, offset }).scrollYProgress`, but cheap to scroll.
 *
 * Framer's target tracking re-measures the element's layout on every scroll
 * frame. With several scroll-linked effects on one page that adds up to a few
 * milliseconds a frame on mid-range phones. Here the element is measured once,
 * re-measured only when the page or element resizes, and each frame is just
 * arithmetic on the window scroll position.
 */
export function useElementScrollProgress(
  ref: RefObject<HTMLElement | null>,
  offset: [Offset, Offset],
): MotionValue<number> {
  const { scrollY } = useScroll();
  const progress = useMotionValue(0);
  const range = useRef<[number, number]>([0, 1]);
  const [a, b] = offset;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const [elA, vpA] = a.split(" ").map(edge);
    const [elB, vpB] = b.split(" ").map(edge);
    const update = (y: number) => {
      const [start, end] = range.current;
      progress.set(end === start ? (y >= end ? 1 : 0) : Math.min(1, Math.max(0, (y - start) / (end - start))));
    };
    const measure = () => {
      const top = documentTop(el);
      const h = el.offsetHeight;
      const vh = window.innerHeight;
      range.current = [top + elA * h - vpA * vh, top + elB * h - vpB * vh];
      update(window.scrollY);
    };
    measure();
    const unsubscribe = scrollY.on("change", update);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      unsubscribe();
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref, a, b, scrollY, progress]);

  return progress;
}
