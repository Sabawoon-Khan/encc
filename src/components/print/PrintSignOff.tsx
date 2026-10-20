import { BRAND } from "@/content/brand";

export function PrintSignOff() {
  return (
    <section className="print-sign-off mt-14 border-t border-slate-300 pt-8">
      <h2 className="mb-2 text-center text-base font-bold text-slate-900">
        Sign-off — تأیید
      </h2>
      <p className="mb-8 text-center text-xs text-slate-500">
        {BRAND.clientShort} (client) · {BRAND.designPartner} (design confirmation) ·{" "}
        {BRAND.analyst}
      </p>
      <div className="grid gap-8 sm:grid-cols-3">
        <div className="text-center">
          <div className="mt-14 border-t border-slate-800 pt-2 text-sm">Signature / امضاء</div>
          <p className="mt-1 text-xs text-slate-500">Prepared — {BRAND.analyst}</p>
          <p className="mt-1 text-xs text-slate-500">Date: _______________</p>
        </div>
        <div className="text-center">
          <div className="mt-14 border-t border-slate-800 pt-2 text-sm">Signature / امضاء</div>
          <p className="mt-1 text-xs text-slate-500">Design review — {BRAND.designPartner}</p>
          <p className="mt-1 text-xs text-slate-500">Date: _______________</p>
        </div>
        <div className="text-center">
          <div className="mt-14 border-t border-slate-800 pt-2 text-sm">Stamp & signature / مهر</div>
          <p className="mt-1 text-xs text-slate-500">Official — {BRAND.clientShort}</p>
          <p className="mt-1 text-xs text-slate-500">Date: _______________</p>
        </div>
      </div>
    </section>
  );
}
