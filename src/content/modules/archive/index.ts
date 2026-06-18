import { createDepartmentModule } from "../createDepartmentModule";
import { archiveSection } from "./archive";

export const archiveModule = createDepartmentModule({
  id: "archive",
  code: "ARC",
  name: "Archive",
  nameDari: "آرشیف",
  location: "ENCC HQ — آرشیف",
  purpose: "Register internal inquiries and external outgoing correspondence.",
  overview:
    "Archive sub-office of ریایست اجرایه. Registers internal inquiries (Paper 1.1) and external outgoing correspondence with executive approval workflow.",
  purposes: [
    "Internal archive — Paper 1.1 inquiries with executive approval",
    "External outgoing correspondence register",
    "Document routing to departments after approval",
  ],
  sections: [archiveSection],
  relatedModules: [
    { code: "OPR", name: "Executive Directorate", relation: "Parent directorate" },
    { code: "DOC", name: "Document Management", relation: "Attachments & retention" },
  ],
  openQuestions: [
    {
      id: "OQ-ARC-001",
      question: "Exact internal inquiry number format used in physical book today?",
      owner: "ENCC Archive",
    },
    {
      id: "OQ-ARC-002",
      question: "Is there a separate incoming external archive (letters arriving from outside)?",
      owner: "ENCC Archive",
    },
    {
      id: "OQ-ARC-003",
      question: "Do external outgoing letters require executive approval before send?",
      owner: "ENCC Operations",
    },
  ],
});
