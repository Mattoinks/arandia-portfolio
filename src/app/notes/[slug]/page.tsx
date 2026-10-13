import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProjectHeader } from "@/components/project/project-header";
import { Footer } from "@/components/footer";
import { formatNoteDate, publishedNotes, readingMinutes, type NoteBlock } from "@/lib/notes";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedNotes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata(props: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const note = publishedNotes.find((n) => n.slug === slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: `/notes/${note.slug}` },
    openGraph: { title: note.title, description: note.summary, type: "article", publishedTime: note.date },
  };
}

function Block({ block }: { block: NoteBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-12 font-heading text-2xl font-medium tracking-[-0.03em] sm:text-3xl">{block.text}</h2>;
    case "ul":
      return (
        <ul className="mt-5 space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="mt-8 border-l-2 border-primary pl-5 font-editorial text-2xl font-light italic leading-snug">
          {block.text}
        </blockquote>
      );
    default:
      return <p className="mt-5">{block.text}</p>;
  }
}

export default async function NotePage(props: PageProps<"/notes/[slug]">) {
  const { slug } = await props.params;
  const note = publishedNotes.find((n) => n.slug === slug);
  if (!note) notFound();

  return (
    <>
      <ProjectHeader backHref="/notes" backLabel="All notes" />
      <main id="main-content" className="flex-1">
        <article className="mx-auto max-w-2xl px-6 pb-20 pt-28 sm:px-10 sm:pt-32">
          <p className="font-mono text-xs text-muted-foreground tabular">
            {formatNoteDate(note.date)} · {readingMinutes(note)} min read
          </p>
          <h1 className="mt-4 text-balance font-heading text-4xl font-medium leading-[1.02] tracking-[-0.045em] sm:text-5xl">{note.title}</h1>
          <p className="mt-5 text-pretty font-editorial text-xl font-light leading-snug text-muted-foreground">{note.summary}</p>
          <div className="mt-10 border-t border-border pt-4 text-pretty text-[1.0625rem] leading-[1.75] text-foreground/90">
            {note.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
          <Link href="/notes" className="link-underline mt-14 inline-flex items-center gap-1.5 pb-0.5 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> All notes
          </Link>
        </article>
      </main>
      <Footer />
    </>
  );
}
