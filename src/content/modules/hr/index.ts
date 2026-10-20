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
    "Named employee master (PY-01), leave (PY-03/04), and timesheets (PY-05/06) per Crest Point forms and Report §4.3 — plus ENCC personnel storage. Schema matches the shared Tables & ER diagram. Wages-based collective pay stays in Salaries (PY-10).",
  overview:
    "HR owns Crest Point PY-01…PY-06 from North_Coal_ERP_Payroll_Forms.xlsx and Report — North Coal §4.3 (Employee Database, Leave, Timesheet). Detail sections below; open Tables & ER diagram for the builder schema (same fields). Payroll calculation PY-07–20 is under معاشات.",
  purposes: [
    "PY-01 employee master + bank accounts + date-effective employment history (PY-02 pro-rata in Salaries)",
    "ENCC storage: person documents + education (lean ER columns); بست in General Tables",
    "PY-03/04 leave for Permanent staff — balances via leave_entitlements",
    "PY-05/06 timesheet period + employee day rows (attendance aggregates from days)",
    "Shared HR & Payroll Data Model (ER) for builders",
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
        "Consumes locked timesheet days + salary history; wages-based PY-10; advances, tax, IC (PY-07–PY-20)",
    },
    {
      code: "GEN",
      name: "General Tables",
      relation: "positions (بست), branches, leave_entitlements",
    },
  ],
  openQuestions: [
    {
      id: "OQ-HR-002",
      question:
        "Should timesheet day_status include weekly holiday / public holiday? (Crest Point PY-05 and Report §4.3 left blank Fridays without a holiday option.)",
      owner: "ENCC HR",
    },
  ],
});
