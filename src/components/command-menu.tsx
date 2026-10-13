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
  Copy,
  Milestone,
  FileText,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/brand-icons";
import { profile, socials } from "@/lib/data";
import { publishedNotes } from "@/lib/notes";
import { lockScroll, scrollToTarget } from "@/lib/smooth-scroll";
import { OPEN_ASSISTANT_EVENT } from "@/lib/contact-prefill";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  group: "Ask" | "Navigate" | "Actions" | "Elsewhere";
  /** Two-digit section index shown on navigation rows. */
  index?: string;
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
      { id: "skills", group: "Navigate", index: "01", label: "Capabilities", icon: <Sparkles className={ICON} />, run: go("#skills") },
      { id: "work", group: "Navigate", index: "02", label: "Selected work", icon: <Briefcase className={ICON} />, run: go("#work") },
      { id: "exp", group: "Navigate", index: "03", label: "Experience", icon: <Milestone className={ICON} />, run: go("#experience") },
      { id: "certs", group: "Navigate", index: "04", label: "Certifications", icon: <ShieldCheck className={ICON} />, run: go("#certifications") },
      { id: "edu", group: "Navigate", index: "05", label: "Education", icon: <GraduationCap className={ICON} />, run: go("#education") },
      { id: "about", group: "Navigate", index: "06", label: "About", icon: <User className={ICON} />, run: go("#about") },
      { id: "contact", group: "Navigate", index: "07", label: "Contact", icon: <AtSign className={ICON} />, run: go("#contact") },
      {
        id: "assistant",
        group: "Actions",
        label: "Chat with Matte",
        hint: "AI assistant",
        icon: <Sparkles className={ICON} />,
        run: () => {
          onClose();
          window.dispatchEvent(new Event(OPEN_ASSISTANT_EVENT));
        },
      },
      {
        id: "copy",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        icon: <Copy className={ICON} />,
        run: () => {
          navigator.clipboard
            .writeText(profile.email)
            .then(() => setToast("Email copied"))
            .catch(() => (window.location.href = `mailto:${profile.email}`));
        },
      },
      ...(publishedNotes.length
        ? [
            {
              id: "notes",
              group: "Actions" as const,
              label: "Read notes",
              hint: `${publishedNotes.length} post${publishedNotes.length > 1 ? "s" : ""}`,
              icon: <FileText className={ICON} />,
              run: () => {
                onClose();
                router.push("/notes");
              },
            },
          ]
        : []),
      {
        id: "resume-page",
        group: "Actions",
        label: "View resume online",
        hint: "/resume",
        icon: <FileText className={ICON} />,
        run: () => {
          onClose();
          router.push("/resume");
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
    const raw = query.trim();
    const q = raw.toLowerCase();
    if (!q) return commands;
    const matches = commands.filter((c) => `${c.label} ${c.group} ${c.hint ?? ""}`.toLowerCase().includes(q));
    // Anything typed can also go straight to Matte — first when nothing else matches.
    const askMatte: Command = {
      id: "ask-matte",
      group: "Ask",
      label: `Ask Matte: “${raw.length > 48 ? `${raw.slice(0, 48)}…` : raw}”`,
      hint: "AI",
      icon: <Sparkles className={ICON} />,
      run: () => {
        onClose();
        window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT, { detail: { question: raw } }));
      },
    };
    return matches.length ? [...matches, askMatte] : [askMatte];
  }, [commands, query, onClose]);

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
      className="fixed inset-0 z-[110] flex items-start justify-center bg-background/60 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="relative w-full max-w-xl overflow-hidden rounded-[1.5rem] border border-card-border bg-background shadow-[0_40px_100px_-30px_rgb(var(--shadow-tint)/0.8)]"
      >
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(70%_100%_at_15%_0%,var(--glow),transparent)]" />

        {/* Search */}
        <div className="relative flex items-center gap-3 border-b border-border/70 px-5">
          <Search className="h-[1.125rem] w-[1.125rem] shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search the site, or ask Matte anything…"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={filtered[activeIndex] ? `cmd-${filtered[activeIndex].id}` : undefined}
            className="cmdk-input h-16 w-full bg-transparent text-[1.0625rem] tracking-[-0.01em] outline-none placeholder:text-muted-foreground"
          />
          <span className="kbd">esc</span>
        </div>

        {/* Results */}
        <ul
          ref={listRef}
          id="command-list"
          role="listbox"
          data-lenis-prevent
          className="thin-scroll relative max-h-[52vh] overflow-y-auto overscroll-contain p-2"
        >
          {filtered.map((cmd, i) => {
            const header = cmd.group !== lastGroup ? cmd.group : null;
            lastGroup = cmd.group;
            const isActive = i === activeIndex;
            const groupCount = header ? filtered.filter((c) => c.group === cmd.group).length : 0;
            return (
              <li key={cmd.id} role="presentation">
                {header && (
                  <p className="flex items-center gap-2 px-3 pb-2 pt-4 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground first:pt-2">
                    {header === "Ask" ? "Ask Matte" : header}
                    <span className="text-muted-foreground/50 tabular">{groupCount}</span>
                  </p>
                )}
                <div
                  id={`cmd-${cmd.id}`}
                  role="option"
                  aria-selected={isActive}
                  data-index={i}
                  onMouseMove={() => !isActive && setActive(i)}
                  onClick={() => cmd.run()}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 text-sm",
                    isActive ? "bg-foreground/[0.06] text-foreground" : "text-muted-foreground",
                  )}
                >
                  {/* Accent bar on the selected row — no motion: this is a keyboard tool. */}
                  <span
                    aria-hidden
                    className={cn("absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary", !isActive && "opacity-0")}
                  />
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                      cmd.group === "Ask"
                        ? "border-primary/40 bg-primary text-primary-foreground"
                        : isActive
                          ? "border-primary/40 bg-primary/12 text-primary"
                          : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {cmd.icon}
                  </span>
                  <span className={cn("flex-1 truncate", cmd.group === "Ask" && "text-foreground")}>{cmd.label}</span>
                  {cmd.index && <span className="font-mono text-[0.6875rem] text-muted-foreground/60 tabular">{cmd.index}</span>}
                  {cmd.hint && !isActive && (
                    <span className="max-w-[40%] truncate font-mono text-[0.6875rem] text-muted-foreground">{cmd.hint}</span>
                  )}
                  {cmd.group === "Elsewhere" && !isActive && <ArrowUpRight className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />}
                  {isActive && (
                    <span className="kbd border-primary/30 text-primary" aria-hidden>
                      <CornerDownLeft className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="relative flex items-center justify-between gap-4 border-t border-border/70 bg-card/50 px-5 py-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          <span aria-live="polite" className={cn("flex items-center", toast && "text-primary")}>
            {toast ?? (
              <>
                Arandia<span className="text-primary">.</span>dev
              </>
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="kbd">↑</span>
            <span className="kbd">↓</span>
            <span className="ml-1 mr-2">select</span>
            <span className="kbd">
              <CornerDownLeft className="h-3 w-3" />
            </span>
            <span className="ml-1">open</span>
          </span>
        </div>
      </div>
    </div>
  );
}
