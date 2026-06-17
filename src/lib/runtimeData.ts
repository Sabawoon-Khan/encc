import path from "path";
import { mkdir } from "fs/promises";

/**
 * When true, reviews/uploads write to `.local-data/` and `public/uploads-local/`
 * instead of the shared `content/` + `public/uploads/` used on the hosted site.
 *
 * Enabled automatically in development unless ENCC_USE_PRODUCTION_DATA=true.
 */
export function isLocalDataStore(): boolean {
  if (process.env.ENCC_USE_PRODUCTION_DATA === "true") return false;
  if (process.env.ENCC_LOCAL_DATA === "true") return true;
  return process.env.NODE_ENV === "development";
}

export function getReviewsStorePath(): string {
  if (isLocalDataStore()) {
    return path.join(process.cwd(), ".local-data/reviews.json");
  }
  return path.join(process.cwd(), "content/reviews.json");
}

export function getEvidenceManifestPath(): string {
  if (isLocalDataStore()) {
    return path.join(process.cwd(), ".local-data/evidence-manifest.json");
  }
  return path.join(process.cwd(), "content/evidence-manifest.json");
}

/** Filesystem directory for uploaded files */
export function getUploadsDir(): string {
  if (isLocalDataStore()) {
    return path.join(process.cwd(), "public/uploads-local");
  }
  return path.join(process.cwd(), "public/uploads");
}

/** URL prefix served from public/ for evidence links */
export function getUploadPublicBase(): string {
  return isLocalDataStore() ? "/uploads-local" : "/uploads";
}

export function uploadPublicUrl(filename: string): string {
  return `${getUploadPublicBase()}/${filename}`;
}

/** Ensure `.local-data/` exists before first write in dev */
export async function ensureLocalDataDir(): Promise<void> {
  if (!isLocalDataStore()) return;
  await mkdir(path.join(process.cwd(), ".local-data"), { recursive: true });
}
