import { createDepartmentModule } from "../createDepartmentModule";
import { salesReportsSection } from "./reports";
import { salesFormSection } from "./sales-form";

export const salesModule = createDepartmentModule({
  id: "sales",
  code: "SAL",
  name: "Sales",
  nameDari: "فروشات",
  location: "ENCC HQ — فروشات",
  purpose: "Issue sales forms and run sales analytics.",
  overview: "Sales department — issue forms to MINS and view sales reports.",
  purposes: [
    "Issue final sales form after payment verified",
    "Sales reports by product type, category, mine, and summary dashboard",
  ],
  sections: [salesFormSection, salesReportsSection],
  relatedModules: [
    { code: "OPR", name: "Executive Directorate", relation: "Parent directorate" },
    { code: "MINS", name: "Mines", relation: "Receives sales forms" },
    { code: "MALI", name: "Mali", relation: "After payment verified" },
  ],
  openQuestions: [
    {
      id: "OQ-SAL-001",
      question: "Sales form PDF layout — sample from ENCC فروشات",
      owner: "ENCC Sales",
    },
  ],
});
