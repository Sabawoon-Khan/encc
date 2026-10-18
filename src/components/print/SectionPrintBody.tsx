import type { ModuleDefinition, SectionDefinition } from "@/types/requirements";
import { StatusBadge } from "@/components/StatusBadge";
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

interface SectionPrintBodyProps {
  mod: ModuleDefinition;
  section: SectionDefinition;
}

export function SectionPrintBody({ mod, section }: SectionPrintBodyProps) {
  if (section.status === "pending") {
    return (
      <p className="text-sm italic text-slate-500">Pending documentation</p>
    );
  }

  return (
    <div className="space-y-8">
      <TemplateSection number="§5" title="Section Information" id={`${section.id}-info`}>
        <InfoTable
          rows={[
            { label: "Module", value: `${mod.code} — ${mod.nameDari}` },
            { label: "Section", value: `${section.name} (${section.nameDari})` },
            { label: "Current tool", value: section.currentTool ?? "—" },
            { label: "Status", value: <StatusBadge status={section.status} /> },
          ]}
        />
      </TemplateSection>

      <TemplateSection number="§6" title="Business Objective" id={`${section.id}-objectives`}>
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
        <TemplateSection number="§7" title="Users, Roles & Locations" id={`${section.id}-roles`}>
          <RolesTable roles={section.roles} />
        </TemplateSection>
      )}

      {section.workflows.length > 0 && (
        <TemplateSection number="§8" title="Process Flows" id={`${section.id}-workflows`}>
          <div className="space-y-4">
            {section.workflows.map((wf) => (
              <WorkflowCard key={wf.id} workflow={wf} />
            ))}
          </div>
        </TemplateSection>
      )}

      {section.entities.length > 0 && (
        <TemplateSection number="§9" title="Data Dictionary" id={`${section.id}-data`}>
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

      {section.businessRules.length > 0 && (
        <TemplateSection number="§10" title="Business Rules" id={`${section.id}-rules`}>
          <RulesTable rules={section.businessRules} />
        </TemplateSection>
      )}

      {section.statusLifecycles && section.statusLifecycles.length > 0 && (
        <TemplateSection number="§11" title="Status Lifecycles" id={`${section.id}-lifecycles`}>
          <LifecycleTable transitions={section.statusLifecycles} />
        </TemplateSection>
      )}

      {section.permissionsMatrix && section.permissionsMatrix.length > 0 && (
        <TemplateSection number="§12" title="Permissions Matrix" id={`${section.id}-permissions`}>
          <PermissionsTable rows={section.permissionsMatrix} />
        </TemplateSection>
      )}

      {section.integrations && section.integrations.length > 0 && (
        <TemplateSection number="§13" title="Integration Map" id={`${section.id}-integrations`}>
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

      {section.reports && section.reports.length > 0 && (
        <TemplateSection number="§14" title="Reports & Exports" id={`${section.id}-reports`}>
          <ReportsTable reports={section.reports} />
        </TemplateSection>
      )}

      {section.validationRules && section.validationRules.length > 0 && (
        <TemplateSection number="§15" title="Validation & UI Rules" id={`${section.id}-validation`}>
          <ValidationTable rules={section.validationRules} />
        </TemplateSection>
      )}

      {section.nfrs && section.nfrs.length > 0 && (
        <TemplateSection number="§16" title="Non-Functional Requirements" id={`${section.id}-nfrs`}>
          <ul className="space-y-2 text-sm">
            {section.nfrs.map((n, i) => (
              <li key={`${n.area}-${i}`} className="rounded-lg border border-slate-100 px-4 py-3">
                <span className="font-medium text-slate-800">{n.area}: </span>
                <span className="text-slate-600">{n.requirement}</span>
              </li>
            ))}
          </ul>
        </TemplateSection>
      )}

      {section.migration && section.migration.length > 0 && (
        <TemplateSection number="§17" title="Migration & Import" id={`${section.id}-migration`}>
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
        <TemplateSection number="§18" title="Edge Cases & Exceptions" id={`${section.id}-edge-cases`}>
          <EdgeCasesTable cases={section.edgeCases} />
        </TemplateSection>
      )}

      {section.deliverableChecklist && section.deliverableChecklist.length > 0 && (
        <TemplateSection number="§24" title="Deliverables & Sign-off" id={`${section.id}-deliverables`}>
          <DeliverablesTable items={section.deliverableChecklist} />
        </TemplateSection>
      )}
    </div>
  );
}
