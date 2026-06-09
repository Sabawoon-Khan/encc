import type { GlossaryTerm } from "@/types/requirements";

export const glossary: GlossaryTerm[] = [
  {
    id: "executive-tier",
    term: "Executive Tier",
    termDari: "مدیران ارشد",
    definition:
      "The four HQ executives (CEO, Commercial, Operations/Admin, Financial) who share equal approval authority within OPR workflows.",
    usedIn: ["OPR"],
  },
  {
    id: "execution-office",
    term: "Execution Office",
    termDari: "مراقبت اجرایی",
    definition:
      "Supporting office that prepares documents and routes them to executives for approval. Does not hold final approval authority.",
    usedIn: ["OPR"],
  },
  {
    id: "internal-archive",
    term: "Internal Archive",
    termDari: "آرشیف داخلی",
    definition:
      "Register for inquiries and requests within ENCC or between internal offices. Uses form Paper 1.1. Tracks external org. document number plus ENCC internal inquiry number.",
    usedIn: ["OPR", "Archive"],
  },
  {
    id: "external-archive",
    term: "External Archive (Outgoing)",
    termDari: "آرشیف خارجی / خروجی",
    definition:
      "Register for correspondence leaving ENCC to external organizations or individuals. Optional result field when reply is received.",
    usedIn: ["OPR", "Archive"],
  },
  {
    id: "external-doc-number",
    term: "External Document Number",
    termDari: "شماره سند خارجی",
    definition:
      "The reference number assigned by the other organization on their document when ENCC sends or receives an inquiry.",
    usedIn: ["Archive"],
  },
  {
    id: "internal-inquiry-number",
    term: "Internal Inquiry Number",
    termDari: "شماره استعلام داخلی",
    definition:
      "Auto-generated ENCC reference number for tracking an internal archive inquiry (e.g. INQ-OPR-2026-0088).",
    usedIn: ["Archive"],
  },
  {
    id: "assigned-executive",
    term: "Assigned Executive",
    termDari: "مدیر مسئول تأیید",
    definition:
      "One of the four executives selected at record creation to receive the item for approval. Reflects organizational responsibility, not hierarchy.",
    usedIn: ["OPR", "Archive"],
  },
  {
    id: "inquiry-result",
    term: "Inquiry Result",
    termDari: "نتیجه استعلام",
    definition:
      "Outcome text recorded when an internal archive inquiry is completed. Required before closing the record.",
    usedIn: ["Archive"],
  },
  {
    id: "destination",
    term: "Destination (Sending Place)",
    termDari: "محل ارسال / مقصد",
    definition:
      "External organization or person receiving an outgoing archive document.",
    usedIn: ["Archive"],
  },
  {
    id: "wbt",
    term: "WBT — Weighbridge Ticketing",
    definition:
      "Tier 1 module for weighbridge operations at Main Site. Source of net weight and coal movement evidence.",
    usedIn: ["WBT"],
  },
  {
    id: "template-v22",
    term: "Shams Hilal Template v2.2",
    definition:
      "Controlled business requirements package format. One file per module with sections 5–25, evidence log, and ENCC sign-off.",
    usedIn: ["All modules"],
  },
];
