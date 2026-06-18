import { createDepartmentModule } from "../createDepartmentModule";
import { salariesSection } from "./salaries";

export const salariesModule = createDepartmentModule({
  id: "salaries",
  code: "SAL-PAY",
  name: "Salaries",
  nameDari: "معاشات",
  location: "ENCC HQ — معاشات",
  purpose: "Employee payroll and salary payment management.",
  overview: "Salaries department — payroll processing and payment records.",
  purposes: ["Process monthly salaries", "Maintain salary registers", "Generate payroll reports"],
  sections: [salariesSection],
});
