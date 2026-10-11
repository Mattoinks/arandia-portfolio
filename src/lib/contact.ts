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
