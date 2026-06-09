import type { SectionDefinition } from "@/types/requirements";

export const executionOfficeSection: SectionDefinition = {
  id: "execution-office",
  name: "Execution Office",
  nameDari: "امریت اجرایه",
  description:
    "Sub-office of ریایست اجرایه. Prepares documents for executive approval and tracks them through the approval workflow. Works closely with آرشیف (Archive) for document routing.",
  status: "pending",
  summary: [
    "Prepares documents before they enter the archive approval workflow",
    "Routes approved items to the correct executive among the four",
    "Tracks approval status — no final approval authority",
    "Full field list to be documented in next workshop",
  ],
  relatedSections: ["archive"],
  entities: [],
  workflows: [],
  businessRules: [],
};
