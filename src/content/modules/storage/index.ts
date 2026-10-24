import { createDepartmentModule } from "../createDepartmentModule";
import { inventoryDataModelSection } from "./inventory-data-model";
import { inventoryFormsIndexSection } from "./inventory-forms-index";
import { inventoryProcessSection } from "./inventory-process";
import {
  createDistributionFormSection,
  fulfillStorageRequestSection,
} from "./storage";

export const storageModule = createDepartmentModule({
  id: "storage",
  code: "STR",
  name: "Storage / Warehouse",
  nameDari: "تحویلخانه",
  location: "ENCC HQ — تحویلخانه",
  purpose:
    "Inventory & warehouse from Crest Point Report §4.2 + IN-01…15 — requests, issuance, GRN/IC, fixed assets — plus ENCC storage fulfillment.",
  overview:
    "تحویلخانه — Forms Index (IN-01…15) → fulfill / distribution. Crest Point §4.2; Items module shares item master/ledger where ENCC keeps محاسبه اجناس separate.",
  purposes: [
    "Navigate all 15 Crest Point IN forms via Inventory Forms Index",
    "IN-01…03 request, issuance, asset handover",
    "IN-04…06 purchase request, GRN, IC GRN verification",
    "IN-07…09 fixed assets, depreciation rate, loss/write-down",
    "IN-10…15 item master, stock alerts, matrix, GL, reports, correction",
    "Lean Inventory process (ENT-IN-*) + shared Tables & ER diagram for builders",
    "ENCC: fulfill storage requests and create distribution forms",
  ],
  sections: [
    inventoryFormsIndexSection,
    inventoryProcessSection,
    inventoryDataModelSection,
    fulfillStorageRequestSection,
    createDistributionFormSection,
  ],
  relatedModules: [
    { code: "OPS", name: "Operations", relation: "Requisition source (IN-01)" },
    { code: "PROC", name: "Procurement", relation: "IN-04 purchase; PC pack" },
    { code: "ITM", name: "Items", relation: "Separate ENCC ledger — share IN-10 concepts" },
    { code: "CTRL", name: "Control", relation: "IN-06 IC at GRN" },
    { code: "MALI", name: "Mali", relation: "IN-13 auto GL; FA-18 Control Log" },
  ],
});
