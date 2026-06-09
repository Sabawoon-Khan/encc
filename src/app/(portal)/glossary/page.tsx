import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { glossary } from "@/content/glossary";

export default function GlossaryPage() {
  const byModule = glossary.reduce<Record<string, typeof glossary>>(
    (acc, term) => {
      for (const mod of term.usedIn) {
        if (!acc[mod]) acc[mod] = [];
        acc[mod].push(term);
      }
      return acc;
    },
    {}
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10">
      <nav className="mb-6 flex items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-sky-600">
          Overview
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-slate-900">Glossary</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Shared terminology
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Terms used across ENCC ERP modules. Edit{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
            src/content/glossary.ts
          </code>{" "}
          to add or update definitions.
        </p>
      </header>

      {Object.entries(byModule).map(([mod, terms]) => (
        <section key={mod} className="mb-10">
          <h2 className="mb-4 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Used in {mod}
          </h2>
          <div className="space-y-4">
            {terms.map((term) => (
              <article
                key={term.id}
                id={term.id}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {term.term}
                  </h3>
                  {term.termDari && (
                    <span className="text-sm text-slate-500">
                      {term.termDari}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {term.definition}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
