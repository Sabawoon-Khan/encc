"use client";

import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import type { SessionRole } from "@/types/reviews";
import { IS_LOCAL_DATA } from "@/lib/clientEnv";

export function PortalHeader({ role }: { role: SessionRole | null }) {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  if (!role) return null;

  return (
    <div className="border-b border-slate-200 bg-white">
      {IS_LOCAL_DATA && (
        <div className="bg-amber-50 px-6 py-1.5 text-center text-xs font-medium text-amber-900">
          Local dev mode — reviews and uploads are saved only on this machine, not on the hosted
          site
        </div>
      )}
      <div className="flex items-center justify-between px-6 py-2">
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
    </div>
  );
}
