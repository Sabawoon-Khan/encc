import type { DocStatus } from "@/types/requirements";

const statusStyles: Record<
  DocStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-amber-50 text-amber-800 ring-amber-200",
  },
  in_review: {
    label: "In Review",
    className: "bg-sky-50 text-sky-800 ring-sky-200",
  },
  verified: {
    label: "Verified",
    className: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  },
  pending: {
    label: "Pending",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

export function StatusBadge({ status }: { status: DocStatus }) {
  const { label, className } = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {label}
    </span>
  );
}

export function TierBadge({ tier }: { tier: number }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
      Tier {tier}
    </span>
  );
}
