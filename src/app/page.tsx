import Link from "next/link";
import { BookOpen, FileText, Users } from "lucide-react";
import { modules } from "@/content/modules";
import { glossary } from "@/content/glossary";
import { ModuleCard } from "@/components/ModuleCard";

export default function HomePage() {
  const totalSections = modules.reduce((n, m) => n + m.sections.length, 0);
  const documented = modules.reduce(
    (n, m) => n + m.sections.filter((s) => s.status !== "pending").length,
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
          Shams Hilal Template v2.2
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          ENCC ERP Requirements Hub
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          Living documentation for National Coal Corporation ERP modules. Browse
          departments, sections, fields, workflows, and upload evidence for
          developers and analysts.
        </p>
      </header>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <FileText className="mb-2 h-5 w-5 text-sky-600" />
          <p className="text-2xl font-bold text-slate-900">{modules.length}</p>
          <p className="text-sm text-slate-500">Modules</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <Users className="mb-2 h-5 w-5 text-sky-600" />
          <p className="text-2xl font-bold text-slate-900">
            {documented}/{totalSections}
          </p>
          <p className="text-sm text-slate-500">Sections documented</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <BookOpen className="mb-2 h-5 w-5 text-sky-600" />
          <p className="text-2xl font-bold text-slate-900">{glossary.length}</p>
          <p className="text-sm text-slate-500">
            <Link href="/glossary" className="text-sky-600 hover:underline">
              Glossary terms
            </Link>
          </p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Modules</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {modules.map((mod) => (
            <ModuleCard key={mod.id} module={mod} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-sky-100 bg-sky-50/50 p-6">
        <h2 className="text-lg font-bold text-slate-900">For developers</h2>
        <p className="mt-2 text-sm text-slate-600">
          Requirements live in{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">
            src/content/modules/
          </code>
          . Each module has an index and section files (e.g.{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">
            opr/archive.ts
          </code>
          ). Add new modules to{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">
            src/content/modules/index.ts
          </code>
          . Shared terminology is in{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">
            src/content/glossary.ts
          </code>
          .
        </p>
      </section>
    </div>
  );
}
