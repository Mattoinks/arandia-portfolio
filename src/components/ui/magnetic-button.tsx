"use client";

import { useRef, useState, type PointerEvent, type ReactNode, type RefObject } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "light";
  type?: "button" | "submit";
}

export function MagneticButton({
  children,
  className,
  href,
  onClick,
  variant = "primary",
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setPos({ x: relX * 0.3, y: relY * 0.3 });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  const styles = cn(
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-wide transition-colors duration-300 cursor-pointer will-change-transform",
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:opacity-90"
      : variant === "light"
        ? "bg-white text-black hover:bg-white/90"
        : "glass text-foreground hover:border-primary/40",
    className,
  );

  const motionProps = {
    animate: { x: pos.x, y: pos.y },
    whileTap: { scale: 0.95 },
    transition: { type: "spring" as const, stiffness: 200, damping: 15, mass: 0.5 },
    onPointerMove: handlePointerMove,
    onPointerLeave: reset,
  };

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <motion.a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className={styles}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={styles}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
