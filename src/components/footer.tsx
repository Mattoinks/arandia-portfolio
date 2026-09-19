import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative border-t border-border px-6 py-8 text-center text-xs text-muted-foreground sm:px-10">
      <p>
        © {new Date().getFullYear()} {profile.name}. Built with Next.js, Tailwind CSS &amp; Framer
        Motion.
      </p>
    </footer>
  );
}
