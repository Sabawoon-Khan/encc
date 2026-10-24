import type { ReportDefinition, SectionDefinition } from "@/types/requirements";

/**
 * Organized index of all sheets from forms/North_Coal_ERP_Inventory_Forms.xlsx
 * so developers and ENCC can navigate form → entity → table in one place.
 * Source rows: Excel "Index" sheet (form code, purpose, source in approved report).
 */

interface FormMapRow {
  code: string;
  sheet: string;
  purpose: string;
  /** Entities in inventory-process.ts / tables in inventory-data-model.ts */
  maps: string;
  reportSource: string;
}

const FORM_MAP: FormMapRow[] = [
  { code: "IN-01", sheet: "IN-01 Item Request", purpose: "Item Request Form with Dept Head / Director-confirmation chain and Inventory Officer stock check", maps: "ENT-IN-010/011 → item_requests, item_request_lines", reportSource: "4.2.2 Item Request and Issuance Workflow" },
  { code: "IN-02", sheet: "IN-02 Store Issuance", purpose: "Store Issuance Form with automatic consumable / non-consumable treatment", maps: "ENT-IN-020/021 → store_issuances, store_issuance_lines (+ stores, stock_ledger_lines)", reportSource: "4.2.2 Scenario 1" },
  { code: "IN-03", sheet: "IN-03 Asset Handover", purpose: "Asset - In Use record: employee name, position, department, date", maps: "ENT-IN-030 → asset_handovers", reportSource: "4.2.2 Non-Consumable Items" },
  { code: "IN-04", sheet: "IN-04 Purchase Request", purpose: "Purchase Request Form (replaces manual FS-9) and transfer to Procurement", maps: "ENT-IN-040/041 → inventory_purchase_requests (+ lines); becomes Procurement PC-01 (purchase_requests) via source_ref", reportSource: "4.2.2 Scenario 2" },
  { code: "IN-05", sheet: "IN-05 Goods Receipt Note", purpose: "GRN with automatic discrepancy flag and posting by item category", maps: "ENT-IN-050/051 → goods_receipt_notes, grn_lines", reportSource: "4.2.2 Goods Receipt from Procurement" },
  { code: "IN-06", sheet: "IN-06 IC GRN Verification", purpose: "Mandatory Internal Control verify / reject record at GRN stage (four checks + re-verification round)", maps: "ENT-IN-060 → ic_grn_verifications", reportSource: "4.2.2 Internal Control Verification" },
  { code: "IN-07", sheet: "IN-07 Fixed Asset Entry", purpose: "Fixed asset registration with mandatory fields and Land rate lock", maps: "ENT-IN-070/071/160 → fixed_assets, depreciation_postings, asset_classes", reportSource: "4.2.2 Fixed Assets Received through Procurement" },
  { code: "IN-08", sheet: "IN-08 Depreciation Rate Change", purpose: "Formal rate adjustment record (original, new, reason, effective date) — class-wide or per asset", maps: "ENT-IN-080 → depreciation_rate_changes", reportSource: "4.2.2 Depreciation Control" },
  { code: "IN-09", sheet: "IN-09 Loss & Write-Down", purpose: "Loss, wastage and write-down to net realizable value with Head approval", maps: "ENT-IN-090/091 → loss_write_downs, loss_write_down_lines", reportSource: "4.2.2 Residual Value and Inventory Write-Down" },
  { code: "IN-10", sheet: "IN-10 Item Master", purpose: "Supporting item master (type, category, unit, minimum threshold, default expense account)", maps: "ENT-IN-100 → item_master (+ GEN product_types where shared)", reportSource: "Derived from 4.2.2 (item types, thresholds)" },
  { code: "IN-11", sheet: "IN-11 Stock Level & Alerts", purpose: "Live stock report layout with low-stock alert logic", maps: "ENT-IN-110/111 → stock_balances, stock_ledger_lines; report RPT-IN-011", reportSource: "4.2.2 Real-Time Inventory Visibility" },
  { code: "IN-12", sheet: "IN-12 Approval Matrix", purpose: "Who prepares, approves and verifies each form", maps: "ENT-IN-120 (documentation — no table)", reportSource: "4.2.3 System Roles and Access Permissions" },
  { code: "IN-13", sheet: "IN-13 Accounting Entries", purpose: "Automatic background double-entries for the module (nine rows)", maps: "ENT-IN-130 (developer reference — no table)", reportSource: "4.2.4 Accounting Entries - Developer Reference" },
  { code: "IN-14", sheet: "IN-14 Reports Spec", purpose: "Required inventory reports (eleven), frequency and filters", maps: "RPT-IN-014-01 … RPT-IN-014-11 (see Inventory Process → Reports)", reportSource: "4.2.4 Required Reports" },
  { code: "IN-15", sheet: "IN-15 Correction Request", purpose: "Standard officer correction request and Department Head decision", maps: "ENT-IN-150 → inventory_correction_requests", reportSource: "4.2.2 Officer Correction Request Workflow" },
];

const formMapReports: ReportDefinition[] = FORM_MAP.map((r) => ({
  id: `RPT-IN-FORM-${r.code.slice(3)}`,
  name: `${r.code} ${r.sheet.replace(/^IN-\d+\s/, "")}`,
  purpose: r.purpose,
  filters: `Excel sheet: ${r.sheet}`,
  columns: `${r.maps} — report source: ${r.reportSource}`,
  export: r.code === "IN-11" || r.code === "IN-14" ? "PDF, Excel" : "—",
}));

