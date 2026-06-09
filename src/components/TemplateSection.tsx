import type { ReactNode } from "react";
import type { BusinessRule, GeneralStandard } from "@/types/requirements";
import { RulesTable } from "./RequirementTables";

interface TemplateSectionProps {
  number: string;
  title: string;
  children: ReactNode;
  id?: string;
  /** Right-side actions, e.g. TopicFeedback button */
  actions?: ReactNode;
}

/** Shams Hilal Template v2.2 section heading */
export function TemplateSection({
  number,
  title,
  children,
  id,
  actions,
}: TemplateSectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-3 flex items-start justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-900">
          <span className="mr-2 font-mono text-xs font-normal text-slate-400">
            {number}
          </span>
          {title}
        </h2>
        {actions && <div className="shrink-0 pt-0.5">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

export function InfoTable({
  rows,
}: {
  rows: { label: string; value: ReactNode }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.label} className="hover:bg-slate-50/50">
              <td className="w-40 shrink-0 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {row.label}
              </td>
              <td className="px-4 py-3 text-slate-700">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GeneralStandardsPanel({
  standards,
  globalRules,
}: {
  standards: GeneralStandard[];
  globalRules?: BusinessRule[];
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {standards.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p className="font-semibold text-slate-900">
              {s.title}
              {s.titleDari && (
                <span className="ml-2 font-normal text-slate-400">
                  {s.titleDari}
                </span>
              )}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {s.description}
            </p>
            {s.example && (
              <p className="mt-2 font-mono text-xs text-sky-700">{s.example}</p>
            )}
          </div>
        ))}
      </div>
      {globalRules && globalRules.length > 0 && (
        <RulesTable rules={globalRules} />
      )}
    </div>
  );
}

export function CurrentToolBadge({ tool }: { tool: string }) {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Current tool / document
      </p>
      <p className="mt-1 text-sm font-medium text-slate-800">{tool}</p>
    </div>
  );
}

export function FlowDiagram({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-900 px-5 py-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Business workflow
      </p>
      <p className="font-mono text-sm leading-relaxed text-sky-100">{text}</p>
    </div>
  );
}
