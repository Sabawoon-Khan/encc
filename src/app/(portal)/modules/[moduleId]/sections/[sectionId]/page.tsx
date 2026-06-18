import { notFound } from "next/navigation";
import { getModule, getSection } from "@/content/modules";
import { getEvidenceForSection } from "@/lib/evidence";
import { getSectionReview, isSectionLocked } from "@/lib/reviews";
import { getSessionRole } from "@/lib/auth";
import { StatusBadge } from "@/components/StatusBadge";
import { SectionPageShell } from "@/components/SectionPageShell";
import { TopicReviewActions } from "@/components/TopicReviewActions";
import { InfoTable, TemplateSection } from "@/components/TemplateSection";
import {
  DeliverablesTable,
  EdgeCasesTable,
  FieldTable,
  IntegrationsTable,
  LifecycleTable,
  PermissionsTable,
  ReportsTable,
  RolesTable,
  RulesTable,
  ValidationTable,
  WorkflowCard,
} from "@/components/RequirementTables";
import { EvidenceSection } from "@/components/EvidenceSection";
import { QuestionsPanel } from "@/components/QuestionsPanel";

function rvActions(enabled: boolean, topicId: string, label: string) {
  return enabled ? <TopicReviewActions topicId={topicId} label={label} /> : undefined;
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ moduleId: string; sectionId: string }>;
}) {
  const { moduleId, sectionId } = await params;
  const mod = getModule(moduleId);
  const section = getSection(moduleId, sectionId);
  if (!mod || !section) notFound();

  const [evidence, review, sessionRole] = await Promise.all([
    getEvidenceForSection(moduleId, sectionId),
    getSectionReview(moduleId, sectionId),
    getSessionRole(),
  ]);
  const locked = isSectionLocked(review);
  const isDocumented = section.status !== "pending";
  const rv = !!section.enableReview;

  if (!isDocumented) {
    return (
      <SectionPageShell mod={mod} section={section} sessionRole={sessionRole}>
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-8 py-16 text-center">
          <p className="font-medium text-slate-600">Pending documentation</p>
        </div>
      </SectionPageShell>
    );
  }

  return (
    <SectionPageShell
      mod={mod}
      section={section}
      review={rv ? review : undefined}
      sessionRole={sessionRole}
    >
      <TemplateSection
        number="§5"
        title="Section Information"
        id="info"
        actions={rvActions(rv, "info", "Section Information")}
      >
        <InfoTable
          rows={[
            { label: "Module", value: `${mod.code} — ${mod.nameDari}` },
            { label: "Section", value: `${section.name} (${section.nameDari})` },
            { label: "Current tool", value: section.currentTool ?? "—" },
            { label: "Status", value: <StatusBadge status={section.status} /> },
          ]}
        />
      </TemplateSection>

      <TemplateSection
        number="§6"
        title="Business Objective"
        id="objectives"
        actions={rvActions(rv, "objectives", "Business Objective")}
      >
        <ul className="space-y-2 text-sm text-slate-700">
          {section.summary.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-sky-600">•</span>
              {s}
            </li>
          ))}
        </ul>
      </TemplateSection>

      {section.roles && section.roles.length > 0 && (
        <TemplateSection
          number="§7"
          title="Users, Roles & Locations"
          id="roles"
          actions={rvActions(rv, "roles", "Users, Roles & Locations")}
        >
          <RolesTable roles={section.roles} />
        </TemplateSection>
      )}

      {section.workflows.length > 0 && (
        <TemplateSection
          number="§8"
          title="Process Flows"
          id="workflows"
          actions={rvActions(rv, "workflows", "Process Flows")}
        >
          <div className="space-y-4">
            {section.workflows.map((wf) => (
              <WorkflowCard key={wf.id} workflow={wf} />
            ))}
          </div>
        </TemplateSection>
      )}

      {section.entities.length > 0 && (
        <TemplateSection
          number="§9"
          title="Data Dictionary"
          id="data"
          actions={rvActions(rv, "data", "Data Dictionary")}
        >
          <div className="space-y-6">
            {section.entities.map((entity) => (
              <div key={entity.id}>
                <h3 className="font-semibold text-slate-900">{entity.name}</h3>
                <p className="mb-2 text-sm text-slate-500">{entity.description}</p>
                <FieldTable fields={entity.fields} />
              </div>
            ))}
          </div>
        </TemplateSection>
      )}

      {section.permissionsMatrix && section.permissionsMatrix.length > 0 && (
        <TemplateSection
          number="§12"
          title="Permissions Matrix"
          id="permissions"
          actions={rvActions(rv, "permissions", "Permissions Matrix")}
        >
          <PermissionsTable rows={section.permissionsMatrix} />
        </TemplateSection>
      )}

      {section.reports && section.reports.length > 0 && (
        <TemplateSection
          number="§14"
          title="Reports & Exports"
          id="reports"
          actions={rvActions(rv, "reports", "Reports & Exports")}
        >
          <ReportsTable reports={section.reports} />
        </TemplateSection>
      )}

      {section.validationRules && section.validationRules.length > 0 && (
        <TemplateSection
          number="§15"
          title="Validation & UI Rules"
          id="validation"
          actions={rvActions(rv, "validation", "Validation & UI Rules")}
        >
          <ValidationTable rules={section.validationRules} />
        </TemplateSection>
      )}

      {section.businessRules.length > 0 && (
        <TemplateSection
          number="§10"
          title="Business Rules"
          id="rules"
          actions={rvActions(rv, "rules", "Business Rules")}
        >
          <RulesTable rules={section.businessRules} />
        </TemplateSection>
      )}

      {section.statusLifecycles && section.statusLifecycles.length > 0 && (
        <TemplateSection
          number="§11"
          title="Status Lifecycles"
          id="lifecycles"
          actions={rvActions(rv, "lifecycles", "Status Lifecycles")}
        >
          <LifecycleTable transitions={section.statusLifecycles} />
        </TemplateSection>
      )}

      {section.integrations && section.integrations.length > 0 && (
        <TemplateSection
          number="§13"
          title="Integration Map"
          id="integrations"
          actions={rvActions(rv, "integrations", "Integration Map")}
        >
          {section.crossModuleNotes && (
            <ul className="mb-4 space-y-1 text-sm text-slate-600">
              {section.crossModuleNotes.map((n, i) => (
                <li key={i}>• {n}</li>
              ))}
            </ul>
          )}
          <IntegrationsTable rows={section.integrations} />
        </TemplateSection>
      )}

      {section.nfrs && section.nfrs.length > 0 && (
        <TemplateSection
          number="§16"
          title="Non-Functional Requirements"
          id="nfrs"
          actions={rvActions(rv, "nfrs", "Non-Functional Requirements")}
        >
          <ul className="space-y-2 text-sm">
            {section.nfrs.map((n) => (
              <li key={n.area} className="rounded-lg border border-slate-100 px-4 py-3">
                <span className="font-medium text-slate-800">{n.area}: </span>
                <span className="text-slate-600">{n.requirement}</span>
              </li>
            ))}
          </ul>
        </TemplateSection>
      )}

      {section.migration && section.migration.length > 0 && (
        <TemplateSection
          number="§17"
          title="Migration & Import"
          id="migration"
          actions={rvActions(rv, "migration", "Migration & Import")}
        >
          <ul className="space-y-2 text-sm text-slate-700">
            {section.migration.map((m, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-sky-600">•</span>
                {m}
              </li>
            ))}
          </ul>
        </TemplateSection>
      )}

      {section.edgeCases && section.edgeCases.length > 0 && (
        <TemplateSection
          number="§18"
          title="Edge Cases & Exceptions"
          id="edge-cases"
          actions={rvActions(rv, "edge-cases", "Edge Cases & Exceptions")}
        >
          <EdgeCasesTable cases={section.edgeCases} />
        </TemplateSection>
      )}

      {section.deliverableChecklist && section.deliverableChecklist.length > 0 && (
        <TemplateSection
          number="§24"
          title="Deliverables & Sign-off"
          id="deliverables"
          actions={rvActions(rv, "deliverables", "Deliverables & Sign-off")}
        >
          <DeliverablesTable items={section.deliverableChecklist} />
          <p className="mt-4 text-sm text-slate-500">
            ENCC reviewer names are recorded when this section is approved.
          </p>
        </TemplateSection>
      )}

      <TemplateSection
        number="App. A"
        title="Evidence & Attachments"
        id="evidence"
        actions={rvActions(rv, "evidence", "Evidence & Attachments")}
      >
        <EvidenceSection
          moduleId={moduleId}
          sectionId={sectionId}
          initialItems={evidence}
          locked={locked}
          canDelete={!locked || sessionRole === "admin"}
        />
      </TemplateSection>

      {rv && (
        <QuestionsPanel
          scopeLabel={`${section.nameDari ?? section.name} section`}
          sessionRole={sessionRole}
        />
      )}
    </SectionPageShell>
  );
}
