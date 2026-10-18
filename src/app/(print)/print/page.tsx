import { modules } from "@/content/modules";
import { PrintDocumentHeader } from "@/components/print/PrintDocumentHeader";
import { PrintSignOff } from "@/components/print/PrintSignOff";
import { PrintToolbar } from "@/components/print/PrintToolbar";
import { SectionPrintBody } from "@/components/print/SectionPrintBody";

export default function PrintAllPage() {
  const totalSections = modules.reduce((n, m) => n + m.sections.length, 0);
  const documented = modules.reduce(
    (n, m) => n + m.sections.filter((s) => s.status !== "pending").length,
    0,
  );

  return (
    <>
      <PrintToolbar backHref="/" title="Print all modules & sections" />
      <article className="print-document mx-auto max-w-4xl px-6 py-10">
        <PrintDocumentHeader
          title="ENCC ERP Requirements — Complete Documentation"
          subtitle="All modules, all sections — for print, PDF, and ENCC sign-off"
          meta={`${documented}/${totalSections} sections documented`}
        />

        <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          This document includes every module and section below. Use <strong>Print / Save as PDF</strong>{" "}
          — no approval required.
        </div>

        {modules.map((mod) => (
          <div key={mod.id} className="print-module mb-16">
            <div className="print-module-header mb-8 border-b border-slate-300 pb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{mod.code}</p>
              <h2 className="text-xl font-bold text-slate-900">{mod.nameDari ?? mod.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{mod.name}</p>
              {mod.purpose && <p className="mt-2 text-sm text-slate-600">{mod.purpose}</p>}
              {mod.overview && <p className="mt-1 text-sm text-slate-500">{mod.overview}</p>}
            </div>

            {mod.sections.length === 0 ? (
              <p className="text-sm italic text-slate-500">No sections in this module.</p>
            ) : (
              mod.sections.map((section) => (
                <div key={section.id} className="print-section mb-12">
                  <div className="mb-6 border-l-4 border-sky-600 pl-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      {section.nameDari ?? section.name}
                    </h3>
                    <p className="text-sm text-slate-500">{section.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{section.description}</p>
                  </div>
                  <SectionPrintBody mod={mod} section={section} />
                </div>
              ))
            )}
          </div>
        ))}

        <PrintSignOff />
      </article>
    </>
  );
}
