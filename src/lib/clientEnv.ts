import { siteEnv } from "@/lib/env";

/**
 * Client-safe upload URL — uses NEXT_PUBLIC_* values baked by next.config.ts
 * so browser and server always agree (avoids wrong /uploads base on production).
 */
export function uploadPublicBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_UPLOAD_BASE?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (siteEnv.localData) return "/uploads-local";
  if (process.env.NEXT_PUBLIC_LOCAL_DATA === "true") return "/uploads";
  return siteEnv.uploadBase.replace(/\/$/, "");
}

export function uploadPublicUrl(filename: string): string {
  const path = filename.replace(/^\//, "");
  return `${uploadPublicBase()}/${path}`;
}

export const SUPABASE_URL = siteEnv.supabaseUrl;
export const SUPABASE_ANON_KEY = siteEnv.supabaseAnonKey;

/** True when uploads go to local public/ folder (dev default). */
export const IS_LOCAL_DATA = process.env.NEXT_PUBLIC_LOCAL_DATA === "true";

export const EVIDENCE_BUCKET = "evidence";

/** @deprecated use uploadPublicBase */
export const UPLOAD_PUBLIC_BASE = uploadPublicBase();
