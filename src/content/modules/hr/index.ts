import { createDepartmentModule } from "../createDepartmentModule";
import { employeeAttendanceSection } from "./employee-attendance";
import { hrSection } from "./hr";
import { leaveRequestsSection } from "./leave-requests";
import { timesheetSection } from "./timesheet";

export const hrModule = createDepartmentModule({
  id: "hr",
  code: "HR",
  name: "Human Resources",
  nameDari: "منابع بشری",
  location: "ENCC HQ — منابع بشری",
  purpose:
    "Named employee master with full personnel storage (documents, education, بست, transfers), leave balances, Crest Point daily timesheets (PY-05/06), fingerprint monthly attendance, and payroll-ready salary history. Wages-based collective labour is paid in Salaries, not stored as individual HR rows.",
  overview:
    "HR department — keeps ENCC personnel storage (Person Documents, Education, Position بست, Assignment History) and Crest Point forms PY-01 fields (basic salary, date-effective history), PY-03/04 leave, PY-05/06 timesheets. Fingerprint monthly attendance kept for ENCC makul/khademati. Wages-based pay stays in Salaries ENT-SAL-040.",
  purposes: [
    "Maintain named employee records and person documents (personnel file storage)",
    "Register positions (بست) and track branch/department/role transfers",
    "Record education (bachelor, master, PhD, etc.) with certificate files",
    "Maintain basic salary and date-effective salary/position history for payroll pro-rata (PY-01/PY-02)",
    "Daily timesheets with OT + Dept Head finalize/lock (PY-05/PY-06)",
    "Import monthly fingerprint attendance for permanent staff (ENCC)",
    "Process leave requests with yearly leave balances (PY-03/PY-04)",
  ],
  sections: [hrSection, leaveRequestsSection, timesheetSection, employeeAttendanceSection],
  relatedModules: [
    {
      code: "SAL-PAY",
      name: "Salaries",
      relation:
        "Payroll from locked timesheets + salary history; fingerprint reconcile; wages-based collective cash; advances, tax, IC (PY-07–PY-20)",
    },
  ],
  openQuestions: [
    {
      id: "OQ-HR-001",
      question:
        "Is Crest Point daily timesheet (PY-05) the payroll authority, or does ENCC fingerprint monthly register (ENT-HR-016) remain primary? Can both run with reconciliation?",
      owner: "ENCC HR + Payroll",
    },
    {
      id: "OQ-HR-002",
      question:
        "Should timesheet day_status include weekly holiday / public holiday (Crest Point PY-05 note left this open)?",
      owner: "ENCC HR",
    },
  ],
});
