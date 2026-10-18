import { notFound } from "next/navigation";
import { getModule, getSection } from "@/content/modules";
import { PrintDocumentHeader } from "@/components/print/PrintDocumentHeader";
import { PrintSignOff } from "@/components/print/PrintSignOff";
import { PrintToolbar } from "@/components/print/PrintToolbar";
import { SectionPrintBody } from "@/components/print/SectionPrintBody";

export default async function SectionPrintPage({
  params,
}: {
  params: Promise<{ moduleId: string; sectionId: string }>;
}) {
  const { moduleId, sectionId } = await params;
  const mod = getModule(moduleId);
  const section = getSection(moduleId, sectionId);
  if (!mod || !section) notFound();

  return (
    <>
      <PrintToolbar
        backHref={`/modules/${moduleId}/sections/${sectionId}`}
        title={`Print ${section.nameDari ?? section.name}`}
      />
      <article className="print-document mx-auto max-w-4xl px-6 py-10">
        <PrintDocumentHeader
          title={section.nameDari ?? section.name}
          subtitle={`${mod.code} — ${section.name}`}
          meta={`${mod.code}/${section.id}`}
        />
        <p className="mb-8 text-sm text-slate-600">{section.description}</p>
        <SectionPrintBody mod={mod} section={section} />
        <PrintSignOff />
      </article>
    </>
  );
}
