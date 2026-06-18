import { createDepartmentModule } from "../createDepartmentModule";
import { hrSection } from "./hr";

export const hrModule = createDepartmentModule({
  id: "hr",
  code: "HR",
  name: "Human Resources",
  nameDari: "منابع بشری",
  location: "ENCC HQ — منابع بشری",
  purpose: "Employee records and personnel management.",
  overview: "HR department — employee master data, hiring, and leave.",
  purposes: ["Maintain employee records", "Manage hiring and transfers", "Leave and personnel reports"],
  sections: [hrSection],
  relatedModules: [{ code: "SAL-PAY", name: "Salaries", relation: "Payroll uses employee data" }],
});
