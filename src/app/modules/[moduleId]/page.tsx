import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, HelpCircle } from "lucide-react";
import { getModule } from "@/content/modules";
import { StatusBadge, TierBadge } from "@/components/StatusBadge";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const mod = getModule(moduleId);
  if (!mod) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
      <nav className="mb-6 flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-sky-600">
          Overview
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900">{mod.code}</span>
      </nav>

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <TierBadge tier={mod.tier} />
          <StatusBadge status={mod.status} />
          <span className="font-mono text-sm text-slate-400">v{mod.version}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {mod.name}
        </h1>
        {mod.nameDari && (
          <p className="mt-1 text-lg text-slate-500">{mod.nameDari}</p>
        )}
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
          {mod.overview}
        </p>
      </header>

      <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          What this department does
        </h2>
        <ul className="space-y-2">
          {mod.purposes.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Executive tier — equal approval authority
        </h2>
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
      </section>

      {mod.supportingOffices.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Supporting offices
          </h2>
          {mod.supportingOffices.map((office) => (
            <div
              key={office.name}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-semibold text-slate-900">
                {office.name}{" "}
                <span className="font-normal text-slate-500">
                  ({office.nameDari})
                </span>
              </p>
              <p className="mt-1 text-sm text-slate-600">{office.description}</p>
            </div>
          ))}
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Sections included in this module
        </h2>
        <div className="space-y-3">
          {mod.sections.map((sec) => (
            <Link
              key={sec.id}
              href={`/modules/${mod.id}/sections/${sec.id}`}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-sky-200 hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{sec.name}</h3>
                  {sec.nameDari && (
                    <span className="text-sm text-slate-400">{sec.nameDari}</span>
                  )}
                  <StatusBadge status={sec.status} />
                </div>
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                  {sec.description}
                </p>
                {sec.summary.length > 0 && sec.status !== "pending" && (
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {sec.summary.slice(0, 2).map((s, i) => (
                      <li key={i} className="text-xs text-slate-400">
                        • {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <ArrowRight className="ml-4 h-5 w-5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-sky-600" />
            </Link>
          ))}
        </div>
      </section>

      {mod.relatedModules.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Related modules
          </h2>
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
        </section>
      )}

      {mod.openQuestions.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
            <HelpCircle className="h-5 w-5 text-amber-600" />
            Open questions
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
    </div>
  );
}
