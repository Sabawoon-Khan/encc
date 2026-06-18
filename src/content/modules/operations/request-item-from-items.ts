import type { SectionDefinition } from "@/types/requirements";
import { itemRequestCoreFields } from "../shared/item-request-fields";

export const requestItemFromItemsSection: SectionDefinition = {
  id: "request-item-from-items",
  name: "Request Item from Items Department",
  nameDari: "درخواست جنس از محاسبه اجناس",
  enableReview: true,
  description:
    "Same requisition pattern as Storage requests, but targets the Items department (محاسبه اجناس) — a separate inventory from Storage / Warehouse. Any department can request consumables or materials managed by Items. Boss approval required before Items receives the request.",
  status: "draft",
  currentTool: "Paper requisition forms",
  summary: [
    "Parallel form to Storage request — same fields, different target department (Items)",
    "Items inventory is separate from Storage / Warehouse stock",
    "Boss approval with selectable approver before routing to Items department",
    "Items checks availability → distribute or send to Procurement if not in stock",
  ],
  followedBy: [
    {
      moduleId: "items",
      sectionId: "fulfill-items-request",
      label: "Review & Fulfill Items Request",
    },
  ],
  relatedSections: ["request-item-from-storage", "fulfill-items-request", "procure-item"],
  entities: [
    {
      id: "ENT-OPS-021",
      name: "Items Department Request",
      description: "Department requisition routed to the Items department after boss approval.",
      fields: [
        ...itemRequestCoreFields.map((f) =>
          f.name === "request_number"
            ? { ...f, example: "IR-0042/1405", rules: "System-generated IR- prefix; read-only" }
            : f
        ),
        {
          name: "target_department",
          label: "Target Department",
          labelDari: "ریاست مقصد",
          meaning: "Always Items department for this form",
          type: "enum",
          required: true,
          example: "items",
          rules: "Fixed value: items",
        },
      ],
    },
  ],
  workflows: [
    {
      id: "WF-OPS-031",
      name: "Request item from Items department",
      trigger: "Department needs material managed by Items (not Storage)",
      startActor: "Any department staff",
      endState: "Boss approved — routed to Items (pending_items)",
      flowDiagram: "Create form → boss approve → Items department queue",
      steps: [
        {
          step: 1,
          actor: "Requesting department staff",
          action: "Create items request with product, unit, qty, description",
          input: "Item details + assigned boss",
          output: "Draft with auto IR- request number",
        },
        {
          step: 2,
          actor: "Assigned boss",
          action: "Approve or reject",
          input: "Request details",
          output: "pending_items or boss_rejected",
          decision: true,
        },
        {
          step: 3,
          actor: "System",
          action: "Route to Items department",
          input: "Approved request",
          output: "Visible in Items — Review & Fulfill task",
        },
      ],
    },
  ],
  statusLifecycles: [
    {
      entity: "Items Department Request",
      from: "draft",
      action: "submit to boss",
      to: "pending_boss_approval",
      actor: "Requesting department",
    },
    {
      entity: "Items Department Request",
      from: "pending_boss_approval",
      action: "approve",
      to: "pending_items",
      actor: "Assigned boss",
      notes: "Handoff to Items department",
    },
    {
      entity: "Items Department Request",
      from: "pending_boss_approval",
      action: "reject",
      to: "boss_rejected",
      actor: "Assigned boss",
    },
  ],
  businessRules: [
    {
      id: "BR-OPS-050",
      rule: "Items requests use IR- number prefix (Storage uses SR-)",
      trigger: "Create",
      response: "Auto-generate IR-####/1405",
      severity: "High",
    },
    {
      id: "BR-OPS-051",
      rule: "Items and Storage are separate inventories — form must not cross-route",
      trigger: "Create",
      response: "target_department fixed to items",
      severity: "Critical",
    },
  ],
  roles: [
    {
      role: "Department Staff (any)",
      location: "HQ — all departments",
      mainActions: "Create and submit items requests",
      approval: false,
      readOnly: false,
    },
    {
      role: "Assigned Boss",
      location: "HQ",
      mainActions: "Approve or reject items requisitions",
      approval: true,
      readOnly: false,
    },
  ],
  deliverableChecklist: [
    { item: "Items request form documented", done: true },
    { item: "Distinction from Storage inventory documented", done: true },
    { item: "ENCC sign-off", done: false },
  ],
};
