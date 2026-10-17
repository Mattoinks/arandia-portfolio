"use client";

import { motion, type Variants } from "framer-motion";
import { EASE } from "@/lib/motion";

// Decorative and intricate: reveal once rather than replaying on every scroll pass.
const viewportOnce = { once: true, margin: "0px 0px -10% 0px" } as const;

/*
  Decorative mini-illustrations for the two capability cards. Pure markup +
  one SVG — no images — so they theme with the site's tokens and stay sharp.
  Everything is aria-hidden; the card text carries the meaning.
*/

const stagger = (delayChildren = 0.2, staggerChildren = 0.07): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

const rise: Variants = {
  hidden: { opacity: 0, transform: "translateY(12px)" },
  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.7, ease: EASE } },
};

const TABLES = [
  { name: "requests", fields: ["id", "status", "lot_id"], x: 8, y: 14 },
  { name: "lots", fields: ["id", "batch", "qty"], x: 8, y: 116 },
  { name: "users", fields: ["id", "role"], x: 118, y: 66 },
];

const ROWS = [
  { id: "REQ-2041", w: "w-16", live: true },
  { id: "REQ-2040", w: "w-12", live: false },
  { id: "REQ-2039", w: "w-20", live: true },
  { id: "REQ-2038", w: "w-10", live: false },
  { id: "REQ-2037", w: "w-14", live: true },
  { id: "REQ-2036", w: "w-8", live: false },
  { id: "REQ-2035", w: "w-16", live: false },
];

