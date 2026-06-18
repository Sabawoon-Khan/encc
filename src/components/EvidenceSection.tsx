"use client";

import { useState } from "react";
import type { EvidenceItem } from "@/types/requirements";
import { ImageUpload } from "@/components/ImageUpload";
import { EvidenceGallery } from "@/components/EvidenceGallery";

export function EvidenceSection({
  moduleId,
  sectionId,
  initialItems,
  locked,
  canDelete,
}: {
  moduleId: string;
  sectionId: string;
  initialItems: EvidenceItem[];
  locked: boolean;
  canDelete: boolean;
}) {
  const [items, setItems] = useState(initialItems);

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <ImageUpload
        moduleId={moduleId}
        sectionId={sectionId}
        locked={locked}
        onUploaded={(item) => setItems((prev) => [item, ...prev])}
      />
      <EvidenceGallery
        items={items}
        canDelete={canDelete}
        onDeleted={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
      />
    </div>
  );
}
