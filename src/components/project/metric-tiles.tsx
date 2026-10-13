import type { ProjectMetric } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Measured outcomes as compact stat tiles. */
export function MetricTiles({ metrics, size = "sm", className }: { metrics: ProjectMetric[]; size?: "sm" | "lg"; className?: string }) {
  return (
    <dl className={cn("grid gap-2", metrics.length > 1 ? "grid-cols-2" : "grid-cols-1", className)}>
      {metrics.map((m) => (
        <div
          key={m.label}
          className={cn(
            "flex flex-col-reverse rounded-2xl border border-primary/25 bg-primary/[0.06]",
            size === "lg" ? "p-6" : "px-4 py-3",
          )}
        >
          <dt className={cn("text-muted-foreground", size === "lg" ? "mt-2 text-sm" : "mt-1 text-xs")}>{m.label}</dt>
          <dd
            className={cn(
              "font-heading font-medium tracking-[-0.04em] text-primary tabular",
              size === "lg" ? "text-4xl sm:text-5xl" : "text-2xl",
            )}
          >
            {m.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
