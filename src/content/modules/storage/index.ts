import { createDepartmentModule } from "../createDepartmentModule";
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
  purpose: "Warehouse inventory, stock checks, and distribution of approved requisitions.",
  overview:
    "Storage / Warehouse department — separate from Items. Receives boss-approved storage requests, checks availability, creates distribution forms, or routes to Procurement when out of stock.",
  purposes: [
    "Review and fulfill department storage requisitions",
    "Maintain warehouse stock ledger",
    "Create distribution forms and issue items to requesters",
    "Forward unavailable items to Procurement",
  ],
  sections: [fulfillStorageRequestSection, createDistributionFormSection],
  relatedModules: [
    { code: "OPS", name: "Operations", relation: "Requisition source" },
    { code: "PROC", name: "Procurement", relation: "Purchase when out of stock" },
    { code: "ITM", name: "Items", relation: "Separate inventory — not shared stock" },
  ],
});
