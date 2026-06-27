import { createDepartmentModule } from "../createDepartmentModule";
import { employeeAttendanceSection } from "./employee-attendance";
import { hrSection } from "./hr";
import { leaveRequestsSection } from "./leave-requests";

export const hrModule = createDepartmentModule({
  id: "hr",
  code: "HR",
  name: "Human Resources",
  nameDari: "منابع بشری",
  location: "ENCC HQ — منابع بشری",
  purpose: "Employee records, positions, transfers, education, leave, attendance, and personnel management.",
  overview:
    "HR department — employee master, بست positions, assignment history, education, monthly attendance for permanent staff, leave requests, and personnel files.",
  purposes: [
    "Maintain employee records and person documents",
    "Register positions (بست) and track branch/department/role transfers",
    "Record education (bachelor, master, PhD, etc.)",
    "Import monthly attendance from fingerprint system for permanent employees",
    "Process leave requests and personnel reports",
  ],
  sections: [hrSection, leaveRequestsSection, employeeAttendanceSection],
  relatedModules: [
    { code: "SAL-PAY", name: "Salaries", relation: "Approved monthly attendance auto-generates payroll" },
  ],
});
