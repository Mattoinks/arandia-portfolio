"use client";

import { useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";

export function TraitStack({ traits }: { traits: string[] }) {
  const [order, setOrder] = useState(traits.map((_, i) => i));
  const [hovered, setHovered] = useState(false);

  const cycle = () => setOrder((o) => [...o.slice(1), o[0]]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cycle();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={cycle}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Show next trait"
      data-cursor="hover"
      className="relative mx-auto h-64 w-64 cursor-pointer sm:mx-0 sm:h-72 sm:w-72"
    >
      {order.slice(0, 3).map((traitIndex, depth) => (
        <motion.div
          key={traits[traitIndex]}
          initial={false}
          animate={{
            x: depth * 18,
            y: depth * 18,
            rotate: depth === 0 ? 0 : depth * 4,
            scale: 1 - depth * 0.05,
            opacity: depth === 0 ? 1 : 0.85 - depth * 0.15,
            zIndex: 10 - depth,
          }}
          whileTap={depth === 0 ? { scale: 0.96 } : undefined}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="glow-border absolute inset-0 flex select-none flex-col justify-between rounded-2xl border border-border bg-muted p-7"
        >
          <div className="flex items-start justify-between">
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-primary">
              Trait
            </span>
            {depth === 0 && (
              <motion.span
                animate={{ opacity: hovered ? 1 : 0.5, scale: hovered ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
                className="text-muted-foreground"
              >
                <MousePointerClick className="h-4 w-4" strokeWidth={1.75} />
              </motion.span>
            )}
          </div>
          <span className="font-heading text-2xl font-semibold leading-tight sm:text-3xl">
            {traits[traitIndex]}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
