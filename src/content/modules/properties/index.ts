import { createDepartmentModule } from "../createDepartmentModule";
import { propertiesDataModelSection } from "./properties-data-model";
import { propertiesFormsIndexSection } from "./properties-forms-index";
import { propertiesProcessSection } from "./properties-process";
import { propertyRegisterSection } from "./property-register";

export const propertiesModule = createDepartmentModule({
  id: "properties",
  code: "PROP",
  name: "Properties",
  nameDari: "جایداد ها",
  location: "ENCC HQ — جایداد ها",
  purpose:
    "Properties from Crest Point Report §4.5 + PP-01…18 — land/building register, tenancy, rent/BRT, IC receipts — plus ENCC property register.",
  overview:
    "جایداد ها — Forms Index (PP-01…18) → process detail (lean entities = ER) → Tables & ER diagram → property-register. Inventory assigns building depreciation; Mali/Control for tenant receipts.",
  purposes: [
    "Navigate all 18 Crest Point PP forms via Properties Forms Index",
    "Lean process + shared Tables & ER diagram for builders",
    "PP-01…03/14 land, building, in-use, asset register",
    "PP-04…10 tenancy, rent due, receipts, IC, tenant ledger, BRT",
    "PP-11…13 disposal, revaluation, class request",
    "PP-15…18 correction, matrix, GL, reports",
    "ENCC: register owned properties with documents/photos",
  ],
  sections: [
    propertiesFormsIndexSection,
    propertiesProcessSection,
    propertiesDataModelSection,
    propertyRegisterSection,
  ],
  relatedModules: [
    { code: "PROC", name: "Procurement", relation: "Legacy property-lease until PP rental entities" },
    { code: "STR", name: "Storage", relation: "Building depreciation rates (IN-07/08)" },
    { code: "MALI", name: "Mali", relation: "PP-06 receipts; PP-17 GL" },
    { code: "CTRL", name: "Control", relation: "PP-07 IC receipt verification" },
    { code: "GEN", name: "General Tables", relation: "Property types (PP-13)" },
  ],
  openQuestions: [
    {
      id: "OQ-PROP-001",
      question:
        "Single tenant-deposit path: PP-06 Finance log + PP-07 IC gate vs FA-06 bank reconciliation — the report allows both for the same deposit. Choose ONE to avoid double posting / alert clearing.",
      owner: "ENCC Properties + Finance + Internal Control",
    },
    {
      id: "OQ-PROP-002",
      question:
        "Confirm BRT rate (4%) and the BRT basis for rent with ARD; rate is held in effective-dated brt_tax_parameters. Who owns the parameter?",
      owner: "ENCC Finance",
    },
    {
      id: "OQ-PROP-003",
      question:
        "Confirm accounting policy: IAS 16 vs IAS 40 / IFRS 16 for rental property; building depreciation method (IN-07); treatment of disposal proceeds (PP-11) and revaluation entry (PP-12).",
      owner: "ENCC Finance + Inventory",
    },
  ],
});
