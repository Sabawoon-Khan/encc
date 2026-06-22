"use client";

import { useMemo, useState } from "react";
import { currentSolarHijriYear, maliYearOptions } from "@/lib/maliYear";

const CURRENT_MALI_YEAR = currentSolarHijriYear();
const MALI_YEARS = maliYearOptions();

type SubAccount = { id: string; code: string; name: string };
type GeneralAccount = { id: string; code: string; name: string; subAccounts: SubAccount[] };

const SAMPLE_ACCOUNTS: GeneralAccount[] = [
  {
    id: "acc-bank",
    code: "1100",
    name: "Bank Accounts",
    subAccounts: [
      { id: "sub-b1", code: "1100-01", name: "Da Afghanistan Bank — Branch 1" },
      { id: "sub-b2", code: "1100-02", name: "Da Afghanistan Bank — Branch 2" },
    ],
  },
  {
    id: "acc-cash",
    code: "1200",
    name: "Cash",
    subAccounts: [],
  },
  {
    id: "acc-pay",
    code: "2100",
    name: "Accounts Payable",
    subAccounts: [{ id: "sub-s1", code: "2100-01", name: "Supplier — Coal Transport" }],
  },
];

const SAMPLE_VOUCHERS = [
  {
    unique_id: "SM-0042/1405",
    file_id: "127/1405",
    date: "1405/02/19",
    mali_year: "1405",
    description: "Transfer from cash to bank — Branch 1",
    created_by: "Ahmad — Mali",
    total: 500000,
    status: "posted",
    lines: [
      { account: "1100 Bank", sub: "1100-01 Branch 1", dr: 500000, cr: 0, details: "Deposit" },
      { account: "1200 Cash", sub: "—", dr: 0, cr: 500000, details: "Cash out" },
    ],
  },
  {
    unique_id: "SM-0041/1405",
    file_id: "",
    date: "1405/02/18",
    mali_year: "1405",
    description: "Supplier payment — coal transport",
    created_by: "Fatima — Mali",
    total: 1200000,
    status: "posted",
    lines: [
      { account: "2100 Payable", sub: "2100-01 Supplier", dr: 1200000, cr: 0, details: "Invoice #88" },
      { account: "1100 Bank", sub: "1100-02 Branch 2", dr: 0, cr: 1200000, details: "Wire transfer" },
    ],
  },
  {
    unique_id: "SM-0039/1404",
    file_id: "98/1404",
    date: "1404/12/05",
    mali_year: "1404",
    description: "Petty cash replenishment",
    created_by: "Ahmad — Mali",
    total: 50000,
    status: "posted",
    lines: [
      { account: "1200 Cash", sub: "—", dr: 50000, cr: 0, details: "Petty cash" },
      { account: "1100 Bank", sub: "1100-01 Branch 1", dr: 0, cr: 50000, details: "Withdrawal" },
    ],
  },
];

type JournalLine = {
  id: string;
  accountId: string;
  subAccountId: string;
  debit: string;
  credit: string;
  details: string;
};

function emptyLine(): JournalLine {
  return {
    id: crypto.randomUUID(),
    accountId: "",
    subAccountId: "",
    debit: "",
    credit: "",
    details: "",
  };
}

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export function SandaMaliDemo() {
  const [tab, setTab] = useState<"form" | "find">("form");

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Interactive sample only</strong> — demonstrates the سند مالی entry form and finder
        page. Nothing is saved; account data is pre-filled for preview.
      </div>

      <div className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setTab("form")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "form"
              ? "bg-white text-sky-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          New سند مالی (sample form)
        </button>
        <button
          type="button"
          onClick={() => setTab("find")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "find"
              ? "bg-white text-sky-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Find سند مالی (sample finder)
        </button>
      </div>

      {tab === "form" ? <SandaFormSample /> : <SandaFinderSample />}
    </div>
  );
}

