import { readFile, writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import type { EvidenceItem, EvidenceManifest } from "@/types/requirements";

const MANIFEST_PATH = path.join(process.cwd(), "content/evidence-manifest.json");
const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");

export async function readManifest(): Promise<EvidenceManifest> {
  try {
    const raw = await readFile(MANIFEST_PATH, "utf-8");
    return JSON.parse(raw) as EvidenceManifest;
  } catch {
    return { items: [] };
  }
}

export async function writeManifest(manifest: EvidenceManifest): Promise<void> {
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
}

export async function saveEvidence(
  file: File,
  meta: Omit<EvidenceItem, "id" | "filename" | "uploadedAt">
): Promise<EvidenceItem> {
  const ext = path.extname(file.name) || ".bin";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const dir = path.join(UPLOADS_DIR, meta.moduleId, meta.sectionId);
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(dir, safeName);
  await writeFile(filePath, buffer);

  const item: EvidenceItem = {
    ...meta,
    id: `ev-${Date.now()}`,
    filename: `${meta.moduleId}/${meta.sectionId}/${safeName}`,
    uploadedAt: new Date().toISOString(),
  };

  const manifest = await readManifest();
  manifest.items.push(item);
  await writeManifest(manifest);

  return item;
}

export async function getEvidenceForSection(
  moduleId: string,
  sectionId: string
): Promise<EvidenceItem[]> {
  const manifest = await readManifest();
  return manifest.items.filter(
    (i) => i.moduleId === moduleId && i.sectionId === sectionId
  );
}

export async function deleteEvidence(id: string): Promise<boolean> {
  const manifest = await readManifest();
  const idx = manifest.items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  const item = manifest.items[idx];
  try {
    await unlink(path.join(UPLOADS_DIR, item.filename));
  } catch {
    /* file may already be gone */
  }
  manifest.items.splice(idx, 1);
  await writeManifest(manifest);
  return true;
}
