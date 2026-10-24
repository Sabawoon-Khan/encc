import type { SectionDefinition } from "@/types/requirements";

/**
 * Crest Point SM-16 required reports (+ SM-09 tracking view).
 * Source: North_Coal_ERP_Sales_Marketing_Forms.xlsx SM-16 + Report §4.4.4.
 * Replaces the older ENCC-only “by product type / category / mine” junk list.
 */
export const salesReportsSection: SectionDefinition = {
  id: "sales-reports",
  name: "Sales Reports",
  nameDari: "گزارش‌های فروشات",
  enableReview: true,
  description:
    "Required Sales & Marketing reports from Excel SM-16 and Report §4.4.4 — same list as Sales Process. Standard header/footer as FA-16; export PDF + Excel. Custom date range on all reports (app displays Hijri).",
  status: "draft",
  summary: [
    "Source: SM-16 Reports Spec + Report §4.4.4 Required Reports",
    "11 required reports + SM-09 customer tracking view",
    "Tariff / order are NOT revenue sources — Revenue Recognition Summary links to weighing (SM-07) or Sub-Office vouchers (SM-08)",
    "ENCC sales-form section remains as an extra operational screen beside Crest Point SM forms",
  ],
  precededBy: [
    { moduleId: "sales", sectionId: "sales-process", label: "Sales Process (SM entities + SM-16)" },
    { moduleId: "sales", sectionId: "sales-form", label: "Issue Sales Form (ENCC)" },
  ],
  entities: [],
  workflows: [],
  businessRules: [
    {
      id: "BR-SAL-R001",
      rule: "Reports use the Crest Point status lifecycle (ED Approved Recorded → Payment Confirmed → IC verified → Open / Partially / Fully Fulfilled / Expired) — not a generic 'complete' flag",
      trigger: "Run report",
      response: "Filter by SM-12 statuses",
      severity: "Critical",
    },
    {
      id: "BR-SAL-R002",
      rule: "All reports support a custom date range; app UI uses Hijri (Excel examples are Gregorian)",
      trigger: "Run report",
      response: "Require or default date range",
      severity: "High",
    },
    {
      id: "BR-SAL-R003",
      rule: "Revenue Recognition Summary must be driven by weighing records / RV-JV — never by tariff issuance",
      trigger: "Run RPT-SM-007",
      response: "Join SM-07 / SM-08 postings only",
      severity: "Critical",
    },
  ],
  reports: [
    { id: "RPT-SM-001", name: "Sales Order Register", purpose: "Register of ED-approved sales orders recorded in the system", filters: "On demand · Custom date range, per customer, per status", columns: "order_no, entry_date, customer, coal type/grade, quantity (t), Second Unit, ED approval ref/date, status", export: "PDF, Excel" },
    { id: "RPT-SM-002", name: "Tariff Slip Register", purpose: "Register of tariff slips issued (payment instructions — not revenue)", filters: "On demand · Custom date range, sequential, per customer", columns: "tariff_no, issue_date, order ref, customer, quantity (t), unit price, total payable, validity, status", export: "PDF, Excel" },
    { id: "RPT-SM-003", name: "Payment Confirmation Report", purpose: "Finance deposit-to-tariff confirmations", filters: "On demand · Custom date range, per customer, per tariff reference", columns: "tariff ref, order ref, customer, bank slip, deposit date, recon ref, deposited vs payable, match result", export: "PDF, Excel" },
    { id: "RPT-SM-004", name: "Coal Allocation Authorization Register", purpose: "Authorizations with live status", filters: "On demand / Real-time · date range, customer, Second Unit, status", columns: "authorization_no, date, customer, tariff, qty authorized, unit price, amount paid, Second Unit, ED ref, valid until, status", export: "PDF, Excel" },
    { id: "RPT-SM-005", name: "Dispatch Tracking Report — Per Customer", purpose: "Authorized vs dispatched vs remaining", filters: "On demand / Real-time · date range; authorized, dispatched, remaining, visit count", columns: "customer, authorization_no, authorized (t), dispatched (t), remaining (t), visits", export: "PDF, Excel" },
    { id: "RPT-SM-006", name: "Dispatch Tracking Report — Per Second Unit", purpose: "Dispatch/sales by mining site or Sub-Office", filters: "On demand / Real-time · date range, per site", columns: "Second Unit, customer, authorization_no, qty dispatched/sold (t), dates", export: "PDF, Excel" },
    { id: "RPT-SM-007", name: "Revenue Recognition Summary", purpose: "Revenue linked to dispatch / vouchers (IFRS 15)", filters: "On demand · date range, Second Unit, customer", columns: "Second Unit, customer, weighing/voucher ref, quantity (t), revenue (AFN)", export: "PDF, Excel" },
    { id: "RPT-SM-008", name: "Outstanding Entitlement Report", purpose: "Active authorizations with remaining quantity", filters: "On demand / Real-time · date range", columns: "customer, authorization_no, Second Unit, authorized, dispatched, remaining, valid until", export: "PDF, Excel" },
    { id: "RPT-SM-009", name: "Expired Authorization Report", purpose: "Past validity with unfulfilled quantity", filters: "On demand · date range", columns: "customer, authorization_no, valid until, authorized, dispatched, unfulfilled", export: "PDF, Excel" },
    { id: "RPT-SM-010", name: "Internal Control Verification", purpose: "SM-04 payment verification outcomes", filters: "On demand · date range, Verified / Rejected", columns: "verification_no, tariff, order, customer, reverify round, 4 checks, outcome, comments, decision date", export: "PDF, Excel" },
    { id: "RPT-SM-011", name: "Control Log / Audit Trail Report", purpose: "Immutable sales audit trail (FA-18)", filters: "On demand · date range, by user, action type", columns: "user, timestamp, action, entry ref, before/after", export: "PDF, Excel" },
    { id: "RPT-SM-012", name: "Customer Order, Payment and Dispatch Tracking (SM-09)", purpose: "Ordered vs paid vs authorized vs dispatched per customer (As-Is pain point)", filters: "Date range, customer, Second Unit, authorization status", columns: "Customer, Order, Tariff, Qty Ordered, Unit Price, Amount Paid, Qty Authorized, Qty Dispatched, Remaining, Visits, Status", export: "PDF, Excel" },
  ],
  permissionsMatrix: [
    { action: "View / generate sales reports", archiveClerk: "—", executive: "R", deptStaff: "R", auditor: "R" },
    { action: "Export PDF / Excel", archiveClerk: "—", executive: "E", deptStaff: "E", auditor: "R" },
  ],
  crossModuleNotes: [
    "Identical report set to Sales Process reports[] (SM-16). Keep both in sync when Excel changes.",
    "Do not resurrect ENCC-only product-type / category / mine dashboard rows — they are not in Crest Point SM-16.",
  ],
  deliverableChecklist: [
    { item: "SM-16 11 reports + SM-09 tracking view", done: true },
    { item: "Junk ENCC product/category/mine report list removed", done: true },
  ],
};
