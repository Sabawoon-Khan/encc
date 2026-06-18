import type { SectionDefinition } from "@/types/requirements";
import { itemRequestCoreFields } from "../shared/item-request-fields";

export const requestItemFromStorageSection: SectionDefinition = {
  id: "request-item-from-storage",
  name: "Request Item from Storage",
  nameDari: "درخواست جنس از تحویلخانه",
  enableReview: true,
  description:
    "Requisition form any department can use to request materials from the Storage / Warehouse department (تحویلخانه). Auto-generated number, requesting department, product, unit, quantity, description, and status. Creator selects which boss receives the request for approval. After boss approval the request routes to Storage.",
  status: "draft",
  currentTool: "Paper requisition forms between departments",
  summary: [
    "Any department creates a storage request — product name, unit, quantity, description",
    "Auto-generated request number and Hijri request date",
    "Creator selects which boss approves (configurable routing per department or item type)",
    "Boss approves or rejects — on approval → Storage / Warehouse department",
    "Storage checks stock: distribute if available, otherwise forward to Procurement",
  ],
  followedBy: [
    {
      moduleId: "storage",
      sectionId: "fulfill-storage-request",
      label: "Review & Fulfill Storage Request",
    },
  ],
  relatedSections: ["request-item-from-items", "fulfill-storage-request", "procure-item"],
  entities: [
    {
      id: "ENT-OPS-020",
      name: "Storage Item Request",
      description:
        "Department requisition sent to the Storage / Warehouse department after boss approval.",
      fields: [
        ...itemRequestCoreFields,
        {
          name: "target_department",
          label: "Target Department",
          labelDari: "ریاست مقصد",
          meaning: "Always Storage / Warehouse for this form",
          type: "enum",
          required: true,
          example: "storage",
          rules: "Fixed value: storage",
        },
      ],
    },
  ],
  workflows: [
    {
      id: "WF-OPS-030",
      name: "Request item from storage",
      trigger: "Department needs material held in Storage / Warehouse",
      startActor: "Any department staff",
      endState: "Boss approved — routed to Storage (pending_warehouse)",
      flowDiagram:
        "Create form → select boss → submit → boss approve/reject → Storage receives",
      steps: [
        {
          step: 1,
          actor: "Requesting department staff",
          action: "Create storage request — department, product, unit, qty, description",
          input: "Item details + assigned boss",
          output: "Draft with auto request number",
        },
        {
          step: 2,
          actor: "Requesting department staff",
          action: "Submit for boss approval",
          input: "Complete draft",
          output: "status: pending_boss_approval",
        },
        {
          step: 3,
          actor: "Assigned boss",
          action: "Approve or reject",
          input: "Request details",
          output: "pending_warehouse or boss_rejected",
          decision: true,
          exception: "Rejection → requester revises and resubmits",
        },
        {
          step: 4,
          actor: "System",
          action: "Route approved request to Storage department queue",
          input: "Approved request",
          output: "Visible in Storage — Review & Fulfill task",
        },
      ],
    },
  ],
  statusLifecycles: [
    {
      entity: "Storage Item Request",
      from: "draft",
      action: "submit to boss",
      to: "pending_boss_approval",
      actor: "Requesting department",
    },
    {
      entity: "Storage Item Request",
      from: "pending_boss_approval",
      action: "approve",
      to: "pending_warehouse",
      actor: "Assigned boss",
      notes: "Handoff to Storage department",
    },
    {
      entity: "Storage Item Request",
      from: "pending_boss_approval",
      action: "reject",
      to: "boss_rejected",
      actor: "Assigned boss",
    },
  ],
  businessRules: [
    {
      id: "BR-OPS-040",
      rule: "Request number auto-generated on first save",
      trigger: "Create",
      response: "Assign SR-####/1405 format; read-only",
      severity: "Critical",
    },
    {
      id: "BR-OPS-041",
      rule: "Creator must select which boss receives the request",
      trigger: "Submit",
      response: "Block submit without assigned_boss_id",
      severity: "Critical",
    },
    {
      id: "BR-OPS-042",
      rule: "Only assigned boss can approve or reject",
      trigger: "Boss action",
      response: "Block unauthorized approver",
      severity: "Critical",
    },
    {
      id: "BR-OPS-043",
      rule: "Storage requests always target Storage department — not Items",
      trigger: "Create",
      response: "Set target_department = storage",
      severity: "High",
    },
  ],
  roles: [
    {
      role: "Department Staff (any)",
      location: "HQ — all departments",
      mainActions: "Create and submit storage requests for their department",
      approval: false,
      readOnly: false,
    },
    {
      role: "Assigned Boss",
      location: "HQ",
      mainActions: "Approve or reject storage requisitions",
      approval: true,
      readOnly: false,
    },
  ],
  deliverableChecklist: [
    { item: "Storage request form fields documented", done: true },
    { item: "Boss routing and approval flow documented", done: true },
    { item: "Handoff to Storage department defined", done: true },
    { item: "ENCC sign-off", done: false },
  ],
};
