"use client";

import { useActionState, useEffect, useRef, useState, type FocusEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { sendMessage } from "@/app/actions/contact";
import {
  CONTACT_LIMITS,
  SUBJECT_SUGGESTIONS,
  validateContact,
  type ContactField,
  type ContactState,
} from "@/lib/contact";
import { EASE_OUT } from "@/lib/motion";
import { onContactPrefill, takePendingPrefill, type ContactPrefill } from "@/lib/contact-prefill";
import { cn } from "@/lib/utils";

const INITIAL: ContactState = { status: "idle" };

const inputClass =
  "w-full rounded-2xl border border-border bg-background/60 px-4 py-3.5 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/60 focus:border-foreground/30 focus:shadow-[0_0_0_4px_var(--glow)] aria-[invalid=true]:border-destructive/70";

function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: ContactField;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </label>
        {hint && <span className="font-mono text-[0.625rem] text-muted-foreground/70 tabular">{hint}</span>}
      </div>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="overflow-hidden pt-2 text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendMessage, INITIAL);
  // Client-side errors appear once a field is left; server errors arrive with the response.
  const [touched, setTouched] = useState<Partial<Record<ContactField, string>>>({});
  const [messageLength, setMessageLength] = useState(state.values?.message?.length ?? 0);
  // Controlled so the suggestion chips can fill it and show which one is picked.
  const [subject, setSubject] = useState(state.values?.subject ?? "");
  // Each submission returns a fresh state object, so "Send another" dismisses this one only.
  const [dismissed, setDismissed] = useState<ContactState | null>(null);
  const [formKey, setFormKey] = useState(0);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Drafts handed over by the assistant ("Ask Matthew directly").
  useEffect(() => {
    const apply = (d: ContactPrefill) => {
      takePendingPrefill(); // consumed — don't re-apply on a later mount
      if (d.subject) setSubject(d.subject);
      const el = messageRef.current;
      if (el && d.message && !el.value.trim()) {
        el.value = d.message;
        setMessageLength(d.message.length);
      }
      // Focus after the smooth scroll settles, without yanking the page.
      setTimeout(() => el?.focus({ preventScroll: true }), 900);
    };
    const pending = takePendingPrefill();
    if (pending) apply(pending);
    return onContactPrefill(apply);
  }, [formKey]);

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const form = e.currentTarget.form;
    if (!form) return;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };
    const field = e.currentTarget.name as ContactField;
    if (!values[field]) return; // don't nag about fields the user hasn't started
    setTouched((t) => ({ ...t, [field]: validateContact(values)[field] }));
  };

  const errorFor = (field: ContactField) =>
    field in touched ? touched[field] : state.status === "error" ? state.fieldErrors?.[field] : undefined;

  const done = state.status === "success" && state !== dismissed;

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="rounded-[1.75rem] border border-border bg-card p-8"
            role="status"
          >
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0.4, delay: 0.1 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <Check className="h-5 w-5" strokeWidth={2} />
            </motion.span>
            <h3 className="mt-6 font-heading text-2xl font-medium tracking-[-0.03em]">Message sent.</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
              Thanks for reaching out — I&apos;ll get back to you at the email you gave.
            </p>
            <button
              type="button"
              onClick={() => {
                setDismissed(state);
                setFormKey((k) => k + 1);
                setMessageLength(0);
                setSubject("");
              }}
              className="link-underline mt-6 cursor-pointer pb-0.5 text-sm font-medium"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key={`form-${formKey}`}
            action={formAction}
            noValidate
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="space-y-5"
            onSubmit={() => setTouched({})}
          >
            {/* Honeypot — hidden from people and assistive tech, irresistible to bots. */}
            <div aria-hidden className="absolute -left-[624.938rem] h-px w-px overflow-hidden">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Name" error={errorFor("name")}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={CONTACT_LIMITS.name}
                  defaultValue={state.values?.name}
                  placeholder="Your name"
                  aria-invalid={!!errorFor("name")}
                  aria-describedby={errorFor("name") ? "name-error" : undefined}
                  onBlur={onBlur}
                  className={inputClass}
                />
              </Field>
              <Field id="email" label="Email" error={errorFor("email")}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                  defaultValue={state.values?.email}
                  placeholder="you@company.com"
                  aria-invalid={!!errorFor("email")}
                  aria-describedby={errorFor("email") ? "email-error" : undefined}
                  onBlur={onBlur}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field id="subject" label="Subject" error={errorFor("subject")}>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                maxLength={CONTACT_LIMITS.subject}
                value={subject}
                onChange={(e) => setSubject(e.currentTarget.value)}
                placeholder="What's this about?"
                aria-invalid={!!errorFor("subject")}
                aria-describedby={errorFor("subject") ? "subject-error subject-suggestions" : "subject-suggestions"}
                onBlur={onBlur}
                className={inputClass}
              />
              <div id="subject-suggestions" className="mt-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Subject suggestions">
                {SUBJECT_SUGGESTIONS.map((suggestion) => {
                  const active = subject === suggestion;
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setSubject(suggestion);
                        setTouched((t) => ({ ...t, subject: undefined }));
                      }}
                      className={cn(
                        "press cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-colors duration-200",
                        active
                          ? "border-primary/50 bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                      )}
                    >
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field id="message" label="Message" error={errorFor("message")} hint={`${messageLength}/${CONTACT_LIMITS.message}`}>
              <textarea
                ref={messageRef}
                id="message"
                name="message"
                required
                rows={5}
                maxLength={CONTACT_LIMITS.message}
                defaultValue={state.values?.message}
                placeholder="What are you building, and how can I help?"
                aria-invalid={!!errorFor("message")}
                aria-describedby={errorFor("message") ? "message-error" : undefined}
                onBlur={onBlur}
                onChange={(e) => setMessageLength(e.currentTarget.value.length)}
                className={cn(inputClass, "resize-none")}
              />
            </Field>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="submit"
                disabled={pending}
                enterKeyHint="send"
                className="group/btn press relative inline-flex cursor-pointer items-center gap-3 rounded-full bg-primary py-1.5 pl-6 pr-1.5 text-sm font-medium text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_8px_24px_-10px_var(--glow)] transition-[opacity,box-shadow] duration-300 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_14px_34px_-10px_var(--primary)] disabled:cursor-wait disabled:opacity-80"
              >
                <span>{pending ? "Sending…" : "Send message"}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10" aria-hidden>
                  {pending ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                  ) : (
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-500 ease-out-strong group-hover/btn:-translate-y-[1px] group-hover/btn:translate-x-[2px]"
                      strokeWidth={1.5}
                    />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {state.status === "error" && state.message && !pending && (
                  <motion.p
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                    role="alert"
                    className="max-w-xs text-sm text-muted-foreground"
                  >
                    {state.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
