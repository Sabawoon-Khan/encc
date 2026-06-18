import { readFile, writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import type { EvidenceItem, EvidenceManifest } from "@/types/requirements";
import {
  ensureLocalDataDir,
  getEvidenceManifestPath,
  getUploadsDir,
} from "@/lib/runtimeData";
import { EVIDENCE_BUCKET, getSupabase } from "@/lib/supabase";
import { useRemoteStore } from "@/lib/dataStore";

function manifestPath() {
  return getEvidenceManifestPath();
}

function uploadsDir() {
  return getUploadsDir();
}

async function readManifestFromFile(): Promise<EvidenceManifest> {
  try {
    const raw = await readFile(manifestPath(), "utf-8");
    return JSON.parse(raw) as EvidenceManifest;
  } catch {
    return { items: [] };
  }
}

async function readManifestFromSupabase(): Promise<EvidenceManifest> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("evidence_items")
    .select("*")
    .order("uploaded_at", { ascending: false });
  if (error) throw error;

  const items: EvidenceItem[] = (data ?? []).map((row) => ({
    id: row.id,
    moduleId: row.module_id,
    sectionId: row.section_id,
    title: row.title,
    description: row.description ?? undefined,
    filename: row.filename,
    uploadedAt: row.uploaded_at,
  }));
  return { items };
}

export async function readManifest(): Promise<EvidenceManifest> {
  if (useRemoteStore()) return readManifestFromSupabase();
  return readManifestFromFile();
}

async function writeManifestToFile(manifest: EvidenceManifest): Promise<void> {
  await ensureLocalDataDir();
  await writeFile(manifestPath(), JSON.stringify(manifest, null, 2), "utf-8");
}

async function saveEvidenceToFile(
  file: File,
  meta: Omit<EvidenceItem, "id" | "filename" | "uploadedAt">
): Promise<EvidenceItem> {
  const ext = path.extname(file.name) || ".bin";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const baseDir = uploadsDir();
  const dir = path.join(baseDir, meta.moduleId, meta.sectionId);
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

  const manifest = await readManifestFromFile();
  manifest.items.push(item);
  await writeManifestToFile(manifest);

  return item;
}

async function saveEvidenceToSupabase(
  file: File,
  meta: Omit<EvidenceItem, "id" | "filename" | "uploadedAt">
): Promise<EvidenceItem> {
  const supabase = getSupabase();
  const ext = path.extname(file.name) || ".bin";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const storagePath = `${meta.moduleId}/${meta.sectionId}/${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(EVIDENCE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (uploadError) throw uploadError;

  const item: EvidenceItem = {
    ...meta,
    id: `ev-${Date.now()}`,
    filename: storagePath,
    uploadedAt: new Date().toISOString(),
  };

  const { error: insertError } = await supabase.from("evidence_items").insert({
    id: item.id,
    module_id: item.moduleId,
    section_id: item.sectionId,
    title: item.title,
    description: item.description ?? null,
    filename: item.filename,
    uploaded_at: item.uploadedAt,
  });
  if (insertError) throw insertError;

  return item;
}

export async function saveEvidence(
  file: File,
  meta: Omit<EvidenceItem, "id" | "filename" | "uploadedAt">
): Promise<EvidenceItem> {
  if (useRemoteStore()) return saveEvidenceToSupabase(file, meta);
  return saveEvidenceToFile(file, meta);
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

async function deleteEvidenceFromFile(id: string): Promise<boolean> {
  const manifest = await readManifestFromFile();
  const idx = manifest.items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  const item = manifest.items[idx];
  try {
    await unlink(path.join(uploadsDir(), item.filename));
  } catch {
    /* file may already be gone */
  }
  manifest.items.splice(idx, 1);
  await writeManifestToFile(manifest);
  return true;
}

async function deleteEvidenceFromSupabase(id: string): Promise<boolean> {
  const supabase = getSupabase();
  const { data, error: fetchError } = await supabase
    .from("evidence_items")
    .select("filename")
    .eq("id", id)
    .maybeSingle();
  if (fetchError) throw fetchError;
  if (!data) return false;

  await supabase.storage.from(EVIDENCE_BUCKET).remove([data.filename]);
  const { error: deleteError } = await supabase
    .from("evidence_items")
    .delete()
    .eq("id", id);
  if (deleteError) throw deleteError;
  return true;
}

export async function deleteEvidence(id: string): Promise<boolean> {
  if (useRemoteStore()) return deleteEvidenceFromSupabase(id);
  return deleteEvidenceFromFile(id);
}
