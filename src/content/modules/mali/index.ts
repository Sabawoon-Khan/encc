import { createDepartmentModule } from "../createDepartmentModule";
import { maliSection } from "./mali";
import { sandaMaliSection } from "./sanda-mali";

export const maliModule = createDepartmentModule({
  id: "mali",
  code: "MALI",
  name: "Mali (Finance)",
  nameDari: "مالی",
  location: "ENCC HQ — مالی",
  purpose: "Digital accounting (سند مالی), bank receipts, and payment verification.",
  overview:
    "Mali (مالی) finance department. سند مالی and chart of accounts are the foundation for digitizing financial records. Also handles bank payment receipts after boss approval and payment verification after customer pays.",
  purposes: [
    "سند مالی — chart of accounts, balanced journal vouchers, and attachments",
    "Generate product and weighing bank receipts for purchase requests",
    "Upload and verify bank receipt records after customer payment",
    "Future: journal summaries, balances, cash flow (separate sections)",
  ],
  sections: [sandaMaliSection, maliSection],
  relatedModules: [
    { code: "OPR", name: "Executive Directorate", relation: "Parent directorate" },
    { code: "GEN", name: "General Tables", relation: "Bank accounts & uploaded receipts" },
    { code: "OPS", name: "Operations", relation: "Receives approved requests" },
    { code: "CTRL", name: "Control", relation: "Hands off after receipt print" },
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
  ],
});
