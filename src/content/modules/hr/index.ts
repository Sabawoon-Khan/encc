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
  purpose:
    "Named employee master with full personnel storage (documents, education, بست, transfers), leave balances, fingerprint attendance, and payroll-ready salary history. Wages-based collective labour is paid in Salaries, not stored as individual HR rows.",
  overview:
    "HR department — keeps ENCC personnel storage (Person Documents, Education, Position بست, Assignment History) and adds date-effective salary/position history for mid-month pro-rata. Leave balances and fingerprint monthly attendance feed معاشات. Wages-based workers remain a Salaries collective-cash process.",
  purposes: [
    "Maintain named employee records and person documents (personnel file storage)",
    "Register positions (بست) and track branch/department/role transfers",
    "Record education (bachelor, master, PhD, etc.) with certificate files",
    "Maintain basic salary and date-effective salary/position history for payroll pro-rata",
    "Import monthly attendance from fingerprint system for permanent (and temporary) named staff",
    "Process leave requests with yearly leave balances",
  ],
  sections: [hrSection, leaveRequestsSection, employeeAttendanceSection],
  relatedModules: [
    {
      code: "SAL-PAY",
      name: "Salaries",
      relation:
        "Named payroll from attendance + salary history; wages-based collective cash entry; advances, tax, IC verification",
    },
  ],
});
