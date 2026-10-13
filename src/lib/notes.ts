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
  published: boolean;
  body: NoteBlock[];
}

export const notes: Note[] = [
  {
    slug: "cutting-delivery-note-processing",
    title: "Cutting Delivery Note processing from 8 minutes to 3",
    summary: "How automating PDF extraction, validation and duplicate checks sped up RMA record-keeping at Infineon.",
    date: "2026-10-20",
    tags: ["Automation", "FastAPI", "PostgreSQL"],
    // DRAFT — replace the bracketed prompts with your own words, then publish.
    published: false,
    body: [
      { type: "h2", text: "The problem" },
      { type: "p", text: "[Describe the manual process: who handled Delivery Notes, what they copied by hand, and why it took ~8 minutes each.]" },
      { type: "h2", text: "What I built" },
      {
        type: "ul",
        items: [
          "[PDF extraction — how data is pulled from each Delivery Note]",
          "[Validation and duplicate detection — the rules that catch bad entries]",
          "[Role-based portals — what staff and requesters each see]",
        ],
      },
      { type: "h2", text: "The result" },
      { type: "p", text: "[~3 minutes per Delivery Note — what that means per week for the team, and what you'd improve next.]" },
    ],
  },
];

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
