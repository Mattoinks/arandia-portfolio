"use client";

import { VelocityMarquee } from "@/components/ui/velocity-marquee";

const DISCIPLINES = ["Full-stack systems", "Mobile apps", "Web platforms", "Database design", "QA & testing"];

/** Editorial interlude between Work and Certifications: two bands drifting in opposite directions. */
export function MarqueeBand() {
  return (
    <section aria-hidden className="relative overflow-hidden border-y border-border py-10 sm:py-14">
      <VelocityMarquee
        items={DISCIPLINES}
        baseVelocity={-1.2}
        className="font-heading text-5xl font-medium tracking-[-0.05em] sm:text-7xl lg:text-8xl"
      />
      <VelocityMarquee
        items={[...DISCIPLINES].reverse()}
        baseVelocity={1.2}
        className="mt-2 font-heading text-5xl font-medium tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_var(--muted-foreground)] sm:text-7xl lg:text-8xl"
      />
    </section>
  );
}
