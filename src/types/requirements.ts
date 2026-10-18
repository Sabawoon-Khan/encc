export type DocStatus = "draft" | "in_review" | "verified" | "pending";

export type FieldType =
  | "text"
  | "longtext"
  | "date"
  | "hijri_date"
  | "datetime"
  | "reference"
  | "enum"
  | "file"
  | "boolean"
  | "decimal";

export const HIJRI_DATE_FORMAT = "YYYY/MM/DD";
export const HIJRI_DATE_EXAMPLE = "1405/02/19";

export interface GlossaryTerm {
  id: string;
  term: string;
  termDari?: string;
  definition: string;
  usedIn: string[];
}

export interface RequirementField {
  name: string;
  label: string;
  labelDari?: string;
  meaning: string;
  type: FieldType;
  required: boolean | "on_close" | "conditional";
  example: string;
  rules?: string;
  verify?: boolean;
}

export interface WorkflowStep {
  step: number;
  actor: string;
  action: string;
  input: string;
  output: string;
  decision?: boolean;
  exception?: string;
}

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  startActor: string;
  endState: string;
  currentTool?: string;
  steps?: WorkflowStep[];
  flowDiagram?: string;
  mermaid?: string;
}

export interface BusinessRule {
  id: string;
  rule: string;
  trigger: string;
  response: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  override?: boolean;
  approver?: string;
}

export interface StatusTransition {
  entity: string;
  from: string;
  action: string;
  to: string;
  actor: string;
  notes?: string;
}

export interface RoleDefinition {
  role: string;
  location: string;
  mainActions: string;
  approval: boolean;
  readOnly: boolean;
}

export interface PermissionRow {
  action: string;
  archiveClerk: string;
  executive: string;
  deptStaff: string;
  auditor: string;
}

export interface ReportDefinition {
  id: string;
  name: string;
  purpose: string;
  filters: string;
  columns: string;
  export: string;
}

export interface ValidationRule {
  field: string;
  rule: string;
  uiBehavior?: string;
}

export interface IntegrationRow {
  id: string;
  direction: string;
  module: string;
  data: string;
  when: string;
  note?: string;
}

export interface EdgeCase {
  id: string;
  scenario: string;
  behavior: string;
  handler: string;
}

export interface DeliverableItem {
  item: string;
  done: boolean | "partial";
}

export interface EntityDefinition {
  id: string;
  name: string;
  description: string;
  fields: RequirementField[];
}

export interface TaskRef {
  moduleId: string;
  sectionId: string;
  /** Display label override */
  label?: string;
}

export interface SectionDefinition {
  id: string;
  name: string;
  nameDari?: string;
  description: string;
  status: DocStatus;
  currentTool?: string;
  summary: string[];
  entities: EntityDefinition[];
  workflows: Workflow[];
  businessRules: BusinessRule[];
  roles?: RoleDefinition[];
  statusLifecycles?: StatusTransition[];
  permissionsMatrix?: PermissionRow[];
  reports?: ReportDefinition[];
  validationRules?: ValidationRule[];
  integrations?: IntegrationRow[];
  nfrs?: { area: string; requirement: string }[];
  migration?: string[];
  edgeCases?: EdgeCase[];
  crossModuleNotes?: string[];
  deliverableChecklist?: DeliverableItem[];
  relatedSections?: string[];
  /** Tasks that must complete before this one */
  precededBy?: TaskRef[];
  /** Tasks that typically follow this one */
  followedBy?: TaskRef[];
  /** Show client review & scoring on this section page */
  enableReview?: boolean;
  /**
   * Optional Mermaid erDiagram (legacy). Prefer `schemaDiagram` for the clean
   * colored table cards (PK column + field names).
   */
  schemaMermaid?: string;
  /** Clean ER / schema overview for builders (colored table cards). */
  schemaDiagram?: SchemaDiagram;
  /** When true, page shows only the ER diagram (no info / objectives / TOC fluff). */
  schemaOnly?: boolean;
}

export interface SchemaTableColumn {
  name: string;
  /** Primary key */
  pk?: boolean;
  /** Show * after name */
  required?: boolean;
  /** Short type label: text | number | bool | date | datetime | enum | ref | file */
  type?: string;
  /** Enum option values — shown in tooltip; type column stays compact as "enum" */
  enums?: string[];
  /**
   * Foreign key target table id (matches SchemaTable.id).
   * Shown as clickable "fk" — same page scrolls/highlights; set `fkHref` when the
   * target table lives on another module ER page.
   */
  fkTo?: string;
  /** Optional full path e.g. /modules/shared/sections/general-tables-er#branches */
  fkHref?: string;
}

export interface SchemaTable {
  id: string;
  name: string;
  /** Short store summary — shown on ER info (i) icon */
  info?: string;
  columns: SchemaTableColumn[];
  /** Child / sub-tables rendered under this parent */
  children?: SchemaTable[];
}

export interface SchemaGroup {
  id: string;
  label: string;
  color: "blue" | "purple" | "green" | "yellow" | "brown" | "rose";
  tables: SchemaTable[];
}

/** @deprecated FK click badges replace drawn lines — optional / unused */
export interface SchemaRelation {
  from: string;
  to: string;
  label?: string;
}

export interface SchemaDiagram {
  groups: SchemaGroup[];
  /** Unused — relationships shown via clickable fk badges */
  relations?: SchemaRelation[];
}

export interface ExecutiveRole {
  id: string;
  name: string;
  nameDari: string;
  description: string;
}

export interface SubOffice {
  id: string;
  name: string;
  nameDari: string;
  description: string;
}

export interface GeneralStandard {
  id: string;
  title: string;
  titleDari?: string;
  description: string;
  example?: string;
}

/** Sidebar grouping — shared data, directorate overview, or task-owning department */
export type SidebarGroup = "shared" | "directorate" | "department";

export interface ModuleDefinition {
  id: string;
  code: string;
  name: string;
  nameDari?: string;
  tier: number;
  status: DocStatus;
  location: string;
  client: string;
  analyst: string;
  version: string;
  purpose: string;
  overview: string;
  purposes: string[];
  /** Controls sidebar placement */
  sidebarGroup?: SidebarGroup;
  /** Parent module when this is a department under a directorate */
  parentModuleId?: string;
  generalStandards?: GeneralStandard[];
  globalBusinessRules?: BusinessRule[];
  executives: ExecutiveRole[];
  subOffices: SubOffice[];
  sections: SectionDefinition[];
  relatedModules: { code: string; name: string; relation: string }[];
  openQuestions: { id: string; question: string; owner: string }[];
  problemStatement?: string;
  successOutcomes?: { id: string; outcome: string; measure: string; target: string }[];
}

export interface EvidenceItem {
  id: string;
  moduleId: string;
  sectionId: string;
  title: string;
  description?: string;
  filename: string;
  uploadedAt: string;
}

export interface EvidenceManifest {
  items: EvidenceItem[];
}
