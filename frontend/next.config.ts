import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Docker/Terraform builds have no .env.local; ESLint in CI is covered by `next lint` / editors.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
