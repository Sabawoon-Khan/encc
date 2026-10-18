import { createDepartmentModule } from "../createDepartmentModule";
import { salariesSection } from "./salaries";

export const salariesModule = createDepartmentModule({
  id: "salaries",
  code: "SAL-PAY",
  name: "Salaries",
  nameDari: "معاشات",
  location: "ENCC HQ — معاشات",
  purpose:
    "Full payroll for named staff (from HR attendance + salary history) and wages-based collective cash per branch; advances, ARD tax, IC verification, payslips, and bank/cash payment.",
  overview:
    "Salaries department — Crest Point–style payroll cycle adapted for ENCC. Named employees and personnel files stay in HR; this module owns calculation, wages-based collective entry, advances, tax, Internal Control gate, GL postings, and payment outputs.",
  purposes: [
    "Generate monthly payroll for Permanent / Temporary / contract named staff from approved HR attendance",
    "Apply mid-month pro-rata from HR salary/position history",
    "Record wages-based collective cash totals per branch / Second Unit (unnamed workers)",
    "Manage salary advances and recovery deductions",
    "Auto-calculate income tax from configurable ARD slabs",
    "Route consolidated payroll through Internal Control before payment",
    "Produce payslips, bank transfer lists, and tax withholding reports",
  ],
  sections: [salariesSection],
});
