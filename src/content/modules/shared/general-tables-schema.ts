import type { SchemaDiagram, SectionDefinition } from "@/types/requirements";

/** Clean ER for General Tables — parent on top, sub-tables nested underneath. */
export const generalTablesSchemaDiagram: SchemaDiagram = {
  groups: [
    {
      id: "customers",
      label: "Customers",
      color: "blue",
      tables: [
        {
          id: "customers",
          name: "customers",
          info: "Shared buyer master. Operations can quick-add; others usually read-only.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "customer_code", type: "text", required: true },
            { name: "first_name", type: "text", required: true },
            { name: "father_name", type: "text", required: true },
            { name: "display_name", type: "text", required: true },
            { name: "phone", type: "text" },
            { name: "national_id", type: "text" },
            { name: "is_active", type: "bool", required: true },
          ],
        },
      ],
    },
    {
      id: "products",
      label: "Products",
      color: "green",
      tables: [
        {
          id: "product_categories",
          name: "product_categories",
          info: "Parent groups for product types (e.g. coal, wood).",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "name", type: "text", required: true },
            { name: "is_active", type: "bool", required: true },
          ],
          children: [
            {
              id: "product_types",
              name: "product_types",
              info: "Price here is a default only — each transaction keeps its own snapshot.",
              columns: [
                { name: "id", pk: true, type: "text", required: true },
                {
                  name: "product_category_id",
                  type: "ref",
                  required: true,
                  fkTo: "product_categories",
                },
                { name: "name", type: "text", required: true },
                { name: "default_unit_price", type: "number", required: true },
                { name: "unit", type: "text", required: true },
                { name: "is_active", type: "bool", required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "sites",
      label: "Sites",
      color: "brown",
      tables: [
        {
          id: "mining_sites",
          name: "mining_sites",
          info: "Shared mine/site list for MINS and Site modules.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "name", type: "text", required: true },
            { name: "code", type: "text", required: true },
            { name: "location", type: "text" },
            { name: "is_active", type: "bool", required: true },
          ],
        },
        {
          id: "branches",
          name: "branches",
          info: "HQ and Second Unit offices — HR assignment, wages PY-10, Items, Drivers, Properties. Inactive hidden from new picks.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "name", type: "text", required: true },
            {
              name: "status",
              type: "enum",
              required: true,
              enums: ["active", "inactive"],
            },
          ],
        },
        {
          id: "departments",
          name: "departments",
          info: "Organizational departments (ریاست) — HR employee assignment, employment history, timesheet filters. Inactive hidden from new picks.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "name", type: "text", required: true },
            { name: "name_dari", type: "text" },
            {
              name: "status",
              type: "enum",
              required: true,
              enums: ["active", "inactive"],
            },
          ],
        },
        {
          id: "positions",
          name: "positions",
          info: "Shared بست list for HR and payroll. Inactive hidden from new assignments.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "title", type: "text", required: true },
            { name: "title_dari", type: "text" },
            { name: "grade", type: "text" },
            { name: "is_active", type: "bool", required: true },
          ],
        },
      ],
    },
    {
      id: "banking",
      label: "Banking",
      color: "yellow",
      tables: [
        {
          id: "bank_accounts",
          name: "bank_accounts",
          info: "Corporation accounts for receipts/payments — not employee salary banks.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "account_name", type: "text", required: true },
            { name: "account_number", type: "text", required: true },
            { name: "bank_name", type: "text", required: true },
            { name: "usage_tag", type: "text" },
            { name: "is_active", type: "bool", required: true },
          ],
        },
        {
          id: "weighing_rates",
          name: "weighing_rates",
          info: "Only one current rate at a time; copied onto new purchase requests.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "rate_per_ton", type: "number", required: true },
            { name: "effective_from", type: "date", required: true },
            { name: "is_current", type: "bool", required: true },
          ],
        },
        {
          id: "bank_receipt_types",
          name: "bank_receipt_types",
          info: "Classifies uploaded bank receipts across sections.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "name", type: "text", required: true },
            { name: "code", type: "text", required: true },
            { name: "is_active", type: "bool", required: true },
          ],
          children: [
            {
              id: "uploaded_bank_receipts",
              name: "uploaded_bank_receipts",
              info: "One scan per receipt; link to a parent transaction when known.",
              columns: [
                { name: "id", pk: true, type: "text", required: true },
                { name: "receipt_number", type: "text", required: true },
                { name: "receipt_date", type: "date", required: true },
                { name: "tarafa_number", type: "text", required: true },
                { name: "file", type: "file", required: true },
                {
                  name: "receipt_type_id",
                  type: "ref",
                  required: true,
                  fkTo: "bank_receipt_types",
                },
                { name: "linked_record_type", type: "text" },
                { name: "linked_record_id", type: "ref" },
                { name: "approved_by", type: "ref" },
                { name: "approved_at", type: "datetime" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "lookups",
      label: "Lookups",
      color: "purple",
      tables: [
        {
          id: "property_types",
          name: "property_types",
          info: "Admin-managed list for the Properties module.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "name", type: "text", required: true },
            { name: "is_active", type: "bool", required: true },
          ],
        },
        {
          id: "procurement_contract_types",
          name: "procurement_contract_types",
          info: "Admin-managed list for Projects and Small Procurement.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "name", type: "text", required: true },
            { name: "is_active", type: "bool", required: true },
          ],
        },
        {
          id: "leave_entitlements",
          name: "leave_entitlements",
          info: "Yearly leave day rules per leave_type + hijri_year (e.g. annual 20, urgency 10, sick 20 for 1405). Unique leave_type + hijri_year. leave_balances FK here for entitlement and year.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            {
              name: "leave_type",
              type: "enum",
              required: true,
              enums: [
                "annual",
                "urgency",
                "sick",
                "exceptional",
                "unpaid",
                "maternity",
                "bereavement",
                "other",
              ],
            },
            { name: "hijri_year", type: "text", required: true },
            { name: "days_per_year", type: "number", required: true },
            { name: "is_active", type: "bool", required: true },
          ],
        },
      ],
    },
  ]
};

/** Schema-only page — full requirements stay on General Tables. */
export const generalTablesErSection: SectionDefinition = {
  id: "general-tables-er",
  name: "Tables & ER diagram",
  nameDari: "Tables & ER diagram",
  enableReview: false,
  description: "",
  status: "draft",
  summary: [],
  schemaOnly: true,
  schemaDiagram: generalTablesSchemaDiagram,
  entities: [],
  workflows: [],
  businessRules: [],
};
