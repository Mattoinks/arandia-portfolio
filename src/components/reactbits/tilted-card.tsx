"use client";

/*
  Adapted from React Bits — TiltedCard (MIT, https://reactbits.dev).
  Changes: wraps arbitrary children (here, project screenshots) instead of a
  bare <img>, uses framer-motion (already a dependency) instead of motion/react,
  gentler defaults, mouse-only, and an optional cursor-following caption.
*/

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, type SpringOptions } from "framer-motion";
import { cn } from "@/lib/utils";

const SPRING: SpringOptions = { damping: 30, stiffness: 120, mass: 1.2 };

interface TiltedCardProps {
  children: ReactNode;
  className?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  /** Small label that follows the cursor while hovering. */
  caption?: string;
}

export function TiltedCard({ children, className, rotateAmplitude = 6, scaleOnHover = 1.02, caption }: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const scale = useSpring(1, SPRING);
  const captionOpacity = useSpring(0, { stiffness: 300, damping: 30 });
  const lastY = useRef(0);
  const captionRotate = useSpring(0, { stiffness: 350, damping: 30 });

  const isMouse = (e: MouseEvent) => (e.nativeEvent as PointerEvent).pointerType !== "touch";

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !isMouse(e)) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    captionRotate.set(-(offsetY - lastY.current) * 0.6);
    lastY.current = offsetY;
  };

  const handleEnter = () => {
    scale.set(scaleOnHover);
    captionOpacity.set(1);
  };

  const handleLeave = () => {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    captionOpacity.set(0);
    captionRotate.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn("relative [perspective:1000px]", className)}
    >
      <motion.div style={{ rotateX, rotateY, scale }} className="[transform-style:preserve-3d]">
        {children}
      </motion.div>
      {caption && (
        <motion.span
          aria-hidden
          style={{ x, y, opacity: captionOpacity, rotate: captionRotate }}
          className="pointer-events-none absolute left-0 top-0 z-10 hidden rounded-full bg-foreground px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-background shadow-lg sm:block"
        >
          {caption}
        </motion.span>
      )}
    </div>
  );
}
