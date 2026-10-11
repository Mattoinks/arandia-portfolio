"use client";

import { useEffect } from "react";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative mx-auto flex min-h-[80dvh] max-w-3xl flex-col items-center justify-center px-6 py-28 text-center sm:px-10">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-primary">Error</p>
      <h1 className="text-balance font-heading text-5xl font-medium leading-[0.95] tracking-[-0.045em] sm:text-7xl">
        Something went wrong.
      </h1>
      <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
        An unexpected error occurred while rendering this page. You can try again, or head back
        home.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <MagneticButton onClick={retry}>
          <RotateCcw className="h-4 w-4" strokeWidth={2} /> Try again
        </MagneticButton>
        <MagneticButton href="/" variant="ghost">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} /> Back to home
        </MagneticButton>
      </div>
    </section>
  );
}
