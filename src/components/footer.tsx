import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { profile } from "@/lib/data";
import { publishedNotes } from "@/lib/notes";
import { FooterClock, FooterWordmark } from "@/components/footer-parts";
import { Magnet } from "@/components/reactbits/magnet";

export function Footer() {
  return (
    <footer className="relative mx-auto w-full max-w-7xl overflow-hidden px-6 pb-8 sm:px-10">
      <FooterWordmark />
      {/* Right padding keeps "Back to top" clear of the fixed Matte launcher. */}
      <div className="flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:pr-24">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <nav aria-label="Footer" className="flex items-center gap-5">
          <Link href="/resume" className="transition-colors hover:text-foreground">Resume</Link>
          {publishedNotes.length > 0 && (
            <Link href="/notes" className="transition-colors hover:text-foreground">Notes</Link>
          )}
          <FooterClock />
        </nav>
        <a href="#top" className="group inline-flex w-fit items-center gap-2 font-medium text-foreground">
          Back to top
          <Magnet padding={24} strength={3}>
          <span className="press flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors duration-300 group-hover:border-foreground/40">
            <ArrowUp
              className="h-3.5 w-3.5 transition-transform duration-300 ease-out-strong group-hover:-translate-y-0.5"
              strokeWidth={1.5}
            />
          </span>
          </Magnet>
        </a>
      </div>
    </footer>
  );
}
