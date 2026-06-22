import type { TaskRef } from "@/types/requirements";
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
import { siteModule } from "./site";
import { salesModule } from "./sales";
import { sharedModule } from "./shared";
import { storageModule } from "./storage";

const allModules = [
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
  siteModule,
  archiveModule,
];

function allSections() {
  return allModules.flatMap((m) =>
    m.sections.map((s) => ({ moduleId: m.id, ...s }))
  );
}

function taskKey(ref: Pick<TaskRef, "moduleId" | "sectionId">): string {
  return `${ref.moduleId}/${ref.sectionId}`;
}

function labelFor(ref: TaskRef): string {
  if (ref.label) return ref.label;
  const mod = allModules.find((m) => m.id === ref.moduleId);
  const sec = mod?.sections.find((s) => s.id === ref.sectionId);
  return sec?.name ?? ref.sectionId;
}

function refFromKey(key: string): TaskRef {
  const [moduleId, sectionId] = key.split("/");
  return { moduleId, sectionId };
}

function buildTaskGraph() {
  const forward = new Map<string, string[]>();
  const labels = new Map<string, string>();

  const register = (ref: TaskRef): string => {
    const key = taskKey(ref);
    labels.set(key, labelFor(ref));
    return key;
  };

  const addEdge = (from: string, to: string) => {
    const next = forward.get(from) ?? [];
    if (!next.includes(to)) next.push(to);
    forward.set(from, next);
  };

  for (const section of allSections()) {
    const self = register({ moduleId: section.moduleId, sectionId: section.id });
    for (const ref of section.precededBy ?? []) {
      addEdge(register(ref), self);
    }
    for (const ref of section.followedBy ?? []) {
      addEdge(self, register(ref));
    }
  }

  const backward = new Map<string, string[]>();
  for (const [from, tos] of forward) {
    for (const to of tos) {
      const preds = backward.get(to) ?? [];
      if (!preds.includes(from)) preds.push(from);
      backward.set(to, preds);
    }
  }

  return { forward, backward, labels };
}

function collectReachable(start: string, adjacency: Map<string, string[]>): Set<string> {
  const seen = new Set<string>();
  const queue = [start];

  while (queue.length > 0) {
    const k = queue.shift()!;
    for (const next of adjacency.get(k) ?? []) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }

  return seen;
}

/** Longest-path distance from `origin` to each node in `keys` (handles cycles). */
function maxDistanceFromOrigin(
  origin: string,
  keys: Set<string>,
  forward: Map<string, string[]>
): Map<string, number> {
  const maxDist = new Map<string, number>();

  function walk(node: string, depth: number, path: Set<string>) {
    for (const next of forward.get(node) ?? []) {
      if (path.has(next) || !keys.has(next)) continue;
      maxDist.set(next, Math.max(maxDist.get(next) ?? 0, depth + 1));
      path.add(next);
      walk(next, depth + 1, path);
      path.delete(next);
    }
  }

  walk(origin, 0, new Set([origin]));
  return maxDist;
}

/** Longest-path distance from each node in `keys` to `target` through backward edges. */
function maxDistanceToTarget(
  target: string,
  keys: Set<string>,
  backward: Map<string, string[]>
): Map<string, number> {
  const maxDist = new Map<string, number>();

  function walk(node: string, depth: number, path: Set<string>) {
    for (const prev of backward.get(node) ?? []) {
      if (path.has(prev) || !keys.has(prev)) continue;
      maxDist.set(prev, Math.max(maxDist.get(prev) ?? 0, depth + 1));
      path.add(prev);
      walk(prev, depth + 1, path);
      path.delete(prev);
    }
  }

  walk(target, 0, new Set([target]));
  return maxDist;
}

function canReach(
  from: string,
  to: string,
  forward: Map<string, string[]>,
  limit?: Set<string>
): boolean {
  const queue = [from];
  const seen = new Set([from]);
  while (queue.length > 0) {
    const node = queue.shift()!;
    for (const next of forward.get(node) ?? []) {
      if (next === to) return true;
      if (seen.has(next)) continue;
      if (limit && !limit.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return false;
}

/** All tasks that come before this one in any linked workflow, earliest first. */
export function resolveAllPrecededTasks(moduleId: string, sectionId: string): TaskRef[] {
  const { forward, backward } = buildTaskGraph();
  const key = taskKey({ moduleId, sectionId });
  const ancestorSet = collectReachable(key, backward);
  const distance = maxDistanceToTarget(key, ancestorSet, backward);
  const ordered = Array.from(distance.entries()).sort((a, b) => {
    const distDiff = b[1] - a[1];
    if (distDiff !== 0) return distDiff;
    if (canReach(a[0], b[0], forward)) return -1;
    if (canReach(b[0], a[0], forward)) return 1;
    return a[0].localeCompare(b[0]);
  });
  return ordered.map(([k]) => refFromKey(k));
}

/** All tasks that come after this one in any linked workflow, nearest first. */
export function resolveAllFollowedTasks(moduleId: string, sectionId: string): TaskRef[] {
  const { forward } = buildTaskGraph();
  const key = taskKey({ moduleId, sectionId });
  const descendantSet = collectReachable(key, forward);
  const distance = maxDistanceFromOrigin(key, descendantSet, forward);
  const ordered = Array.from(distance.entries()).sort((a, b) => {
    const distDiff = a[1] - b[1];
    if (distDiff !== 0) return distDiff;
    if (canReach(a[0], b[0], forward)) return -1;
    if (canReach(b[0], a[0], forward)) return 1;
    return a[0].localeCompare(b[0]);
  });
  return ordered.map(([k]) => refFromKey(k));
}

export function resolveTaskFlow(
  moduleId: string,
  sectionId: string
): { precededBy: TaskRef[]; followedBy: TaskRef[] } {
  return {
    precededBy: resolveAllPrecededTasks(moduleId, sectionId),
    followedBy: resolveAllFollowedTasks(moduleId, sectionId),
  };
}
