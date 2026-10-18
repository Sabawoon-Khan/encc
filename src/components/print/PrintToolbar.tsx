"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

export function PrintToolbar({ backHref, title }: { backHref: string; title: string }) {
  return (
    <div className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-sky-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <p className="truncate text-sm font-medium text-slate-800">{title}</p>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
