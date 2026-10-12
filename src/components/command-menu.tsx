"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowUpRight,
  AtSign,
  Briefcase,
  CornerDownLeft,
  GraduationCap,
  Hash,
  Layers,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/brand-icons";
import { profile, socials } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  group: "Navigate" | "Actions" | "Elsewhere";
  label: string;
  hint?: string;
  icon: ReactNode;
  run: () => void;
}

const CommandMenuContext = createContext<{ open: () => void }>({ open: () => {} });

/** Opens the palette from anywhere (e.g. the navbar's ⌘K button). */
export function useCommandMenu() {
  return useContext(CommandMenuContext);
}

const ICON = "h-4 w-4";

export function CommandMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <CommandMenuContext.Provider value={value}>
      {children}
      {isOpen && <CommandPalette onClose={() => setIsOpen(false)} />}
    </CommandMenuContext.Provider>
  );
}

/*
  Deliberately has no open/close animation: a command palette is a
  keyboard-driven tool opened many times per session, and motion would only
  make it feel slower.
*/
function CommandPalette({ onClose }: { onClose: () => void }) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const commands = useMemo<Command[]>(() => {
    const go = (hash: string) => () => {
      onClose();
      // Sections live on the home page; from a project page, navigate there.
      if (hash !== "#top" && !document.querySelector(hash)) {
        router.push(`/${hash}`);
        return;
      }
      // Let the palette unmount and scrolling unlock before gliding.
      requestAnimationFrame(() => scrollToTarget(hash));
    };
    const github = socials.find((s) => s.icon === "github")?.href;
    const linkedin = socials.find((s) => s.icon === "linkedin")?.href;
    return [
      { id: "top", group: "Navigate", label: "Home", icon: <Hash className={ICON} />, run: go("#top") },
      { id: "skills", group: "Navigate", label: "Capabilities", icon: <Sparkles className={ICON} />, run: go("#skills") },
      { id: "work", group: "Navigate", label: "Selected work", icon: <Briefcase className={ICON} />, run: go("#work") },
      { id: "certs", group: "Navigate", label: "Certifications", icon: <ShieldCheck className={ICON} />, run: go("#certifications") },
      { id: "edu", group: "Navigate", label: "Education", icon: <GraduationCap className={ICON} />, run: go("#education") },
      { id: "about", group: "Navigate", label: "About", icon: <User className={ICON} />, run: go("#about") },
      { id: "contact", group: "Navigate", label: "Contact", icon: <AtSign className={ICON} />, run: go("#contact") },
      {
        id: "copy",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        icon: <Layers className={ICON} />,
        run: () => {
          navigator.clipboard
            .writeText(profile.email)
            .then(() => setToast("Email copied"))
            .catch(() => (window.location.href = `mailto:${profile.email}`));
        },
      },
      {
        id: "resume",
        group: "Actions",
        label: "Download resume",
        hint: "PDF",
        icon: <ArrowDownToLine className={ICON} />,
        run: () => {
          const a = document.createElement("a");
          a.href = profile.resumeUrl;
          a.download = "";
          a.click();
          onClose();
        },
      },
      {
        id: "theme",
        group: "Actions",
        label: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        icon: <Moon className={ICON} />,
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          onClose();
        },
      },
      ...(github
        ? [{ id: "gh", group: "Elsewhere" as const, label: "GitHub", hint: "Mattoinks", icon: <GithubIcon className={ICON} />, run: () => window.open(github, "_blank", "noreferrer") }]
        : []),
      ...(linkedin
        ? [{ id: "li", group: "Elsewhere" as const, label: "LinkedIn", hint: "mattoinks", icon: <LinkedinIcon className={ICON} />, run: () => window.open(linkedin, "_blank", "noreferrer") }]
        : []),
    ];
  }, [onClose, resolvedTheme, setTheme, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.hint ?? ""}`.toLowerCase().includes(q));
  }, [commands, query]);

  const activeIndex = Math.min(active, Math.max(filtered.length - 1, 0));

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lockScroll(true);
    inputRef.current?.focus();
    return () => {
      lockScroll(false);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((activeIndex + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((activeIndex - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.run();
    }
  };

  let lastGroup = "";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center bg-background/60 px-4 pt-[14vh] backdrop-blur-sm"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="glass w-full max-w-lg overflow-hidden rounded-2xl shadow-[0_32px_80px_-24px_rgb(var(--shadow-tint)/0.6)] backdrop-blur-md"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Type a command or search…"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={filtered[activeIndex] ? `cmd-${filtered[activeIndex].id}` : undefined}
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <span className="kbd">esc</span>
        </div>

        <ul ref={listRef} id="command-list" role="listbox" data-lenis-prevent className="max-h-[50vh] overflow-y-auto overscroll-contain p-2">
          {filtered.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-muted-foreground">No results for “{query}”.</li>
          )}
          {filtered.map((cmd, i) => {
            const header = cmd.group !== lastGroup ? cmd.group : null;
            lastGroup = cmd.group;
            return (
              <li key={cmd.id} role="presentation">
                {header && (
                  <p className="px-3 pb-1.5 pt-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground first:pt-1">
                    {header}
                  </p>
                )}
                <div
                  id={`cmd-${cmd.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  data-index={i}
                  onMouseMove={() => i !== activeIndex && setActive(i)}
                  onClick={() => cmd.run()}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                    i === activeIndex ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span className={cn("shrink-0", i === activeIndex && "text-primary")}>{cmd.icon}</span>
                  <span className="flex-1 truncate">{cmd.label}</span>
                  {cmd.hint && <span className="truncate font-mono text-[0.6875rem] text-muted-foreground">{cmd.hint}</span>}
                  {cmd.group === "Elsewhere" && <ArrowUpRight className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          <span aria-live="polite">{toast ?? "Navigate the site"}</span>
          <span className="flex items-center gap-1.5">
            <span className="kbd">↑</span>
            <span className="kbd">↓</span>
            <span className="ml-1">select</span>
            <span className="kbd ml-2">
              <CornerDownLeft className="h-3 w-3" />
            </span>
            <span className="ml-1">run</span>
          </span>
        </div>
      </div>
    </div>
  );
}
