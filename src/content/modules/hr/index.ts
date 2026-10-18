import { createDepartmentModule } from "../createDepartmentModule";
import { payrollDataModelSection } from "../salaries/payroll-data-model";
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
    "Named employee master with full personnel storage (documents, education, بست, transfers), leave balances, Crest Point timesheets (period + employee days), and payroll-ready salary history. Wages-based collective labour is paid in Salaries, not stored as individual HR rows.",
  overview:
    "HR department — keeps ENCC personnel storage (Person Documents, Education) and Employment History (ENT-HR-013) for branch, position, and basic salary changes. Position بست is in General Tables. Leave and timesheets feed payroll; month/branch attendance is calculated from timesheet days via employee. Wages-based pay stays in Salaries. Open Tables & ER diagram for the schema.",
  purposes: [
    "Maintain named employee records and person documents (personnel file storage)",
    "Use General Tables positions (بست) and track branch/department/role transfers",
    "Record education (bachelor, master, PhD, etc.) with certificate files",
    "Maintain basic salary and date-effective salary/position history for payroll pro-rata (PY-01/PY-02)",
    "Timesheets: year/month parent + employee day rows; aggregates replace monthly attendance",
    "Process leave requests with yearly leave balances (PY-03/PY-04)",
    "Open the shared HR & Payroll Data Model (ER + lean tables) for builders",
  ],
  sections: [
    hrSection,
    leaveRequestsSection,
    timesheetSection,
    payrollDataModelSection,
  ],
  relatedModules: [
    {
      code: "SAL-PAY",
      name: "Salaries",
      relation:
        "Payroll from locked timesheet days + salary history; wages-based collective cash; advances, tax, IC (PY-07–PY-20)",
    },
  ],
  openQuestions: [
    {
      id: "OQ-HR-002",
      question:
        "Should timesheet day_status include weekly holiday / public holiday (Crest Point PY-05 note left this open)?",
      owner: "ENCC HR",
    },
  ],
});
