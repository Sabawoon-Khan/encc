import Image from "next/image";
import type { EvidenceItem } from "@/types/requirements";
import { FileText } from "lucide-react";

export function EvidenceGallery({ items }: { items: EvidenceItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
        <FileText className="mx-auto mb-2 h-8 w-8 text-slate-300" />
        <p className="text-sm text-slate-500">No evidence uploaded yet</p>
        <p className="mt-1 text-xs text-slate-400">
          Upload form samples, scans, or screenshots above
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const isPdf = item.filename.toLowerCase().endsWith(".pdf");
        const src = `/uploads/${item.filename}`;

        return (
          <a
            key={item.id}
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[4/3] bg-slate-100">
              {isPdf ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
                  <FileText className="h-10 w-10" />
                  <span className="text-xs font-medium">PDF Document</span>
                </div>
              ) : (
                <Image
                  src={src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-slate-900">{item.title}</p>
              {item.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                  {item.description}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                {new Date(item.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
