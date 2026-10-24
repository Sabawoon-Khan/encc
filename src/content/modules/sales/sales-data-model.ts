import type { SchemaDiagram, SectionDefinition } from "@/types/requirements";

const GEN = "/modules/shared/sections/general-tables-er";
const FIN = "/modules/mali/sections/finance-data-model";

/**
 * Sales Tables & ER — Report §4.4.2/§4.4.4 + North_Coal_ERP_Sales_Marketing_Forms.xlsx (SM-01…16).
 *
 * Table-per-sheet where the Excel sheet is a stored record:
 *   SM-01 sales_orders | SM-02 tariff_slips | SM-03 payment_confirmations | SM-04 sales_ic_verifications
 *   SM-05 coal_allocation_auths | SM-07 weighing_records | SM-08 sub_office_minor_sales (Finance voucher link)
 *   SM-11 tariff_schedule | SM-13 sales_correction_requests
 *
 * NOT tables (by design, per Excel):
 *   SM-06 Dispatch Tracking  — report/view derived from weighing_records + coal_allocation_auths
 *   SM-09 Customer Tracking  — report/view
 *   SM-10 Customer Master    — shared GEN `customers` (Excel layout is a proposed minimal template)
 *   SM-12 Lifecycle, SM-14 Matrix, SM-15 Accounting entries, SM-16 Reports — documentation
 *
 * "Second Unit" = branches (HQ / mining-site Second Unit / Sub-Office) on General Tables.
 * Order carries NO unit price — price enters at SM-02 from the tariff schedule (SM-11).
 */
