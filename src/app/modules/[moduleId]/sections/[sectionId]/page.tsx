import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, HelpCircle } from "lucide-react";
import { getModule, getSection } from "@/content/modules";
import { getEvidenceForSection } from "@/lib/evidence";
import { StatusBadge } from "@/components/StatusBadge";
import {
  CurrentToolBadge,
  InfoTable,
  TemplateSection,
} from "@/components/TemplateSection";
import {
  FieldTable,
  LifecycleTable,
  RolesTable,
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
  const isDocumented = section.status !== "pending";

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-sky-600">
          Overview
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/modules/${mod.id}`} className="hover:text-sky-600">
          {mod.nameDari ?? mod.code}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900">
          {section.nameDari ?? section.name}
        </span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={section.status} />
          <span className="font-mono text-xs text-slate-400">
            Template v2.2 · {mod.code}/{section.id}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {section.name}
        </h1>
        {section.nameDari && (
          <p className="mt-1 text-xl text-slate-500">{section.nameDari}</p>
        )}
        <p className="mt-1 text-sm text-slate-400">
          Sub-office of {mod.nameDari} ({mod.name})
        </p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
          {section.description}
        </p>
      </header>

      {mod.generalStandards && mod.generalStandards.length > 0 && (
        <p className="mb-6 text-sm text-slate-500">
          Dates and other module-wide standards are defined in{" "}
          <Link
            href={`/modules/${mod.id}#general-standards`}
            className="font-medium text-sky-600 hover:underline"
          >
            General Information
          </Link>{" "}
          on the {mod.nameDari} overview — not repeated here.
        </p>
      )}

      {section.currentTool && <CurrentToolBadge tool={section.currentTool} />}

      {!isDocumented ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-8 py-16 text-center">
          <p className="text-lg font-medium text-slate-600">Pending documentation</p>
          <p className="mt-2 text-sm text-slate-400">
            Edit{" "}
            <code className="rounded bg-white px-1 font-mono text-xs">
              src/content/modules/{mod.id}/{section.id}.ts
            </code>
          </p>
        </div>
      ) : (
        <>
          {/* §5 Module / Section info */}
          <TemplateSection number="§5" title="Section Information">
            <InfoTable
              rows={[
                { label: "Module ID", value: <code className="font-mono text-sm">{mod.code}</code> },
                { label: "Section ID", value: section.id },
                { label: "Section name", value: `${section.name} (${section.nameDari})` },
                { label: "Parent", value: `${mod.nameDari} — ${mod.name}` },
                { label: "Current tool", value: section.currentTool ?? "—" },
                { label: "Status", value: <StatusBadge status={section.status} /> },
                { label: "Version", value: mod.version },
              ]}
            />
          </TemplateSection>

          {/* §6 Business objective */}
          <TemplateSection number="§6" title="Business Objective">
            {section.summary.length > 0 && (
              <ul className="space-y-2 rounded-xl border border-sky-100 bg-sky-50/40 p-5">
                {section.summary.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="font-bold text-sky-600">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </TemplateSection>

          {/* §7 Roles */}
          {section.roles && section.roles.length > 0 && (
            <TemplateSection number="§7" title="Users, Roles & Locations">
              <RolesTable roles={section.roles} />
            </TemplateSection>
          )}

          {/* §8 Workflows */}
          {section.workflows.length > 0 && (
            <TemplateSection number="§8" title="Current & Target Process Flows">
              <div className="space-y-5">
                {section.workflows.map((wf) => (
                  <WorkflowCard key={wf.id} workflow={wf} />
                ))}
              </div>
            </TemplateSection>
          )}

          {/* §9 Data dictionary */}
          {section.entities.length > 0 && (
            <TemplateSection number="§9" title="Business Data Dictionary">
              <div className="space-y-8">
                {section.entities.map((entity) => (
                  <div key={entity.id}>
                    <div className="mb-3">
                      <code className="text-xs font-bold text-sky-700">
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
            </TemplateSection>
          )}

          {/* §10 Business rules */}
          {section.businessRules.length > 0 && (
            <TemplateSection number="§10" title="Business Rules">
              <RulesTable rules={section.businessRules} />
            </TemplateSection>
          )}

          {/* §11 Status lifecycles */}
          {section.statusLifecycles && section.statusLifecycles.length > 0 && (
            <TemplateSection number="§11" title="Status Lifecycles & Approvals">
              <LifecycleTable transitions={section.statusLifecycles} />
            </TemplateSection>
          )}
        </>
      )}

      {/* Evidence — Appendix A */}
      <TemplateSection number="App. A" title="Evidence & Attachments">
        <p className="mb-4 text-sm text-slate-500">
          Upload Paper 1.1 scans, physical book register photos, or outgoing
          letter samples for developers.
        </p>
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <ImageUpload moduleId={moduleId} sectionId={sectionId} />
          <EvidenceGallery items={evidence} />
        </div>
      </TemplateSection>

      {/* Open questions */}
      {mod.openQuestions.length > 0 && isDocumented && (
        <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
            <HelpCircle className="h-5 w-5 text-amber-600" />
            §22 Open Questions
          </h2>
          <ul className="space-y-3">
            {mod.openQuestions.map((q) => (
              <li key={q.id} className="text-sm">
                <code className="font-mono text-xs font-semibold text-amber-800">
                  {q.id}
                </code>
                <p className="mt-0.5 text-slate-700">{q.question}</p>
                <p className="text-xs text-slate-400">Owner: {q.owner}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
