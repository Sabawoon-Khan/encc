import type { GlossaryTerm } from "@/types/requirements";

export const glossary: GlossaryTerm[] = [
  {
    id: "executive-directorate",
    term: "Executive Directorate",
    termDari: "ریایست اجرایه",
    definition:
      "HQ management section (OPR module) controlled by general managers and executives. Contains sub-offices: امریت اجرایه and آرشیف.",
    usedIn: ["OPR"],
  },
  {
    id: "execution-office",
    term: "Execution Office",
    termDari: "امریت اجرایه",
    definition:
      "Sub-office of ریایست اجرایه. Prepares documents and routes them to executives for approval.",
    usedIn: ["OPR"],
  },
  {
    id: "archive",
    term: "Archive",
    termDari: "آرشیف",
    definition:
      "Sub-office of ریایست اجرایه. Registers internal inquiries (Paper 1.1) and external outgoing correspondence. Current tool: physical book register.",
    usedIn: ["OPR", "Archive"],
  },
  {
    id: "executive-tier",
    term: "Executive Tier",
    termDari: "مدیران ارشد",
    definition:
      "Four HQ executives (CEO, Commercial, Operations/Admin, Financial) with equal approval authority in OPR workflows.",
    usedIn: ["OPR"],
  },
  {
    id: "hijri-date",
    term: "Hijri Date (Shamsi)",
    termDari: "تاریخ هجری شمسی",
    definition:
      "All date fields across ریایست اجرایه use Solar Hijri (Shamsi) format YYYY/MM/DD — e.g. 1405/02/19. Defined once in module General Information, not repeated per section.",
    usedIn: ["OPR", "Archive"],
  },
  {
    id: "paper-11",
    term: "Paper 1.1",
    termDari: "فورم ۱.۱",
    definition:
      "Physical form and book register used for internal archive inquiries. Current tool alongside physical book register.",
    usedIn: ["Archive"],
  },
  {
    id: "internal-archive",
    term: "Internal Archive",
    termDari: "آرشیف داخلی",
    definition:
      "Register for inquiries within ENCC. Workflow: create + attach → executive approval → send to department → optional result.",
    usedIn: ["Archive"],
  },
  {
    id: "external-archive",
    term: "External Archive (Outgoing)",
    termDari: "آرشیف خارجی",
    definition:
      "Register for correspondence leaving ENCC to external parties. Optional result when reply received.",
    usedIn: ["Archive"],
  },
  {
    id: "assigned-executive",
    term: "Assigned Executive",
    termDari: "مدیر مسئول تأیید",
    definition:
      "One of four executives selected at creation. Item is sent to them for approval before routing to department.",
    usedIn: ["OPR", "Archive"],
  },
  {
    id: "inquiry-result",
    term: "Inquiry Result",
    termDari: "نتیجه استعلام",
    definition:
      "Optional outcome text recorded after the related department responds.",
    usedIn: ["Archive"],
  },
  {
    id: "template-v22",
    term: "Shams Hilal Template v2.2",
    definition:
      "Controlled business requirements package. Sections 5–25 per module with evidence log and ENCC sign-off.",
    usedIn: ["All modules"],
  },
];
