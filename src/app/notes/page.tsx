import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ProjectHeader } from "@/components/project/project-header";
import { Footer } from "@/components/footer";
import { formatNoteDate, publishedNotes, readingMinutes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "Short write-ups on how Matthew Arandia builds things — systems, automation and interfaces.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  // Hidden until there's something worth reading.
  if (publishedNotes.length === 0) notFound();

  return (
    <>
      <ProjectHeader backHref="/" backLabel="Portfolio" />
      <main id="main-content" className="flex-1">
        <section className="mx-auto max-w-4xl px-6 pb-20 pt-28 sm:px-10 sm:pt-32">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground">Notes</p>
          <h1 className="mt-4 font-heading text-5xl font-medium tracking-[-0.05em] sm:text-6xl">
            Notes from the <span className="font-serif font-normal italic tracking-[-0.02em] text-primary">build</span>
          </h1>
          <ul className="mt-14 divide-y divide-border border-y border-border">
            {publishedNotes.map((n) => (
              <li key={n.slug}>
                <Link href={`/notes/${n.slug}`} className="group flex flex-col gap-2 py-7 sm:flex-row sm:items-baseline sm:gap-10">
                  <span className="w-32 shrink-0 font-mono text-xs text-muted-foreground tabular">{formatNoteDate(n.date)}</span>
                  <span className="flex-1">
                    <span className="flex items-start justify-between gap-4 font-heading text-2xl font-medium tracking-[-0.03em]">
                      {n.title}
                      <ArrowUpRight className="mt-1.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-out-strong group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" strokeWidth={1.5} />
                    </span>
                    <span className="mt-2 block text-[0.9375rem] leading-relaxed text-muted-foreground">{n.summary}</span>
                    <span className="mt-3 block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {readingMinutes(n)} min read · {n.tags.join(" · ")}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
