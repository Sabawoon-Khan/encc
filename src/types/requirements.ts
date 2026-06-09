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
  /** Show client review & scoring on this section page */
  enableReview?: boolean;
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
