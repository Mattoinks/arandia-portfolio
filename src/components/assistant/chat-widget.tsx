"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowUpRight, RotateCcw, Sparkles, X } from "lucide-react";
import { LOCAL_ANSWERS, SUGGESTED, parseReply } from "@/lib/assistant/knowledge";
import { socials } from "@/lib/data";
import { OPEN_ASSISTANT_EVENT, prefillContact } from "@/lib/contact-prefill";
import { EASE, EASE_OUT } from "@/lib/motion";
import { lockScroll, scrollToTarget } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

/* "Matte" — the portfolio assistant. Suggested questions are answered locally;
   anything else streams from /api/chat (Groq free tier) and hands off to the
   contact form when it needs Matthew himself. */

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  handoff?: boolean;
  /** Still arriving (streaming or local typewriter). */
  streaming?: boolean;
  /** Waiting for the first token — show the typing indicator. */
  thinking?: boolean;
  /** Related next questions for this answer (from the local knowledge tree). */
  followUps?: string[];
}

const BOT = "Matte";
const MAX_CHARS = 500;
const NUDGE_KEY = "matte:nudged";
let nextId = 1;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rise = { hidden: { opacity: 0, transform: "translateY(8px)" }, show: { opacity: 1, transform: "translateY(0px)" } };

function Avatar({ className, sizes, eager }: { className?: string; sizes: string; eager?: boolean }) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden rounded-full bg-primary", className)}>
      <Image
        src="/assets/avatar/assistant-icon-v2.webp"
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
        {...(eager ? { loading: "eager" as const } : {})}
      />
    </span>
  );
}

/** Plain text with URLs and email addresses turned into links. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+|(?<![\w/])\/(?:resume|work\/[\w-]+))/g);
  return (
    <>
      {parts.map((part, i): ReactNode => {
        if (/^https?:\/\//.test(part))
          return (
            <a key={i} href={part} target="_blank" rel="noreferrer" className="text-primary underline-offset-2 [overflow-wrap:anywhere] hover:underline">
              {part.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
            </a>
          );
        if (/^\/(?:resume|work\/[\w-]+)$/.test(part))
          return (
            <a key={i} href={part} className="text-primary underline-offset-2 hover:underline">
              {part === "/resume" ? "his online resume" : "the case study"}
            </a>
          );
        if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part))
          return (
            // Compact inline chip: Gmail mark + address, sits inside the sentence.
            <a
              key={i}
              href={`mailto:${part}`}
              className="press group mx-0.5 inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-background/60 py-0.5 pl-1 pr-2.5 align-middle text-[0.8125rem] leading-5 text-foreground transition-colors duration-200 hover:border-primary/50"
            >
              <span className="relative h-4 w-4 shrink-0">
                <Image src="/assets/icons/gmail.png" alt="" fill sizes="16px" className="object-contain" />
              </span>
              <span className="truncate group-hover:text-primary">{part}</span>
            </a>
          );
        return part;
      })}
    </>
  );
}

/** Inline formatting: **bold** (and stray single *emphasis* stripped) + links. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\*\*[^*]+\*\*$/.test(part) ? (
          <strong key={i} className="font-semibold text-foreground">
            <Linkified text={part.slice(2, -2)} />
          </strong>
        ) : (
          <Linkified key={i} text={part.replace(/(^|\s)\*(\S[^*]*\S|\S)\*(?=\s|$|[.,!?])/g, "$1$2")} />
        ),
      )}
    </>
  );
}

/* ---------- Social links as logo cards ---------- */

const SOCIAL_ICONS: Record<string, string> = {
  github: "/assets/icons/github.png",
  linkedin: "/assets/icons/linkedin.png",
  instagram: "/assets/icons/instagram.png",
  facebook: "/assets/icons/facebook.png",
};

const normalizeUrl = (url: string) =>
  url.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[/.,)]+$/, "");

const SOCIAL_BY_URL = new Map(
  socials.filter((s) => SOCIAL_ICONS[s.icon]).map((s) => [normalizeUrl(s.href), s] as const),
);

type Social = (typeof socials)[number];

