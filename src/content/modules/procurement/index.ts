import { createDepartmentModule } from "../createDepartmentModule";
import { procureItemSection } from "./procurement";
import { propertyLeaseSection } from "./property-lease";
import { projectsSection } from "./projects";
import { smallProcurementSection } from "./small-procurement";

export const procurementModule = createDepartmentModule({
  id: "procurement",
  code: "PROC",
  name: "Procurement",
  nameDari: "تدارکات",
  location: "ENCC HQ — تدارکات",
  purpose: "Purchases, property leases, major projects, and small procurements.",
  overview:
    "Procurement handles out-of-stock item purchases, property rental lifecycle, major bid projects (≥ 5M AFN), and routine small purchases (< 5M AFN). Contract types are maintained in General Tables.",
  purposes: [
    "Receive out-of-stock requisitions from Storage and Items",
    "Manage property leases — bids, tenants, rent collection",
    "Register major project contracts (≥ 5M AFN) with optional line items",
    "Record small procurements (< 5M AFN) with auto-calculated totals",
  ],
  sections: [
    procureItemSection,
    propertyLeaseSection,
    projectsSection,
    smallProcurementSection,
  ],
  relatedModules: [
    { code: "STR", name: "Storage", relation: "Forwards unavailable storage requests" },
    { code: "ITM", name: "Items", relation: "Forwards unavailable items requests" },
    { code: "PROP", name: "Properties", relation: "Property account header for leases" },
    { code: "GEN", name: "General Tables", relation: "Procurement contract types" },
  ],
});
