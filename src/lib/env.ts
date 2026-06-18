/**
 * App configuration with built-in defaults.
 * Host env vars (Vercel, etc.) are optional — they override these values when set.
 */
const SUPABASE_PROJECT_URL = "https://sfgcegrbljdmshophrmi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_bLJ8ZybIv5nMHgzwr3klMA_lhpY9AVb";

export const siteEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? SUPABASE_PROJECT_URL,
  supabaseAnonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  uploadBase:
    process.env.NEXT_PUBLIC_UPLOAD_BASE ??
    `${SUPABASE_PROJECT_URL}/storage/v1/object/public/evidence`,
  clientPassword: process.env.ENCC_CLIENT_PASSWORD ?? "encc-review-2026",
  adminPassword: process.env.ENCC_ADMIN_PASSWORD ?? "yaqeen-admin-2026",
  sessionSecret:
    process.env.ENCC_SESSION_SECRET ?? "encc-portal-session-2026",
  localData: process.env.ENCC_LOCAL_DATA === "true",
  useProductionData: process.env.ENCC_USE_PRODUCTION_DATA === "true",
  isDev: process.env.NODE_ENV === "development",
} as const;

export function resolvedUploadBase(): string {
  return siteEnv.localData ? "/uploads-local" : siteEnv.uploadBase;
}

export function supabaseApiKey(): string {
  return siteEnv.supabaseServiceRoleKey || siteEnv.supabaseAnonKey;
}
