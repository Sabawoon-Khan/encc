import { siteEnv } from "@/lib/env";
import { useSupabaseStore } from "@/lib/supabase";

/** Supabase for reviews/evidence — production, or dev with ENCC_USE_PRODUCTION_DATA. */
export function useRemoteStore(): boolean {
  if (siteEnv.localData) return false;
  if (!useSupabaseStore()) return false;
  return !siteEnv.isDev || siteEnv.useProductionData;
}

/** Public URL base for evidence file links. */
export function uploadBaseUrl(): string {
  if (siteEnv.localData) return "/uploads-local";
  if (!useRemoteStore()) return "/uploads";
  return siteEnv.uploadBase;
}
