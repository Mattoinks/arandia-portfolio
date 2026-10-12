import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The navbar's primary CTA, shared by the home and project headers.
 * Styling lives in globals.css (`.hire-btn`): bevelled gradient pill, a sheen
 * that sweeps across on hover, a rolling label and a glowing arrow island —
 * all transform/opacity, so it stays cheap.
 */
export function HireButton({ href, className }: { href: string; className?: string }) {
  return (
    <Link href={href} className={cn("hire-btn press group", className)}>
      <span className="hire-btn__sheen" aria-hidden />
      <span className="roll relative">
        <span>Hire me</span>
        <span aria-hidden>Hire me</span>
      </span>
      <span className="hire-btn__icon" aria-hidden>
        <span className="relative h-3.5 w-3.5">
          <ArrowUpRight
            className="absolute inset-0 h-3.5 w-3.5 transition-transform duration-500 ease-out-strong group-hover:-translate-y-[150%] group-hover:translate-x-[150%]"
            strokeWidth={2.25}
          />
          <ArrowUpRight
            className="absolute inset-0 h-3.5 w-3.5 -translate-x-[150%] translate-y-[150%] transition-transform duration-500 ease-out-strong group-hover:translate-x-0 group-hover:translate-y-0"
            strokeWidth={2.25}
          />
        </span>
      </span>
    </Link>
  );
}
