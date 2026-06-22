import { createDepartmentModule } from "../createDepartmentModule";
import { contractEmployeesSection } from "./contract-employees";
import { dailySiteWorkSection } from "./daily-site-work";

export const siteModule = createDepartmentModule({
  id: "site",
  code: "SITE",
  name: "Site",
  nameDari: "سایت / معدن",
  location: "ENCC mine and field sites",
  purpose: "Contract workers, daily attendance, and piece-rate work at sites.",
  overview:
    "Site module — register contract employees (not HR permanent staff), manage per-site work groups and pay rates, record daily Hijri attendance and work quantities (ترمیم اساسی, ترمیم جاری, حفریات, wagon, ton), and produce monthly salary reports with tax.",
  purposes: [
    "Register contract employees with site, group, and type",
    "Configure per-site work groups and pay rates",
    "Daily attendance (present/absent) and work entry by group",
    "Monthly salary rollup — printable 8 people per page",
  ],
  sections: [contractEmployeesSection, dailySiteWorkSection],
  relatedModules: [
    { code: "GEN", name: "General Tables", relation: "Mining sites and branches" },
    { code: "HR", name: "Human Resources", relation: "Separate from permanent HR employees" },
    { code: "SAL-PAY", name: "Salaries", relation: "Future payroll handoff" },
  ],
});
