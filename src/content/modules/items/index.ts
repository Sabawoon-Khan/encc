import { createDepartmentModule } from "../createDepartmentModule";
import { driversSection } from "./drivers";
import {
  createItemsDistributionSection,
  fulfillItemsRequestSection,
} from "./items";
import { itemsProductLedgerSection } from "./items-product-ledger";
import { personRegisterSection } from "./person-register";

export const itemsModule = createDepartmentModule({
  id: "items",
  code: "ITM",
  name: "Items Department",
  nameDari: "محاسبه اجناس",
  location: "ENCC HQ — محاسبه اجناس",
  purpose: "Product ledger, inventory movements, drivers, and person register.",
  overview:
    "Items department (محاسبه اجناس) — standalone item ledger (account books + product master), چګ صادره / چک وارده, drivers, جمع اشخاص, and IR- requisition fulfillment.",
  purposes: [
    "Items ledger — account books + Product master; products on transaction lines; user_id on movements and spend",
    "چګ صادره (issue) and چک وارده (return) movement vouchers",
    "Driver register and کتابجه ګردش circulation ledger",
    "جمع اشخاص person credit/debit register",
    "Review and fulfill items requisitions (IR-)",
  ],
  sections: [
    itemsProductLedgerSection,
    driversSection,
    personRegisterSection,
    fulfillItemsRequestSection,
    createItemsDistributionSection,
  ],
  relatedModules: [
    { code: "HR", name: "Human Resources", relation: "Active employees for جمع اشخاص" },
    { code: "CTRL", name: "Control", relation: "Spend confirmation (optional)" },
    { code: "OPS", name: "Operations", relation: "Requisition source" },
    { code: "STR", name: "Storage", relation: "Separate warehouse inventory" },
    { code: "PROC", name: "Procurement", relation: "Purchase when unavailable" },
  ],
  openQuestions: [
    {
      id: "OQ-ITM-001",
      question: "Sample paper چګ صادره / چک وارده forms from ENCC",
      owner: "ENCC Items / محاسبه اجناس",
    },
  ],
});
