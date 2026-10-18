import { notFound } from "next/navigation";
import { getModule } from "@/content/modules";
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
          meta={`${mod.code} · ${documented}/${mod.sections.length} sections`}
        />

        {mod.purpose && (
          <p className="mb-2 text-sm text-slate-700">
            <strong>Purpose:</strong> {mod.purpose}
          </p>
        )}
        {mod.overview && <p className="mb-8 text-sm text-slate-600">{mod.overview}</p>}

        {mod.generalStandards && mod.generalStandards.length > 0 && (
          <div className="mb-10 rounded-lg border border-slate-200 p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-900">General Information</h2>
            <ul className="space-y-1 text-sm text-slate-600">
              {mod.generalStandards.map((s, i) => (
                <li key={i}>
                  • <strong>{s.title}:</strong> {s.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {mod.sections.map((section) => (
          <div key={section.id} className="print-section mb-12">
            <div className="mb-6 border-l-4 border-sky-600 pl-4">
              <h2 className="text-lg font-bold text-slate-900">{section.nameDari ?? section.name}</h2>
              <p className="text-sm text-slate-500">{section.name}</p>
              <p className="mt-1 text-sm text-slate-600">{section.description}</p>
            </div>
            <SectionPrintBody mod={mod} section={section} />
          </div>
        ))}

        <PrintSignOff />
      </article>
    </>
  );
}