const schemaDiagram: SchemaDiagram = {
  groups: [
    {
      id: "order_pay",
      label: "Order → tariff → payment → IC (SM-01…04)",
      color: "blue",
      tables: [
        {
          id: "sales_orders",
          name: "sales_orders",
          info: "SM-01 — recorded ONLY AFTER the signed hard-copy ED approval is in hand (no pending_ed_approval state exists). Order No. auto-sequential (ISO 9001). Mandatory: customer, coal type & grade, quantity, Second Unit, ED approval ref + date. NO unit price. Sales Officer cannot approve or edit once submitted (SM-13).",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "order_no", type: "text", required: true },
            { name: "entry_date", type: "date", required: true },
            {
              name: "customer_id",
              type: "ref",
              required: true,
              fkTo: "customers",
              fkHref: `${GEN}#customers`,
            },
            {
              name: "product_type_id",
              type: "ref",
              required: true,
              fkTo: "product_types",
              fkHref: `${GEN}#product_types`,
            },
            { name: "quantity_tonnes", type: "number", required: true },
            {
              name: "second_unit_id",
              type: "ref",
              required: true,
              fkTo: "branches",
              fkHref: `${GEN}#branches`,
            },
            { name: "ed_approval_ref", type: "text", required: true },
            { name: "ed_approval_date", type: "date", required: true },
            { name: "notes", type: "text" },
            { name: "entered_by", type: "text", required: true },
            { name: "head_decision", type: "enum", enums: ["confirmed", "rejected"] },
            { name: "head_confirmation_date", type: "date" },
            { name: "head_confirmed_by", type: "text" },
            { name: "revision_no", type: "number", required: true },
            { name: "is_locked", type: "bool", required: true },
            {
              name: "status",
              type: "enum",
              required: true,
              enums: [
                "order_recorded",
                "ed_approved_recorded",
                "tariff_issued",
                "payment_confirmed",
                "payment_verified_by_ic",
              ],
            },
          ],
          children: [
            {
              id: "tariff_slips",
              name: "tariff_slips",
              info: "SM-02 — printed payment instruction, NOT revenue (no posting). Only the validity period is entered (by Sales Dept Head); everything else is system-sourced. Total = quantity × unit price, not editable. Tariff No. sequential, not editable.",
              columns: [
                { name: "id", pk: true, type: "text", required: true },
                { name: "tariff_no", type: "text", required: true },
                { name: "issue_date", type: "date", required: true },
                {
                  name: "sales_order_id",
                  type: "ref",
                  required: true,
                  fkTo: "sales_orders",
                },
                {
                  name: "tariff_schedule_id",
                  type: "ref",
                  required: true,
                  fkTo: "tariff_schedule",
                },
                { name: "quantity_approved_tonnes", type: "number", required: true },
                { name: "unit_price_afn", type: "number", required: true },
                { name: "total_amount_payable_afn", type: "number", required: true },
                {
                  name: "payment_bank_account_id",
                  type: "ref",
                  required: true,
                  fkTo: "bank_accounts",
                  fkHref: `${GEN}#bank_accounts`,
                },
                { name: "ed_approval_ref", type: "text", required: true },
                { name: "validity_from", type: "date", required: true },
                { name: "validity_to", type: "date", required: true },
                { name: "validity_set_by", type: "text", required: true },
                {
                  name: "status",
                  type: "enum",
                  required: true,
                  enums: ["issued_awaiting_payment", "payment_confirmed"],
                },
              ],
              children: [
                {
                  id: "payment_confirmations",
                  name: "payment_confirmations",
                  info: "SM-03 — Finance Officer confirms deposit vs tariff through bank reconciliation (FA-06). On confirmed match: Dr Bank Account / Cr Customer Advance (Current Liability) auto-posted; order → Payment Confirmed; Sales notified in system. Finance Dept Head reviews.",
                  columns: [
                    { name: "id", pk: true, type: "text", required: true },
                    {
                      name: "tariff_slip_id",
                      type: "ref",
                      required: true,
                      fkTo: "tariff_slips",
                    },
                    {
                      name: "sales_order_id",
                      type: "ref",
                      required: true,
                      fkTo: "sales_orders",
                    },
                    { name: "bank_payment_slip_no", type: "text", required: true },
                    { name: "deposit_date", type: "date", required: true },
                    {
                      name: "bank_reconciliation_id",
                      type: "ref",
                      required: true,
                      fkTo: "bank_reconciliations",
                      fkHref: `${FIN}#bank_reconciliations`,
                    },
                    { name: "amount_deposited_afn", type: "number", required: true },
                    { name: "amount_payable_afn", type: "number", required: true },
                    { name: "difference_afn", type: "number", required: true },
                    {
                      name: "match_result",
                      type: "enum",
                      required: true,
                      enums: ["matched", "mismatch"],
                    },
                    { name: "confirmed_by", type: "text", required: true },
                    { name: "reviewed_by", type: "text" },
                    { name: "sales_notified_at", type: "datetime" },
                    {
                      name: "status",
                      type: "enum",
                      required: true,
                      enums: ["payment_confirmed"],
                    },
                  ],
                  children: [
                    {
                      id: "sales_ic_verifications",
                      name: "sales_ic_verifications",
                      info: "SM-04 — the ONLY mandatory IC gate in Sales. Four system-assisted checks; IC can only Verify or Reject (read-only otherwise). Reject needs comments → Finance & Sales Heads notified, order returns for re-verification (reverify_round +1). No allocation until verified. Every outcome → Control Log (FA-18). Distinct from Finance FA-10 (payment vouchers).",
                      columns: [
                        { name: "id", pk: true, type: "text", required: true },
                        { name: "verification_no", type: "text", required: true },
                        {
                          name: "payment_confirmation_id",
                          type: "ref",
                          required: true,
                          fkTo: "payment_confirmations",
                        },
                        {
                          name: "tariff_slip_id",
                          type: "ref",
                          required: true,
                          fkTo: "tariff_slips",
                        },
                        {
                          name: "sales_order_id",
                          type: "ref",
                          required: true,
                          fkTo: "sales_orders",
                        },
                        { name: "date_received_by_ic", type: "date", required: true },
                        { name: "reverify_round", type: "number", required: true },
                        { name: "check1_bank_slip_matches_finance_deposit", type: "bool", required: true },
                        { name: "check2_amount_matches_tariff_exactly", type: "bool", required: true },
                        { name: "check3_order_qty_consistent_with_tariff_and_paid", type: "bool", required: true },
                        { name: "check4_customer_advance_posted_correctly", type: "bool", required: true },
                        {
                          name: "system_outcome",
                          type: "enum",
                          required: true,
                          enums: ["verify", "reject"],
                        },
                        {
                          name: "final_outcome",
                          type: "enum",
                          required: true,
                          enums: ["verified", "rejected"],
                        },
                        { name: "decision_date", type: "date", required: true },
                        { name: "ic_comments", type: "text" },
                        { name: "verified_by", type: "text", required: true },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "fulfil",
      label: "Allocation, weighing & sub-office (SM-05…08)",
      color: "green",
      tables: [
        {
          id: "coal_allocation_auths",
          name: "coal_allocation_auths",
          info: "SM-05 — generated by Sales Officer ONLY after SM-04 = Verified; Sales Head prints & issues the letter on letterhead outside the ERP. Live tracking (dispatched / remaining / visits / status) updated from weighing records. Status: Open | Partially Fulfilled | Fully Fulfilled | Expired. valid_until is an ADDITION TO CONFIRM (not in approved field list).",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "authorization_no", type: "text", required: true },
            { name: "authorization_date", type: "date", required: true },
            {
              name: "sales_order_id",
              type: "ref",
              required: true,
              fkTo: "sales_orders",
            },
            {
              name: "tariff_slip_id",
              type: "ref",
              required: true,
              fkTo: "tariff_slips",
            },
            {
              name: "ic_verification_id",
              type: "ref",
              required: true,
              fkTo: "sales_ic_verifications",
            },
            { name: "total_qty_authorized_tonnes", type: "number", required: true },
            { name: "unit_price_afn", type: "number", required: true },
            { name: "total_amount_paid_afn", type: "number", required: true },
            {
              name: "second_unit_id",
              type: "ref",
              required: true,
              fkTo: "branches",
              fkHref: `${GEN}#branches`,
            },
            { name: "ed_approval_ref", type: "text", required: true },
            { name: "valid_until", type: "date" },
            { name: "total_qty_dispatched_tonnes", type: "number", required: true },
            { name: "remaining_entitlement_tonnes", type: "number", required: true },
            { name: "collection_visit_count", type: "number", required: true },
            { name: "generated_by", type: "text", required: true },
            { name: "issued_by_head", type: "text" },
            {
              name: "status",
              type: "enum",
              required: true,
              enums: ["open", "partially_fulfilled", "fully_fulfilled", "expired"],
            },
          ],
          children: [
            {
              id: "weighing_records",
              name: "weighing_records",
              info: "SM-07 — received from Ministry of Mines weighing software (real-time or end-of-day sync); MINING SITES ONLY; keyed by authorization. Operated by the Responsible User at the Second Unit — no manual vehicle/driver entry in the ERP. Sole trigger for revenue. Three simultaneous actions: (1) update authorization tracking; (2) Dr Customer Advance / Cr Revenue; (3) Dr Cost of Coal Sold / Cr Coal Inventory + site stock reduced. SM-06 tracking view is derived from these rows.",
              columns: [
                { name: "id", pk: true, type: "text", required: true },
                { name: "weighing_record_id", type: "text", required: true },
                {
                  name: "authorization_id",
                  type: "ref",
                  required: true,
                  fkTo: "coal_allocation_auths",
                },
                {
                  name: "second_unit_id",
                  type: "ref",
                  required: true,
                  fkTo: "branches",
                  fkHref: `${GEN}#branches`,
                },
                { name: "qty_dispatched_this_trip_tonnes", type: "number", required: true },
                { name: "cumulative_reported_tonnes", type: "number", required: true },
                { name: "remaining_reported_tonnes", type: "number", required: true },
                { name: "dispatch_datetime", type: "datetime", required: true },
                {
                  name: "sync_mode",
                  type: "enum",
                  required: true,
                  enums: ["real_time", "end_of_day"],
                },
                { name: "received_in_erp_at", type: "datetime", required: true },
                { name: "approved_unit_price_afn", type: "number", required: true },
                { name: "revenue_amount_afn", type: "number", required: true },
                {
                  name: "revenue_recognition_id",
                  type: "ref",
                  fkTo: "revenue_recognitions",
                  fkHref: `${FIN}#revenue_recognitions`,
                },
                { name: "cost_of_coal_sold_afn", type: "number" },
                { name: "cumulative_agrees_with_weighing_sw", type: "bool" },
                { name: "remaining_agrees", type: "bool" },
                { name: "is_duplicate_weighing_id", type: "bool" },
                { name: "exceeds_remaining_entitlement", type: "bool" },
              ],
            },
          ],
        },
        {
          id: "sub_office_minor_sales",
          name: "sub_office_minor_sales",
          info: "SM-08 — Sub-Offices have NO weighing software. Minor sale/distribution = standard Finance voucher (FA-02 RV or FA-03 JV) initiated by Finance Officer or designated staff — NOT a Sales Officer entry. Sales keeps a read link. Open gaps from Excel: (a) FA-02/03 have no Quantity field; (b) no stock reduction / Cost of Coal Sold defined for Sub-Offices; (c) IC verification applicability — FA-02 shows N/A but Sales spec says same IC as weighing entries.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            {
              name: "voucher_type",
              type: "enum",
              required: true,
              enums: ["rv", "jv"],
            },
            {
              name: "receipt_voucher_id",
              type: "ref",
              fkTo: "receipt_vouchers",
              fkHref: `${FIN}#receipt_vouchers`,
            },
            {
              name: "journal_voucher_id",
              type: "ref",
              fkTo: "journal_vouchers",
              fkHref: `${FIN}#journal_vouchers`,
            },
            {
              name: "second_unit_id",
              type: "ref",
              required: true,
              fkTo: "branches",
              fkHref: `${GEN}#branches`,
            },
            {
              name: "customer_id",
              type: "ref",
              required: true,
              fkTo: "customers",
              fkHref: `${GEN}#customers`,
            },
            { name: "voucher_date", type: "date", required: true },
            { name: "receipt_method", type: "text" },
            { name: "quantity_tonnes", type: "number" },
            { name: "unit_price_afn", type: "number" },
            { name: "expected_amount_afn", type: "number" },
            {
              name: "ic_verification_status",
              type: "enum",
              enums: ["pending", "verified", "rejected"],
            },
          ],
        },
      ],
    },
    {
      id: "masters",
      label: "Tariff schedule (SM-11)",
      color: "purple",
      tables: [
        {
          id: "tariff_schedule",
          name: "tariff_schedule",
          info: "SM-11 — approved unit-price master; source of Unit Price on every tariff slip. OPEN: who maintains the schedule and how price changes are approved is NOT specified in the report. Excel columns: Coal Type, Grade, Unit Price, Effective From, Effective To, Status, Approval Reference (hard copy), Rule Check. No mining-site column in the Excel. Customers (SM-10) live on GEN customers.",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            {
              name: "product_type_id",
              type: "ref",
              required: true,
              fkTo: "product_types",
              fkHref: `${GEN}#product_types`,
            },
            { name: "unit_price_afn", type: "number", required: true },
            { name: "effective_from", type: "date", required: true },
            { name: "effective_to", type: "date" },
            {
              name: "status",
              type: "enum",
              required: true,
              enums: ["active", "inactive"],
            },
            { name: "approval_ref", type: "text", required: true },
            { name: "rule_check", type: "text" },
          ],
        },
      ],
    },
    {
      id: "control",
      label: "Correction (SM-13)",
      color: "brown",
      tables: [
        {
          id: "sales_correction_requests",
          name: "sales_correction_requests",
          info: "SM-13 — same standard form as FA-11 with module = Sales and Marketing. Only for entries submitted BEFORE IC verification or finalization. IC rejection of a payment uses the Finance/Sales loop in SM-04, not this form. Every step (original, request, Head decision, corrected entry) → Control Log FA-18 (immutable).",
          columns: [
            { name: "id", pk: true, type: "text", required: true },
            { name: "request_no", type: "text", required: true },
            { name: "date_raised", type: "datetime", required: true },
            { name: "module", type: "text", required: true },
            {
              name: "second_unit_id",
              type: "ref",
              fkTo: "branches",
              fkHref: `${GEN}#branches`,
            },
            {
              name: "entry_type",
              type: "enum",
              required: true,
              enums: ["sales_order", "tariff_slip", "coal_allocation_authorization", "other"],
            },
            { name: "entry_reference", type: "text", required: true },
            { name: "raised_by", type: "text", required: true },
            { name: "entry_status_at_request", type: "text", required: true },
            { name: "description_of_error", type: "text", required: true },
            { name: "required_correction", type: "text", required: true },
            { name: "justification", type: "text", required: true },
            {
              name: "head_decision",
              type: "enum",
              enums: ["approved", "rejected"],
            },
            { name: "decision_datetime", type: "datetime" },
            { name: "rejection_reason", type: "text" },
            { name: "entry_unlocked", type: "bool" },
            { name: "corrected_entry_ref", type: "text" },
            {
              name: "control_log_line_id",
              type: "ref",
              fkTo: "control_log_lines",
              fkHref: `${FIN}#control_log_lines`,
            },
          ],
        },
      ],
    },
  ],
};

export const salesDataModelSection: SectionDefinition = {
  id: "sales-data-model",
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
