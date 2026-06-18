import { createDepartmentModule } from "../createDepartmentModule";
import { balanceSection } from "./balance";

export const balanceModule = createDepartmentModule({
  id: "balance",
  code: "BAL",
  name: "Balance",
  nameDari: "بیلانس",
  location: "ENCC HQ — بیلانس",
  purpose: "Accounting ledger, balances, and financial reconciliation.",
  overview: "Balance department — general ledger and period accounting (separate from Mali receipts).",
  purposes: ["Maintain account balances", "Period closing and reconciliation", "Accounting reports"],
  sections: [balanceSection],
  relatedModules: [{ code: "MALI", name: "Mali", relation: "Finance receipts feed accounting" }],
});
