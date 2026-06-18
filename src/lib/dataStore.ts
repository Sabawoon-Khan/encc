import { isHostedDeployment, siteEnv } from "@/lib/env";
import { useSupabaseStore } from "@/lib/supabase";

/**
 * Where reviews & evidence are stored:
 * - Local dev (`npm run dev`): files in `content/` (unless ENCC_USE_PRODUCTION_DATA=true)
 * - Vercel / production: Supabase (required)
 * - ENCC_LOCAL_DATA=true: `.local-data/` (offline dev only)
 */
export function useRemoteStore(): boolean {
  if (siteEnv.localData) return false;
  if (!useSupabaseStore()) return false;
  if (isHostedDeployment()) return true;
  return siteEnv.useProductionData;
}

/** Public URL base for evidence file links. */
export function uploadBaseUrl(): string {
  if (siteEnv.localData) return "/uploads-local";
  if (!useRemoteStore()) return "/uploads";
  return siteEnv.uploadBase;
}

export function reviewStoreLabel(): "supabase" | "local" {
  return useRemoteStore() ? "supabase" : "local";
}
