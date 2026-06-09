import type {
  BusinessRule,
  RequirementField,
  Workflow,
} from "@/types/requirements";

export function FieldTable({ fields }: { fields: RequirementField[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Field
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Meaning
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Type
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Required
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Example
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {fields.map((f) => (
            <tr key={f.name} className="hover:bg-slate-50/80">
              <td className="px-4 py-3">
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-sky-800">
                  {f.name}
                </code>
                <p className="mt-0.5 text-xs font-medium text-slate-700">
                  {f.label}
                </p>
                {f.verify && (
                  <span className="mt-1 inline-block text-xs font-semibold text-amber-600">
                    Verify at workshop
                  </span>
                )}
              </td>
              <td className="max-w-xs px-4 py-3 text-slate-600">{f.meaning}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {f.type}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {typeof f.required === "boolean"
                  ? f.required
                    ? "Yes"
                    : "No"
                  : f.required}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-500">
                {f.example}
                {f.rules && (
                  <p className="mt-1 font-sans text-xs text-slate-400">
                    {f.rules}
                  </p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <code className="text-xs font-semibold text-sky-700">{workflow.id}</code>
          <h4 className="mt-0.5 font-semibold text-slate-900">{workflow.name}</h4>
        </div>
      </div>
      <dl className="mb-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-400">Trigger</dt>
          <dd className="text-slate-700">{workflow.trigger}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Start actor</dt>
          <dd className="text-slate-700">{workflow.startActor}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">End state</dt>
          <dd className="text-slate-700">{workflow.endState}</dd>
        </div>
        {workflow.currentTool && (
          <div>
            <dt className="text-xs text-slate-400">Current tool</dt>
            <dd className="text-slate-700">{workflow.currentTool}</dd>
          </div>
        )}
      </dl>
      {workflow.flowDiagram && (
        <div className="mb-4 rounded-lg bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-600">
          {workflow.flowDiagram}
        </div>
      )}
      {workflow.steps && workflow.steps.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400">
                <th className="py-2 pr-3">#</th>
                <th className="py-2 pr-3">Actor</th>
                <th className="py-2 pr-3">Action</th>
                <th className="py-2 pr-3">Output</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workflow.steps.map((s) => (
                <tr key={s.step}>
                  <td className="py-2 pr-3 font-medium">{s.step}</td>
                  <td className="py-2 pr-3">{s.actor}</td>
                  <td className="py-2 pr-3">{s.action}</td>
                  <td className="py-2 pr-3 text-slate-500">{s.output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function RulesTable({ rules }: { rules: BusinessRule[] }) {
  if (rules.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              ID
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Rule
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Trigger
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Severity
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rules.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3 font-mono text-xs text-sky-700">
                {r.id}
              </td>
              <td className="px-4 py-3 text-slate-700">{r.rule}</td>
              <td className="px-4 py-3 text-slate-500">{r.trigger}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.severity === "Critical"
                      ? "bg-red-50 text-red-700"
                      : r.severity === "High"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {r.severity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
