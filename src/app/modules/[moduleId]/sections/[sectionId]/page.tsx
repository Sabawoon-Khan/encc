import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getModule, getSection } from "@/content/modules";
import { getEvidenceForSection } from "@/lib/evidence";
import { StatusBadge } from "@/components/StatusBadge";
import {
  FieldTable,
  RulesTable,
  WorkflowCard,
} from "@/components/RequirementTables";
import { EvidenceGallery } from "@/components/EvidenceGallery";
import { ImageUpload } from "@/components/ImageUpload";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ moduleId: string; sectionId: string }>;
}) {
  const { moduleId, sectionId } = await params;
  const mod = getModule(moduleId);
  const section = getSection(moduleId, sectionId);
  if (!mod || !section) notFound();

  const evidence = await getEvidenceForSection(moduleId, sectionId);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-sky-600">
          Overview
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/modules/${mod.id}`} className="hover:text-sky-600">
          {mod.code}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900">{section.name}</span>
      </nav>

      <header className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <StatusBadge status={section.status} />
          <span className="font-mono text-xs text-slate-400">
            {mod.code} / {section.id}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {section.name}
        </h1>
        {section.nameDari && (
          <p className="mt-1 text-lg text-slate-500">{section.nameDari}</p>
        )}
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
          {section.description}
        </p>
      </header>

      {section.status === "pending" ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 py-16 text-center">
          <p className="text-lg font-medium text-slate-600">
            This section is not documented yet
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Requirements will be added after the next client workshop session.
            Edit{" "}
            <code className="rounded bg-white px-1 font-mono text-xs">
              src/content/modules/{mod.id}/{section.id}.ts
            </code>{" "}
            when ready.
          </p>
        </div>
      ) : (
        <>
          {section.summary.length > 0 && (
            <section className="mb-10 rounded-2xl border border-sky-100 bg-sky-50/40 p-6">
              <h2 className="mb-3 text-lg font-bold text-slate-900">Summary</h2>
              <ul className="space-y-2">
                {section.summary.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="font-bold text-sky-600">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {section.workflows.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Workflows
              </h2>
              <div className="space-y-4">
                {section.workflows.map((wf) => (
                  <WorkflowCard key={wf.id} workflow={wf} />
                ))}
              </div>
            </section>
          )}

          {section.entities.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Data fields (business dictionary)
              </h2>
              <div className="space-y-8">
                {section.entities.map((entity) => (
                  <div key={entity.id}>
                    <div className="mb-3">
                      <code className="text-xs font-semibold text-sky-700">
                        {entity.id}
                      </code>
                      <h3 className="font-semibold text-slate-900">
                        {entity.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {entity.description}
                      </p>
                    </div>
                    <FieldTable fields={entity.fields} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {section.businessRules.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Business rules
              </h2>
              <RulesTable rules={section.businessRules} />
            </section>
          )}
        </>
      )}

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Evidence &amp; attachments
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Upload scans of Paper 1.1, outgoing letter templates, or workshop
          photos. Developers use these as reference when building screens.
        </p>
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <ImageUpload moduleId={moduleId} sectionId={sectionId} />
          <EvidenceGallery items={evidence} />
        </div>
      </section>
    </div>
  );
}
