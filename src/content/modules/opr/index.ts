import type { ModuleDefinition } from "@/types/requirements";
import { HIJRI_DATE_EXAMPLE, HIJRI_DATE_FORMAT } from "@/types/requirements";
import { archiveSection } from "./archive";
import { executionOfficeSection } from "./execution-office";

export const oprModule: ModuleDefinition = {
  id: "opr",
  code: "OPR",
  name: "Executive Directorate",
  nameDari: "ریایست اجرایه",
  tier: 1,
  status: "draft",
  location: "ENCC HQ — ریایست اجرایه",
  client: "ENCC — National Coal Corporation",
  analyst: "Yaqeen Technology",
  version: "1.0",
  purpose:
    "General management and executive control layer of the ENCC ERP — approvals, document circulation, and HQ coordination.",
  overview:
    "ریایست اجرایه (Executive Directorate) is the headquarters management section controlled by general managers and executives. It contains two sub-offices: امریت اجرایه (Execution Office) and آرشیف (Archive). Four executives share equal approval authority for workflows in this module.",
  purposes: [
    "Centralize executive-level approvals and document routing at HQ",
    "Track internal and external correspondence through آرشیف (Archive)",
    "Support امریت اجرایه (Execution Office) in preparing and routing documents for executive sign-off",
  ],
  generalStandards: [
    {
      id: "dates",
      title: "Dates",
      titleDari: "تاریخ",
      description:
        "All date fields across this module use the Solar Hijri (Shamsi) calendar. Applies to every sub-office and section — not repeated in individual field definitions.",
      example: `${HIJRI_DATE_FORMAT} → ${HIJRI_DATE_EXAMPLE}`,
    },
    {
      id: "executive-approval",
      title: "Executive selection",
      titleDari: "انتخاب مدیر",
      description:
        "When a record requires approval, the creator selects one of the four executives (CEO, Commercial, Operations, Financial). All four have equal approval authority.",
    },
    {
      id: "audit-trail",
      title: "Audit trail",
      titleDari: "ثبت تغییرات",
      description:
        "All create, update, approval, rejection, and attachment actions must be logged with user and timestamp.",
    },
  ],
  globalBusinessRules: [
    {
      id: "BR-OPR-G001",
      rule: `All date fields must use Hijri (Shamsi) format ${HIJRI_DATE_FORMAT}`,
      trigger: "Save / Submit (any section)",
      response: "Block invalid format",
      severity: "Critical",
    },
    {
      id: "BR-OPR-G002",
      rule: "Date example format: 1405/02/19 (year/month/day)",
      trigger: "Validation",
      response: "Show format hint on error",
      severity: "Medium",
    },
  ],
  problemStatement:
    "ENCC HQ manages inquiries and correspondence through Paper 1.1 and physical book registers. There is no digital trail for executive approval → department routing → optional result.",
  successOutcomes: [
    {
      id: "OUT-OPR-001",
      outcome: "Every archive item registered with unique ENCC number",
      measure: "Archive register review",
      target: "100%",
    },
    {
      id: "OUT-OPR-002",
      outcome: "Executive approval before department routing",
      measure: "Workflow audit",
      target: "100%",
    },
    {
      id: "OUT-OPR-003",
      outcome: "All dates stored in Hijri YYYY/MM/DD format",
      measure: "Field validation check",
      target: "100%",
    },
  ],
  executives: [
    {
      id: "ceo",
      name: "General Executive / CEO",
      nameDari: "مدیر عامل / رئیس کل",
      description: "Equal approval authority with other three executives",
    },
    {
      id: "commercial",
      name: "Commercial Manager",
      nameDari: "مدیر تجارتی",
      description: "Commercial and sales-related approvals",
    },
    {
      id: "operations",
      name: "Operations / Admin Manager",
      nameDari: "مدیر اداری / عملیات",
      description: "Internal operations and administrative approvals",
    },
    {
      id: "financial",
      name: "Financial Manager",
      nameDari: "مدیر مالی",
      description: "Financial and budget-related approvals",
    },
  ],
  subOffices: [
    {
      id: "execution-office",
      name: "Execution Office",
      nameDari: "امریت اجرایه",
      description:
        "Prepares documents and routes them to executives for approval. Tracks status through the approval chain.",
    },
    {
      id: "archive",
      name: "Archive",
      nameDari: "آرشیف",
      description:
        "Registers internal inquiries (Paper 1.1) and external outgoing correspondence. Current tool: physical book register.",
    },
  ],
  sections: [archiveSection, executionOfficeSection],
  relatedModules: [
    { code: "DOC", name: "Document Management", relation: "Attachments & retention" },
    { code: "SCA", name: "Sales, Contracts & Allocations", relation: "Commercial context" },
    { code: "FIN", name: "Finance & GL", relation: "Financial approvals" },
  ],
  openQuestions: [
    {
      id: "OQ-OPR-001",
      question: "Exact internal inquiry number format used in physical book today?",
      owner: "ENCC Archive",
    },
    {
      id: "OQ-OPR-002",
      question: "Is there a separate incoming external archive (letters arriving from outside)?",
      owner: "ENCC Archive",
    },
    {
      id: "OQ-OPR-003",
      question: "Do external outgoing letters require executive approval before send?",
      owner: "ENCC Operations",
    },
  ],
};
