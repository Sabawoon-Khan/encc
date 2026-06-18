import { uploadBaseUrl, useRemoteStore } from "@/lib/dataStore";

/** Client-safe upload URL base (mirrors server local-data routing). */
export const UPLOAD_PUBLIC_BASE = uploadBaseUrl();

export function uploadPublicUrl(filename: string): string {
  return `${UPLOAD_PUBLIC_BASE.replace(/\/$/, "")}/${filename}`;
}

/** True when reviews/evidence use local files instead of Supabase. */
export const IS_LOCAL_DATA = !useRemoteStore();
