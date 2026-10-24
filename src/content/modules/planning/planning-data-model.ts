import type { SchemaDiagram, SectionDefinition } from "@/types/requirements";

/**
 * Planning Tables & ER — nested like Procurement / Payroll.
 * Crest Point Report §4.7 + PL-01…14. Branches (Second Units / HQ) live on
 * General Tables ER via fkHref. CoA links point to Finance chart_of_accounts (FA-14).
 */
const BRANCHES_HREF = "/modules/shared/sections/general-tables-er#branches";
const COA_HREF = "/modules/mali/sections/finance-data-model#chart_of_accounts";

const schemaDiagram: SchemaDiagram = {
  groups: [
    {
      id: "setup",
      label: "Plan items",
      color: "blue",
      tables: [
        {
          id: "plan_items",
          name: "plan_items",
          info: "PL-01 — dynamic plan item: branch_id class (Second Unit | HQ), category (Main Core Revenue | Non-Core Revenue | Direct Costs | Indirect Costs | CAPEX | N/A operational), financial vs non-financial. Financial → coa_account_id (HQ / Second Unit sub-account) required; operational → CoA N/A.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "name", type: "text", required: true },
            {
              name: "branch_id",
              type: "ref",
              required: true,
              fkTo: "branches",
              fkHref: BRANCHES_HREF,
            },
            {
              name: "unit_class",
              type: "enum",
              required: true,
              enums: ["second_unit", "hq"],
            },
            {
              name: "category",
              type: "enum",
              required: true,
              enums: [
                "main_core_revenue",
                "non_core_revenue",
                "direct_cost",
                "indirect_cost",
                "capex",
                "na_operational",
              ],
            },
            {
              name: "metric_type",
              type: "enum",
              required: true,
              enums: ["financial", "non_financial"],
            },
            { name: "unit_of_measure", type: "text", required: true },
            {
              name: "coa_account_id",
              type: "ref",
              fkTo: "chart_of_accounts",
              fkHref: COA_HREF,
            },
            { name: "coa_not_applicable", type: "bool", required: true },
            {
              name: "status",
              type: "enum",
              required: true,
              enums: ["active", "inactive"],
            },
          ],
        },
      ],
    },
    {
      id: "plans",
      label: "Plans & approval",
      color: "green",
      tables: [
        {
          id: "plan_approvals",
          name: "plan_approvals",
          info: "PL-02 — ONE plan header per plan type (operational | financial) per year covering all classes (see plan_approval_classes). Submit → completeness → Head approval. Approved lines locked; change only via plan_amendments (ED physical).",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "plan_year", type: "text", required: true },
            {
              name: "plan_type",
              type: "enum",
              required: true,
              enums: ["operational", "financial"],
            },
            { name: "submitted_by", type: "text" },
            { name: "submitted_date", type: "date" },
            { name: "completeness_checked", type: "bool", required: true },
            { name: "ed_approval_ref", type: "text" },
            { name: "head_approved", type: "bool" },
            { name: "approval_date", type: "date" },
            {
              name: "status",
              type: "enum",
              required: true,
              enums: ["draft", "submitted", "completeness_review", "approved", "rejected"],
            },
          ],
          children: [
            {
              id: "plan_approval_classes",
              name: "plan_approval_classes",
              info: "PL-02 — classes (HQ / each Second Unit) covered by the plan header; completeness check confirms all are present.",
              columns: [
                { name: "id", pk: true, type: "text", required: true },
                {
                  name: "plan_approval_id",
                  type: "ref",
                  required: true,
                  fkTo: "plan_approvals",
                },
                {
                  name: "branch_id",
                  type: "ref",
                  required: true,
                  fkTo: "branches",
                  fkHref: BRANCHES_HREF,
                },
              ],
            },
            {
              id: "operational_plan_lines",
              name: "operational_plan_lines",
              info: "PL-03 — monthly excavation / extraction target per Second Unit (non-financial plan items).",
              columns: [
                { name: "id", pk: true, type: "text", required: true },
                {
                  name: "plan_approval_id",
                  type: "ref",
                  required: true,
                  fkTo: "plan_approvals",
                },
                {
                  name: "plan_item_id",
                  type: "ref",
                  required: true,
                  fkTo: "plan_items",
                },
                {
                  name: "branch_id",
                  type: "ref",
                  required: true,
                  fkTo: "branches",
                  fkHref: BRANCHES_HREF,
                },
                { name: "plan_month", type: "text", required: true },
                { name: "target_volume", type: "number", required: true },
              ],
            },
            {
              id: "financial_plan_lines",
              name: "financial_plan_lines",
              info: "PL-04 — monthly AFN target per class + category + CoA sub-account. Planned P&L: Core + Non-Core − Direct = Gross; − Indirect = Net; CAPEX memo outside P&L. branch_id and CoA copied from the plan item.",
              columns: [
                { name: "id", pk: true, type: "text", required: true },
                {
                  name: "plan_approval_id",
                  type: "ref",
                  required: true,
                  fkTo: "plan_approvals",
                },
                {
                  name: "plan_item_id",
                  type: "ref",
                  required: true,
                  fkTo: "plan_items",
                },
                {
                  name: "branch_id",
                  type: "ref",
                  required: true,
                  fkTo: "branches",
                  fkHref: BRANCHES_HREF,
                },
                { name: "plan_month", type: "text", required: true },
                { name: "planned_amount", type: "number", required: true },
                {
                  name: "coa_account_id",
                  type: "ref",
                  required: true,
                  fkTo: "chart_of_accounts",
                  fkHref: COA_HREF,
                },
              ],
            },
            {
              id: "plan_amendments",
              name: "plan_amendments",
              info: "PL-09 — amendment to approved plan. ED approves physically first; mandatory ed_approval_ref + date; Head verifies and approves. Figures in plan_amendment_lines; originals retained. Directors physical only, no login.",
              columns: [
                { name: "id", pk: true, type: "text", required: true },
                {
                  name: "plan_approval_id",
                  type: "ref",
                  required: true,
                  fkTo: "plan_approvals",
                },
                {
                  name: "branch_id",
                  type: "ref",
                  required: true,
                  fkTo: "branches",
                  fkHref: BRANCHES_HREF,
                },
                { name: "request_date", type: "date", required: true },
                {
                  name: "nature",
                  type: "enum",
                  required: true,
                  enums: ["physical", "financial"],
                },
                { name: "reason", type: "text", required: true },
                { name: "written_justification", type: "text", required: true },
                { name: "ed_approval_ref", type: "text", required: true },
                { name: "ed_approval_date", type: "date", required: true },
                { name: "approved_by", type: "text" },
                { name: "approved_at", type: "date" },
                {
                  name: "status",
                  type: "enum",
                  required: true,
                  enums: ["submitted", "approved", "rejected"],
                },
              ],
              children: [
                {
                  id: "plan_amendment_lines",
                  name: "plan_amendment_lines",
                  info: "PL-09 — one row per month and plan item: original, revised, difference. Original kept for Plan Amendment Log.",
                  columns: [
                    { name: "id", pk: true, type: "text", required: true },
                    {
                      name: "plan_amendment_id",
                      type: "ref",
                      required: true,
                      fkTo: "plan_amendments",
                    },
                    {
                      name: "plan_item_id",
                      type: "ref",
                      required: true,
                      fkTo: "plan_items",
                    },
                    { name: "plan_month", type: "text", required: true },
                    { name: "original_value", type: "number", required: true },
                    { name: "revised_value", type: "number", required: true },
                    { name: "difference", type: "number", required: true },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "actuals",
      label: "Actuals, variance & alerts",
      color: "yellow",
      tables: [
        {
          id: "actual_volume_entries",
          name: "actual_volume_entries",
          info: "PL-05 — manual non-financial actual volumes; reference_document_ref AND document_type mandatory (CoA N/A, no GL impact). Financial actuals come from Sales/Finance.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            {
              name: "plan_item_id",
              type: "ref",
              required: true,
              fkTo: "plan_items",
            },
            {
              name: "branch_id",
              type: "ref",
              required: true,
              fkTo: "branches",
              fkHref: BRANCHES_HREF,
            },
            { name: "plan_month", type: "text", required: true },
            { name: "actual_volume", type: "number", required: true },
            { name: "entry_date", type: "date", required: true },
            { name: "reference_document_ref", type: "text", required: true },
            { name: "document_type", type: "text", required: true },
          ],
        },
        {
          id: "alert_parameters",
          name: "alert_parameters",
          info: "PL-07 — one editable threshold % per plan category (optional per-item override) with direction. Higher-is-better (volumes, revenues): alert when below plan; lower-is-better (costs, CAPEX): alert when above plan. Confirm figures with ENCC.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            {
              name: "plan_category",
              type: "enum",
              required: true,
              enums: [
                "main_core_revenue",
                "non_core_revenue",
                "direct_cost",
                "indirect_cost",
                "capex",
                "na_operational",
              ],
            },
            {
              name: "plan_item_id",
              type: "ref",
              fkTo: "plan_items",
            },
            {
              name: "direction",
              type: "enum",
              required: true,
              enums: ["higher_is_better", "lower_is_better"],
            },
            { name: "threshold_pct", type: "number", required: true },
            { name: "is_active", type: "bool", required: true },
          ],
        },
        {
          id: "variance_analysis_lines",
          name: "variance_analysis_lines",
          info: "PL-06 — system-computed plan vs actual per item/branch/month: variance abs + %, alert status. Feeds PL-08 P&L report.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            {
              name: "plan_item_id",
              type: "ref",
              required: true,
              fkTo: "plan_items",
            },
            {
              name: "branch_id",
              type: "ref",
              required: true,
              fkTo: "branches",
              fkHref: BRANCHES_HREF,
            },
            { name: "plan_month", type: "text", required: true },
            { name: "planned_value", type: "number", required: true },
            { name: "actual_value", type: "number", required: true },
            { name: "variance_abs", type: "number", required: true },
            { name: "variance_pct", type: "number", required: true },
            {
              name: "alert_status",
              type: "enum",
              required: true,
              enums: [
                "on_plan_or_favourable",
                "unfavourable_within_threshold",
                "alert",
              ],
            },
          ],
          children: [
            {
              id: "alert_log",
              name: "alert_log",
              info: "PL-07 — each alert raised from a variance line against an alert parameter; permanent log; Planning Head reviews and records management action.",
              columns: [
                { name: "id", pk: true, type: "text", required: true },
                {
                  name: "variance_line_id",
                  type: "ref",
                  required: true,
                  fkTo: "variance_analysis_lines",
                },
                {
                  name: "alert_parameter_id",
                  type: "ref",
                  required: true,
                  fkTo: "alert_parameters",
                },
                { name: "variance_pct", type: "number", required: true },
                { name: "threshold_pct", type: "number", required: true },
                { name: "alerted_at", type: "date", required: true },
                {
                  name: "status",
                  type: "enum",
                  required: true,
                  enums: ["open", "reviewed"],
                },
                { name: "head_review_note", type: "text" },
                { name: "reviewed_by", type: "text" },
                { name: "reviewed_at", type: "date" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "control",
      label: "Control & reference",
      color: "brown",
      tables: [
        {
          id: "correspondence_register",
          name: "correspondence_register",
          info: "PL-10 — digital in/out correspondence register (addition). Hard copy stays on file; system keeps refs.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            {
              name: "direction",
              type: "enum",
              required: true,
              enums: ["incoming", "outgoing"],
            },
            { name: "register_date", type: "date", required: true },
            { name: "letter_no", type: "text" },
            { name: "party", type: "text", required: true },
            { name: "subject", type: "text", required: true },
            {
              name: "branch_id",
              type: "ref",
              fkTo: "branches",
              fkHref: BRANCHES_HREF,
            },
            {
              name: "plan_approval_id",
              type: "ref",
              fkTo: "plan_approvals",
            },
            { name: "hard_copy_file_ref", type: "text" },
            {
              name: "status",
              type: "enum",
              required: true,
              enums: ["open", "answered", "closed"],
            },
          ],
        },
        {
          id: "planning_correction_requests",
          name: "planning_correction_requests",
          info: "PL-11 — Officer unlock path before finalization. Control Log = FA-18.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            {
              name: "entry_type",
              type: "enum",
              required: true,
              enums: [
                "plan_item",
                "plan_approval",
                "operational_line",
                "financial_line",
                "actual_volume",
                "other",
              ],
            },
            { name: "entry_reference", type: "text", required: true },
            { name: "error_description", type: "text", required: true },
            { name: "required_correction", type: "text", required: true },
            {
              name: "decision",
              type: "enum",
              enums: ["approved", "rejected"],
            },
            {
              name: "status",
              type: "enum",
              required: true,
              enums: ["submitted", "approved", "rejected", "corrected"],
            },
          ],
        },
      ],
    },
  ],
};

export const planningDataModelSection: SectionDefinition = {
  id: "planning-data-model",
  name: "Tables & ER diagram",
  nameDari: "Tables & ER diagram",
  enableReview: false,
  description: "",
  status: "draft",
  summary: [],
  schemaOnly: true,
  schemaDiagram,
  entities: [],
  workflows: [],
  businessRules: [],
};
