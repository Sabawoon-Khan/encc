import type { SectionDefinition } from "@/types/requirements";

export const balanceSection: SectionDefinition = {
  id: "balance",
  name: "Balance / Accounting",
  nameDari: "بیلانس / حسابداری",
  enableReview: true,
  description:
    "Balance department (بیلانس) — financial accounting, ledger balances, and reconciliation. Separate from Mali (finance receipts). Detailed workflows to be expanded with ENCC.",
  status: "draft",
  summary: [
    "General ledger and account balances",
    "Financial reconciliation and period closing",
    "Balance sheet and accounting reports",
  ],
  entities: [
    {
      id: "ENT-BAL-010",
      name: "Account Balance Entry",
      description: "Ledger balance record for an account in a period.",
      fields: [
        {
          name: "entry_number",
          label: "Entry Number",
          labelDari: "شماره ثبت",
          meaning: "Auto-generated journal entry number",
          type: "text",
          required: true,
          example: "JE-3301/1405",
        },
        {
          name: "account_code",
          label: "Account Code",
          labelDari: "کود حساب",
          meaning: "Chart of accounts reference",
          type: "reference",
          required: true,
          example: "1100-Cash",
        },
        {
          name: "period",
          label: "Period",
          labelDari: "دوره",
          meaning: "Accounting period (Hijri month/year)",
          type: "text",
          required: true,
          example: "1405/02",
        },
        {
          name: "debit",
          label: "Debit",
          labelDari: "بدهکار",
          meaning: "Debit amount in AFN",
          type: "decimal",
          required: false,
          example: "100000",
        },
        {
          name: "credit",
          label: "Credit",
          labelDari: "بستانکار",
          meaning: "Credit amount in AFN",
          type: "decimal",
          required: false,
          example: "0",
        },
        {
          name: "status",
          label: "Status",
          labelDari: "وضعیت",
          meaning: "draft | posted | reconciled",
          type: "enum",
          required: true,
          example: "posted",
        },
      ],
    },
  ],
  workflows: [],
  businessRules: [],
  relatedSections: ["mali", "sanda-mali"],
  precededBy: [
    { moduleId: "mali", sectionId: "sanda-mali", label: "سند مالی — journal vouchers" },
  ],
  deliverableChecklist: [
    { item: "Balance department placeholder documented", done: true },
    { item: "Detailed accounting workflows with ENCC", done: false },
  ],
};
