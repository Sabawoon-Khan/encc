import { uploadBaseUrl, useRemoteStore } from "@/lib/dataStore";
import { siteEnv } from "@/lib/env";

/** Client-safe upload URL base (mirrors server local-data routing). */
export const UPLOAD_PUBLIC_BASE = uploadBaseUrl();

export const SUPABASE_URL = siteEnv.supabaseUrl;
export const SUPABASE_ANON_KEY = siteEnv.supabaseAnonKey;

export function uploadPublicUrl(filename: string): string {
  return `${UPLOAD_PUBLIC_BASE.replace(/\/$/, "")}/${filename}`;
}

/** True when reviews/evidence use local files instead of Supabase. */
export const IS_LOCAL_DATA = !useRemoteStore();

export const EVIDENCE_BUCKET = "evidence";