/** If a reply line is just a social profile link (optionally "- Label: url"), return that profile. */
function socialFromLine(line: string): Social | null {
  const url = line.match(/https?:\/\/\S+|(?:www\.)?(?:github|linkedin|instagram|facebook)\.com\/\S+/i)?.[0];
  if (!url) return null;
  const rest = line.replace(url, "").replace(/^[-*•\d.)\s]+/, "").replace(/[:\-–—\s]+$/, "").trim();
  const social = SOCIAL_BY_URL.get(normalizeUrl(url));
  // Only treat it as a card when the line is basically just the link (plus maybe its label).
  if (!social || rest.replace(/\*/g, "").length > 24) return null;
  return social;
}

function handleOf(href: string) {
  const last = href.replace(/\/+$/, "").split("/").pop() ?? "";
  return `@${last}`;
}

function SocialCards({ items }: { items: Social[] }) {
  return (
    <div className="my-2 grid min-w-[14rem] gap-1.5 first:mt-0 last:mb-0">
      {items.map((s) => (
        <a
          key={s.href}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          className="press group flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-2 pr-3.5 transition-colors duration-200 hover:border-primary/40"
        >
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[0.7rem]">
            <Image src={SOCIAL_ICONS[s.icon]} alt="" fill sizes="36px" className="object-cover" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium leading-tight text-foreground">{s.label}</span>
            <span className="mt-0.5 block truncate text-xs leading-tight text-muted-foreground">{handleOf(s.href)}</span>
          </span>
          <ArrowUpRight
            className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-[transform,color] duration-300 ease-out-strong group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-primary"
            strokeWidth={1.75}
            aria-hidden
          />
        </a>
      ))}
    </div>
  );
}

/**
 * Renders the small Markdown subset models tend to emit — paragraphs, "- " /
 * "1." lists, **bold**, "#" headings (shown as bold lines) — as real elements,
 * so replies never show raw asterisks. Safe: builds React nodes, no HTML.
 */
function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={`l${blocks.length}`} className={cn("my-1.5 space-y-1 pl-4", list.ordered ? "list-decimal" : "list-disc", "marker:text-primary")}>
        {list.items.map((item, i) => (
          <li key={i} className="pl-0.5">
            <Inline text={item} />
          </li>
        ))}
      </Tag>,
    );
    list = null;
  };

  let socialRun: Social[] = [];
  const flushSocial = () => {
    if (!socialRun.length) return;
    blocks.push(<SocialCards key={`s${blocks.length}`} items={socialRun} />);
    socialRun = [];
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const social = line ? socialFromLine(line) : null;
    if (social) {
      flush();
      if (!socialRun.some((x) => x.href === social.href)) socialRun.push(social);
      continue;
    }
    if (line) flushSocial();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const ordered = !!numbered;
      if (list && list.ordered !== ordered) flush();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
      continue;
    }
    flush();
    if (!line) continue;
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    blocks.push(
      <p key={`p${blocks.length}`} className={cn("[&:not(:first-child)]:mt-2", heading && "font-semibold text-foreground")}>
        <Inline text={heading ? heading[1] : line} />
      </p>,
    );
  }
  flush();
  flushSocial();
  return <>{blocks}</>;
}

