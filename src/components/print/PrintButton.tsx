"use client";

import Link from "next/link";
import { Printer } from "lucide-react";

type PrintButtonProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

export function PrintButton({ href, label, variant = "secondary" }: PrintButtonProps) {
  const className =
    variant === "primary"
      ? "inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      : "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-sky-200 hover:bg-sky-50";

  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className={className}>
      <Printer className="h-4 w-4" />
      {label}
    </Link>
  );
}
