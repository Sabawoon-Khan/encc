import type { RequirementField } from "@/types/requirements";

/** Shared Purchase Request entity — ENT-OPR-015. Each department section documents the fields it owns. */
export const purchaseRequestCoreFields: RequirementField[] = [
  {
    name: "request_number",
    label: "Request Number",
    labelDari: "شماره درخواست",
    meaning: "System-generated unique tracking number",
    type: "text",
    required: true,
    example: "PR-1245/1405",
    rules: "Auto-generated, unique, sequential per year",
  },
  {
    name: "request_date",
    label: "Request Date",
    labelDari: "تاریخ",
    meaning: "Date request registered",
    type: "date",
    required: true,
    example: "1405/02/19",
  },
  {
    name: "customer_id",
    label: "Customer",
    labelDari: "مشتری",
    meaning: "Reference → General Tables / Customer. Searchable dropdown; + button (Operations only)",
    type: "reference",
    required: true,
    example: "CUS-004521 — احمد بن محمد",
    rules: "See General Tables ENT-OPR-G001",
  },
  {
    name: "product_category_id",
    label: "Product Category",
    labelDari: "جنس",
    meaning: "Reference → General Tables / Product Category",
    type: "reference",
    required: true,
    example: "Coal",
  },
  {
    name: "product_type_id",
    label: "Product Type",
    labelDari: "نوع",
    meaning: "Reference → General Tables / Product Type — filters by category",
    type: "reference",
    required: true,
    example: "Grade A Coal",
  },
  {
    name: "mining_site_id",
    label: "Mining Site",
    labelDari: "معدن",
    meaning: "Reference → General Tables / Mining Site",
    type: "reference",
    required: true,
    example: "Karkar Mine",
  },
  {
    name: "quantity",
    label: "Quantity (tons)",
    labelDari: "مقدار (تن)",
    meaning: "Amount of product ordered in tons",
    type: "decimal",
    required: true,
    example: "50",
  },
  {
    name: "unit_price",
    label: "Unit Price (Product)",
    labelDari: "قیمت واحد جنس",
    meaning: "Editable copy of product type default — snapshotted on type selection; not live-linked",
    type: "decimal",
    required: true,
    example: "8500",
  },
  {
    name: "product_total",
    label: "Product Total",
    labelDari: "مجموع جنس",
    meaning: "quantity × unit_price",
    type: "decimal",
    required: true,
    example: "425000",
    rules: "System-calculated",
  },
  {
    name: "weighing_unit_price",
    label: "Weighing Rate (per ton)",
    labelDari: "نرخ ویگن (به ازای تن)",
    meaning: "Editable copy of Weighing Rate — default 10 AFN/ton",
    type: "decimal",
    required: true,
    example: "10",
  },
  {
    name: "weighing_total",
    label: "Weighing Total",
    labelDari: "مجموع ویگن",
    meaning: "quantity × weighing_unit_price",
    type: "decimal",
    required: true,
    example: "500",
    rules: "System-calculated",
  },
  {
    name: "grand_total",
    label: "Grand Total",
    labelDari: "مجموع کل",
    meaning: "product_total + weighing_total",
    type: "decimal",
    required: true,
    example: "425500",
    rules: "System-calculated",
  },
  {
    name: "assigned_boss",
    label: "Assigned Boss",
    labelDari: "مدیر مسئول تأیید",
    meaning: "Boss for approval — defaults to Commercial",
    type: "enum",
    required: true,
    example: "Commercial",
    rules: "Commercial (default) | Mali | Operational | General",
  },
  {
    name: "status",
    label: "Status",
    labelDari: "وضعیت",
    meaning: "Current stage — shared across all departments",
    type: "enum",
    required: true,
    example: "pending_boss_approval",
    rules:
      "draft | pending_boss_approval | boss_rejected | pending_mali | pending_control | control_rejected | pending_payment | payment_submitted | payment_verified | sales_issued | complete",
  },
];

export const crossDepartmentWorkflowMermaid = `flowchart TD
  subgraph OPS[Operations]
    A[Create Request] --> B[Submit to Boss]
    B --> C{Boss}
  end
  subgraph MALI[Mali]
    D[Print Bank Receipts]
    G[Upload Receipts]
    H[Verify Payment]
  end
  subgraph CTRL[Control]
    E{Control Check}
  end
  subgraph SALES[Sales]
    I[Issue Sales Form]
    J[Send to MINS]
  end
  C -->|Approve| D
  C -->|Reject| A
  D --> E
  E -->|Approve| F[Customer Pays at Bank]
  E -->|Reject| A
  F --> G --> H --> I --> J`;
