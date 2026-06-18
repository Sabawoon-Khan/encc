import type { SectionDefinition } from "@/types/requirements";

export const salesReportsSection: SectionDefinition = {
  id: "sales-reports",
  name: "Sales Reports",
  nameDari: "گزارش‌های فروشات",
  enableReview: true,
  description:
    "Analytics on completed sales — four report types with Hijri date filters and export to PDF or Excel.",
  status: "draft",
  summary: [
    "By product type, category, mine, or combined dashboard",
    "All reports use Hijri date range filters",
    "Data from completed purchase requests and issued sales forms",
  ],
  precededBy: [
    {
      moduleId: "sales",
      sectionId: "sales-form",
      label: "Issue Sales Form",
    },
  ],
  entities: [],
  workflows: [],
  businessRules: [
    {
      id: "BR-SAL-R001",
      rule: "Reports only include completed sales (status = complete)",
      trigger: "Run report",
      response: "Filter out in-progress requests",
      severity: "High",
    },
    {
      id: "BR-SAL-R002",
      rule: "Hijri date range filter on all report types",
      trigger: "Run report",
      response: "Default to current month if empty",
      severity: "High",
    },
  ],
  reports: [
    {
      id: "RPT-OPR-050",
      name: "By Product Type",
      purpose: "Volume and revenue per coal grade or product variant",
      filters: "Hijri date range, category, product type, mine, customer",
      columns: "product type, category, total qty (tons), revenue (AFN), order count",
      export: "PDF, Excel",
    },
    {
      id: "RPT-OPR-051",
      name: "By Product Category",
      purpose: "Totals by general group — coal vs wood vs other",
      filters: "Hijri date range, category, mine, status",
      columns: "category, total qty (tons), revenue (AFN), order count, avg price/ton",
      export: "PDF, Excel",
    },
    {
      id: "RPT-OPR-052",
      name: "By Mining Site",
      purpose: "Quantity and revenue sold from each mine",
      filters: "Hijri date range, mine, category, product type",
      columns: "mine, category, type, total qty (tons), revenue (AFN), order count",
      export: "PDF, Excel",
    },
    {
      id: "RPT-OPR-053",
      name: "Summary Dashboard",
      purpose: "Combined view — filter by date, mine, category, type, customer, boss, status",
      filters: "Hijri date range (required), mine, category, type, customer, boss, status",
      columns: "qty, product revenue, weighing revenue, grand total, order count",
      export: "PDF, Excel, Dashboard",
    },
  ],
  permissionsMatrix: [
    { action: "View reports", archiveClerk: "—", executive: "R", deptStaff: "R", auditor: "R" },
    { action: "Export reports", archiveClerk: "—", executive: "E", deptStaff: "E", auditor: "R" },
  ],
  deliverableChecklist: [
    { item: "Four report types defined", done: true },
    { item: "ENCC sign-off", done: false },
  ],
};
