import type {
  BusinessRule,
  RequirementField,
  RoleDefinition,
  StatusTransition,
  Workflow,
} from "@/types/requirements";

export function FieldTable({ fields }: { fields: RequirementField[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Field
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Business meaning
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Type
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Req?
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Example / Rules
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {fields.map((f) => (
            <tr key={f.name} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 align-top">
                <code className="rounded bg-sky-50 px-1.5 py-0.5 font-mono text-xs text-sky-800">
                  {f.name}
                </code>
                <p className="mt-1 text-xs font-semibold text-slate-800">
                  {f.label}
                </p>
                {f.labelDari && (
                  <p className="text-xs text-slate-400">{f.labelDari}</p>
                )}
                {f.verify && (
                  <span className="mt-1 inline-block text-xs font-semibold text-amber-600">
                    Verify at workshop
                  </span>
                )}
              </td>
              <td className="max-w-[200px] px-4 py-3 align-top text-slate-600">
                {f.meaning}
              </td>
              <td className="px-4 py-3 align-top">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {f.type}
                </span>
              </td>
              <td className="px-4 py-3 align-top text-slate-600">
                {typeof f.required === "boolean"
                  ? f.required
                    ? "Yes"
                    : "No"
                  : f.required}
              </td>
              <td className="px-4 py-3 align-top font-mono text-xs text-slate-500">
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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <code className="text-xs font-bold text-sky-700">{workflow.id}</code>
        <h4 className="mt-0.5 font-semibold text-slate-900">{workflow.name}</h4>
      </div>
      <div className="p-5">
        <dl className="mb-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium uppercase text-slate-400">
              Trigger
            </dt>
            <dd className="mt-0.5 text-slate-700">{workflow.trigger}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-slate-400">
              Start actor
            </dt>
            <dd className="mt-0.5 text-slate-700">{workflow.startActor}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-slate-400">
              End state
            </dt>
            <dd className="mt-0.5 text-slate-700">{workflow.endState}</dd>
          </div>
          {workflow.currentTool && (
            <div>
              <dt className="text-xs font-medium uppercase text-slate-400">
                Current tool
              </dt>
              <dd className="mt-0.5 font-medium text-slate-800">
                {workflow.currentTool}
              </dd>
            </div>
          )}
        </dl>
        {workflow.flowDiagram && (
          <div className="mb-4 rounded-lg bg-slate-900 px-4 py-3 font-mono text-xs leading-relaxed text-sky-100">
            {workflow.flowDiagram}
          </div>
        )}
        {workflow.steps && workflow.steps.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-3 py-2 font-semibold uppercase">Step</th>
                  <th className="px-3 py-2 font-semibold uppercase">Actor</th>
                  <th className="px-3 py-2 font-semibold uppercase">Action</th>
                  <th className="px-3 py-2 font-semibold uppercase">Input</th>
                  <th className="px-3 py-2 font-semibold uppercase">Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workflow.steps.map((s) => (
                  <tr key={s.step} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 font-bold text-sky-700">
                      {s.step}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700">{s.actor}</td>
                    <td className="px-3 py-2.5 text-slate-800">{s.action}</td>
                    <td className="px-3 py-2.5 text-slate-500">{s.input}</td>
                    <td className="px-3 py-2.5 text-slate-500">{s.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function RulesTable({ rules }: { rules: BusinessRule[] }) {
  if (rules.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              BR-ID
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Rule
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Trigger
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Response
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Severity
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rules.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-3 font-mono text-xs font-semibold text-sky-700">
                {r.id}
              </td>
              <td className="px-4 py-3 text-slate-700">{r.rule}</td>
              <td className="px-4 py-3 text-slate-500">{r.trigger}</td>
              <td className="px-4 py-3 text-slate-500">{r.response}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
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

export function RolesTable({ roles }: { roles: RoleDefinition[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Role
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Location
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Main actions
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Approval?
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {roles.map((r) => (
            <tr key={r.role}>
              <td className="px-4 py-3 font-medium text-slate-800">{r.role}</td>
              <td className="px-4 py-3 text-slate-500">{r.location}</td>
              <td className="px-4 py-3 text-slate-600">{r.mainActions}</td>
              <td className="px-4 py-3">{r.approval ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LifecycleTable({
  transitions,
}: {
  transitions: StatusTransition[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Entity
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              From
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Action
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              To
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">
              Actor
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transitions.map((t, i) => (
            <tr key={i} className="hover:bg-slate-50/50">
              <td className="px-4 py-3 text-slate-700">{t.entity}</td>
              <td className="px-4 py-3">
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                  {t.from}
                </code>
              </td>
              <td className="px-4 py-3 text-slate-600">{t.action}</td>
              <td className="px-4 py-3">
                <code className="rounded bg-sky-50 px-1.5 py-0.5 font-mono text-xs text-sky-800">
                  {t.to}
                </code>
              </td>
              <td className="px-4 py-3 text-slate-500">{t.actor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
