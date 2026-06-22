import { createDepartmentModule } from "../createDepartmentModule";
import { hrSection } from "./hr";
import { leaveRequestsSection } from "./leave-requests";

export const hrModule = createDepartmentModule({
  id: "hr",
  code: "HR",
  name: "Human Resources",
  nameDari: "منابع بشری",
  location: "ENCC HQ — منابع بشری",
  purpose: "Employee records, positions, transfers, education, leave, and personnel management.",
  overview: "HR department — employee master, بست positions, assignment history, education, leave requests, and personnel files.",
  purposes: [
    "Maintain employee records and person documents",
    "Register positions (بست) and track branch/department/role transfers",
    "Record education (bachelor, master, PhD, etc.)",
    "Process leave requests and personnel reports",
  ],
  sections: [hrSection, leaveRequestsSection],
  relatedModules: [{ code: "SAL-PAY", name: "Salaries", relation: "Payroll uses employee data" }],
});
