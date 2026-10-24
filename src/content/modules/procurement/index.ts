import { createDepartmentModule } from "../createDepartmentModule";
import { procureItemSection } from "./procurement";
import { procurementDataModelSection } from "./procurement-data-model";
import { procurementFormsIndexSection } from "./procurement-forms-index";
import { procurementProcessSection } from "./procurement-process";
import { propertyLeaseSection } from "./property-lease";
import { projectsSection } from "./projects";
import { smallProcurementSection } from "./small-procurement";

export const procurementModule = createDepartmentModule({
  id: "procurement",
  code: "PROC",
  name: "Procurement",
  nameDari: "تدارکات",
  location: "ENCC HQ — تدارکات",
  purpose:
    "Procurement from Crest Point Report §4.6 + PC-01…18 — ED-gated requests, method/bids, PO/contracts, deposits, implementation, IC at GRN/handover — plus ENCC item purchase, projects, small procurement.",
  overview:
    "تدارکات — Forms Index → process detail (lean entities = ER) → Tables & ER diagram. Then ENCC task sections (procure-item, projects, small-procurement, property-lease bridge). Aligned to Report §4.6 + Excel PC-01…18.",
  purposes: [
    "Navigate all 18 Crest Point PC forms via Procurement Forms Index",
    "Lean process: request queue, method/bids, PO, deposits, tracker, IC (PC-01…15)",
    "Shared Tables & ER diagram for builders",
    "ENCC: out-of-stock purchases, ≥5M projects, <5M small procurement",
    "Property-lease bridge until Properties PP rental entities land",
  ],
  sections: [
    procurementFormsIndexSection,
    procurementProcessSection,
    procurementDataModelSection,
    procureItemSection,
    projectsSection,
    smallProcurementSection,
    propertyLeaseSection,
  ],
  relatedModules: [
    { code: "STR", name: "Storage", relation: "IN-04 purchase requests; IN-05/06 GRN" },
    { code: "ITM", name: "Items", relation: "Forwards unavailable items requests" },
    { code: "PROP", name: "Properties", relation: "PP rental pack; lease bridge" },
    { code: "CTRL", name: "Control", relation: "PC-10 handover IC; goods IC = IN-06" },
    { code: "MALI", name: "Mali", relation: "Deposits + payables after IC" },
    { code: "GEN", name: "General Tables", relation: "Departments; contract type labels" },
  ],
  openQuestions: [
    {
      id: "OQ-PROC-001",
      question:
        "Confirm tender threshold AFN and whether General Directorate / NPA approvals are recorded in ERP (PC-14 notes).",
      owner: "ENCC Procurement + ED office",
    },
    {
      id: "OQ-PROC-002",
      question: "Confirm supplier blacklist workflow owner and un-blacklist rules (PC-12).",
      owner: "ENCC Procurement",
    },
  ],
});
