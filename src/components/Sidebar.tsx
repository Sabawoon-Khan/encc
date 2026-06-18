"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Table2 } from "lucide-react";
import { modules } from "@/content/modules";
import { DEPARTMENT_NAV, DIRECTORATE_NAV } from "@/content/modules/nav-config";

function moduleHref(moduleId: string) {
  const mod = modules.find((m) => m.id === moduleId);
  if (mod?.sections.length === 1) {
    return `/modules/${moduleId}/sections/${mod.sections[0].id}`;
  }
  return `/modules/${moduleId}`;
}

const NAV = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/glossary", label: "Glossary", icon: BookOpen },
  { href: moduleHref("shared"), label: "General Tables", icon: Table2 },
];

function NavLink({
  href,
  label,
  active,
  nested,
}: {
  href: string;
  label: string;
  active: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
        nested ? "py-1.5 pl-6 text-xs" : ""
      } ${
        active
          ? "bg-sky-50 font-medium text-sky-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const oprActive = pathname.startsWith("/modules/opr");

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-4">
        <p className="text-sm font-bold text-slate-900">ENCC ERP</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-sky-50 font-medium text-sky-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-60" />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          ریایست اجرایه
        </p>
        <ul className="space-y-0.5">
          <li>
            <NavLink
              href="/modules/opr"
              label="Overview"
              active={oprActive}
              nested
            />
          </li>
          {DIRECTORATE_NAV.map(({ moduleId, label }) => (
            <li key={moduleId}>
              <NavLink
                href={moduleHref(moduleId)}
                label={label}
                active={pathname.startsWith(`/modules/${moduleId}`)}
                nested
              />
            </li>
          ))}
        </ul>

        <p className="mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Departments
        </p>
        <ul className="space-y-0.5">
          {DEPARTMENT_NAV.map(({ moduleId, label }) => (
            <li key={moduleId}>
              <NavLink
                href={moduleHref(moduleId)}
                label={label}
                active={pathname.startsWith(`/modules/${moduleId}`)}
                nested
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
