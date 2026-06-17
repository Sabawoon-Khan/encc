import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, HelpCircle } from "lucide-react";
import { getModule } from "@/content/modules";
import { getSessionRole } from "@/lib/auth";
import { getModuleQuestionsReview } from "@/lib/reviews";
import { MODULE_QUESTIONS_SECTION_ID } from "@/types/reviews";
import { StatusBadge, TierBadge } from "@/components/StatusBadge";
import { GeneralStandardsPanel, InfoTable, TemplateSection } from "@/components/TemplateSection";
import { SectionReviewProvider } from "@/components/SectionReviewContext";
import { QuestionsPanel } from "@/components/QuestionsPanel";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  if (!mod) notFound();

  const [questionsReview, sessionRole] = await Promise.all([
    getModuleQuestionsReview(moduleId),
    getSessionRole(),
  ]);

  return (
    <SectionReviewProvider
      moduleId={moduleId}
      sectionId={MODULE_QUESTIONS_SECTION_ID}
      initialReview={questionsReview}
      sessionRole={sessionRole}
    >
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <nav className="mb-6 flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-sky-600">
          Overview
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900">{mod.nameDari ?? mod.code}</span>
      </nav>

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <TierBadge tier={mod.tier} />
          <StatusBadge status={mod.status} />
          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500">
            Template v2.2
          </span>
          <span className="font-mono text-sm text-slate-400">v{mod.version}</span>
        </div>
        <p className="font-mono text-sm font-semibold text-sky-600">{mod.code}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {mod.nameDari}
        </h1>
        <p className="mt-1 text-lg text-slate-500">{mod.name}</p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
          {mod.overview}
        </p>
      </header>

      <TemplateSection number="§5" title="Module Information">
        <InfoTable
          rows={[
            { label: "Module ID", value: <code className="font-mono">{mod.code}</code> },
            { label: "Module name", value: `${mod.nameDari} (${mod.name})` },
            { label: "Tier", value: mod.tier },
            { label: "Location", value: mod.location },
            { label: "Client", value: mod.client },
            { label: "BA / Analyst", value: mod.analyst },
            { label: "Version", value: mod.version },
            { label: "Status", value: <StatusBadge status={mod.status} /> },
          ]}
        />
      </TemplateSection>

      {mod.generalStandards && mod.generalStandards.length > 0 && (
        <TemplateSection number="—" title="General Information & Standards" id="general-standards">
          <p className="mb-4 text-sm text-slate-500">
            Module-wide conventions that apply to all sub-offices ({mod.subOffices.map((o) => o.nameDari).join(", ")}). Individual sections do not repeat these rules.
          </p>
          <GeneralStandardsPanel
            standards={mod.generalStandards}
            globalRules={mod.globalBusinessRules}
          />
        </TemplateSection>
      )}

      <TemplateSection number="§6" title="Business Objective">
        {mod.problemStatement && (
          <>
            <h3 className="mb-2 text-sm font-semibold text-slate-700">
              6.1 Problem statement
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              {mod.problemStatement}
            </p>
          </>
        )}
        <h3 className="mb-2 text-sm font-semibold text-slate-700">
          What this department does
        </h3>
        <ul className="mb-4 space-y-2">
          {mod.purposes.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
              {p}
            </li>
          ))}
        </ul>
        {mod.successOutcomes && mod.successOutcomes.length > 0 && (
          <>
            <h3 className="mb-2 text-sm font-semibold text-slate-700">
              6.2 Success outcomes
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Outcome</th>
                    <th className="px-4 py-2 text-left">Measure</th>
                    <th className="px-4 py-2 text-left">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mod.successOutcomes.map((o) => (
                    <tr key={o.id}>
                      <td className="px-4 py-2 font-mono text-xs text-sky-700">
                        {o.id}
                      </td>
                      <td className="px-4 py-2 text-slate-700">{o.outcome}</td>
                      <td className="px-4 py-2 text-slate-500">{o.measure}</td>
                      <td className="px-4 py-2 font-medium text-slate-800">
                        {o.target}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </TemplateSection>

      <TemplateSection number="§7" title="Executives — Equal Approval Authority">
        <div className="grid gap-3 sm:grid-cols-2">
          {mod.executives.map((exec) => (
            <div
              key={exec.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <p className="font-semibold text-slate-900">{exec.name}</p>
              <p className="text-sm text-slate-500">{exec.nameDari}</p>
              <p className="mt-2 text-sm text-slate-600">{exec.description}</p>
            </div>
          ))}
        </div>
      </TemplateSection>

      <TemplateSection number="—" title="Sub-offices included in this module">
        <div className="grid gap-4 sm:grid-cols-2">
          {mod.subOffices.map((office) => (
            <Link
              key={office.id}
              href={`/modules/${mod.id}/sections/${office.id}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-sky-300 hover:shadow-md"
            >
              <p className="text-xl font-bold text-slate-900">{office.nameDari}</p>
              <p className="text-sm font-medium text-slate-500">{office.name}</p>
              <p className="mt-2 text-sm text-slate-600">{office.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-sky-600 group-hover:gap-2 transition-all">
                View requirements <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </TemplateSection>

      <TemplateSection number="—" title="All sections">
        <div className="space-y-3">
          {mod.sections.map((sec) => (
            <Link
              key={sec.id}
              href={`/modules/${mod.id}/sections/${sec.id}`}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-sky-200 hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {sec.nameDari ?? sec.name}
                  </h3>
                  <span className="text-sm text-slate-400">{sec.name}</span>
                  <StatusBadge status={sec.status} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{sec.description}</p>
                {sec.currentTool && (
                  <p className="mt-2 text-xs text-slate-400">
                    Current tool: {sec.currentTool}
                  </p>
                )}
                {sec.enableReview && (
                  <p className="mt-1 text-xs text-sky-600">
                    Review &amp; feedback on section page →
                  </p>
                )}
              </div>
              <ArrowRight className="ml-4 h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-sky-600" />
            </Link>
          ))}
        </div>
      </TemplateSection>

      {mod.relatedModules.length > 0 && (
        <TemplateSection number="§13" title="Related Modules">
          <div className="flex flex-wrap gap-2">
            {mod.relatedModules.map((rel) => (
              <span
                key={rel.code}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <span className="font-mono font-semibold text-sky-700">
                  {rel.code}
                </span>{" "}
                <span className="text-slate-600">{rel.name}</span>
                <span className="text-slate-400"> — {rel.relation}</span>
              </span>
            ))}
          </div>
        </TemplateSection>
      )}

      {mod.openQuestions.length > 0 && (
        <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <HelpCircle className="h-5 w-5 text-amber-600" />
            §22 Open Questions
          </h2>
          <ul className="space-y-3">
            {mod.openQuestions.map((q) => (
              <li key={q.id} className="text-sm">
                <code className="font-mono text-xs text-amber-800">{q.id}</code>
                <p className="mt-0.5 text-slate-700">{q.question}</p>
                <p className="text-xs text-slate-400">Owner: {q.owner}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <QuestionsPanel
        scopeLabel={mod.nameDari ?? mod.name}
        sessionRole={sessionRole}
      />
    </div>
    </SectionReviewProvider>
  );
}
