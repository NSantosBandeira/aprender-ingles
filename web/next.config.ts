import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["typeorm", "pg", "pg-cloudflare", "reflect-metadata"],
};

export default nextConfig;
