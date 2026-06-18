import type { ModuleDefinition } from "@/types/requirements";
import { HIJRI_DATE_EXAMPLE, HIJRI_DATE_FORMAT } from "@/types/requirements";
import { executionOfficeSection } from "./execution-office";

export const oprModule: ModuleDefinition = {
  id: "opr",
  code: "OPR",
  name: "Executive Directorate",
  nameDari: "ریایست اجرایه",
  tier: 1,
  sidebarGroup: "directorate",
  status: "draft",
  location: "ENCC HQ — ریایست اجرایه",
  client: "ENCC — National Coal Corporation",
  analyst: "Yaqeen Technology",
  version: "1.0",
  purpose:
    "HQ executive layer — standards, boss approvals, and coordination across departments.",
  overview:
    "HQ executive directorate — standards, boss approvals, and coordination across اجرایه, آرشیف, and departments.",
  purposes: [
    "Module-wide standards (Hijri dates, executive approval, audit trail)",
    "End-to-end purchase workflow overview across departments",
    "Coordinate Archive and Execution Office sub-offices",
  ],
  generalStandards: [
    {
      id: "dates",
      title: "Dates",
      titleDari: "تاریخ",
      description:
        "All date fields across this module use the Solar Hijri (Shamsi) calendar. Applies to every department — not repeated in individual field definitions.",
      example: `${HIJRI_DATE_FORMAT} → ${HIJRI_DATE_EXAMPLE}`,
    },
    {
      id: "executive-approval",
      title: "Executive selection",
      titleDari: "انتخاب مدیر",
      description:
        "When a record requires approval, the creator selects one of the four bosses (Commercial, Mali, Operational, General). All four have equal approval authority.",
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
    "ENCC HQ manages inquiries and correspondence through paper forms and physical registers. Departments work in silos with no shared digital trail.",
  successOutcomes: [
    {
      id: "OUT-OPR-001",
      outcome: "Every transaction registered with unique ENCC number",
      measure: "Department register review",
      target: "100%",
    },
    {
      id: "OUT-OPR-002",
      outcome: "Executive approval before downstream routing",
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
      description: "Purchase workflow — Operations → Mali → Control → Sales",
    },
    {
      id: "archive",
      name: "Archive",
      nameDari: "آرشیف",
      description: "Internal inquiries and external correspondence — see Archive module",
    },
  ],
  sections: [executionOfficeSection],
  relatedModules: [
    { code: "GEN", name: "General Tables", relation: "Shared master data" },
    { code: "OPS", name: "Operations", relation: "Purchase request creation" },
    { code: "MALI", name: "Mali", relation: "Bank receipts & payments" },
    { code: "CTRL", name: "Control", relation: "Verification checkpoint" },
    { code: "SAL", name: "Sales", relation: "Sales forms & reports" },
    { code: "ARC", name: "Archive", relation: "Correspondence register" },
    { code: "MINS", name: "Mines", relation: "Mine site integration" },
  ],
  openQuestions: [
    {
      id: "OQ-OPR-006",
      question: "Weighing fee confirmed at 10 AFN/ton — any exceptions or volume discounts?",
      owner: "ENCC Commercial",
    },
  ],
};
