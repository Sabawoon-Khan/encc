import { createDepartmentModule } from "../createDepartmentModule";
import { payrollDataModelSection } from "./payroll-data-model";
import { payrollFormsIndexSection } from "./payroll-forms-index";
import { salariesSection } from "./salaries";

export const salariesModule = createDepartmentModule({
  id: "salaries",
  code: "SAL-PAY",
  name: "Salaries",
  nameDari: "معاشات",
  location: "ENCC HQ — معاشات",
  purpose:
    "Full payroll mapped to Crest Point forms PY-01…PY-20: named staff from locked timesheets + salary history, wages-based collective cash, advances, ARD tax, IC verification, payslips, bank/cash payment.",
  overview:
    "Salaries — Forms Index (20 sheets) → process detail → end with clean HR & Payroll Data Model (ER) for builders. Detail workflows stay in middle sections; the last section is schema-only.",
  purposes: [
    "Navigate all 20 Excel forms via Payroll Forms Index",
    "Generate PY-09 payroll from PY-05/06 timesheets and PY-02 pro-rata",
    "Record PY-10 wages-based collective cash per Second Unit",
    "Manage PY-07/08 salary advances and recovery",
    "Auto-calculate tax from PY-15 slabs; track PY-16 withholding",
    "PY-11 summary + PY-12 IC eight-point gate before PY-19 GL",
    "Produce PY-13 payslips, PY-14 bank lists (from ENT-HR-023), and PY-20 reports",
    "Ship a clean ER / data model section for database builders",
  ],
  sections: [payrollFormsIndexSection, salariesSection, payrollDataModelSection],
  openQuestions: [
    {
      id: "OQ-SAL-001",
      question:
        "Confirm ARD tax slab rates and remittance deadline parameters before go-live (PY-15 notes cite a secondary source).",
      owner: "ENCC Payroll + Finance",
    },
    {
      id: "OQ-SAL-002",
      question:
        "Confirm GL amount basis for rent/electricity deductions (Crest Point PY-19 note — no posting listed for those two).",
      owner: "ENCC Finance",
    },
  ],
});
