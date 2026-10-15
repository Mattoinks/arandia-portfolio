"use client";

import { useRef, type PointerEvent, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  /** primary = accent fill, solid = foreground fill, ghost = hairline outline. "light" is kept as an alias of solid. */
  variant?: "primary" | "solid" | "ghost" | "light";
  /** Trailing icon, rendered inside its own circular "island" flush with the button edge. */
  icon?: ReactNode;
  type?: "button" | "submit";
  download?: boolean;
}

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

// Internal routes go through next/link for client-side navigation + prefetch.
const MotionLink = motion.create(Link);

export function MagneticButton({
  children,
  className,
  href,
  onClick,
  variant = "primary",
  icon,
  type = "button",
  download,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  // Pull toward the pointer through motion values — no React state, so no
  // re-render per mouse move. Mouse only: touch has no hover to attract.
  const handlePointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.2);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const styles = cn(
    "group/btn relative inline-flex items-center justify-center gap-3 rounded-full text-sm font-medium tracking-[-0.01em] cursor-pointer select-none",
    "transition-[background-color,border-color,color,box-shadow] duration-300",
    icon ? "py-1.5 pl-6 pr-1.5" : "px-6 py-3.5",
    variant === "primary" &&
      "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_8px_24px_-10px_var(--glow)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_14px_34px_-10px_var(--primary)]",
    (variant === "solid" || variant === "light") &&
      "bg-foreground text-background shadow-[inset_0_1px_0_rgb(255_255_255/0.15)]",
    variant === "ghost" && "border border-border text-foreground hover:border-foreground/30 hover:bg-foreground/[0.04]",
    className,
  );

  const iconIsland = icon && (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-500 ease-out-strong group-hover/btn:scale-105 [&>svg]:transition-transform [&>svg]:duration-500 [&>svg]:ease-out-strong group-hover/btn:[&>svg]:translate-x-[2px] group-hover/btn:[&>svg]:-translate-y-[1px]",
        variant === "primary" && "bg-black/10",
        (variant === "solid" || variant === "light") && "bg-background/15",
        variant === "ghost" && "bg-foreground/[0.06]",
      )}
      aria-hidden
    >
      {icon}
    </span>
  );

  const content = (
    <>
      <span className="roll">
        <span className="inline-flex items-center gap-2">{children}</span>
        <span className="inline-flex items-center gap-2" aria-hidden>
          {children}
        </span>
      </span>
      {iconIsland}
    </>
  );

  const motionProps = {
    style: { x, y },
    whileTap: { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 500, damping: 30 },
    onPointerMove: handlePointerMove,
    onPointerLeave: reset,
  };

  if (href?.startsWith("/") && !download) {
    return (
      <MotionLink ref={ref as RefObject<HTMLAnchorElement>} href={href} className={styles} {...motionProps}>
        {content}
      </MotionLink>
    );
  }

  if (href) {
    // Downloads stay in the same tab — a new tab would just sit there empty.
    const isExternal = href.startsWith("http") && !download;
    return (
      <motion.a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        download={download}
        className={styles}
        {...motionProps}
      >
        {content}
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
      {content}
    </motion.button>
  );
}
