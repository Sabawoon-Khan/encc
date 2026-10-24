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
    "Payroll from Crest Point Report - North Coal §4.3 + forms PY-07…20 for ENCC — advances, named payroll from locked timesheets, wages-based collective cash, ARD tax, IC eight-check gate, payslips, bank list, corrections, auto GL. PY-01…06 are in HR.",
  overview:
    "معاشات — Forms Index → process detail (lean entities = ER) → Tables & ER. Aligned to Report §4.3 To-Be, BPMN-3/4/5, developer specs §4.3.4, and Excel PY-07…20. HR owns employee/leave/timesheet; this module owns the pay run.",
  purposes: [
    "Map Report §4.3 + all 20 Crest Point forms via Payroll Forms Index",
    "PY-07/08 salary advances (BPMN-3) and recovery ledger",
    "PY-09/11 payroll period + named lines (PY-02 pro-rata; OT from timesheet)",
    "PY-10 wages-based collective cash per Second Unit",
    "PY-12 IC eight Report checks before payment / GL",
    "PY-13 payslips (Report display fields), PY-14 bank, PY-15/16 tax",
    "PY-17 correction (BPMN-5), PY-18 matrix, PY-19 five GL triggers, PY-20 reports",
    "Compliance: ISO 9001 sequence, IAS 19 accrual, Afghan/ARD tax",
    "Shared Tables & ER diagram for builders",
  ],
  sections: [payrollFormsIndexSection, salariesSection, payrollDataModelSection],
  openQuestions: [
    {
      id: "OQ-SAL-001",
      question:
        "Confirm ARD tax slab rates and remittance deadline before go-live (PY-15/16 cite a secondary source).",
      owner: "ENCC Payroll + Finance",
    },
    {
      id: "OQ-SAL-002",
      question:
        "Confirm GL amount basis for rent/electricity deductions (Crest Point PY-19 lists no posting for those two).",
      owner: "ENCC Finance",
    },
    {
      id: "OQ-SAL-003",
      question:
        "Confirm overtime rate source — per employee, per grade, or single corporate rate (PY-09 note).",
      owner: "ENCC Payroll",
    },
  ],
});
