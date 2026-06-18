import type { ModuleDefinition, TaskRef } from "@/types/requirements";
import { archiveModule } from "./archive";
import { balanceModule } from "./balance";
import { controlModule } from "./control";
import { hrModule } from "./hr";
import { itemsModule } from "./items";
import { maliModule } from "./mali";
import { operationsModule } from "./operations";
import { oprModule } from "./opr";
import { procurementModule } from "./procurement";
import { propertiesModule } from "./properties";
import { salariesModule } from "./salaries";
import { salesModule } from "./sales";
import { sharedModule } from "./shared";
import { storageModule } from "./storage";

/** All ENCC ERP modules — grouped in sidebar: Shared → Directorate → Departments */
export const modules: ModuleDefinition[] = [
  sharedModule,
  oprModule,
  operationsModule,
  maliModule,
  controlModule,
  salesModule,
  storageModule,
  itemsModule,
  procurementModule,
  salariesModule,
  hrModule,
  balanceModule,
  propertiesModule,
  archiveModule,
];

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

export function getDepartmentModules(): ModuleDefinition[] {
  return modules.filter((m) => m.sidebarGroup === "department");
}

export function getParentModule(moduleId: string): ModuleDefinition | undefined {
  const mod = getModule(moduleId);
  if (!mod?.parentModuleId) return undefined;
  return getModule(mod.parentModuleId);
}

export function resolveTaskRef(ref: TaskRef): { href: string; label: string } {
  const mod = getModule(ref.moduleId);
  const sec = mod?.sections.find((s) => s.id === ref.sectionId);
  return {
    href: `/modules/${ref.moduleId}/sections/${ref.sectionId}`,
    label: ref.label ?? sec?.name ?? ref.sectionId,
  };
}

export {
  resolveAllFollowedTasks,
  resolveAllPrecededTasks,
  resolveTaskFlow,
} from "./task-flow";
