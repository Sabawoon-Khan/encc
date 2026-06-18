import type { NextConfig } from "next";
import { siteEnv } from "./src/lib/env";

function useRemoteStore(): boolean {
  if (siteEnv.localData) return false;
  const key = siteEnv.supabaseServiceRoleKey || siteEnv.supabaseAnonKey;
  if (!siteEnv.supabaseUrl || !key) return false;
  return !siteEnv.isDev || siteEnv.useProductionData;
}

function uploadBaseUrl(): string {
  if (siteEnv.localData) return "/uploads-local";
  if (!useRemoteStore()) return "/uploads";
  return siteEnv.uploadBase;
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_LOCAL_DATA: useRemoteStore() ? "false" : "true",
    NEXT_PUBLIC_UPLOAD_BASE: uploadBaseUrl(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(siteEnv.supabaseUrl).hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
