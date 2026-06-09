import type { ModuleDefinition } from "@/types/requirements";
import { archiveSection } from "./archive";

export const oprModule: ModuleDefinition = {
  id: "opr",
  code: "OPR",
  name: "Operations Department",
  nameDari: "د عملیاتو او اداری مدیریت برخه",
  tier: 1,
  status: "draft",
  location: "ENCC HQ — Operations / Administrative Department",
  client: "ENCC — National Coal Corporation",
  analyst: "Yaqeen Technology",
  version: "1.0",
  purpose:
    "General management layer of the ENCC ERP — executive approvals, document circulation, and HQ coordination.",
  overview:
    "The Operations Department (OPR) module governs headquarters-level administrative control. It is controlled by general managers and executives and contains sub-sections that mirror ENCC's physical office structure: Archive, Sales, Buying & Distribution, and the Execution Office.",
  purposes: [
    "Centralize executive-level approvals and document routing for HQ operations",
    "Track all internal and external correspondence (archive) with full audit trail",
    "Support sales, procurement/buying, and distribution under unified executive oversight",
    "Enable the Execution Office (مراقبت اجرایی) to prepare and route documents for executive sign-off",
  ],
  executives: [
    {
      id: "ceo",
      name: "General Executive / CEO",
      nameDari: "مدیر عامل / رئیس کل",
      description:
        "Highest authority; same approval powers as other executives for OPR workflows",
    },
    {
      id: "commercial",
      name: "Commercial Manager",
      nameDari: "مدیر تجارتی",
      description: "Sales and commercial approvals",
    },
    {
      id: "operations",
      name: "Operations / Admin Manager",
      nameDari: "مدیر اداری / عملیات",
      description: "Internal operations and administrative approvals",
    },
    {
      id: "financial",
      name: "Financial Manager",
      nameDari: "مدیر مالی",
      description: "Financial and budget-related approvals",
    },
  ],
  supportingOffices: [
    {
      name: "Execution Office",
      nameDari: "مراقبت اجرایی",
      description:
        "Prepares documents, routes to executives, tracks approval status — no final approval authority",
    },
  ],
  sections: [
    archiveSection,
    {
      id: "sales",
      name: "Sales",
      nameDari: "فروش / تجارت",
      description: "Sales operations under the Commercial Manager executive.",
      status: "pending",
      summary: ["To be documented in next workshop session"],
      entities: [],
      workflows: [],
      businessRules: [],
    },
    {
      id: "buying-distribution",
      name: "Buying & Distribution",
      nameDari: "خریداری و توزیع",
      description: "Procurement, buying, and distribution workflows.",
      status: "pending",
      summary: ["To be documented in next workshop session"],
      entities: [],
      workflows: [],
      businessRules: [],
    },
    {
      id: "execution-office",
      name: "Execution Office",
      nameDari: "مراقبت اجرایی",
      description:
        "Document preparation and routing workflows for executive approvals.",
      status: "pending",
      summary: [
        "Partially covered via approval routing in Archive",
        "Full workflow to be documented separately",
      ],
      entities: [],
      workflows: [],
      businessRules: [],
      relatedSections: ["archive"],
    },
  ],
  relatedModules: [
    { code: "DOC", name: "Document Management", relation: "Attachments & retention" },
    { code: "SCA", name: "Sales, Contracts & Allocations", relation: "Commercial correspondence" },
    { code: "PRO", name: "Procurement & Stores", relation: "Buying workflows" },
    { code: "FIN", name: "Finance & GL", relation: "Financial approvals" },
  ],
  openQuestions: [
    {
      id: "OQ-OPR-001",
      question: "Exact internal inquiry number format used today?",
      owner: "ENCC Archive",
    },
    {
      id: "OQ-OPR-002",
      question: "Is file attachment mandatory on create or optional?",
      owner: "ENCC Archive",
    },
    {
      id: "OQ-OPR-003",
      question: "Do external outgoing letters require executive approval before send?",
      owner: "ENCC Operations",
    },
    {
      id: "OQ-OPR-005",
      question: "Is there a separate incoming external archive (letters arriving from outside)?",
      owner: "ENCC Archive",
    },
  ],
};
