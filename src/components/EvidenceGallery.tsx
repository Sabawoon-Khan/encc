"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import type { EvidenceItem } from "@/types/requirements";
import { uploadPublicUrl } from "@/lib/clientEnv";

export function EvidenceGallery({
  items,
  canDelete = true,
  onDeleted,
}: {
  items: EvidenceItem[];
  canDelete?: boolean;
  onDeleted?: (id: string) => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    if (!confirm("Remove this attachment?")) return;
    setDeleting(id);
    setError("");
    try {
      const res = await fetch(`/api/uploads?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      onDeleted?.(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
        <FileText className="mx-auto mb-2 h-7 w-7 text-slate-300" />
        <p className="text-sm text-slate-500">No attachments yet</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const isPdf = item.filename.toLowerCase().endsWith(".pdf");
          const src = uploadPublicUrl(item.filename);

          return (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <a href={src} target="_blank" rel="noopener noreferrer">
                <div className="relative aspect-[4/3] bg-slate-100">
                  {isPdf ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
                      <FileText className="h-8 w-8" />
                      <span className="text-xs">PDF</span>
                    </div>
                  ) : (
                    <Image
                      src={src}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
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
                </div>
              </a>
              {canDelete && (
                <button
                  type="button"
                  disabled={deleting === item.id}
                  onClick={() => handleDelete(item.id)}
                  className="absolute right-2 top-2 rounded-md bg-white/90 p-1.5 text-slate-500 shadow-sm opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:opacity-50"
                  title="Remove attachment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