function SandaFormSample() {
  const [fileId, setFileId] = useState("");
  const [date, setDate] = useState("1405/02/19");
  const [maliYear, setMaliYear] = useState(String(CURRENT_MALI_YEAR));
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<JournalLine[]>([emptyLine(), emptyLine()]);
  const [posted, setPosted] = useState(false);

  const totals = useMemo(() => {
    let dr = 0;
    let cr = 0;
    for (const line of lines) {
      dr += Number(line.debit) || 0;
      cr += Number(line.credit) || 0;
    }
    return { dr, cr, balanced: dr > 0 && dr === cr };
  }, [lines]);

  function updateLine(id: string, patch: Partial<JournalLine>) {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const next = { ...l, ...patch };
        if (patch.accountId !== undefined) next.subAccountId = "";
        return next;
      }),
    );
  }

  function addLine() {
    setLines((prev) => [...prev, emptyLine()]);
  }

  function removeLine(id: string) {
    setLines((prev) => (prev.length <= 2 ? prev : prev.filter((l) => l.id !== id)));
  }

  function handlePost() {
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-semibold text-slate-900">سند مالی — New Voucher</h3>
          <p className="text-xs text-slate-500">System no. SM-0043/1405 (preview)</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Draft — not saved
        </span>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            Paper file no. <span className="font-normal text-slate-400">(optional)</span>
          </span>
          <input
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
            placeholder="127/1405"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Date / تاریخ</span>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Mali year / سال مالی</span>
          <select
            value={maliYear}
            onChange={(e) => setMaliYear(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            {MALI_YEARS.map((y) => (
              <option key={y} value={String(y)}>
                {y}
                {y === CURRENT_MALI_YEAR ? " (current)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2 lg:col-span-4">
          <span className="mb-1 block font-medium text-slate-700">Description / توضیحات</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Summary of this voucher"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />
        </label>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800">Journal lines</h4>
        <button
          type="button"
          onClick={addLine}
          className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100"
        >
          + Add line
        </button>
      </div>

      <div className="space-y-3">
        {lines.map((line, idx) => {
          const account = SAMPLE_ACCOUNTS.find((a) => a.id === line.accountId);
          const hasSubs = (account?.subAccounts.length ?? 0) > 0;
          return (
            <div
              key={line.id}
              className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-3 sm:grid-cols-12"
            >
              <span className="self-center text-xs font-medium text-slate-400 sm:col-span-1">
                {idx + 1}
              </span>
              <label className="text-xs sm:col-span-3">
                <span className="mb-1 block text-slate-500">General account</span>
                <select
                  value={line.accountId}
                  onChange={(e) => updateLine(line.id, { accountId: e.target.value })}
                  className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-sm"
                >
                  <option value="">Select…</option>
                  {SAMPLE_ACCOUNTS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code} — {a.name}
                    </option>
                  ))}
                </select>
              </label>
              {hasSubs ? (
                <label className="text-xs sm:col-span-3">
                  <span className="mb-1 block text-slate-500">Sub account</span>
                  <select
                    value={line.subAccountId}
                    onChange={(e) => updateLine(line.id, { subAccountId: e.target.value })}
                    className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-sm"
                  >
                    <option value="">Select…</option>
                    {account!.subAccounts.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} — {s.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <div className="flex items-end text-xs text-slate-400 sm:col-span-3">
                  No sub accounts — general account only
                </div>
              )}
              <label className="text-xs sm:col-span-1">
                <span className="mb-1 block text-slate-500">DR</span>
                <input
                  type="number"
                  min="0"
                  value={line.debit}
                  onChange={(e) =>
                    updateLine(line.id, { debit: e.target.value, credit: e.target.value ? "" : line.credit })
                  }
                  className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-sm"
                />
              </label>
              <label className="text-xs sm:col-span-1">
                <span className="mb-1 block text-slate-500">CR</span>
                <input
                  type="number"
                  min="0"
                  value={line.credit}
                  onChange={(e) =>
                    updateLine(line.id, { credit: e.target.value, debit: e.target.value ? "" : line.debit })
                  }
                  className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-sm"
                />
              </label>
              <label className="text-xs sm:col-span-2">
                <span className="mb-1 block text-slate-500">Details</span>
                <input
                  value={line.details}
                  onChange={(e) => updateLine(line.id, { details: e.target.value })}
                  className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-sm"
                />
              </label>
              <button
                type="button"
                onClick={() => removeLine(line.id)}
                disabled={lines.length <= 2}
                className="self-center text-xs text-slate-400 hover:text-red-600 disabled:opacity-30 sm:col-span-1"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div
        className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm ${
          totals.balanced ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
        }`}
      >
        <span>
          Total DR: <strong>{fmt(totals.dr)}</strong> — Total CR: <strong>{fmt(totals.cr)}</strong>
        </span>
        <span className="font-medium">
          {totals.balanced ? "Balanced ✓" : `Difference: ${fmt(Math.abs(totals.dr - totals.cr))}`}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 hover:border-sky-300 hover:bg-sky-50/50">
          <span>📎 Attach voucher scan (sample)</span>
          <input type="file" className="hidden" disabled />
        </label>
        <button
          type="button"
          onClick={handlePost}
          disabled={!totals.balanced}
          className="ml-auto rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Post voucher
        </button>
      </div>

      {posted && (
        <p className="mt-3 text-center text-sm font-medium text-amber-700">
          Preview only — voucher was not saved.
        </p>
      )}
    </div>
  );
}

function SandaFinderSample() {
  const [uniqueId, setUniqueId] = useState("");
  const [fileId, setFileId] = useState("");
  const [maliYear, setMaliYear] = useState("");
  const [accountFilter, setAccountFilter] = useState("");
  const [subFilter, setSubFilter] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<(typeof SAMPLE_VOUCHERS)[0] | null>(null);

  const account = SAMPLE_ACCOUNTS.find((a) => a.id === accountFilter);
  const filtered = SAMPLE_VOUCHERS.filter((v) => {
    if (uniqueId && !v.unique_id.toLowerCase().includes(uniqueId.toLowerCase())) return false;
    if (fileId && !v.file_id.includes(fileId)) return false;
    if (maliYear && v.mali_year !== maliYear) return false;
    if (description && !v.description.toLowerCase().includes(description.toLowerCase())) return false;
    if (accountFilter || subFilter) {
      const acctCode = account?.code ?? "";
      const subCode = account?.subAccounts.find((s) => s.id === subFilter)?.code ?? "";
      const hit = v.lines.some((l) => {
        if (accountFilter && !l.account.startsWith(acctCode)) return false;
        if (subFilter && !l.sub.startsWith(subCode)) return false;
        return true;
      });
      if (!hit) return false;
    }
    return true;
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-1 font-semibold text-slate-900">Find سند مالی</h3>
        <p className="mb-4 text-xs text-slate-500">
          Detailed search page — filter by account, sub account, year, and more. Click a result to
          view full voucher.
        </p>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs">
            <span className="mb-1 block font-medium text-slate-600">System no.</span>
            <input
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              placeholder="SM-0042"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block font-medium text-slate-600">Paper file no.</span>
            <input
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              placeholder="127/1405"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block font-medium text-slate-600">Mali year</span>
            <select
              value={maliYear}
              onChange={(e) => setMaliYear(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">All years</option>
              {MALI_YEARS.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            <span className="mb-1 block font-medium text-slate-600">Description contains</span>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs">
            <span className="mb-1 block font-medium text-slate-600">General account</span>
            <select
              value={accountFilter}
              onChange={(e) => {
                setAccountFilter(e.target.value);
                setSubFilter("");
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">All accounts</option>
              {SAMPLE_ACCOUNTS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} — {a.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            <span className="mb-1 block font-medium text-slate-600">Sub account</span>
            <select
              value={subFilter}
              onChange={(e) => setSubFilter(e.target.value)}
              disabled={!accountFilter || !account?.subAccounts.length}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
            >
              <option value="">All sub accounts</option>
              {account?.subAccounts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mb-2 text-xs font-medium text-slate-500">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </p>
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {filtered.map((v) => (
            <button
              key={v.unique_id}
              type="button"
              onClick={() => setSelected(v)}
              className={`w-full rounded-lg border px-3 py-3 text-left text-sm transition hover:border-sky-300 hover:bg-sky-50/50 ${
                selected?.unique_id === v.unique_id
                  ? "border-sky-400 bg-sky-50"
                  : "border-slate-100 bg-slate-50/30"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-slate-900">{v.unique_id}</span>
                <span className="text-xs text-slate-500">{v.date}</span>
              </div>
              <p className="mt-1 text-xs text-slate-600">{v.description}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
                {v.file_id && <span>File: {v.file_id}</span>}
                <span>Year: {v.mali_year}</span>
                <span>{fmt(v.total)} AFN</span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">No vouchers match filters.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-slate-900">Voucher detail</h3>
        {selected ? (
          <div className="space-y-4 text-sm">
            <dl className="grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">System no.</dt>
                <dd className="font-medium">{selected.unique_id}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Paper file</dt>
                <dd className="font-medium">{selected.file_id || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Date</dt>
                <dd>{selected.date}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Mali year</dt>
                <dd>{selected.mali_year}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-slate-500">Description</dt>
                <dd>{selected.description}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Created by</dt>
                <dd>{selected.created_by}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Status</dt>
                <dd className="capitalize">{selected.status}</dd>
              </div>
            </dl>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="py-2 pr-2">Account</th>
                  <th className="py-2 pr-2">Sub</th>
                  <th className="py-2 pr-2 text-right">DR</th>
                  <th className="py-2 text-right">CR</th>
                </tr>
              </thead>
              <tbody>
                {selected.lines.map((l, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="py-2 pr-2">{l.account}</td>
                    <td className="py-2 pr-2 text-slate-500">{l.sub}</td>
                    <td className="py-2 pr-2 text-right font-mono">
                      {l.dr ? fmt(l.dr) : "—"}
                    </td>
                    <td className="py-2 text-right font-mono">{l.cr ? fmt(l.cr) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Print voucher (sample)
            </button>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-slate-400">
            Select a voucher from the list to view full details and lines.
          </p>
        )}
      </div>
    </div>
  );
}
