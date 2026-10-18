"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type {
  SchemaDiagram,
  SchemaGroup,
  SchemaTable,
  SchemaTableColumn,
} from "@/types/requirements";

const HEADER: Record<SchemaGroup["color"], string> = {
  blue: "bg-sky-200 text-sky-950",
  purple: "bg-violet-200 text-violet-950",
  green: "bg-emerald-200 text-emerald-950",
  yellow: "bg-amber-200 text-amber-950",
  brown: "bg-orange-200 text-orange-950",
  rose: "bg-rose-200 text-rose-950",
};

const RING: Record<SchemaGroup["color"], string> = {
  blue: "border-sky-300",
  purple: "border-violet-300",
  green: "border-emerald-300",
  yellow: "border-amber-300",
  brown: "border-orange-300",
  rose: "border-rose-300",
};

function scrollToTable(tableId: string) {
  const el = document.querySelector<HTMLElement>(`[data-er-table="${tableId}"]`);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("ring-2", "ring-sky-500", "ring-offset-2");
  window.setTimeout(() => {
    el.classList.remove("ring-2", "ring-sky-500", "ring-offset-2");
  }, 1600);
  return true;
}

function FkBadge({ col }: { col: SchemaTableColumn }) {
  if (!col.fkTo) return null;

  const hash = `#${col.fkTo}`;
  const href = col.fkHref ?? hash;

  const onClick = (e: React.MouseEvent) => {
    if (!col.fkHref || col.fkHref.startsWith("#")) {
      e.preventDefault();
      window.history.replaceState(null, "", hash);
      if (!scrollToTable(col.fkTo!)) {
        window.location.hash = col.fkTo!;
      }
      return;
    }
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      title={`→ ${col.fkTo}`}
      className="font-semibold uppercase text-sky-600 underline-offset-2 hover:text-sky-800 hover:underline"
    >
      fk
    </Link>
  );
}

function TableInfoButton({ info }: { info: string }) {
  const [open, setOpen] = useState(false);
  const tipId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="Table summary"
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="rounded-full p-0.5 text-current/60 transition-colors hover:bg-black/10 hover:text-current"
      >
        <Info className="h-3.5 w-3.5" strokeWidth={2.25} />
      </button>
      {open ? (
        <div
          id={tipId}
          role="tooltip"
          className="absolute left-0 top-full z-30 mt-1.5 w-56 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-left text-[11px] font-normal leading-snug text-slate-600 shadow-lg"
        >
          {info}
        </div>
      ) : null}
    </div>
  );
}

function enumValues(col: SchemaTableColumn): string[] {
  if (col.enums?.length) return col.enums;
  const raw = col.type ?? "";
  if (raw.includes("|")) {
    return raw.split("|").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function EnumSelect({ values }: { values: string[] }) {
  if (values.length === 0) {
    return (
      <span className="font-mono text-[11px] text-slate-400" title="Add enums: […] on this column">
        enum
      </span>
    );
  }
  return (
    <select
      aria-label="Enum options"
      defaultValue={values[0]}
      className="max-w-[7.5rem] cursor-pointer rounded border border-slate-200 bg-white py-0.5 pl-1 pr-0 text-[10px] font-mono leading-tight text-slate-700 shadow-sm"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {values.map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  );
}

function ColumnRow({ col }: { col: SchemaTableColumn }) {
  const values = enumValues(col);
  const isEnum = col.type === "enum" || values.length > 0 || !!col.enums;
  const plain = col.type ?? (col.fkTo ? "ref" : "");

  return (
    <tr className="border-t border-slate-100">
      <td className="w-9 border-r border-slate-100 bg-slate-50 px-1 py-1 text-center text-[10px] tracking-wide text-slate-400">
        {col.pk ? (
          <span className="font-semibold uppercase">PK</span>
        ) : col.fkTo ? (
          <FkBadge col={col} />
        ) : null}
      </td>
      <td className="px-2.5 py-1 font-mono text-[12px] text-slate-800">
        {col.name}
        {col.required ? <span className="text-rose-500">*</span> : null}
      </td>
      <td className="px-1.5 py-1 text-right align-middle">
        {isEnum ? (
          <EnumSelect values={values} />
        ) : (
          <span className="font-mono text-[11px] text-slate-400">{plain}</span>
        )}
      </td>
    </tr>
  );
}

function TableCard({
  id,
  name,
  info,
  columns,
  color,
  highlighted,
}: {
  id: string;
  name: string;
  info?: string;
  columns: SchemaTableColumn[];
  color: SchemaGroup["color"];
  highlighted: boolean;
}) {
  return (
    <div
      id={id}
      data-er-table={id}
      className={`inline-block min-w-[15.5rem] overflow-visible rounded-md border bg-white shadow-sm transition-shadow ${RING[color]} ${
        highlighted ? "ring-2 ring-sky-500 ring-offset-2" : ""
      }`}
    >
      <div
        className={`flex items-center justify-between gap-2 px-3 py-1.5 text-sm font-bold tracking-tight ${HEADER[color]}`}
      >
        <span className="min-w-0 truncate">{name}</span>
        {info ? <TableInfoButton info={info} /> : null}
      </div>
      <table className="w-full border-collapse overflow-hidden text-left text-[13px]">
        <tbody>
          {columns.map((col) => (
            <ColumnRow key={col.name} col={col} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableTree({
  table,
  color,
  highlightId,
}: {
  table: SchemaTable;
  color: SchemaGroup["color"];
  highlightId: string | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <TableCard
        id={table.id}
        name={table.name}
        info={table.info}
        columns={table.columns}
        color={color}
        highlighted={highlightId === table.id}
      />
      {table.children && table.children.length > 0 ? (
        <div className="ml-5 flex flex-col gap-3 border-l-2 border-slate-200 pl-4">
          {table.children.map((child) => (
            <TableTree
              key={child.id}
              table={child}
              color={color}
              highlightId={highlightId}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CleanErDiagram({ diagram }: { diagram: SchemaDiagram }) {
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      window.setTimeout(() => {
        if (scrollToTable(id)) setHighlightId(id);
      }, 80);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [diagram]);

  return (
    <div className="flex flex-wrap items-start gap-8">
      {diagram.groups.map((group) =>
        group.tables.map((table) => (
          <TableTree
            key={table.id}
            table={table}
            color={group.color}
            highlightId={highlightId}
          />
        )),
      )}
    </div>
  );
}