/** Browser window: an ER schema on the left feeding a records dashboard on the right. */
export function WebSystemsVisual() {
  return (
    <motion.div
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger(0.1, 0.05)}
      className="flex flex-1 flex-col overflow-hidden rounded-t-2xl border border-b-0 border-border bg-background/80 shadow-[0_-8px_24px_-18px_rgb(var(--shadow-tint)/0.5)]"
    >
      {/* Chrome */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-foreground/15" />
          <span className="h-2 w-2 rounded-full bg-foreground/15" />
          <span className="h-2 w-2 rounded-full bg-foreground/15" />
        </div>
        <span className="mx-auto rounded-md bg-foreground/[0.05] px-3 py-1 font-mono text-[0.625rem] text-muted-foreground">
          api.arandia.dev/v1/records
        </span>
      </div>

      <div className="grid flex-1 grid-cols-5 gap-4 p-4">
        {/* Schema */}
        <div className="relative col-span-5 h-[11.75rem] sm:col-span-2">
          <svg viewBox="0 0 200 188" className="absolute inset-0 h-full w-full" fill="none">
            {[
              "M88 40 C 104 40, 104 86, 118 86",
              "M88 140 C 104 140, 104 98, 118 98",
              "M48 66 L 48 116",
            ].map((d, i) => (
              <motion.path
                key={d}
                d={d}
                stroke="var(--primary)"
                strokeWidth="1.25"
                strokeDasharray="3 3"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  show: { pathLength: 1, opacity: 0.8, transition: { duration: 1, delay: 0.5 + i * 0.15, ease: EASE } },
                }}
              />
            ))}
          </svg>
          {TABLES.map((t) => (
            <motion.div
              key={t.name}
              variants={rise}
              className="absolute w-[5rem] overflow-hidden rounded-lg border border-border bg-card text-[0.5625rem] leading-none shadow-sm"
              style={{ left: `${(t.x / 200) * 100}%`, top: `${t.y / 16}rem` }}
            >
              <div className="border-b border-border bg-foreground/[0.04] px-2 py-1.5 font-mono font-medium text-foreground">
                {t.name}
              </div>
              <div className="space-y-1 px-2 py-1.5 font-mono text-muted-foreground">
                {t.fields.map((f) => (
                  <div key={f} className="flex items-center gap-1">
                    <span className={f === "id" ? "text-primary" : "text-muted-foreground/60"}>{f === "id" ? "◆" : "◇"}</span>
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dashboard */}
        <div className="col-span-5 hidden min-h-0 flex-col gap-2.5 sm:col-span-3 sm:flex">
          <motion.div variants={rise} className="grid grid-cols-3 gap-2">
            {[
              ["Open", "128"],
              ["Matched", "96%"],
              ["Today", "14"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border bg-card px-2.5 py-2">
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                <p className="mt-1 font-heading text-base font-medium tracking-[-0.03em] tabular">{value}</p>
              </div>
            ))}
          </motion.div>
          <motion.div variants={stagger(0.35, 0.08)} className="max-h-[16.25rem] min-h-[7.5rem] flex-1 overflow-hidden rounded-lg border border-border bg-card">
            {ROWS.map((r) => (
              <motion.div
                key={r.id}
                variants={rise}
                className="flex items-center gap-2.5 border-b border-border px-2.5 py-2 last:border-b-0"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${r.live ? "bg-primary" : "bg-foreground/25"}`} />
                <span className="font-mono text-[0.5625rem] text-foreground tabular">{r.id}</span>
                <span className={`ml-auto h-1.5 rounded-full bg-foreground/10 ${r.w}`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

const LIST = [
  { title: "Admission request", meta: "Approved", accent: true },
  { title: "Care note added", meta: "2m ago", accent: false },
  { title: "Visit scheduled", meta: "Fri 10:00", accent: false },
];

/** Phone rising out of the card's bottom edge, with an app screen that fills in. */
export function MobileAppVisual() {
  return (
    <motion.div
      aria-hidden
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger(0.25, 0.08)}
      className="flex justify-center"
    >
      <motion.div
        variants={{
          hidden: { y: 60, opacity: 0 },
          show: { y: 0, opacity: 1, transition: { duration: 1.1, ease: EASE } },
        }}
        className="w-[14.25rem] transition-transform duration-500 ease-out-strong group-hover/cap:-translate-y-2"
      >
        <div className="rounded-t-[2.4rem] border-[6px] border-b-0 border-foreground/10 bg-background p-3 pb-0 shadow-[0_-8px_24px_-18px_rgb(var(--shadow-tint)/0.6)]">
          {/* Status bar + island */}
          <div className="relative flex items-center justify-between px-2 pb-3 pt-1 font-mono text-[0.5625rem] text-foreground tabular">
            <span>9:41</span>
            <span className="absolute left-1/2 top-0.5 h-4 w-16 -translate-x-1/2 rounded-full bg-foreground/90" />
            <span className="flex gap-0.5">
              <span className="h-1.5 w-1 rounded-sm bg-foreground/60" />
              <span className="h-1.5 w-1 rounded-sm bg-foreground/60" />
              <span className="h-1.5 w-1 rounded-sm bg-foreground/30" />
            </span>
          </div>

          <motion.div variants={rise} className="flex items-center justify-between px-1">
            <div>
              <p className="text-[0.5625rem] text-muted-foreground">Good evening</p>
              <p className="font-heading text-sm font-medium tracking-[-0.03em]">Dashboard</p>
            </div>
            <span className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary/40" />
          </motion.div>

          <motion.div
            variants={rise}
            className="mt-3 rounded-2xl bg-primary p-3 text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]"
          >
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] opacity-80">Residents in care</p>
            <p className="mt-1 font-heading text-2xl font-medium tracking-[-0.04em] tabular">42</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/15">
              <motion.div
                variants={{
                  hidden: { scaleX: 0 },
                  show: { scaleX: 0.68, transition: { duration: 1.2, delay: 0.6, ease: EASE } },
                }}
                className="h-full origin-left rounded-full bg-primary-foreground/80"
              />
            </div>
          </motion.div>

          <div className="mt-3 space-y-1.5 pb-4">
            {LIST.map((item) => (
              <motion.div
                key={item.title}
                variants={rise}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-2"
              >
                <span className={`h-5 w-5 shrink-0 rounded-md ${item.accent ? "bg-primary/20" : "bg-foreground/[0.07]"}`} />
                <span className="truncate text-[0.625rem] font-medium">{item.title}</span>
                <span className={`ml-auto shrink-0 font-mono text-[0.5rem] ${item.accent ? "text-primary" : "text-muted-foreground"}`}>
                  {item.meta}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
