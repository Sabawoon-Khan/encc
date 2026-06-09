import type { TocItem } from "@/lib/sectionToc";

interface SectionTOCProps {
  items: TocItem[];
}

export function SectionTOC({ items }: SectionTOCProps) {
  if (items.length === 0) return null;

  return (
    <nav className="sticky top-4 hidden lg:block">
      <div className="max-h-[min(70vh,32rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-sm">
        <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          On this page
        </p>
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block truncate rounded px-2 py-1 text-slate-600 hover:bg-slate-50 hover:text-sky-700"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
