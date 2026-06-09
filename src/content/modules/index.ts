import type { ModuleDefinition } from "@/types/requirements";
import { oprModule } from "./opr";

/** All ENCC ERP requirement modules — add new modules here */
export const modules: ModuleDefinition[] = [oprModule];

export function getModule(id: string): ModuleDefinition | undefined {
  return modules.find((m) => m.id === id);
}

export function getSection(moduleId: string, sectionId: string) {
  const mod = getModule(moduleId);
  return mod?.sections.find((s) => s.id === sectionId);
}

export function getAllSections() {
  return modules.flatMap((m) =>
    m.sections.map((s) => ({
      moduleId: m.id,
      moduleCode: m.code,
      moduleName: m.name,
      ...s,
    }))
  );
}
