export function PrintDocumentHeader({
  title,
  subtitle,
  meta,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
}) {
  return (
    <header className="print-doc-header mb-10 border-b-2 border-slate-900 pb-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-lg font-bold text-slate-900">ENCC</p>
          <p className="text-sm text-slate-700">شرکت استخراج و فرآوری زغال سنگ شمال افغانستان</p>
          <p className="mt-1 text-xs text-slate-500">ERP Requirements — Shams Hilal Template v2.2</p>
        </div>
        {meta && <p className="text-right text-xs text-slate-500">{meta}</p>}
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
    </header>
  );
}
