"use client";

import { useEffect, useState } from "react";

interface UseTypewriterOptions {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  /** When false, types the first word once and stops instead of looping/deleting. */
  loop?: boolean;
  /** Pauses typing while false (e.g. scrolled off-screen) so it doesn't re-render for nothing. */
  active?: boolean;
}

export function useTypewriter({
  words,
  typingSpeed = 55,
  deletingSpeed = 30,
  pauseDuration = 1800,
  loop = true,
  active = true,
}: UseTypewriterOptions) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) return;
    // Capability check requires window, so it can only be known post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(true);
    setText(words[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reducedMotion || !active) return;

    const current = words[wordIndex % words.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      if (!loop) return;
      timeout = setTimeout(() => setDeleting(true), pauseDuration);
    } else if (deleting && text === "") {
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, typingSpeed);
    } else {
      const next = deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1);
      timeout = setTimeout(() => setText(next), deleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration, reducedMotion, loop, active]);

  return text;
}
