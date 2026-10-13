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
    summary:
      "How PDF extraction with an OCR fallback, layout-aware table parsing and similarity-based duplicate checks turned a manual RMA masterfile workflow into a reviewed, mostly automatic one.",
    date: "2026-10-14",
    tags: ["Python", "OCR", "FastAPI", "PostgreSQL"],
    published: true,
    body: [
      { type: "h2", text: "The problem" },
      {
        type: "p",
        text: "Every RMA starts with a Delivery Note — a PDF listing the device, package, quantities, date codes and a table of lot numbers. Getting that into the RMA masterfile meant reading each PDF and keying the details into Excel by hand, then checking it wasn't already there. It took around 8 minutes per Delivery Note.",
      },
      { type: "h2", text: "Reading the PDF" },
      {
        type: "p",
        text: "Extraction reads the PDF's native text layer first with PyMuPDF. If a page has no text — a scan — it falls back to local OCR (RapidOCR). Results are cached by file hash, so the same PDF is never OCR'd twice. From each Delivery Note it pulls the DN number and date, customer, device, package, quantity, material and RMA numbers, plant code, date codes, and the full lot-by-lot breakdown. PDFs that bundle several Delivery Notes are split into separate records automatically.",
      },
      {
        type: "p",
        text: "The lot table was the hard part. OCR returns text in an unreliable reading order, which scrambles dense tables. Instead of trusting that order, the extractor rebuilds the table by clustering each token's position on the page into rows and columns.",
      },
      { type: "h2", text: "Catching mistakes without blocking work" },
      {
        type: "ul",
        items: [
          "Validation: DN number, device and quantity are required; quantities must be numeric; dates are checked against the accepted formats.",
          "Consistency checks: duplicate lot numbers within one Delivery Note, or lot quantities that don't add up to the declared total (within 1%), are flagged as warnings — surfaced for a human to look at, not silently rejected.",
          "Duplicate detection: every upload is scored against existing records — the same DN number weighs most, then RMA number, then device plus date code — and classified as new, possible duplicate or exact duplicate for staff to review, never auto-merged.",
        ],
      },
      { type: "h2", text: "Two portals, one source of truth" },
      {
        type: "p",
        text: "Admins and engineers get the full internal app: search, upload, process, edit and manage the RMA request queue. Requesters get exactly one permission — submitting a request — and only ever see their own requests, never the masterfile. That split is enforced on every backend route and with two separate frontend shells. Everything lives in Supabase PostgreSQL behind a FastAPI backend and a React frontend, with Excel export kept for reporting.",
      },
      { type: "h2", text: "The bugs that taught me the most" },
      {
        type: "p",
        text: "The worst bugs were silent ones, found by re-checking extraction against the rendered PDF pages instead of trusting the OCR output:",
      },
      {
        type: "ul",
        items: [
          "One misread cell could corrupt the neighbouring row through a row-merge recovery step. Fix: when a page comes back short on rows, retry it at a higher OCR resolution — and keep the retry only if it recovers strictly more rows.",
          "Some PDFs split a header like “Lot number” into two separate tokens, which quietly emptied the whole table. Fix: join adjacent unrecognised tokens, guarded so they can't swallow the start of the next real label (a regression I caught and fixed in the same session).",
          "Delivery Notes with several line items lost a whole item's rows when a new item began partway down a page. Fix: keep processing those rows against the still-valid previous anchors instead of discarding them.",
        ],
      },
      {
        type: "quote",
        text: "Every fix is checked against a regression suite of every previously verified file — because twice, fixing one document had silently broken another.",
      },
      { type: "h2", text: "The result" },
      {
        type: "p",
        text: "Processing went from about 8 minutes to about 3 minutes per Delivery Note. Staff now review what the system extracted and flagged instead of typing it — with duplicates and inconsistencies surfaced up front.",
      },
      { type: "h2", text: "What's next" },
      {
        type: "ul",
        items: [
          "Model Delivery Notes with several line items as separate case entries, the way bundled PDFs are already split, instead of one record with a summed quantity.",
          "Decide whether to enable the already-built, benchmarked AI extraction path for scanned PDFs.",
          "Keep hardening the layout parsing as new real-world Delivery Note templates appear.",
        ],
      },
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
