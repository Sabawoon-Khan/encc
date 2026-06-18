import { createDepartmentModule } from "../createDepartmentModule";
import { procureItemSection } from "./procurement";

export const procurementModule = createDepartmentModule({
  id: "procurement",
  code: "PROC",
  name: "Procurement",
  nameDari: "تدارکات",
  location: "ENCC HQ — تدارکات",
  purpose: "Purchase items unavailable in Storage or Items inventory.",
  overview:
    "Procurement department buys materials when Storage or Items cannot fulfill from stock. After delivery, the originating department distributes to the requester.",
  purposes: [
    "Receive out-of-stock requisitions from Storage and Items",
    "Create purchase orders and manage vendors",
    "Record receipt and trigger distribution",
  ],
  sections: [procureItemSection],
  relatedModules: [
    { code: "STR", name: "Storage", relation: "Forwards unavailable storage requests" },
    { code: "ITM", name: "Items", relation: "Forwards unavailable items requests" },
  ],
});
