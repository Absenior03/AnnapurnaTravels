/** @type {import('next').NextConfig} */
const path = require("path");

// Create a minimal config to avoid any complexities
const nextConfig = {
  // Basic settings that won't cause issues
  reactStrictMode: false,
  swcMinify: true,

  // Disable optimizations that might cause problems
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  // Output as standalone
  output: "standalone",

  // Disable all checks during build
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Basic webpack config for aliases only
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./components"),
      "@/context": path.resolve(__dirname, "./context"),
    };
    return config;
  },

  // Prevent static optimization of auth pages
  experimental: {
    // Server actions are enabled by default in Next.js 14
    serverComponentsExternalPackages: ["react-dom", "react"],
  },

  // Configure page builds
  pageExtensions: ["js", "jsx", "ts", "tsx"],

  // Custom runtime configuration
  onDemandEntries: {
    // Keep auth pages in development mode only
    maxInactiveAge: 1000 * 60 * 60,
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig;
