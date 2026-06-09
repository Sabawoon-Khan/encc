"use client";

import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import type { SessionRole } from "@/types/reviews";

export function PortalHeader({ role }: { role: SessionRole | null }) {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  if (!role) return null;

  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-2">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5" />
        Signed in as{" "}
        <span className="font-semibold text-slate-700">
          {role === "admin" ? "Yaqeen Admin" : "ENCC Client"}
        </span>
      </div>
      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign out
      </button>
    </div>
  );
}
