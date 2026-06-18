import type { SectionDefinition } from "@/types/requirements";
import { crossDepartmentWorkflowMermaid } from "../shared/purchase-request-fields";

export const executionOfficeSection: SectionDefinition = {
  id: "execution-office",
  name: "Execution Office",
  nameDari: "امریت اجرایه",
  enableReview: true,
  description:
    "Sub-office of ریایست اجرایه overseeing the coal/product purchase workflow across four departments: Operations, Mali (مالی), Control (کنترول), and Sales (فروشات). Master data lives in General Tables.",
  status: "draft",
  currentTool: "Paper forms, manual bank receipts, physical register",
  summary: [
    "Four departments: Operations → Mali → Control → Sales",
    "Operations creates request + customers; Mali handles receipts; Control verifies; Sales issues form → MINS",
    "Shared Purchase Request (ENT-OPR-015) flows through all departments by status",
    "General Tables hold all master data — see general-tables section",
  ],
  relatedSections: ["general-tables", "operations", "mali", "control", "sales", "archive"],
  roles: [
    {
      role: "Operations Clerk",
      location: "HQ — عملیات",
      mainActions: "See Operations section",
      approval: false,
      readOnly: false,
    },
    {
      role: "Mali Clerk",
      location: "HQ — مالی",
      mainActions: "See Mali section",
      approval: true,
      readOnly: false,
    },
    {
      role: "Control Officer",
      location: "HQ — کنترول",
      mainActions: "See Control section",
      approval: true,
      readOnly: false,
    },
    {
      role: "Sales Clerk",
      location: "HQ — فروشات",
      mainActions: "See Sales section",
      approval: false,
      readOnly: false,
    },
  ],
  entities: [],
  workflows: [
    {
      id: "WF-OPR-010",
      name: "End-to-end purchase workflow (all departments)",
      trigger: "Customer arrives to buy coal, wood, or other product",
      startActor: "Operations Clerk",
      endState: "Complete — sales form in MINS",
      currentTool: "Paper forms across four departments",
      flowDiagram:
        "Operations: create + boss approve → Mali: print receipts → Control: verify → Customer pays → Mali: upload + verify → Sales: form → MINS",
      mermaid: crossDepartmentWorkflowMermaid,
      steps: [
        {
          step: 1,
          actor: "Operations",
          action: "Create request, add/select customer, submit to boss, boss approves",
          input: "Customer, product, mine, quantity, prices",
          output: "status: pending_mali",
        },
        {
          step: 2,
          actor: "Mali",
          action: "Generate product + weighing bank receipts",
          input: "Boss-approved request",
          output: "status: pending_control",
        },
        {
          step: 3,
          actor: "Control",
          action: "Verify request and receipts before bank payment",
          input: "Request + Mali receipts",
          output: "status: pending_payment",
        },
        {
          step: 4,
          actor: "Customer",
          action: "Pay at bank",
          input: "Printed receipts",
          output: "Bank receipt with number and Tarafa",
        },
        {
          step: 5,
          actor: "Mali",
          action: "Upload and verify bank receipts",
          input: "Receipt scans",
          output: "status: payment_verified",
        },
        {
          step: 6,
          actor: "Sales",
          action: "Issue sales form and send to MINS",
          input: "Verified request",
          output: "status: complete",
        },
      ],
    },
  ],
  businessRules: [
    {
      id: "BR-OPR-001",
      rule: "Purchase workflow spans four departments in fixed order: Operations → Mali → Control → Sales",
      trigger: "Any stage transition",
      response: "Enforce department sequence via status",
      severity: "Critical",
    },
  ],
  crossModuleNotes: [
    "Department modules: Operations (/modules/operations), Mali (/modules/mali), Control (/modules/control), Sales (/modules/sales).",
    "General Tables module (/modules/shared): customers, products, mines, bank accounts, weighing rate, uploaded receipts.",
    "Only Operations can create customers. Sales cannot.",
    "Control and Mali will gain additional task sections as new workflows are documented.",
  ],
  deliverableChecklist: [
    { item: "Four department sections created", done: true },
    { item: "End-to-end workflow overview", done: true },
    { item: "General Tables separated", done: true },
    { item: "ENCC sign-off", done: false },
  ],
};