export const inventoryFormsIndexSection: SectionDefinition = {
  id: "inventory-forms-index",
  name: "Inventory Forms Index",
  nameDari: "فهرست فورم‌های انبار",
  enableReview: true,
  description:
    "Master map of Crest Point workbook North_Coal_ERP_Inventory_Forms.xlsx (IN-01…15) aligned to Report - North Coal §4.2 for ENCC. Each form maps to entities in Inventory Process and tables in Tables & ER. Open design questions are listed in Inventory Process (OPEN Q-IN-nn).",
  status: "draft",
  currentTool: "forms/North_Coal_ERP_Inventory_Forms.xlsx + Report - North Coal (1).pdf §4.2",
  summary: [
    "Source: Report - North Coal §4.2 + North_Coal_ERP_Inventory_Forms.xlsx — Crest Point for ENCC",
    "A Request/Issue: IN-01 Request | IN-02 Issuance | IN-03 Asset handover",
    "B Buy: IN-04 Purchase request (source of Procurement PC-01) | IN-05 GRN | IN-06 IC GRN (4 checks)",
    "C Assets: IN-07 Fixed asset | IN-08 Depreciation rate change | IN-09 Loss/write-down",
    "D Master & stock: IN-10 Item master | IN-11 Stock level & alerts (stock_balances)",
    "E Specs: IN-12 Matrix | IN-13 Accounting entries | IN-14 Reports (11) | IN-15 Correction",
    "All 15 sheets mapped — UI form codes use IN-xx",
  ],
  precededBy: [],
  followedBy: [
    { moduleId: "storage", sectionId: "inventory-process", label: "Inventory process detail" },
    { moduleId: "storage", sectionId: "inventory-data-model", label: "Tables & ER diagram" },
  ],
  relatedSections: ["inventory-process", "inventory-data-model"],
  entities: [
    {
      id: "ENT-IN-FORM-MAP",
      name: "IN Form → Entity Map",
      description: "One row per Excel sheet is listed under Reports below (form code, purpose, entities/tables, report source).",
      fields: [
        { name: "form_code", label: "Form Code", labelDari: "کود فورم", meaning: "Sheet code from workbook", type: "text", required: true, example: "IN-01" },
        { name: "sheet_name", label: "Excel Sheet", labelDari: "شیت اکسل", meaning: "Exact sheet title in xlsx", type: "text", required: true, example: "IN-01 Item Request" },
        { name: "purpose", label: "Purpose", labelDari: "هدف", meaning: "From Index column C", type: "longtext", required: true, example: "Item Request Form with Dept Head / Director-confirmation chain and Inventory Officer stock check" },
        { name: "entity_ids", label: "Entity / Table", labelDari: "موجودیت", meaning: "ENT-IN-* in Inventory Process and table in Tables & ER", type: "text", required: true, example: "ENT-IN-010/011 → item_requests, item_request_lines" },
        { name: "report_source", label: "Report Source", labelDari: "منبع گزارش", meaning: "Index column D — approved report paragraph", type: "text", required: false, example: "4.2.2 Item Request and Issuance Workflow" },
      ],
    },
  ],
  workflows: [],
  businessRules: [
    {
      id: "BR-IN-FORM-001",
      rule: "Every IN-* sheet must have a mapped entity, table or report before build sign-off",
      trigger: "Developer handoff",
      response: "Use this index as the checklist",
      severity: "High",
    },
    {
      id: "BR-IN-FORM-002",
      rule: "UI form codes should match Excel IN-xx codes",
      trigger: "Screen design",
      response: "Show Form IN-xx on each screen header like the workbook",
      severity: "Medium",
    },
    {
      id: "BR-IN-FORM-003",
      rule: "Excel design rules apply to every form: AFN only; ED and Directors have no system access (physical approvals recorded by staff, no ED/Director signature block); Prepared / Reviewed (Head) / Verified (IC at GRN only) signature blocks; Officers never edit submitted entries (IN-15); all entries post to the ledger automatically (IN-13); Control Log = FA-18, immutable",
      trigger: "Any IN transaction or print",
      response: "Block other currencies; no Director UI; no manual journals; append-only log",
      severity: "Critical",
    },
  ],
  reports: formMapReports,
  crossModuleNotes: [
    "Report §4.2; Excel IN sheets are the screens.",
    "ENCC Storage + Items both hold stock — map IN-01/02 to fulfill + distribution; Items ledger for محاسبه اجناس.",
    "IN-04 is the source document of Procurement PC-01 (not a second master); IN-05/06 take the PO from Procurement; IN-07…09 fixed assets / write-downs with Inventory-owned depreciation.",
    "IC gate at GRN only (IN-06); Control Log = FA-18 layout (Finance workbook).",
    "Open design questions (land/buildings via GRN, depreciation method, IN-04 budget check order, PO/PC-01 lines, expense vs stock receipt, thresholds, costing) are tracked as OPEN Q-IN-01…11 in Inventory Process.",
  ],
  deliverableChecklist: [
    { item: "All 15 IN forms listed with entity and table mapping", done: true },
    { item: "Aligned to Report §4.2 + Crest Point workbook Index", done: true },
    { item: "Process entities + Tables & ER diagram in sync", done: true },
    { item: "Open questions OPEN Q-IN-01…11 resolved with ENCC / report owner", done: false },
    { item: "UI shows Form IN-xx codes like workbook", done: false },
  ],
};
