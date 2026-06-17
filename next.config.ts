import type { NextConfig } from "next";

const useLocalData =
  process.env.NODE_ENV === "development" &&
  process.env.ENCC_USE_PRODUCTION_DATA !== "true";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_LOCAL_DATA: useLocalData ? "true" : "false",
    NEXT_PUBLIC_UPLOAD_BASE: useLocalData ? "/uploads-local" : "/uploads",
  },
};

export default nextConfig;
