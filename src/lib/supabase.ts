import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { siteEnv, supabaseApiKey } from "@/lib/env";

let client: SupabaseClient | null = null;

export function useSupabaseStore(): boolean {
  return Boolean(siteEnv.supabaseUrl && supabaseApiKey());
}

export function getSupabase(): SupabaseClient {
  if (!useSupabaseStore()) {
    throw new Error("Supabase is not configured");
  }
  if (!client) {
    client = createClient(siteEnv.supabaseUrl, supabaseApiKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export const EVIDENCE_BUCKET = "evidence";

export function evidencePublicUrl(storagePath: string): string {
  const base = siteEnv.uploadBase;
  return `${base.replace(/\/$/, "")}/${storagePath}`;
}
