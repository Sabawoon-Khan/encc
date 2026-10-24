import type { SectionDefinition } from "@/types/requirements";

/**
 * Index of every sheet in forms/North_Coal_ERP_Sales_Marketing_Forms.xlsx (SM-01…SM-16)
 * mapped to Report - North Coal §4.4 source paragraph, requirement entity (Sales Process) and ER table.
 * Report lines below carry the REAL Excel columns / fields of each sheet.
 */
export const salesFormsIndexSection: SectionDefinition = {
  id: "sales-forms-index",
  name: "Sales Forms Index",
  nameDari: "فهرست فورم‌های فروشات",
  enableReview: true,
  description:
    "Master map of the Crest Point developer pack North_Coal_ERP_Sales_Marketing_Forms.xlsx (SM-01…SM-16, v1.0) to Report - North Coal §4.4. Each sheet is listed with its purpose, report source, requirement entity in Sales Process and ER table in Tables & ER diagram. Illustrative example data in the workbook is not production data.",
  status: "draft",
  currentTool:
    "forms/North_Coal_ERP_Sales_Marketing_Forms.xlsx + Report - North Coal (1).pdf §4.4 (As-Is: paper orders, bank slips, Maktub letters, manual ledgers — no customer tracking)",
  summary: [
    "Source: Report - North Coal §4.4 + North_Coal_ERP_Sales_Marketing_Forms.xlsx — Crest Point for ENCC",
    "A. Order → payment: SM-01 Sales Order Entry | SM-02 Tariff Slip | SM-03 Payment Confirmation | SM-04 IC Payment Verification",
    "B. Fulfilment: SM-05 Coal Allocation Auth | SM-06 Dispatch Tracking (view) | SM-07 Weighing Interface | SM-08 Sub-Office Minor Sale (Finance RV/JV)",
    "C. Views & masters: SM-09 Customer Tracking View | SM-10 Customer Master | SM-11 Tariff Schedule | SM-12 Status Lifecycle",
    "D. Specs: SM-13 Correction Request | SM-14 Approval Matrix | SM-15 Accounting Entries | SM-16 Reports Spec",
    "Workbook design rules: AFN only, tonnes; ED signs hard copy BEFORE entry; IC only at SM-04; tariff slip is NOT revenue; officers never edit submitted entries (SM-13); Control Log FA-18 immutable; allocation letter and tariff slip are printed hard copies",
    "Colour legend: yellow = user entry, grey = auto-populated, light grey = N/A, navy = headers",
  ],
  precededBy: [],
  followedBy: [
    { moduleId: "sales", sectionId: "sales-process", label: "Sales Process (entities, BPMN 1–5, roles, rules, reports)" },
    { moduleId: "sales", sectionId: "sales-data-model", label: "Tables & ER diagram" },
  ],
  relatedSections: ["sales-process", "sales-data-model"],
  entities: [
    {
      id: "ENT-SM-FORM-MAP",
      name: "SM Form → Entity / ER Map",
      description:
        "One row per Excel sheet (see the 16 lines below). Use as the build checklist: each sheet maps to a requirement entity, an ER table (or is explicitly a view / documentation), and a Report §4.4 source.",
      fields: [
        { name: "form_code", label: "Form Code", labelDari: "کود فورم", meaning: "Sheet code from workbook Index column A", type: "text", required: true, example: "SM-01" },
        { name: "sheet_name", label: "Excel Sheet", labelDari: "شیت اکسل", meaning: "Exact sheet title (Index column B)", type: "text", required: true, example: "SM-01 Sales Order Entry" },
        { name: "purpose", label: "Purpose", labelDari: "هدف", meaning: "Index column C", type: "longtext", required: true, example: "ED-approved sales order record with approval gate and Head confirmation" },
        { name: "report_source", label: "Source in approved report", labelDari: "منبع گزارش", meaning: "Index column D — Report paragraph", type: "text", required: true, example: "4.4.2 Sales Order Process and ED Approval" },
        { name: "entity_id", label: "Requirement Entity", labelDari: "موجودیت", meaning: "Entity / section in Sales Process", type: "text", required: true, example: "ENT-SM-010" },
        { name: "er_table", label: "ER Table", labelDari: "جدول", meaning: "Table in Tables & ER diagram, or 'view' / 'documentation' / 'GEN'", type: "text", required: true, example: "sales_orders" },
      ],
    },
  ],
  workflows: [],
  businessRules: [
    {
      id: "BR-SM-FORM-001",
      rule: "Every SM-* sheet must have a mapped entity, ER table, view or documentation target before build sign-off",
      trigger: "Developer handoff",
      response: "Use this index as the checklist",
      severity: "High",
    },
    {
      id: "BR-SM-FORM-002",
      rule: "UI form codes should match Excel SM-xx codes; screens show the Form code and version in the header like the workbook",
      trigger: "Screen design",
      response: "Show 'Form SM-xx' on each screen header",
      severity: "Medium",
    },
    {
      id: "BR-SM-FORM-003",
      rule: "Single currency AFN; quantities in tonnes. Directors/ED have no system login — physical approvals only, referenced by staff; no ED / Director signature block on any printed form",
      trigger: "Any SM transaction or print",
      response: "Block other currencies; no ED signature block",
      severity: "Critical",
    },
    {
      id: "BR-SM-FORM-004",
      rule: "Control Log (FA-18) is immutable — every sales action is written to it and no user can alter it",
      trigger: "Any SM action",
      response: "Append-only log",
      severity: "Critical",
    },
  ],
  reports: [
    {
      id: "RPT-SM-FORM-01",
      name: "SM-01 Sales Order Entry",
      purpose: "ED-approved sales order record with approval gate and Head confirmation",
      filters: "Report source: 4.4.2 Sales Order Process and ED Approval",
      columns:
        "Order No. (sequential) · Date of Order Entry · Customer Name · Coal Type and Grade · Quantity Ordered (tonnes) · Second Unit for Collection · ED Approval Reference · Date of ED Physical Approval · Notes (optional) · Entered By · Order Status | Gate result | Head decision + confirmation date → ENT-SM-010 / sales_orders",
      export: "Printed form (prepared by Sales Officer, confirmed by Sales Dept Head)",
    },
    {
      id: "RPT-SM-FORM-02",
      name: "SM-02 Tariff Slip",
      purpose: "Printable payment instruction with auto-calculated amount",
      filters: "Report source: 4.4.2 Tariff Issuance",
      columns:
        "Tariff No. · Date of Issue · Sales Order Ref. · Customer Name · Coal Type and Grade · Second Unit Location for Coal Receipt · Quantity Approved (t) · Unit Price (AFN/t) · Total Amount Payable (AFN) · Payment Bank Account · Tariff Validity From/To · ED Approval Reference · Status · Payment Instruction text → ENT-SM-020 / tariff_slips",
      export: "Printed hard copy to customer; digital copy linked to order",
    },
    {
      id: "RPT-SM-FORM-03",
      name: "SM-03 Payment Confirmation",
      purpose: "Finance deposit-to-tariff match and Customer Advance posting",
      filters: "Report source: 4.4.2 Customer Payment and Finance Confirmation",
      columns:
        "Tariff Slip Ref. · Sales Order Ref. · Customer Name · Bank Payment Slip No. · Deposit Date · Bank Reconciliation Ref. · Amount Deposited · Amount Payable per Tariff · Difference · Match Result · Automatic Posting (Dr Bank / Cr Customer Advance) · Order Status → Payment Confirmed · Notification to Sales → ENT-SM-030 / payment_confirmations",
      export: "Printed form (Finance Officer, Finance Dept Head)",
    },
    {
      id: "RPT-SM-FORM-04",
      name: "SM-04 IC Payment Verification",
      purpose: "Mandatory three-way check (bank slip, tariff slip, ED-approved order)",
      filters: "Report source: 4.4.2 Internal Control Payment Verification",
      columns:
        "Verification No. · Date Received by IC · Tariff Slip Ref. · Sales Order Ref. · Customer · Re-verification Round · Unit Price · Customer Advance Posted · Three-way comparison (Bank slip, Bank statement deposit, Tariff slip, ED-approved order) · 4 Checks (Yes/No) · Outcome (system) · Final Outcome (IC) · Decision Date · IC Comments (mandatory if Rejected) → ENT-SM-040 / sales_ic_verifications",
      export: "Printed form (Finance Officer, Finance Head, Internal Control)",
    },
    {
      id: "RPT-SM-FORM-05",
      name: "SM-05 Coal Allocation Auth",
      purpose: "Authorization record with live tracking fields",
      filters: "Report source: 4.4.2 Coal Allocation Authorization",
      columns:
        "Authorization No. · Date · Customer Name · Tariff Slip Ref. · Total Quantity Authorized · Unit Price · Total Amount Paid · Second Unit for Collection · ED Approval Reference · IC Payment Verification Ref. · Valid Until (to confirm) · Status | Live tracking: Dispatched · Remaining · Number of Collection Visits · Current Status → ENT-SM-050 / coal_allocation_auths",
      export: "Printed on letterhead outside ERP by Sales Dept Head",
    },
    {
      id: "RPT-SM-FORM-06",
      name: "SM-06 Dispatch Tracking",
      purpose: "Dispatch events, cumulative and remaining entitlement, status rules — tracking VIEW fed by weighing, not an entry form",
      filters: "Report source: 4.4.2 Dispatch Tracking",
      columns:
        "Header: Authorization No. · Customer · Total Authorized · Unit Price · Valid Until · As-of Date | Rows: Dispatch Date/Time · Second Unit · Quantity Dispatched · Cumulative Dispatched · Remaining Entitlement · Weighing Record Ref. · Revenue Recognized | Summary: total dispatched, remaining, visits, status, total revenue → ENT-SM-060 (view over weighing_records)",
      export: "Report layout (read-only for Sales)",
    },
    {
      id: "RPT-SM-FORM-07",
      name: "SM-07 Weighing Interface",
      purpose: "Weighing-system record received by the ERP and the three automatic actions (mining sites only)",
      filters: "Report source: 4.4.2 Weighing System Integration",
      columns:
        "Weighing Record ID · Second Unit (mining site) · Customer · Authorization Reference · Quantity This Transaction · Cumulative (as reported) · Remaining (as reported) · Date/Time of Dispatch · Sync Mode · Received in ERP On | Auto: Sales update · Dr Customer Advance / Cr Revenue · Dr Cost of Coal Sold / Cr Coal Inventory | Recommended integrity checks → ENT-SM-070 / weighing_records",
      export: "Integration record (Ministry of Mines weighing software → ERP)",
    },
    {
      id: "RPT-SM-FORM-08",
      name: "SM-08 Sub-Office Minor Sale",
      purpose: "Minor sales at Sub-Offices through Finance RV / JV (no weighing integration)",
      filters: "Report source: 4.4.2 Sub-Office Coal Dispatch Process",
      columns:
        "Voucher No. · Voucher Type (RV/JV) · Sub-Office (Second Unit) · Voucher Date · Customer / Employee · Receipt Method · Quantity (gap) · Unit Price · Expected Amount · IC Verification · Lines: Account Code · Account Name · Description · Debit · Credit → ENT-SM-080 / sub_office_minor_sales (Finance FA-02 / FA-03)",
      export: "Printed voucher (Finance Officer, Finance Head, Internal Control)",
    },
    {
      id: "RPT-SM-FORM-09",
      name: "SM-09 Customer Tracking View",
      purpose: "Ordered vs paid vs authorized vs dispatched per customer",
      filters: "Report source: 4.4.2 Order and Dispatch Tracking; 4.4.1 pain point (no customer tracking)",
      columns:
        "Customer · Order No. · Tariff Ref. · Qty Ordered · Unit Price · Amount Paid · Qty Authorized · Qty Dispatched · Remaining Entitlement · Visits · Status; totals; filters by customer, Second Unit, date range, authorization status → RPT-SM-012",
      export: "Report layout",
    },
    {
      id: "RPT-SM-FORM-10",
      name: "SM-10 Customer Master",
      purpose: "Supporting customer database layout (proposed — report lists no customer fields)",
      filters: "Report source: Derived (customers selected from database)",
      columns: "Customer ID · Customer Name · Contact Person · Phone · Address · Status · Created By → ENT-SM-100 (shared GEN customers)",
      export: "Supporting template",
    },
    {
      id: "RPT-SM-FORM-11",
      name: "SM-11 Tariff Schedule",
      purpose: "Supporting unit-price master — source of Unit Price on every tariff slip (maintainer to be confirmed)",
      filters: "Report source: Derived (unit price from approved tariff schedule)",
      columns:
        "Coal Type · Grade · Unit Price (AFN per tonne) · Effective From · Effective To · Status · Approval Reference (hard copy) · Rule Check (system) → ENT-SM-110 / tariff_schedule",
      export: "Supporting template",
    },
    {
      id: "RPT-SM-FORM-12",
      name: "SM-12 Status Lifecycle",
      purpose: "Sequence of statuses and gates from order to fulfilment",
      filters: "Report source: 4.4.2; 4.4.5 Workflows 1–4",
      columns:
        "# · Stage / Status · Set By · Trigger · Gate to Next Stage — 10 stages: physical request + ED signature → Order recorded → ED Approved Recorded → Tariff issued → Payment Confirmed → Payment verified by IC → Open → Partially Fulfilled → Fully Fulfilled → Expired → documented as Status Lifecycle in Sales Process",
      export: "Documentation",
    },
    {
      id: "RPT-SM-FORM-13",
      name: "SM-13 Correction Request",
      purpose: "Standard officer correction request (Sales) — same form as FA-11",
      filters: "Report source: 4.4.2 Officer Correction Request Workflow",
      columns:
        "Request No. · Date Raised · Module · Second Unit / HQ · Entry Type · Entry Reference · Raised By · Entry Status at Request · Description of Error · Required Correction · Justification · Head Decision / Date / Reason · Entry Unlocked · Corrected Entry Ref. · Control Log → ENT-SM-130 / sales_correction_requests",
      export: "Printed form (Sales Officer, Sales Dept Head)",
    },
    {
      id: "RPT-SM-FORM-14",
      name: "SM-14 Approval Matrix",
      purpose: "Who prepares, approves and verifies each form; ED has no system role",
      filters: "Report source: 4.4.3 System Roles and Access Permissions",
      columns:
        "Form · Initiated/Prepared By · Department Head Action · ED (physical, outside system) · Finance Role · Internal Control (read-only) · Automatic System Action → ENT-SM-140 (documentation)",
      export: "Documentation",
    },
    {
      id: "RPT-SM-FORM-15",
      name: "SM-15 Accounting Entries",
      purpose: "Automatic entries for deposits, dispatch and cost of coal sold",
      filters: "Report source: 4.4.4 Accounting Entries",
      columns:
        "# · Trigger Event · Debit · Credit · Posting Basis / Related Form — (1) Dr Bank / Cr Customer Advance (2) Dr Customer Advance / Cr Revenue (3) Dr Cost of Coal Sold / Cr Coal Inventory (4) Sub-Office via RV/JV → ENT-SM-150 (documentation)",
      export: "Documentation",
    },
    {
      id: "RPT-SM-FORM-16",
      name: "SM-16 Reports Spec",
      purpose: "Required sales reports, frequency and filters (11 reports)",
      filters: "Report source: 4.4.4 Required Reports",
      columns:
        "Sales Order Register · Tariff Slip Register · Payment Confirmation Report · Coal Allocation Authorization Register · Dispatch Tracking — Per Customer · Dispatch Tracking — Per Second Unit · Revenue Recognition Summary · Outstanding Entitlement Report · Expired Authorization Report · Internal Control Verification · Control Log / Audit Trail Report → RPT-SM-001…011 in Sales Process",
      export: "PDF + Excel",
    },
  ],
  crossModuleNotes: [
    "Report §4.4.2 narrative + Excel SM sheets define the screens; FA-xx references point to the Finance workbook (FA-02 RV, FA-03 JV, FA-06 bank reconciliation, FA-08 revenue, FA-11 correction, FA-16 report header, FA-18 Control Log).",
    "Tariff slip is NOT revenue. Revenue is recognised only on the weighing record at mining sites (SM-07) or via Finance RV/JV at Sub-Offices (SM-08).",
    "Customers (SM-10) are shared master data on General Tables; the tariff schedule (SM-11) is owned by Sales (maintainer to be confirmed).",
    "SM-06 and SM-09 are views; SM-12, SM-14, SM-15, SM-16 are documentation, not tables.",
  ],
  deliverableChecklist: [
    { item: "All 16 SM sheets listed with real Excel columns and report source", done: true },
    { item: "Each sheet mapped to entity (Sales Process) and ER table / view / documentation", done: true },
    { item: "Aligned to Report §4.4 + Crest Point workbook v1.0", done: true },
    { item: "OPEN — SM-05 Valid Until rule (not in approved field list; needed for Expired)", done: false },
    { item: "OPEN — SM-07 weighing software integration method and over-limit / duplicate sync handling", done: false },
    { item: "OPEN — SM-07 / SM-15 inventory costing basis for Cost of Coal Sold", done: false },
    { item: "OPEN — SM-08 Quantity field on FA-02/03, Sub-Office stock reduction, IC verification alignment", done: false },
    { item: "OPEN — SM-10 final customer master fields vs General Tables", done: false },
    { item: "OPEN — SM-11 who maintains the tariff schedule and price-change approval", done: false },
    { item: "OPEN — SM-12 confirm derived status names (Tariff issued, Payment verified by IC)", done: false },
    { item: "OPEN — UI shows Form SM-xx codes like workbook", done: false },
  ],
};
