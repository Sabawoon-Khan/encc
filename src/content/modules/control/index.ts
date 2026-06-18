import { createDepartmentModule } from "../createDepartmentModule";
import { controlSection } from "./control";

export const controlModule = createDepartmentModule({
  id: "control",
  code: "CTRL",
  name: "Control",
  nameDari: "کنترول",
  location: "ENCC HQ — کنترول",
  purpose: "Verify requests and documents before customer actions — central checkpoint.",
  overview:
    "Control department (کنترول). Verifies purchase requests and Mali receipts before bank payment. Most workflows pass through Control; additional verification tasks will be added as new sections.",
  purposes: [
    "Verify purchase requests and Mali bank receipts before customer pays",
    "Central checkpoint for cross-department workflows",
    "Future: rent, property, and other control tasks",
  ],
  sections: [controlSection],
  relatedModules: [
    { code: "OPR", name: "Executive Directorate", relation: "Parent directorate" },
    { code: "MALI", name: "Mali", relation: "Receives after receipt print" },
    { code: "SAL", name: "Sales", relation: "Downstream after payment" },
  ],
});
