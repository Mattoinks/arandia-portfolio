import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";
import { formatNoteDate, publishedNotes, readingMinutes } from "@/lib/notes";

export const alt = "Note";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return publishedNotes.map((n) => ({ slug: n.slug }));
}

/** Per-note share card: title, date and reading time, tags, brand. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = publishedNotes.find((n) => n.slug === slug) ?? publishedNotes[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(70% 90% at 90% 0%, rgba(242,107,58,0.28), #0c0c0b 70%)",
          color: "#f2f1ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 5, textTransform: "uppercase" }}>
          Arandia<span style={{ color: "#f26b3a" }}>.</span>dev
          <span style={{ color: "#9c9b93", marginLeft: 18 }}>/ Notes</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#f26b3a" }}>
            {formatNoteDate(note.date)} · {readingMinutes(note)} min read
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: note.title.length > 48 ? 60 : 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1040,
            }}
          >
            {note.title}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 22, color: "#9c9b93" }}>{note.tags.join(" · ")}</div>
          <div style={{ display: "flex", fontSize: 24, color: "#f2f1ec" }}>{profile.name}</div>
        </div>
      </div>
    ),
    size,
  );
}
