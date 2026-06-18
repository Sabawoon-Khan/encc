import { createDepartmentModule } from "../createDepartmentModule";
import { maliSection } from "./mali";

export const maliModule = createDepartmentModule({
  id: "mali",
  code: "MALI",
  name: "Mali (Finance)",
  nameDari: "مالی",
  location: "ENCC HQ — مالی",
  purpose: "Generate bank receipts, upload and verify customer payments.",
  overview:
    "Mali (مالی) finance department. Prints bank payment receipts after boss approval, then uploads and verifies receipts after customer pays. Future task sections (rent, other payments) will be added here.",
  purposes: [
    "Generate product and weighing bank receipts for purchase requests",
    "Upload and verify bank receipt records after customer payment",
    "Future: rent and property payment workflows",
  ],
  sections: [maliSection],
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
  ],
});
