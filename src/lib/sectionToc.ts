export interface TocItem {
  id: string;
  label: string;
}

export const SECTION_TOC_ITEMS: TocItem[] = [
  { id: "info", label: "Section info" },
  { id: "objectives", label: "Objectives" },
  { id: "roles", label: "Roles" },
  { id: "workflows", label: "Workflows" },
  { id: "data", label: "Data dictionary" },
  { id: "permissions", label: "Permissions" },
  { id: "reports", label: "Reports" },
  { id: "validation", label: "Validation & UI" },
  { id: "rules", label: "Business rules" },
  { id: "lifecycles", label: "Status lifecycles" },
  { id: "integrations", label: "Integrations" },
  { id: "nfrs", label: "Non-functional" },
  { id: "migration", label: "Migration" },
  { id: "edge-cases", label: "Edge cases" },
  { id: "deliverables", label: "Deliverables" },
  { id: "evidence", label: "Attachments" },
  { id: "questions", label: "Q&A" },
];

export interface SectionTocFlags {
  hasRoles?: boolean;
  hasWorkflows?: boolean;
  hasData?: boolean;
  hasPermissions?: boolean;
  hasReports?: boolean;
  hasValidation?: boolean;
  hasRules?: boolean;
  hasLifecycles?: boolean;
  hasIntegrations?: boolean;
  hasNfrs?: boolean;
  hasMigration?: boolean;
  hasEdgeCases?: boolean;
  hasDeliverables?: boolean;
  hasQuestions?: boolean;
}

/** Build visible TOC items from section content flags (server-safe). */
export function buildSectionTocItems(flags: SectionTocFlags): TocItem[] {
  const ids = new Set<string>(["info", "objectives"]);
  if (flags.hasRoles) ids.add("roles");
  if (flags.hasWorkflows) ids.add("workflows");
  if (flags.hasData) ids.add("data");
  if (flags.hasPermissions) ids.add("permissions");
  if (flags.hasReports) ids.add("reports");
  if (flags.hasValidation) ids.add("validation");
  if (flags.hasRules) ids.add("rules");
  if (flags.hasLifecycles) ids.add("lifecycles");
  if (flags.hasIntegrations) ids.add("integrations");
  if (flags.hasNfrs) ids.add("nfrs");
  if (flags.hasMigration) ids.add("migration");
  if (flags.hasEdgeCases) ids.add("edge-cases");
  if (flags.hasDeliverables) ids.add("deliverables");
  ids.add("evidence");
  if (flags.hasQuestions) ids.add("questions");

  return SECTION_TOC_ITEMS.filter((item) => ids.has(item.id));
}

/** Build flags directly from a section definition (server-safe). */
export function sectionTocFlagsFromSection(section: {
  enableReview?: boolean;
  roles?: unknown[];
  workflows: unknown[];
  entities: unknown[];
  permissionsMatrix?: unknown[];
  reports?: unknown[];
  validationRules?: unknown[];
  businessRules: unknown[];
  statusLifecycles?: unknown[];
  integrations?: unknown[];
  nfrs?: unknown[];
  migration?: unknown[];
  edgeCases?: unknown[];
  deliverableChecklist?: unknown[];
}): SectionTocFlags {
  return {
    hasRoles: !!section.roles?.length,
    hasWorkflows: section.workflows.length > 0,
    hasData: section.entities.length > 0,
    hasPermissions: !!section.permissionsMatrix?.length,
    hasReports: !!section.reports?.length,
    hasValidation: !!section.validationRules?.length,
    hasRules: section.businessRules.length > 0,
    hasLifecycles: !!section.statusLifecycles?.length,
    hasIntegrations: !!section.integrations?.length,
    hasNfrs: !!section.nfrs?.length,
    hasMigration: !!section.migration?.length,
    hasEdgeCases: !!section.edgeCases?.length,
    hasDeliverables: !!section.deliverableChecklist?.length,
    hasQuestions: !!section.enableReview,
  };
}
