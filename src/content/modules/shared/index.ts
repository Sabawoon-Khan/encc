import type { ModuleDefinition } from "@/types/requirements";
import { crestFormsHubSection } from "./crest-forms-hub";
import { generalTablesSection } from "./general-tables";
import { generalTablesErSection } from "./general-tables-schema";

export const sharedModule: ModuleDefinition = {
  id: "shared",
  code: "GEN",
  name: "General Tables",
  tier: 0,
  sidebarGroup: "shared",
  status: "draft",
  location: "ENCC HQ — all departments",
  client: "ENCC — North Coal State Owned Corporation",
  analyst: "Yaqeen Technology · design confirmed with Crest Point",
  version: "1.0",
  purpose:
    "Shared reference data and Crest Point forms hub — customers, products, mines, bank accounts, plus links to every FA/IN/PL/PC/PP/SM/PY Forms Index.",
  overview:
    "Central master data + Crest Point Forms Hub (all workbooks under forms/). Open Tables & ER for schema; open Forms Hub to jump to each domain index.",
  purposes: [
    "Single source of truth for customers, product types, mines, and bank accounts",
    "Crest Point Forms Hub — every workbook sheet mapped to a module Forms Index",
    "Reusable uploaded bank receipt records for purchases, rent, and other payments",
    "Clean ER diagram for builders — required fields marked *, simple column types",
  ],
  executives: [],
  subOffices: [],
  sections: [crestFormsHubSection, generalTablesSection, generalTablesErSection],
  relatedModules: [
    { code: "OPR", name: "Executive Directorate", relation: "Parent organisation" },
    { code: "OPS", name: "Operations", relation: "Creates customers" },
    { code: "MALI", name: "Mali", relation: "FA forms index + bank accounts" },
    { code: "PLN", name: "Planning & Policy", relation: "PL forms index" },
    { code: "MINS", name: "Mines", relation: "Mining sites sync" },
  ],
  openQuestions: [
    {
      id: "OQ-GEN-001",
      question: "Current product categories, types, and price list for migration",
      owner: "ENCC Operations",
    },
  ],
};