function TypingIndicator() {
  return (
    <span className="flex items-center gap-1 py-1.5" aria-label={`${BOT} is typing`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-primary" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [nudgeTyping, setNudgeTyping] = useState(true);
  const [nudgeHover, setNudgeHover] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus({ preventScroll: true }));
  }, []);

  const openPanel = useCallback(() => {
    setNudge(false);
    setOpen(true);
  }, []);

  // A one-time greeting bubble per session, a few seconds after landing.
  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(NUDGE_KEY) === "1";
    } catch {}
    if (seen) return;
    const show = setTimeout(() => {
      setNudge(true);
      try {
        sessionStorage.setItem(NUDGE_KEY, "1");
      } catch {}
    }, 6000);
    return () => clearTimeout(show);
  }, []);
  // Typing dots first, then the message — like Matte just started a chat.
  useEffect(() => {
    if (!nudge) return; // shown once per session, so nudgeTyping starts true
    const t = setTimeout(() => setNudgeTyping(false), reduce ? 0 : 1300);
    return () => clearTimeout(t);
  }, [nudge, reduce]);
  // Auto-hide after a while, paused while hovered.
  useEffect(() => {
    if (!nudge || nudgeHover) return;
    const hide = setTimeout(() => setNudge(false), 12000);
    return () => clearTimeout(hide);
  }, [nudge, nudgeHover]);

  // Opened from elsewhere (⌘K) — optionally with a question to ask right away.
  const askRef = useRef<(q: string) => void>(() => {});
  useEffect(() => {
    const onOpen = (e: Event) => {
      openPanel();
      const question = (e as CustomEvent<{ question?: string }>).detail?.question;
      if (question) setTimeout(() => askRef.current(question), 250);
    };
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen);
  }, [openPanel]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const sheet = window.matchMedia("(max-width: 639px)").matches;
    if (sheet) lockScroll(true);
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 120);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (sheet) lockScroll(false);
      clearTimeout(t);
    };
  }, [open, close]);

  // Keep the newest message in view as it grows.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, open, reduce]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Auto-grow the composer up to ~4 lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [input]);

  const push = (m: Omit<Message, "id">) => {
    const msg = { ...m, id: nextId++ };
    setMessages((ms) => [...ms, msg]);
    return msg.id;
  };
  const patch = (id: number, update: Partial<Message>) =>
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...update } : m)));

  /** Reveal a known answer word by word so local replies feel like Matte typing. */
  const typeOut = async (id: number, text: string, signal: AbortSignal) => {
    if (reduce) {
      patch(id, { content: text, thinking: false, streaming: false });
      return;
    }
    await sleep(550 + Math.random() * 250);
    const words = text.split(/(\s+)/);
    let shown = "";
    patch(id, { thinking: false });
    for (const w of words) {
      if (signal.aborted) return;
      shown += w;
      patch(id, { content: shown });
      if (w.trim()) await sleep(18 + Math.random() * 22);
    }
    patch(id, { streaming: false });
  };

  const ask = async (question: string) => {
    const text = question.trim().slice(0, MAX_CHARS);
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;

    const history = [...messages.filter((m) => !m.thinking && m.content), { role: "user" as const, content: text }]
      .map(({ role, content }) => ({ role, content }))
      .slice(-10);

    push({ role: "user", content: text });
    const replyId = push({ role: "assistant", content: "", thinking: true, streaming: true });

    try {
      const local = LOCAL_ANSWERS.find((s) => s.question === text);
      if (local) {
        await typeOut(replyId, local.answer, controller.signal);
        patch(replyId, { handoff: !!local.handoff, followUps: local.followUps });
        return;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const fallback =
          res.status === 429
            ? ((await res.json().catch(() => null))?.error ?? "I'm getting a lot of questions — try again in a moment.")
            : "I can't answer custom questions right now — but you can ask Matthew directly.";
        await typeOut(replyId, fallback, controller.signal);
        patch(replyId, { handoff: true });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let raw = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        raw += decoder.decode(value, { stream: true });
        // Hide a half-streamed "[[HANDOFF]]" marker while it arrives.
        const visible = raw.replace(/\[\[[A-Z]*\]?\]?$/, "").replaceAll("[[HANDOFF]]", "").trimEnd();
        if (visible) patch(replyId, { content: visible, thinking: false });
      }
      const { text: answer, handoff } = parseReply(raw);
      patch(replyId, {
        content: answer || "Hmm, I don't have a good answer for that — Matthew can help directly.",
        handoff: handoff || !answer,
        thinking: false,
        streaming: false,
      });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      patch(replyId, {
        content: "Something went wrong on my end. You can still reach Matthew directly.",
        handoff: true,
        thinking: false,
        streaming: false,
      });
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  useEffect(() => {
    askRef.current = (q: string) => void ask(q);
  });

  const reset = () => {
    abortRef.current?.abort();
    setBusy(false);
    setMessages([]);
    setInput("");
    inputRef.current?.focus({ preventScroll: true });
  };

  const handOff = (question?: string) => {
    prefillContact({
      subject: "Question from your portfolio",
      message: question ? `Hi Matthew,\n\n${question}` : undefined,
    });
    setOpen(false);
    if (pathname === "/") requestAnimationFrame(() => scrollToTarget("#contact"));
    else router.push("/#contact");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };

  const lastUserQuestion = (beforeId: number) =>
    [...messages].reverse().find((m) => m.role === "user" && m.id < beforeId)?.content;

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content));
  // Prefer the follow-ups tied to the last answer; otherwise fall back to the starters.
  const contextual = (messages[messages.length - 1]?.followUps ?? []).filter((q) => !asked.has(q));
  const followUps = (
    contextual.length ? contextual : SUGGESTED.map((s) => s.question).filter((q) => !asked.has(q))
  ).slice(0, 3);
  const last = messages[messages.length - 1];
  const showFollowUps = !busy && last?.role === "assistant" && !last.streaming && followUps.length > 0;
  const empty = messages.length === 0;

  const bubbleMotion = (fromRight: boolean) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, transform: `translate(${fromRight ? 12 : -8}px, 8px) scale(0.97)` },
          animate: { opacity: 1, transform: "translate(0px, 0px) scale(1)" },
        };

  return (
    <>
      {/* ---------- Launcher ---------- */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, transform: "translateY(16px) scale(0.85)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(8px) scale(0.9)", transition: { duration: 0.15 } }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.8 }}
            className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-30 flex items-end gap-3 sm:right-6"
          >
            {/* One-time greeting: a chat-style message from Matte with quick replies */}
            <AnimatePresence>
              {nudge && (
                <motion.div
                  role="status"
                  onMouseEnter={() => setNudgeHover(true)}
                  onMouseLeave={() => setNudgeHover(false)}
                  initial={{ opacity: 0, transform: "translate(12px, 12px) scale(0.9)" }}
                  animate={{ opacity: 1, transform: "translate(0px, 0px) scale(1)" }}
                  exit={{ opacity: 0, transform: "translate(6px, 6px) scale(0.95)", transition: { duration: 0.15 } }}
                  transition={{ type: "spring", duration: 0.55, bounce: 0.22 }}
                  className="group/nudge relative mb-3 hidden w-[19rem] origin-bottom-right sm:block"
                >
                  <div className="relative overflow-hidden rounded-[1.25rem] rounded-br-md border border-card-border bg-background shadow-[0_20px_50px_-20px_rgb(var(--shadow-tint)/0.7)]">
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[radial-gradient(70%_100%_at_15%_0%,var(--glow),transparent)]" />

                    {/* Sender row */}
                    <div className="relative flex items-center gap-2.5 px-4 pt-3.5">
                      <span className="relative">
                        <Avatar className="h-7 w-7" sizes="28px" />
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" aria-hidden />
                      </span>
                      <p className="flex-1 text-[0.8125rem] font-medium">
                        {BOT} <span className="font-normal text-muted-foreground">· now</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setNudge(false)}
                        aria-label="Dismiss message"
                        className="press -mr-1 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.07] hover:text-foreground cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                    </div>

                    {/* Message (types in first) */}
                    <div className="relative min-h-[3.25rem] px-4 pb-3 pt-1.5">
                      <AnimatePresence mode="wait" initial={false}>
                        {nudgeTyping ? (
                          <motion.div key="typing" exit={{ opacity: 0, transition: { duration: 0.1 } }} className="pt-1">
                            <TypingIndicator />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="msg"
                            initial={{ opacity: 0, transform: "translateY(4px)" }}
                            animate={{ opacity: 1, transform: "translateY(0px)" }}
                            transition={{ duration: 0.35, ease: EASE_OUT }}
                          >
                            <p className="text-sm leading-snug">
                              Hi, I&apos;m {BOT} <span aria-hidden>👋</span>
                            </p>
                            <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                              Matthew&apos;s AI assistant — ask me about his skills, projects or availability.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Quick replies */}
                    <AnimatePresence>
                      {!nudgeTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="relative flex flex-nowrap items-center gap-1.5 border-t border-border/70 px-3 py-2.5"
                        >
                          {[SUGGESTED[1], SUGGESTED[0]].map((s, i) => (
                            <button
                              key={s.question}
                              type="button"
                              onClick={() => {
                                openPanel();
                                void ask(s.question);
                              }}
                              className="press whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors duration-200 hover:border-primary/50 cursor-pointer"
                            >
                              {i === 0 ? "What's his stack?" : "Is he available?"}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={openPanel}
                            aria-label="Ask anything"
                            title="Ask anything"
                            className="press group/ask ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground cursor-pointer"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out-strong group-hover/ask:-translate-y-px group-hover/ask:translate-x-px" strokeWidth={2} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              ref={launcherRef}
              type="button"
              onClick={openPanel}
              aria-label={`Ask ${BOT}, Matthew's AI assistant`}
              aria-haspopup="dialog"
              className="press group relative flex h-[3.75rem] items-center rounded-full cursor-pointer"
            >
              {/* Label that unrolls from behind the avatar on hover (pointer devices) */}
              <span
                aria-hidden
                className="pointer-events-none absolute right-[calc(100%-1.75rem)] top-1/2 hidden -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-card-border bg-foreground py-2 pl-4 pr-9 text-sm font-medium text-background opacity-0 shadow-lg transition-[opacity,clip-path] duration-500 ease-out-strong [clip-path:inset(0_0_0_100%_round_9999px)] [@media(hover:hover)]:flex group-hover:opacity-100 group-hover:[clip-path:inset(0_0_0_0_round_9999px)] group-focus-visible:opacity-100 group-focus-visible:[clip-path:inset(0_0_0_0_round_9999px)]"
              >
                Ask {BOT}
                <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
              </span>

              <span className="matte-ring relative block h-[3.75rem] w-[3.75rem] rounded-full transition-transform duration-500 ease-out-strong group-hover:scale-[1.06]">
                <span className="absolute inset-[3px] rounded-full bg-background p-[2px]">
                  <Avatar className="h-full w-full" sizes="60px" eager />
                </span>
                <span
                  aria-hidden
                  className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-foreground text-primary shadow-md"
                >
                  <Sparkles className="h-3 w-3" strokeWidth={2} />
                </span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Panel ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-labelledby="matte-title"
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(24px) scale(0.94)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(16px) scale(0.96)", transition: { duration: 0.18 } }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.18 }}
            className="fixed inset-x-0 bottom-0 z-[60] flex h-[86dvh] origin-bottom-right flex-col overflow-hidden rounded-t-[1.75rem] border border-card-border bg-background shadow-[0_40px_100px_-30px_rgb(var(--shadow-tint)/0.75)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(38rem,calc(100dvh-7rem))] sm:w-[25rem] sm:rounded-[1.75rem]"
          >
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(80%_100%_at_20%_0%,var(--glow),transparent)]" />

            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-border/70 px-5 py-4">
              <span className="relative">
                <Avatar className="h-11 w-11 ring-2 ring-primary/60 ring-offset-2 ring-offset-background" sizes="44px" />
                <span className="absolute -bottom-0.5 -right-0.5 flex" aria-hidden>
                  <span className="live-dot h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <p id="matte-title" className="flex items-center gap-1.5 font-heading text-base font-medium tracking-[-0.02em]">
                  {BOT}
                  <span className="rounded-full bg-primary/15 px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-primary">
                    AI
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">Matthew&apos;s assistant · Online</p>
              </div>
              {!empty && (
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Start a new chat"
                  title="New chat"
                  className="press flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                </button>
              )}
              <button
                type="button"
                onClick={close}
                aria-label="Close chat"
                className="press flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            {/* Conversation */}
            <div
              ref={listRef}
              data-lenis-prevent
              aria-live="polite"
              className="thin-scroll relative flex-1 overflow-y-auto overscroll-contain px-4 py-5"
            >
              {empty ? (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
                  className="flex min-h-full flex-col items-center justify-center text-center"
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, transform: "scale(0.8)" },
                      show: { opacity: 1, transform: "scale(1)", transition: { type: "spring", duration: 0.6, bounce: 0.35 } },
                    }}
                    className="matte-ring rounded-full"
                  >
                    <span className="block rounded-full bg-background p-1">
                      <Avatar className="h-16 w-16" sizes="64px" />
                    </span>
                  </motion.div>
                  <motion.h3 variants={rise} className="mt-4 font-heading text-2xl font-medium tracking-[-0.03em]">
                    Hi, I&apos;m <span className="font-serif font-normal italic text-primary">{BOT}</span>
                  </motion.h3>
                  <motion.p variants={rise} className="mt-2 max-w-[17rem] text-sm leading-relaxed text-muted-foreground">
                    Matthew&apos;s AI assistant. Ask about his skills, projects or availability — I&apos;ll connect you to
                    him for the rest.
                  </motion.p>
                  <div className="mt-5 grid w-full grid-cols-2 gap-2">
                    {SUGGESTED.map((s, i) => (
                      <motion.button
                        key={s.question}
                        type="button"
                        onClick={() => void ask(s.question)}
                        variants={rise}
                        className={cn(
                          "press group flex items-start gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 text-left text-[0.8125rem] leading-snug text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-foreground cursor-pointer",
                          // An odd last starter spans the full row so the grid stays even.
                          i === SUGGESTED.length - 1 && SUGGESTED.length % 2 === 1 && "col-span-2",
                        )}
                      >
                        <ArrowUpRight
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary transition-transform duration-300 ease-out-strong group-hover:-translate-y-px group-hover:translate-x-px"
                          strokeWidth={1.75}
                        />
                        {s.question}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) =>
                    m.role === "user" ? (
                      <motion.div key={m.id} {...bubbleMotion(true)} transition={{ duration: 0.35, ease: EASE_OUT }} className="flex justify-end">
                        <div className="max-w-[82%] whitespace-pre-wrap rounded-[1.25rem] rounded-br-md bg-primary px-4 py-2.5 text-[0.875rem] leading-relaxed text-primary-foreground shadow-[0_8px_20px_-12px_var(--primary)]">
                          {m.content}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={m.id}
                        {...bubbleMotion(false)}
                        transition={{ duration: 0.35, ease: EASE_OUT }}
                        className="flex items-end gap-2.5"
                      >
                        <Avatar className="mb-0.5 h-7 w-7" sizes="28px" />
                        <div className="flex min-w-0 max-w-[82%] flex-col items-start">
                          <div
                            className={cn(
                              "rounded-[1.25rem] rounded-bl-md border border-border bg-card px-4 py-2.5 text-[0.875rem] leading-relaxed text-foreground",
                              m.streaming && !m.thinking && "stream-caret",
                            )}
                          >
                            {m.thinking ? <TypingIndicator /> : <RichText text={m.content} />}
                          </div>
                          {m.thinking && <span className="mt-1.5 pl-1 text-[0.6875rem] text-muted-foreground">{BOT} is typing…</span>}
                          <AnimatePresence>
                            {m.handoff && !m.streaming && (
                              <motion.button
                                type="button"
                                onClick={() => handOff(lastUserQuestion(m.id))}
                                initial={{ opacity: 0, transform: "translateY(6px)" }}
                                animate={{ opacity: 1, transform: "translateY(0px)" }}
                                transition={{ duration: 0.35, ease: EASE_OUT, delay: 0.1 }}
                                className="press group mt-2 inline-flex items-center gap-2 rounded-full bg-foreground py-1.5 pl-3.5 pr-1.5 text-xs font-medium text-background cursor-pointer"
                              >
                                Ask Matthew directly
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                  <ArrowUpRight
                                    className="h-3.5 w-3.5 transition-transform duration-300 ease-out-strong group-hover:-translate-y-px group-hover:translate-x-px"
                                    strokeWidth={2}
                                  />
                                </span>
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ),
                  )}

                  {/* Follow-up suggestions after each finished answer */}
                  <AnimatePresence>
                    {showFollowUps && (
                      <motion.div
                        initial={{ opacity: 0, transform: "translateY(6px)" }}
                        animate={{ opacity: 1, transform: "translateY(0px)" }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.15 }}
                        className="flex flex-wrap gap-1.5 pl-[2.375rem]"
                        role="group"
                        aria-label="Suggested follow-ups"
                      >
                        {followUps.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => void ask(q)}
                            className="press rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-foreground cursor-pointer"
                          >
                            {q}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Composer */}
            <form onSubmit={onSubmit} className="relative px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex items-end gap-2 rounded-[1.25rem] border border-border bg-card p-1.5 pl-4 transition-[border-color,box-shadow] duration-200 focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px_var(--glow)]">
                <label htmlFor="matte-input" className="sr-only">
                  Message {BOT}
                </label>
                <textarea
                  ref={inputRef}
                  id="matte-input"
                  rows={1}
                  value={input}
                  maxLength={MAX_CHARS}
                  onChange={(e) => setInput(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void ask(input);
                    }
                  }}
                  placeholder={`Message ${BOT}…`}
                  enterKeyHint="send"
                  className="matte-input max-h-28 flex-1 resize-none bg-transparent py-2 text-base leading-6 outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  aria-label="Send message"
                  className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_6px_16px_-6px_var(--primary)] transition-[opacity,transform,box-shadow] duration-200 disabled:scale-90 disabled:opacity-35 disabled:shadow-none cursor-pointer disabled:cursor-default"
                >
                  <ArrowUp className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
                </button>
              </div>
              <p className="flex items-center justify-center gap-1.5 pt-2 text-[0.6875rem] text-muted-foreground">
                <Sparkles className="h-3 w-3" strokeWidth={1.75} aria-hidden />
                {input.length > 400 ? `${input.length}/${MAX_CHARS}` : "AI can make mistakes · chats aren't stored"}
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
