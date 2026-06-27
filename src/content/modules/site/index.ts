import { createDepartmentModule } from "../createDepartmentModule";
import { contractEmployeesSection } from "./contract-employees";
import { dailyAttendanceSection } from "./daily-attendance";
import { dailyWorkReportSection } from "./daily-work-report";
import { siteRequestsCirculationSection } from "./site-requests-circulation";

export const siteModule = createDepartmentModule({
  id: "site",
  code: "SITE",
  name: "Site",
  nameDari: "سایت / معدن",
  location: "ENCC mine and field sites",
  purpose: "Contract workers, daily attendance, piece-rate work, and site item circulation at sites.",
  overview:
    "Site module — register contract employees (not HR permanent staff), manage per-site work groups and pay rates, record daily Hijri attendance (present/absent), enter daily work quantities (ترمیم اساسی, ترمیم جاری, حفریات, wagon, ton), produce monthly salary reports with tax, submit requests to main office, and record چک وارده / چګ صادره item circulation.",
  purposes: [
    "Register contract employees with site, group, and type",
    "Configure per-site work groups and pay rates",
    "Daily attendance — present/absent by group",
    "Daily work report — piece-rate entry for present employees",
    "Monthly salary rollup — printable 8 people per page",
    "Site requests to main office — title, description, file, status, date",
    "چک وارده (in from HQ) and چګ صادره (out to workers) — simple site register",
  ],
  sections: [
    contractEmployeesSection,
    dailyAttendanceSection,
    dailyWorkReportSection,
    siteRequestsCirculationSection,
  ],
  relatedModules: [
    { code: "GEN", name: "General Tables", relation: "Mining sites and branches" },
    { code: "HR", name: "Human Resources", relation: "Separate from permanent HR employees" },
    { code: "ITM", name: "Items", relation: "HQ items ledger — separate from site circulation" },
    { code: "SAL-PAY", name: "Salaries", relation: "Future payroll handoff" },
  ],
});
