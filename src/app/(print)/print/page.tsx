import { modules } from "@/content/modules";
import { BRAND } from "@/content/brand";
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
          title={`${BRAND.productTitle} — Complete`}
          subtitle={`${BRAND.clientFull} · design confirmed with ${BRAND.designPartner}`}
          meta={`${documented}/${totalSections} sections`}
        />

        <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Full pack for print / PDF. Client: <strong>{BRAND.clientShort}</strong>. Design
          confirmation: <strong>{BRAND.designPartner}</strong>.
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

            {mod.sections.filter((s) => !s.schemaOnly).length === 0 ? (
              <p className="text-sm italic text-slate-500">No printable sections in this module.</p>
            ) : (
              mod.sections
                .filter((s) => !s.schemaOnly)
                .map((section, i) => (
                  <div key={section.id} className="print-section mb-12">
                    <div className="mb-5 border-b border-slate-200 pb-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                        {mod.code} · Section {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        {section.nameDari ?? section.name}
                      </h3>
                      {section.nameDari && section.name !== section.nameDari && (
                        <p className="text-sm text-slate-500">{section.name}</p>
                      )}
                      {section.description && (
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {section.description}
                        </p>
                      )}
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
