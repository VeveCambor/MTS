import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: __dirname },
  // react-big-calendar je publikován jako CJS, transpile pro App Router
  transpilePackages: ["react-big-calendar"],
  experimental: {
    // @mui/material vynecháno — optimizePackageImports rozbíjí interní re-exporty MUI v9 + Turbopack
    optimizePackageImports: ["@mui/icons-material", "react-feather"],
  },
};

export default nextConfig;
