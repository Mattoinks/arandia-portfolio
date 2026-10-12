/** Tiny window-event bus so other UI (the assistant) can pre-fill the contact form. */

export interface ContactPrefill {
  subject?: string;
  message?: string;
}

const EVENT = "contact:prefill";
const STORAGE_KEY = "contact:prefill";

export function prefillContact(detail: ContactPrefill) {
  // Also park it in sessionStorage: if the form isn't mounted yet (asked from a
  // project page, then navigated home) it picks the draft up on mount.
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(detail));
  } catch {
    // storage unavailable (private mode) — the live event still works
  }
  window.dispatchEvent(new CustomEvent<ContactPrefill>(EVENT, { detail }));
}

/** Returns and clears a parked prefill, if any. */
export function takePendingPrefill(): ContactPrefill | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ContactPrefill) : null;
  } catch {
    return null;
  }
}

export function onContactPrefill(handler: (detail: ContactPrefill) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<ContactPrefill>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

/** Lets anything (e.g. the ⌘K menu) open the assistant panel. */
export const OPEN_ASSISTANT_EVENT = "assistant:open";
