import type { ReactNode } from "react";
import { BRAND } from "@/content/brand";

export function PrintDocumentHeader({
  title,
  subtitle,
  meta,
}: {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
}) {
  return (
    <header className="print-doc-header mb-8 border-b border-slate-300 pb-5">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="text-base font-bold tracking-tight text-slate-900">
            {BRAND.clientShort}
            <span className="mx-2 font-normal text-slate-300">·</span>
            <span className="font-semibold text-slate-700">{BRAND.designPartner}</span>
          </p>
          <p className="mt-0.5 text-sm text-slate-600">{BRAND.clientDari}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            {BRAND.productTitle} · {BRAND.designNote}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {BRAND.analyst} · {BRAND.versionLabel}
          </p>
        </div>
        {meta && (
          <p className="shrink-0 text-right text-xs leading-relaxed text-slate-500">{meta}</p>
        )}
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
    </header>
  );
}
