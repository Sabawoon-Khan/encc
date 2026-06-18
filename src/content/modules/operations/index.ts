import { createDepartmentModule } from "../createDepartmentModule";
import { createPurchaseRequestSection } from "./create-purchase-request";
import { requestItemFromItemsSection } from "./request-item-from-items";
import { requestItemFromStorageSection } from "./request-item-from-storage";

export const operationsModule = createDepartmentModule({
  id: "operations",
  code: "OPS",
  name: "Execution Office",
  nameDari: "اجرایه",
  location: "ENCC HQ — امریت اجرایه",
  purpose: "Customer sales requests, internal requisitions, and boss approval routing.",
  overview:
    "Operations department — customer purchase (sales) workflow, plus internal item requisition forms that any department can submit for Storage or Items.",
  purposes: [
    "Register customer purchase requests (coal, wood, other products)",
    "Create and search customers — only department with customer create permission",
    "Submit storage and items requisition forms on behalf of any department",
  ],
  sections: [
    createPurchaseRequestSection,
    requestItemFromStorageSection,
    requestItemFromItemsSection,
  ],
  relatedModules: [
    { code: "OPR", name: "Executive Directorate", relation: "Parent directorate" },
    { code: "GEN", name: "General Tables", relation: "Master data" },
    { code: "MALI", name: "Mali", relation: "Next step — bank receipts" },
    { code: "STR", name: "Storage", relation: "Storage requisition fulfillment" },
    { code: "ITM", name: "Items", relation: "Items requisition fulfillment" },
  ],
});
