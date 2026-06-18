import type { ModuleDefinition, SectionDefinition } from "@/types/requirements";

const ENCC_BASE = {
  client: "ENCC — National Coal Corporation",
  analyst: "Yaqeen Technology",
  version: "1.0",
  status: "draft" as const,
};

/** Build a department module — task sections live under `sections[]` */
export function createDepartmentModule(opts: {
  id: string;
  code: string;
  name: string;
  nameDari: string;
  location: string;
  purpose: string;
  overview: string;
  purposes: string[];
  sections: SectionDefinition[];
  relatedModules?: ModuleDefinition["relatedModules"];
  openQuestions?: ModuleDefinition["openQuestions"];
}): ModuleDefinition {
  return {
    ...ENCC_BASE,
    tier: 2,
    sidebarGroup: "department",
    parentModuleId: "opr",
    executives: [],
    subOffices: [],
    relatedModules: opts.relatedModules ?? [
      { code: "OPR", name: "Executive Directorate", relation: "Parent directorate" },
      { code: "GEN", name: "General Tables", relation: "Shared master data" },
    ],
    openQuestions: opts.openQuestions ?? [],
    ...opts,
  };
}
