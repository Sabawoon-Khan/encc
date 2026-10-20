"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Table2 } from "lucide-react";
import { modules } from "@/content/modules";
import { BRAND } from "@/content/brand";
import { DEPARTMENT_NAV, DIRECTORATE_NAV } from "@/content/modules/nav-config";

function moduleHref(moduleId: string) {
  const mod = modules.find((m) => m.id === moduleId);
  if (mod?.sections.length === 1) {
    return `/modules/${moduleId}/sections/${mod.sections[0].id}`;
  }
  return `/modules/${moduleId}`;
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-md px-2.5 py-1.5 text-sm transition-colors ${
        active
          ? "bg-sky-50 font-medium text-sky-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );
}

function SectionLabel({
  children,
  href,
  active,
}: {
  children: string;
  href?: string;
  active?: boolean;
}) {
  const className =
    "mb-1 mt-5 block px-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 first:mt-0";

  if (href) {
    return (
      <Link
        href={href}
        className={`${className} ${active ? "text-sky-600" : "hover:text-slate-600"}`}
      >
        {children}
      </Link>
    );
  }

  return <p className={className}>{children}</p>;
}

export function Sidebar() {
  const pathname = usePathname();
  const sharedHref = moduleHref("shared");

  return (
    <aside className="flex h-full w-52 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-3 py-3.5">
        <p className="text-sm font-bold tracking-tight text-slate-900">{BRAND.productShort}</p>
        <p className="mt-0.5 text-[10px] leading-snug text-slate-400">
          {BRAND.clientShort} · {BRAND.designPartner}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/"
              className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                isActive(pathname, "/")
                  ? "bg-sky-50 font-medium text-sky-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Home className="h-3.5 w-3.5 shrink-0 opacity-50" />
              Overview
            </Link>
          </li>
          <li>
            <Link
              href="/glossary"
              className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                isActive(pathname, "/glossary")
                  ? "bg-sky-50 font-medium text-sky-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 shrink-0 opacity-50" />
              Glossary
            </Link>
          </li>
          <li>
            <Link
              href={sharedHref}
              className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                pathname.startsWith("/modules/shared")
                  ? "bg-sky-50 font-medium text-sky-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Table2 className="h-3.5 w-3.5 shrink-0 opacity-50" />
              General Tables
            </Link>
          </li>
        </ul>

        <SectionLabel href="/modules/opr" active={pathname.startsWith("/modules/opr")}>
          ریاست اجرایه
        </SectionLabel>
        <ul className="space-y-0.5">
          {DIRECTORATE_NAV.map(({ moduleId, label }) => (
            <li key={moduleId}>
              <NavLink
                href={moduleHref(moduleId)}
                label={label}
                active={pathname.startsWith(`/modules/${moduleId}`)}
              />
            </li>
          ))}
        </ul>

        <SectionLabel>Departments</SectionLabel>
        <ul className="space-y-0.5">
          {DEPARTMENT_NAV.map(({ moduleId, label }) => (
            <li key={moduleId}>
              <NavLink
                href={moduleHref(moduleId)}
                label={label}
                active={pathname.startsWith(`/modules/${moduleId}`)}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
