import { createDepartmentModule } from "../createDepartmentModule";
import {
  createItemsDistributionSection,
  fulfillItemsRequestSection,
} from "./items";

export const itemsModule = createDepartmentModule({
  id: "items",
  code: "ITM",
  name: "Items Department",
  nameDari: "محاسبه اجناس",
  location: "ENCC HQ — محاسبه اجناس",
  purpose: "Items inventory separate from Storage — fulfillment and distribution.",
  overview:
    "Items department manages a separate inventory from Storage / Warehouse. Fulfills IR- requisitions or routes to Procurement when out of stock.",
  purposes: [
    "Maintain Items department stock (separate from تحویلخانه)",
    "Review and fulfill items requisitions",
    "Create distribution forms for issued materials",
  ],
  sections: [fulfillItemsRequestSection, createItemsDistributionSection],
  relatedModules: [
    { code: "OPS", name: "Operations", relation: "Requisition source" },
    { code: "STR", name: "Storage", relation: "Separate warehouse inventory" },
    { code: "PROC", name: "Procurement", relation: "Purchase when unavailable" },
  ],
});
