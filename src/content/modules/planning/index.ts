import { createDepartmentModule } from "../createDepartmentModule";
import { planningDataModelSection } from "./planning-data-model";
import { planningFormsIndexSection } from "./planning-forms-index";
import { planningProcessSection } from "./planning-process";

/**
 * Planning & Policy — Crest Point Report §4.7 + PL-01…14 forms.
 * New ENCC department module (no prior process sections); forms index is the entry.
 */
export const planningModule = createDepartmentModule({
  id: "planning",
  code: "PLN",
  name: "Planning & Policy",
  nameDari: "پلان و پالیسی",
  location: "ENCC HQ — پلان و پالیسی",
  purpose:
    "Operational and financial planning from Crest Point Report §4.7 + forms PL-01…14 — plan items, monthly targets, actuals, variance alerts, amendments, correspondence.",
  overview:
    "Planning & Policy — Forms Index → process detail (lean entities = ER) → Tables & ER diagram. Actual volumes and P&L pull from Site, Sales, and Finance.",
  purposes: [
    "Navigate all 14 Crest Point PL forms via Planning Forms Index",
    "PL-01/02 plan item catalog and plan approval",
    "PL-03/04 operational excavation + financial revenue/cost/CAPEX plans",
    "PL-05…08 actuals, variance, alerts, Actual vs Planned P&L",
    "PL-09 amendments (ED physical), PL-10 correspondence, PL-11 corrections",
    "PL-12…14 matrix, data-source logic, required reports",
  ],
  sections: [planningFormsIndexSection, planningProcessSection, planningDataModelSection],
  relatedModules: [
    { code: "OPR", name: "Executive Directorate", relation: "Parent; ED physical on plan amendments" },
    { code: "MALI", name: "Mali", relation: "CoA links on plan items; actual P&L" },
    { code: "SITE", name: "Site", relation: "Actual excavation/extraction volumes" },
    { code: "SAL", name: "Sales", relation: "Revenue actuals vs plan" },
    { code: "GEN", name: "General Tables", relation: "Branches / Second Units for operational plans" },
  ],
  openQuestions: [
    {
      id: "OQ-PLN-001",
      question: "Confirm plan-item classes/categories and which must link Chart of Accounts vs N/A (PL-01).",
      owner: "ENCC Planning + Finance",
    },
    {
      id: "OQ-PLN-002",
      question: "Confirm variance alert thresholds (PL-07) before go-live.",
      owner: "ENCC Planning",
    },
    {
      id: "OQ-PLN-003",
      question: "PL-13 As-Is gap: piece-rate payroll — Planning verifies output before payroll payment. Link to Payroll piece-rate step?",
      owner: "ENCC Planning + HR/Payroll",
    },
    {
      id: "OQ-PLN-004",
      question: "PL-13 As-Is gap: monthly coal royalty report (to Finance / Ministry) — in scope as a Planning report, or stays manual?",
      owner: "ENCC Planning + Finance",
    },
    {
      id: "OQ-PLN-005",
      question: "PL-13 As-Is gap: quarterly operational, evaluation and financial realization reports for government — which should the module generate?",
      owner: "ENCC Planning",
    },
    {
      id: "OQ-PLN-006",
      question: "PL-13 As-Is gap: topographic survey maps and contracting out of informally mined areas — track in Planning or another module?",
      owner: "ENCC Planning + Site",
    },
    {
      id: "OQ-PLN-007",
      question: "Confirm PL-10 correspondence register (proposed addition), ed_approval_ref on the plan header (PL-02), and IFRS 18 P&L layout for PL-08.",
      owner: "ENCC Planning + Finance",
    },
  ],
});
