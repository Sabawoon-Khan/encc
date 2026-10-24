import { createDepartmentModule } from "../createDepartmentModule";
import { financeDataModelSection } from "./finance-data-model";
import { financeFormsIndexSection } from "./finance-forms-index";
import { financeProcessSection } from "./finance-process";
import { maliSection } from "./mali";
import { sandaMaliSection } from "./sanda-mali";

export const maliModule = createDepartmentModule({
  id: "mali",
  code: "MALI",
  name: "Mali (Finance)",
  nameDari: "مالی",
  location: "ENCC HQ — مالی",
  purpose:
    "Finance from Crest Point Report §4.1 + FA-01…18 — vouchers, bank recon, CoA, periods, IC payments — plus ENCC سند مالی and purchase-chain receipts.",
  overview:
    "مالی — Forms Index (FA-01…18) → سند مالی / receipts detail. Crest Point workbook + Report §4.1; expand lean entities from the index. Balance module shares GL/recon targets.",
  purposes: [
    "Navigate all 18 Crest Point FA forms via Finance Forms Index",
    "سند مالی — chart of accounts, balanced journal vouchers (FA-03/14)",
    "PV/RV/JV, bank import/recon, bulk import, revenue recognition (FA-01…08)",
    "Purchase budget check, IC payment verify, corrections (FA-09…11)",
    "Fiscal periods, period close, CoA, GL reference, reports, Control Log (FA-12…18)",
    "ENCC: product/weighing bank receipts after boss approval",
  ],
  sections: [
    financeFormsIndexSection,
    financeProcessSection,
    financeDataModelSection,
    sandaMaliSection,
    maliSection,
  ],
  relatedModules: [
    { code: "OPR", name: "Executive Directorate", relation: "Parent directorate" },
    { code: "GEN", name: "General Tables", relation: "Bank accounts & uploaded receipts" },
    { code: "BAL", name: "Balance", relation: "GL / reconciliation companion" },
    { code: "CTRL", name: "Control", relation: "FA-10 IC; FA-18 Control Log pattern" },
    { code: "OPS", name: "Operations", relation: "Receives approved requests" },
  ],
  openQuestions: [
    {
      id: "OQ-MALI-001",
      question: "Exact bank receipt PDF layout for product and weighing — sample from ENCC",
      owner: "ENCC Mali / Finance",
    },
    {
      id: "OQ-MALI-003",
      question: "Sample paper سند مالی form and numbering convention for file_id",
      owner: "ENCC Mali / Finance",
    },
    {
      id: "OQ-MALI-004",
      question: "Confirm Chart of Accounts Direct/Indirect classification rules (FA-14) before go-live.",
      owner: "ENCC Finance",
    },
  ],
});
