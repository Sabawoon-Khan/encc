import type { SectionDefinition } from "@/types/requirements";

export const fulfillItemsRequestSection: SectionDefinition = {
  id: "fulfill-items-request",
  name: "Review & Fulfill Items Request",
  nameDari: "بررسی و توزیع درخواست محاسبه اجناس",
  enableReview: true,
  description:
    "Items department (محاسبه اجناس) — separate inventory from Storage. Receives boss-approved items requisitions, checks stock, distributes if available, or sends to Procurement to purchase.",
  status: "draft",
  currentTool: "Manual items ledger and paper distribution slips",
  summary: [
    "Receive approved items requests (IR- numbers) from any department",
    "Check Items department inventory — not Storage stock",
    "If available → create distribution form and issue to requester",
    "If not available → route to Procurement",
  ],
  precededBy: [
    {
      moduleId: "operations",
      sectionId: "request-item-from-items",
      label: "Request Item from Items Department",
    },
  ],
  followedBy: [
    {
      moduleId: "items",
      sectionId: "create-items-distribution",
      label: "Create Items Distribution Form",
    },
    {
      moduleId: "procurement",
      sectionId: "procure-item",
      label: "Procure Unavailable Item",
    },
  ],
  relatedSections: ["request-item-from-items", "create-items-distribution", "procure-item"],
  entities: [
    {
      id: "ENT-ITM-010",
      name: "Items Fulfillment Review",
      description: "Items department stock check on approved requisition.",
      fields: [
        {
          name: "items_request_id",
          label: "Items Request",
          labelDari: "درخواست محاسبه اجناس",
          meaning: "Linked IR- request",
          type: "reference",
          required: true,
          example: "IR-0042/1405",
        },
        {
          name: "availability",
          label: "Availability",
          labelDari: "موجودی",
          meaning: "in_stock | not_in_stock",
          type: "enum",
          required: true,
          example: "not_in_stock",
        },
        {
          name: "status",
          label: "Status",
          labelDari: "وضعیت",
          meaning: "accepted | rejected | pending_procurement | ready_to_distribute",
          type: "enum",
          required: true,
          example: "pending_procurement",
        },
      ],
    },
  ],
  workflows: [
    {
      id: "WF-ITM-010",
      name: "Items availability check",
      trigger: "Boss-approved items request in Items queue",
      startActor: "Items department clerk",
      endState: "Distribution or Procurement",
      steps: [
        {
          step: 1,
          actor: "Items clerk",
          action: "Review request and check Items inventory",
          input: "Items request",
          output: "availability decision",
          decision: true,
        },
        {
          step: 2,
          actor: "Items clerk",
          action: "Route to distribution or Procurement",
          input: "Stock result",
          output: "ready_to_distribute or pending_procurement",
        },
      ],
    },
  ],
  businessRules: [],
  roles: [
    {
      role: "Items Department Clerk",
      location: "HQ — محاسبه اجناس",
      mainActions: "Review items requests, check stock, route fulfillment",
      approval: false,
      readOnly: false,
    },
  ],
  deliverableChecklist: [
    { item: "Items fulfillment workflow documented", done: true },
    { item: "ENCC sign-off", done: false },
  ],
};

export const createItemsDistributionSection: SectionDefinition = {
  id: "create-items-distribution",
  name: "Create Items Distribution Form",
  nameDari: "فورم توزیع محاسبه اجناس",
  enableReview: true,
  description:
    "Items department creates a distribution form and hands materials to the requester — same pattern as Storage distribution but for Items inventory.",
  status: "draft",
  summary: [
    "Distribution form for Items department issuances",
    "Linked to original IR- items request",
    "Records recipient, quantity, and closes request as distributed",
  ],
  precededBy: [
    {
      moduleId: "items",
      sectionId: "fulfill-items-request",
      label: "Review & Fulfill Items Request",
    },
    {
      moduleId: "procurement",
      sectionId: "procure-item",
      label: "Procure Unavailable Item",
    },
  ],
  entities: [
    {
      id: "ENT-ITM-011",
      name: "Distribution Form (Items)",
      description: "Issuance record from Items department.",
      fields: [
        {
          name: "distribution_number",
          label: "Distribution Number",
          labelDari: "شماره توزیع",
          meaning: "Auto-generated ID- prefix",
          type: "text",
          required: true,
          example: "ID-0018/1405",
        },
        {
          name: "items_request_id",
          label: "Items Request",
          type: "reference",
          required: true,
          meaning: "Original requisition",
          example: "IR-0042/1405",
        },
        {
          name: "recipient_name",
          label: "Recipient Name",
          type: "text",
          required: true,
          meaning: "Person receiving items",
          example: "Sara Ahmadi",
        },
        {
          name: "quantity_distributed",
          label: "Quantity Distributed",
          type: "decimal",
          required: true,
          meaning: "Amount issued",
          example: "5",
        },
        {
          name: "status",
          label: "Status",
          type: "enum",
          required: true,
          meaning: "draft | distributed",
          example: "distributed",
        },
      ],
    },
  ],
  workflows: [
    {
      id: "WF-ITM-011",
      name: "Issue items to requester",
      trigger: "Items request ready to distribute",
      startActor: "Items clerk",
      endState: "distributed",
      steps: [
        {
          step: 1,
          actor: "Items clerk",
          action: "Create and issue distribution form",
          input: "Approved request",
          output: "Items handed to recipient — closed",
        },
      ],
    },
  ],
  businessRules: [],
  deliverableChecklist: [{ item: "Items distribution form documented", done: true }],
};
