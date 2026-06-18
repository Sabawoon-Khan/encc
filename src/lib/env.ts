/**
 * App configuration with built-in defaults.
 * Host env vars (Vercel, etc.) are optional — they override these values when set.
 */
const SUPABASE_PROJECT_URL = "https://sfgcegrbljdmshophrmi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_bLJ8ZybIv5nMHgzwr3klMA_lhpY9AVb";

/** Treat empty env vars as unset (Vercel sometimes sets blank values). */
function envString(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export const siteEnv = {
  supabaseUrl: envString(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_PROJECT_URL
  ),
  supabaseAnonKey: envString(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_ANON_KEY
  ),
  supabaseServiceRoleKey: envString(process.env.SUPABASE_SERVICE_ROLE_KEY, ""),
  uploadBase: envString(
    process.env.NEXT_PUBLIC_UPLOAD_BASE,
    `${SUPABASE_PROJECT_URL}/storage/v1/object/public/evidence`
  ),
  clientPassword: envString(
    process.env.ENCC_CLIENT_PASSWORD,
    "encc-review-2026"
  ),
  adminPassword: envString(process.env.ENCC_ADMIN_PASSWORD, "yaqeen-admin-2026"),
  sessionSecret: envString(
    process.env.ENCC_SESSION_SECRET,
    "encc-portal-session-2026"
  ),
  localData: process.env.ENCC_LOCAL_DATA === "true",
  /** Dev only: write/read Supabase instead of local files */
  useProductionData: process.env.ENCC_USE_PRODUCTION_DATA === "true",
  isDev: process.env.NODE_ENV === "development",
  isVercel: process.env.VERCEL === "1",
} as const;

export function resolvedUploadBase(): string {
  return siteEnv.localData ? "/uploads-local" : siteEnv.uploadBase;
}

export function supabaseApiKey(): string {
  return siteEnv.supabaseServiceRoleKey || siteEnv.supabaseAnonKey;
}

/** Hosted deployment (Vercel) — reviews must persist in Supabase, not the filesystem. */
export function isHostedDeployment(): boolean {
  return siteEnv.isVercel || (!siteEnv.isDev && process.env.NODE_ENV === "production");
}
