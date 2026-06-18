import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { ModuleDefinition, SectionDefinition, TaskRef } from "@/types/requirements";
import { getModule, getParentModule, resolveTaskFlow, resolveTaskRef } from "@/content/modules";
import { DEPARTMENT_NAV, DIRECTORATE_NAV } from "@/content/modules/nav-config";

function Breadcrumb({ mod }: { mod: ModuleDefinition }) {
  const parent = getParentModule(mod.id);
  return (
    <nav className="mb-8 flex items-center gap-1 text-sm text-slate-500">
      <Link href="/" className="hover:text-sky-600">
        Overview
      </Link>
      <ChevronRight className="h-4 w-4" />
      {parent && (
        <>
          <Link href={`/modules/${parent.id}`} className="hover:text-sky-600">
            {parent.nameDari ?? parent.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
        </>
      )}
      <span className="text-slate-900">{mod.nameDari ?? mod.name}</span>
    </nav>
  );
}

function TaskRefLinks({
  refs,
  layout = "inline",
}: {
  refs: TaskRef[];
  layout?: "inline" | "list";
}) {
  if (layout === "list") {
    return (
      <ol className="mt-1.5 list-none space-y-1 pl-0">
        {refs.map((ref) => {
          const { href, label } = resolveTaskRef(ref);
          return (
            <li key={`${ref.moduleId}-${ref.sectionId}`}>
              <Link href={href} className="font-medium text-sky-600 hover:underline">
                {label}
              </Link>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <>
      {refs.map((ref, i) => {
        const { href, label } = resolveTaskRef(ref);
        return (
          <span key={`${ref.moduleId}-${ref.sectionId}`}>
            {i > 0 && ", "}
            <Link href={href} className="text-sky-600 hover:underline">
              {label}
            </Link>
          </span>
        );
      })}
    </>
  );
}

function TaskCard({ modId, sec }: { modId: string; sec: SectionDefinition }) {
  const subtitle = [sec.nameDari, sec.summary[0]].filter(Boolean).join(" · ");
  const flow = resolveTaskFlow(modId, sec.id);
  const hasFlow = flow.precededBy.length > 0 || flow.followedBy.length > 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white transition-colors hover:border-sky-200">
      <Link
        href={`/modules/${modId}/sections/${sec.id}`}
        className="group flex items-center justify-between px-4 py-3.5"
      >
        <div className="min-w-0 pr-4">
          <p className="font-medium text-slate-900">{sec.name}</p>
          {subtitle && (
            <p className="mt-0.5 text-sm text-slate-500 line-clamp-1">{subtitle}</p>
          )}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-sky-600" />
      </Link>
      {hasFlow && (
        <div className="space-y-1 border-t border-slate-100 px-4 py-2.5 text-xs text-slate-500">
          {flow.precededBy.length > 0 && (
            <p>
              <span className="text-slate-400">Before · </span>
              <TaskRefLinks refs={flow.precededBy} />
            </p>
          )}
          {flow.followedBy.length > 0 && (
            <p>
              <span className="text-slate-400">After · </span>
              <TaskRefLinks refs={flow.followedBy} />
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function TaskGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function TaskLink({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3.5 transition-colors hover:border-sky-200 hover:bg-sky-50/30"
    >
      <div className="min-w-0 pr-4">
        <p className="font-medium text-slate-900">{title}</p>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500 line-clamp-1">{subtitle}</p>
        )}
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-sky-600" />
    </Link>
  );
}

function OprHub({ mod }: { mod: ModuleDefinition }) {
  const workflow = mod.sections[0];

  return (
    <>
      <Breadcrumb mod={mod} />
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{mod.nameDari}</h1>
      </header>

      <div className="space-y-8">
        <TaskGroup label="ریایست اجرایه">
          {DIRECTORATE_NAV.map(({ moduleId, label }) => {
            const m = getModule(moduleId);
            const href =
              m && m.sections.length === 1
                ? `/modules/${moduleId}/sections/${m.sections[0].id}`
                : `/modules/${moduleId}`;
            return (
              <TaskLink key={moduleId} href={href} title={label} subtitle={m?.purpose} />
            );
          })}
        </TaskGroup>

        <TaskGroup label="Departments">
          {DEPARTMENT_NAV.map(({ moduleId, label }) => (
            <TaskLink
              key={moduleId}
              href={`/modules/${moduleId}`}
              title={label}
              subtitle={getModule(moduleId)?.purpose}
            />
          ))}
        </TaskGroup>

        {workflow && (
          <TaskGroup label="Tasks">
            <TaskLink
              href={`/modules/opr/sections/${workflow.id}`}
              title="Purchase Flow Overview"
              subtitle={workflow.summary[0]}
            />
          </TaskGroup>
        )}
      </div>
    </>
  );
}

function DefaultHub({ mod }: { mod: ModuleDefinition }) {
  const title = mod.id === "shared" ? mod.name : (mod.nameDari ?? mod.name);

  return (
    <>
      <Breadcrumb mod={mod} />
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      </header>

      <TaskGroup label="Tasks">
        {mod.sections.length === 0 ? (
          <p className="text-sm text-slate-500">No tasks documented yet.</p>
        ) : (
          mod.sections.map((sec) => <TaskCard key={sec.id} modId={mod.id} sec={sec} />)
        )}
      </TaskGroup>
    </>
  );
}

export function ModuleHub({ mod }: { mod: ModuleDefinition }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 lg:px-8">
      {mod.id === "opr" ? <OprHub mod={mod} /> : <DefaultHub mod={mod} />}
    </div>
  );
}
