/** Shared between the contact server action and the form, so both validate identically. */

export type ContactField = "name" | "email" | "subject" | "message";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  values?: Partial<Record<ContactField, string>>;
}

export const CONTACT_LIMITS = { name: 80, subject: 120, message: 2000 } as const;

/** One-tap starting points shown under the subject field. */
export const SUBJECT_SUGGESTIONS = ["Job opportunity", "Freelance project", "Collaboration", "Just saying hi"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(values: Record<ContactField, string>) {
  const errors: Partial<Record<ContactField, string>> = {};
  if (values.name.length < 2) errors.name = "Please enter your name.";
  else if (values.name.length > CONTACT_LIMITS.name) errors.name = "That name is a bit long.";
  if (!EMAIL_RE.test(values.email)) errors.email = "Enter a valid email so I can reply.";
  if (values.subject.length < 3) errors.subject = "Add a short subject, or tap a suggestion.";
  else if (values.subject.length > CONTACT_LIMITS.subject)
    errors.subject = `Keep the subject under ${CONTACT_LIMITS.subject} characters.`;
  if (values.message.length < 10) errors.message = "Tell me a little more — at least 10 characters.";
  else if (values.message.length > CONTACT_LIMITS.message)
    errors.message = `Keep it under ${CONTACT_LIMITS.message} characters.`;
  return errors;
}

/*
  Typo help for the email field: "juan@gmial.com" → "juan@gmail.com". Only
  suggests (never changes) and only for close misspellings of big providers,
  which is where nearly all real typos happen.
*/
const KNOWN_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "yahoo.com.ph",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  // Real providers that sit close to the ones above — listed so they're never "corrected".
  "mail.com",
  "email.com",
  "gmx.com",
  "aol.com",
  "zoho.com",
  "mac.com",
  "googlemail.com",
  "live.ca",
  "yahoo.co.uk",
  "hotmail.co.uk",
];

function editDistance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
  }
  return row[b.length];
}

/** A corrected address when the domain looks like a misspelled big provider, otherwise null. */
export function suggestEmail(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (domain.length < 4 || KNOWN_DOMAINS.includes(domain)) return null;
  let best: { domain: string; distance: number } | null = null;
  for (const known of KNOWN_DOMAINS) {
    const distance = editDistance(domain, known);
    if (distance <= 2 && (!best || distance < best.distance)) best = { domain: known, distance };
  }
  return best ? `${local}@${best.domain}` : null;
}
