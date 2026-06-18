import type { ModuleDefinition } from "@/types/requirements";
import { HIJRI_DATE_EXAMPLE, HIJRI_DATE_FORMAT } from "@/types/requirements";
import { archiveSection } from "./archive";
import { executionOfficeSection } from "./execution-office";
import { generalTablesSection } from "./general-tables";

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
    "ریایست اجرایه (Executive Directorate) is the headquarters management section controlled by general managers and executives. It contains sub-offices: امریت اجرایه (Execution Office) and آرشیف (Archive), plus shared General Tables used across sections. Four bosses share equal approval authority for workflows in this module.",
  purposes: [
    "Centralize executive-level approvals and document routing at HQ",
    "Track internal and external correspondence through آرشیف (Archive)",
    "Register customer purchase requests (coal, wood, etc.) through امریت اجرایه with full payment and sales workflow",
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
  sections: [generalTablesSection, archiveSection, executionOfficeSection],
  relatedModules: [
    { code: "DOC", name: "Document Management", relation: "Attachments & retention" },
    { code: "SCA", name: "Sales, Contracts & Allocations", relation: "Sales forms & commercial context" },
    { code: "FIN", name: "Finance & GL", relation: "Bank accounts & payment verification" },
    { code: "MINS", name: "Mines", relation: "Mining sites & completed order visibility" },
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
    {
      id: "OQ-OPR-004",
      question: "Exact bank receipt PDF layout for product and weighing — sample images needed from ENCC",
      owner: "ENCC Mali / Finance",
    },
    {
      id: "OQ-OPR-005",
      question: "Sales department form layout and fields — sample from ENCC فروشات",
      owner: "ENCC Sales",
    },
    {
      id: "OQ-OPR-006",
      question: "Weighing fee confirmed at 10 AFN/ton — any exceptions or volume discounts?",
      owner: "ENCC Commercial",
    },
    {
      id: "OQ-OPR-007",
      question: "Current product categories, types, and price list for migration into master tables",
      owner: "ENCC Execution Office",
    },
  ],
};
