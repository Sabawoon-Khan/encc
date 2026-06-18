import type { NextConfig } from "next";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
  "https://sfgcegrbljdmshophrmi.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  "sb_publishable_bLJ8ZybIv5nMHgzwr3klMA_lhpY9AVb";

function useRemoteStoreAtBuild(): boolean {
  if (process.env.ENCC_LOCAL_DATA === "true") return false;
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;
  if (process.env.VERCEL === "1") return true;
  if (process.env.NODE_ENV === "production") return true;
  return process.env.ENCC_USE_PRODUCTION_DATA === "true";
}

function uploadBaseAtBuild(): string {
  if (process.env.ENCC_LOCAL_DATA === "true") return "/uploads-local";
  if (!useRemoteStoreAtBuild()) return "/uploads";
  return (
    process.env.NEXT_PUBLIC_UPLOAD_BASE?.trim() ||
    `${SUPABASE_URL}/storage/v1/object/public/evidence`
  );
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_LOCAL_DATA: useRemoteStoreAtBuild() ? "false" : "true",
    NEXT_PUBLIC_UPLOAD_BASE: uploadBaseAtBuild(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(SUPABASE_URL).hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
