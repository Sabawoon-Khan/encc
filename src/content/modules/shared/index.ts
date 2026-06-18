import type { ModuleDefinition } from "@/types/requirements";
import { generalTablesSection } from "./general-tables";

export const sharedModule: ModuleDefinition = {
  id: "shared",
  code: "GEN",
  name: "General Tables",
  tier: 0,
  sidebarGroup: "shared",
  status: "draft",
  location: "ENCC HQ — all departments",
  client: "ENCC — National Coal Corporation",
  analyst: "Yaqeen Technology",
  version: "1.0",
  purpose:
    "Shared reference data used across departments — customers, products, mines, bank accounts, receipts.",
  overview:
    "Central master data for the entire ERP. Departments reference these tables; changes apply to new transactions everywhere.",
  purposes: [
    "Single source of truth for customers, product types, mines, and bank accounts",
    "Reusable uploaded bank receipt records for purchases, rent, and other payments",
  ],
  executives: [],
  subOffices: [],
  sections: [generalTablesSection],
  relatedModules: [
    { code: "OPR", name: "Executive Directorate", relation: "Parent organisation" },
    { code: "OPS", name: "Operations", relation: "Creates customers" },
    { code: "MALI", name: "Mali", relation: "Bank accounts & receipts" },
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
