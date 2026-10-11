import { ArrowLeft } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function NotFound() {
  return (
    <section className="relative mx-auto flex min-h-[80dvh] max-w-3xl flex-col items-center justify-center px-6 py-28 text-center sm:px-10">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-primary">404</p>
      <h1 className="text-balance font-heading text-5xl font-medium leading-[0.95] tracking-[-0.045em] sm:text-7xl">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
        The page you&apos;re looking for was moved, renamed, or never existed in the first place.
      </p>
      <div className="mt-10">
        <MagneticButton href="/">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Back to home
        </MagneticButton>
      </div>
    </section>
  );
}
