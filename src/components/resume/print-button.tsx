"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="press inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-[0.8125rem] font-medium transition-colors hover:bg-foreground/[0.05]"
    >
      <Printer className="h-4 w-4" strokeWidth={1.75} /> Print
    </button>
  );
}
