import { notFound } from "next/navigation";
import { getModule } from "@/content/modules";
import { BRAND } from "@/content/brand";
import { PrintDocumentHeader } from "@/components/print/PrintDocumentHeader";
import { PrintSignOff } from "@/components/print/PrintSignOff";
import { PrintToolbar } from "@/components/print/PrintToolbar";
import { SectionPrintBody } from "@/components/print/SectionPrintBody";

export default async function ModulePrintPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  if (!mod) notFound();

  const printable = mod.sections.filter((s) => !s.schemaOnly);
  const schemaSections = mod.sections.filter((s) => s.schemaOnly);
  const documented = mod.sections.filter((s) => s.status !== "pending").length;

  return (
    <>
      <PrintToolbar
        backHref={`/modules/${moduleId}`}
        title={`Print ${mod.nameDari ?? mod.name}`}
      />
      <article className="print-document mx-auto max-w-4xl px-6 py-10">
        <PrintDocumentHeader
          title={mod.nameDari ?? mod.name}
          subtitle={mod.name}
          meta={
            <>
              {mod.code}
              <br />
              {documented}/{mod.sections.length} sections
              <br />
              {BRAND.clientShort} · {BRAND.designPartner}
            </>
          }
        />

        <div className="mb-8 grid gap-3 rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Client
            </p>
            <p className="mt-0.5 font-medium text-slate-800">{BRAND.clientFull}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Design confirmation
            </p>
            <p className="mt-0.5 font-medium text-slate-800">{BRAND.designPartner}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Forms & report aligned to Crest Point payroll design
            </p>
          </div>
        </div>

        {mod.purpose && (
          <section className="mb-6">
            <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Purpose
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">{mod.purpose}</p>
          </section>
        )}

        {mod.overview && (
          <section className="mb-8">
            <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Overview
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">{mod.overview}</p>
          </section>
        )}

        {mod.purposes.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Scope
            </h2>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
              {mod.purposes.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ol>
          </section>
        )}

        <nav className="mb-10 rounded-lg border border-slate-200 p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Contents
          </h2>
          <ol className="space-y-1.5 text-sm">
            {printable.map((section, i) => (
              <li key={section.id} className="flex gap-2 text-slate-700">
                <span className="w-6 shrink-0 font-mono text-xs text-slate-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="font-medium text-slate-900">
                    {section.nameDari ?? section.name}
                  </span>
                  {section.nameDari && section.name !== section.nameDari && (
                    <span className="text-slate-500"> — {section.name}</span>
                  )}
                </span>
              </li>
            ))}
            {schemaSections.length > 0 && (
              <li className="flex gap-2 text-slate-500">
                <span className="w-6 shrink-0 font-mono text-xs text-slate-400">—</span>
                <span>Tables & ER diagram — view online (builder schema)</span>
              </li>
            )}
          </ol>
        </nav>

        {mod.generalStandards && mod.generalStandards.length > 0 && (
          <section className="mb-10 rounded-lg border border-slate-200 p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-900">General Information</h2>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {mod.generalStandards.map((s, i) => (
                <li key={i}>
                  <strong className="text-slate-800">{s.title}:</strong> {s.description}
                </li>
              ))}
            </ul>
          </section>
        )}

        {printable.map((section, i) => (
          <section key={section.id} className="print-section mb-14">
            <header className="mb-5 border-b border-slate-200 pb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                Section {String(i + 1).padStart(2, "0")} · {mod.code}
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {section.nameDari ?? section.name}
              </h2>
              {section.nameDari && section.name !== section.nameDari && (
                <p className="text-sm text-slate-500">{section.name}</p>
              )}
              {section.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {section.description}
                </p>
              )}
            </header>
            <SectionPrintBody mod={mod} section={section} />
          </section>
        ))}

        {schemaSections.length > 0 && (
          <section className="print-section mb-12 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">Tables & ER diagram</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              The builder schema (colored ER cards) is maintained online so it stays in sync with
              the data model. Open{" "}
              <span className="font-medium text-slate-800">
                {mod.nameDari ?? mod.name} → Tables & ER diagram
              </span>{" "}
              in the portal — same tables as documented in the sections above.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              {schemaSections.map((s) => (
                <li key={s.id}>
                  · {s.name}
                  {s.nameDari && s.nameDari !== s.name ? ` (${s.nameDari})` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {mod.openQuestions && mod.openQuestions.length > 0 && (
          <section className="print-section mb-12">
            <h2 className="mb-3 text-base font-bold text-slate-900">Open questions</h2>
            <ul className="space-y-3 text-sm">
              {mod.openQuestions.map((q) => (
                <li key={q.id} className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3">
                  <p className="font-mono text-xs text-amber-800">{q.id}</p>
                  <p className="mt-1 text-slate-800">{q.question}</p>
                  <p className="mt-1 text-xs text-slate-500">Owner: {q.owner}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <PrintSignOff />
      </article>
    </>
  );
}
