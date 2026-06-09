import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import type { ModuleDefinition } from "@/types/requirements";
import { StatusBadge, TierBadge } from "./StatusBadge";

export function ModuleCard({ module: mod }: { module: ModuleDefinition }) {
  const documented = mod.sections.filter((s) => s.status !== "pending").length;
  const total = mod.sections.length;

  return (
    <Link
      href={`/modules/${mod.id}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700 transition-colors group-hover:bg-sky-600 group-hover:text-white">
          <Layers className="h-5 w-5" />
        </div>
        <div className="flex gap-2">
          <TierBadge tier={mod.tier} />
          <StatusBadge status={mod.status} />
        </div>
      </div>
      <p className="font-mono text-xs font-semibold text-sky-600">{mod.code}</p>
      <h3 className="mt-1 text-lg font-bold text-slate-900">
        {mod.nameDari ?? mod.name}
      </h3>
      {mod.nameDari && (
        <p className="text-sm text-slate-500">{mod.name}</p>
      )}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
        {mod.overview}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-400">
          {documented}/{total} sections documented
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-sky-600 group-hover:gap-2 transition-all">
          View module <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
