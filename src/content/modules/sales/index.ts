import { createDepartmentModule } from "../createDepartmentModule";
import { salesReportsSection } from "./reports";
import { salesDataModelSection } from "./sales-data-model";
import { salesFormSection } from "./sales-form";
import { salesFormsIndexSection } from "./sales-forms-index";
import { salesProcessSection } from "./sales-process";

export const salesModule = createDepartmentModule({
  id: "sales",
  code: "SAL",
  name: "Sales",
  nameDari: "فروشات",
  location: "ENCC HQ — فروشات",
  purpose:
    "Sales & Marketing per Report §4.4 and Excel SM-01…SM-16: ED-approved order → tariff slip → Finance payment confirmation → IC payment verification → coal allocation authorization → weighing-based dispatch tracking and revenue — plus ENCC sales form and reports.",
  overview:
    "فروشات — Forms Index (SM-01…16) → Sales Process (entities with Excel field labels, BPMN Workflows 1–5, §4.4.3 roles, status lifecycle, 11 required reports) → Tables & ER diagram, then ENCC sales-form and reports. The cycle starts outside the ERP with the ED's signed hard copy; the tariff slip is a payment instruction, not revenue; IC verifies only at the payment gate (SM-04); revenue is recognised only on the weighing record at mining sites or via Finance RV/JV at Sub-Offices (IFRS 15, ISO 9001 sequence).",
  purposes: [
    "Navigate all 16 Crest Point SM sheets via the Sales Forms Index (entity + ER table per sheet)",
    "SM-01…04: ED-approved order (recorded only after physical ED approval), tariff slip, Finance payment confirmation, IC four-check payment verification",
    "SM-05…08: coal allocation authorization, dispatch tracking view, weighing-software interface (mining sites), Sub-Office minor sale via Finance RV/JV",
    "SM-09…12: customer tracking, customer master, tariff schedule, status lifecycle",
    "SM-13…16: correction request, approval matrix, accounting entries, 11 required reports",
    "Roles per §4.4.3 incl. Responsible User at Second Unit; ED/Directors no access; System Administrator zero sales data",
    "ENCC: issue sales form after payment verified + analytics",
  ],
  sections: [
    salesFormsIndexSection,
    salesProcessSection,
    salesDataModelSection,
    salesFormSection,
    salesReportsSection,
  ],
  relatedModules: [
    { code: "OPR", name: "Executive Directorate", relation: "ED physical approval of sales order (outside ERP; reference recorded in SM-01)" },
    { code: "MALI", name: "Finance (Mali)", relation: "SM-03 payment confirmation (FA-06 bank recon); FA-08 revenue; FA-02/03 RV/JV for Sub-Office sales" },
    { code: "CTRL", name: "Internal Control", relation: "SM-04 four-check payment verification; Control Log FA-18" },
    { code: "GEN", name: "General Tables", relation: "Customers (SM-10), Second Units (branches), coal type/grade, bank accounts" },
    { code: "STR", name: "Storage / Inventory", relation: "Mining-site stock reduction and Cost of Coal Sold on each weighing record (SM-07)" },
  ],
  openQuestions: [
    {
      id: "OQ-SAL-001",
      question: "Sales form PDF layout — sample from ENCC فروشات",
      owner: "ENCC Sales",
    },
    {
      id: "OQ-SAL-002",
      question: "SM-11: who maintains the tariff schedule and how are price changes approved? (Report does not say.)",
      owner: "ENCC Sales + Finance",
    },
    {
      id: "OQ-SAL-003",
      question: "SM-05: confirm the 'Authorization Valid Until' rule (not in approved field list; needed for Expired status — default from tariff validity?).",
      owner: "ENCC Sales + Crest Point",
    },
    {
      id: "OQ-SAL-004",
      question: "SM-07: confirm integration feasibility with the Ministry of Mines weighing software (API / file export) and sync mode; define ERP behaviour when a dispatch exceeds remaining entitlement or a batch is received twice.",
      owner: "ENCC IT + Ministry of Mines",
    },
    {
      id: "OQ-SAL-005",
      question: "SM-07 / SM-15: confirm the inventory costing basis for Cost of Coal Sold (e.g. weighted average).",
      owner: "ENCC Finance",
    },
    {
      id: "OQ-SAL-006",
      question: "SM-08: add Quantity to FA-02/FA-03? How does coal handed out at Sub-Offices leave inventory / post Cost of Coal Sold? Align IC verification of manual Sub-Office entries with the Finance spec (FA-02 shows N/A).",
      owner: "ENCC Finance + Crest Point",
    },
    {
      id: "OQ-SAL-007",
      question: "SM-12: confirm exact status names — 'Tariff issued' and 'Payment verified by IC' (and 'Order recorded' before Head confirmation) are derived labels, not in the report.",
      owner: "Crest Point (report owner)",
    },
    {
      id: "OQ-SAL-008",
      question: "SM-10: confirm final customer master fields vs General Tables customers; SM-02: define what happens when tariff validity lapses before payment.",
      owner: "ENCC Sales + Operations",
    },
  ],
});
