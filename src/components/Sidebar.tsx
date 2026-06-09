"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Building2,
  ChevronRight,
  FileText,
  Home,
  Layers,
} from "lucide-react";
import { modules } from "@/content/modules";

const navItems = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/glossary", label: "Glossary", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">ENCC ERP</p>
            <p className="text-xs text-slate-500">Requirements Hub</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-sky-50 text-sky-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mb-2 mt-6 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Modules
        </p>
        <ul className="space-y-1">
          {modules.map((mod) => {
            const modActive = pathname.startsWith(`/modules/${mod.id}`);
            return (
              <li key={mod.id}>
                <Link
                  href={`/modules/${mod.id}`}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    modActive
                      ? "bg-sky-50 font-medium text-sky-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    <span className="font-mono text-xs text-slate-400">
                      {mod.code}
                    </span>{" "}
                    {mod.nameDari ?? mod.name}
                  </span>
                </Link>
                {modActive && (
                  <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
                    {mod.sections.map((sec) => {
                      const secHref = `/modules/${mod.id}/sections/${sec.id}`;
                      const secActive = pathname === secHref;
                      return (
                        <li key={sec.id}>
                          <Link
                            href={secHref}
                            className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors ${
                              secActive
                                ? "font-medium text-sky-700"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            <ChevronRight className="h-3 w-3" />
                            <FileText className="h-3 w-3" />
                            {sec.nameDari ?? sec.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 px-4 py-3">
        <p className="text-xs text-slate-400">Template v2.2 · Yaqeen Technology</p>
      </div>
    </aside>
  );
}
