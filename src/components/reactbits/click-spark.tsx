"use client";

/*
  Adapted from React Bits — ClickSpark (MIT, https://reactbits.dev).
  Changes: one fixed, viewport-sized canvas for the whole page (the original
  sized a canvas to its container — the full document height here), the rAF
  loop only runs while sparks are alive, DPR-aware drawing, colour follows the
  theme's --primary, and it's disabled for reduced-motion users.
*/

import { useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  angle: number;
  start: number;
}

interface ClickSparkProps {
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
}

export function ClickSpark({ sparkSize = 10, sparkRadius = 18, sparkCount = 8, duration = 420 }: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sparks: Spark[] = [];
    let raf = 0;
    let color = "#f26b3a";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.75;
      ctx.lineCap = "round";

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        const t = (now - s.start) / duration;
        if (t >= 1) {
          sparks.splice(i, 1);
          continue;
        }
        const eased = 1 - Math.pow(1 - t, 3);
        const dist = eased * sparkRadius;
        const len = sparkSize * (1 - eased);
        ctx.beginPath();
        ctx.moveTo(s.x + dist * Math.cos(s.angle), s.y + dist * Math.sin(s.angle));
        ctx.lineTo(s.x + (dist + len) * Math.cos(s.angle), s.y + (dist + len) * Math.sin(s.angle));
        ctx.stroke();
      }

      raf = sparks.length ? requestAnimationFrame(draw) : 0;
    };

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0) return;
      color = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || color;
      const now = performance.now();
      for (let i = 0; i < sparkCount; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, angle: (2 * Math.PI * i) / sparkCount, start: now });
      }
      if (!raf) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
    };
  }, [sparkSize, sparkRadius, sparkCount, duration]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[120] h-full w-full" />;
}
