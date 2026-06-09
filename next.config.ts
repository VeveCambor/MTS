import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // react-big-calendar je publikován jako CJS, transpile pro App Router
  transpilePackages: ["react-big-calendar"],
  experimental: {
    // Optimalizace importů ikon a MUI komponent (menší bundle)
    optimizePackageImports: ["@mui/material", "@mui/icons-material", "react-feather"],
  },
};

export default nextConfig;
