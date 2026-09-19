"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Database, GitBranch, Layers, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const TABS = [
  { id: "database", label: "Database Design", icon: Database },
  { id: "workflow", label: "System Workflow", icon: GitBranch },
  { id: "logic", label: "Logic Structure", icon: Layers },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project?.architecture && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-sm p-4"
          onClick={onClose}
          role="presentation"
        >
          <ProjectModalPanel
            key={project.slug}
            project={project}
            architecture={project.architecture}
            onClose={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectModalPanel({
  project,
  architecture,
  onClose,
}: {
  project: Project;
  architecture: NonNullable<Project["architecture"]>;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<TabId>("database");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={(e) => e.stopPropagation()}
      className="glass glow-border max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl"
    >
      <div className="flex items-start justify-between border-b border-border px-6 py-5">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-primary">
            System Architecture &amp; Database Deep-Dive
          </p>
          <h3 id="project-modal-title" className="mt-1 font-heading text-xl font-semibold">
            {project.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-90 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2.5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors active:scale-95",
              tab === id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </div>

      <div className="max-h-[45vh] overflow-y-auto px-6 py-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="font-mono text-sm leading-relaxed text-muted-foreground"
          >
            {architecture[tab]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
