import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import type { ModuleDefinition, SectionDefinition, TaskRef } from "@/types/requirements";
import type { SectionReview } from "@/types/reviews";
import { resolveTaskFlow, resolveTaskRef } from "@/content/modules";
import { StatusBadge } from "@/components/StatusBadge";
import { SectionReviewBar } from "@/components/SectionReviewBar";
import { SectionReviewProvider } from "@/components/SectionReviewContext";
import { SectionTOC } from "@/components/SectionTOC";
import {
  buildSectionTocItems,
  sectionTocFlagsFromSection,
} from "@/lib/sectionToc";
import { CurrentToolBadge } from "@/components/TemplateSection";

function TaskRefLinks({
  refs,
  layout = "list",
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
            <Link href={href} className="font-medium text-sky-600 hover:underline">
              {label}
            </Link>
          </span>
        );
      })}
    </>
  );
}

function TaskFlowLinks({
  moduleId,
  section,
}: {
  moduleId: string;
  section: SectionDefinition;
}) {
  const flow = resolveTaskFlow(moduleId, section.id);
  const hasBefore = flow.precededBy.length > 0;
  const hasAfter = flow.followedBy.length > 0;
  if (!hasBefore && !hasAfter) return null;

  return (
    <div className="mb-6 space-y-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
      {hasBefore && (
        <div className="text-slate-600">
          <span className="font-medium text-slate-500">Before</span>
          <TaskRefLinks refs={flow.precededBy} layout="list" />
        </div>
      )}
      {hasAfter && (
        <div className="text-slate-600">
          <span className="font-medium text-slate-500">After</span>
          <TaskRefLinks refs={flow.followedBy} layout="list" />
        </div>
      )}
    </div>
  );
}

interface SectionPageShellProps {
  mod: ModuleDefinition;
  section: SectionDefinition;
  review?: SectionReview;
  sessionRole: "client" | "admin" | null;
  children: ReactNode;
}

export function SectionPageShell({
  mod,
  section,
  review,
  sessionRole,
  children,
}: SectionPageShellProps) {
  const tocItems = buildSectionTocItems(sectionTocFlagsFromSection(section));
  const reviewEnabled = section.enableReview && !!review;

  const body = (
    <>
      {reviewEnabled && <SectionReviewBar initialReview={review} />}

      {mod.generalStandards && mod.generalStandards.length > 0 && (
        <p className="mb-4 text-sm text-slate-500">
          Hijri dates and module-wide rules are in{" "}
          <Link
            href={`/modules/${mod.id}#general-standards`}
            className="text-sky-600 hover:underline"
          >
            General Information
          </Link>
          .
        </p>
      )}

      {section.currentTool && <CurrentToolBadge tool={section.currentTool} />}

      <div className="grid gap-8 lg:grid-cols-[160px_1fr]">
        <SectionTOC items={tocItems} />
        <div className="min-w-0 space-y-8">{children}</div>
      </div>
    </>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-sky-600">
          Overview
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/modules/${mod.id}`} className="hover:text-sky-600">
          {mod.nameDari ?? mod.code}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-800">{section.nameDari ?? section.name}</span>
      </nav>

      <header className="mb-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={section.status} />
          <span className="text-xs text-slate-400">
            {mod.code}/{section.id} · v{mod.version}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {section.nameDari ?? section.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{section.name}</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {section.description}
        </p>
      </header>

      <TaskFlowLinks moduleId={mod.id} section={section} />

      {reviewEnabled ? (
        <SectionReviewProvider
          moduleId={mod.id}
          sectionId={section.id}
          initialReview={review}
          sessionRole={sessionRole}
        >
          {body}
        </SectionReviewProvider>
      ) : (
        body
      )}
    </div>
  );
}
