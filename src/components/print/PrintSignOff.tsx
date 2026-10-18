export function PrintSignOff() {
  return (
    <section className="print-sign-off mt-16 border-t-2 border-slate-900 pt-8">
      <h2 className="mb-6 text-center text-base font-bold text-slate-900">
        ENCC Sign-off — تأیید شرکت
      </h2>
      <div className="grid gap-8 sm:grid-cols-3">
        <div className="text-center">
          <div className="mt-12 border-t border-slate-900 pt-2 text-sm">امضاء — Signature</div>
          <p className="mt-1 text-xs text-slate-500">Prepared by / تهیه کننده</p>
          <p className="mt-1 text-xs text-slate-500">Date / تاریخ: _______________</p>
        </div>
        <div className="text-center">
          <div className="mt-12 border-t border-slate-900 pt-2 text-sm">امضاء — Signature</div>
          <p className="mt-1 text-xs text-slate-500">Reviewed by / بررسی کننده</p>
          <p className="mt-1 text-xs text-slate-500">Date / تاریخ: _______________</p>
        </div>
        <div className="text-center">
          <div className="mt-12 border-t border-slate-900 pt-2 text-sm">مهر و امضاء — Stamp & Signature</div>
          <p className="mt-1 text-xs text-slate-500">ENCC Official / مسئول ENCC</p>
          <p className="mt-1 text-xs text-slate-500">Date / تاریخ: _______________</p>
        </div>
      </div>
    </section>
  );
}
