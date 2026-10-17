/**
 * Notes — short write-ups about how things were built.
 *
 * To publish: fill in a note's body, then set `published: true`. The /notes
 * pages, footer/⌘K links and sitemap entries appear automatically once at
 * least one note is published.
 */

export type NoteBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface Note {
  slug: string;
  title: string;
  summary: string;
  /** ISO date, e.g. "2026-10-20". */
  date: string;
  tags: string[];
  /** Slug of the project this note is about, if any. */
  project?: string;
  published: boolean;
  body: NoteBlock[];
}

export const notes: Note[] = [];

export const publishedNotes = notes
  .filter((n) => n.published)
  .sort((a, b) => b.date.localeCompare(a.date));

export function readingMinutes(note: Note) {
  const words = note.body
    .map((b) => ("text" in b ? b.text : b.items.join(" ")))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatNoteDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
