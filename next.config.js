/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  transpilePackages: ["three"],
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["sequelize"],
    outputFileTracingIncludes: {
      "/api/**/*": ["node_modules/**/*"],
    },
  },
  eslint: {
    // Completely disable ESLint during build
    ignoreDuringBuilds: true,
    dirs: [], // Empty array means don't run ESLint on any directory
  },
  typescript: {
    // Disable TypeScript type checking during build
    ignoreBuildErrors: true,
  },
  // Suppress warnings that aren't critical
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    pagesBufferLength: 5,
  },
  reactStrictMode: true,
  // Ignore all ESLint warnings and errors
  webpack: (config, { dev, isServer }) => {
    // This makes Webpack ignore ESLint errors
    config.ignoreWarnings = [{ message: /.*/ }];

    // Add module resolution aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./components"),
      "@/context": path.resolve(__dirname, "./context"),
    };

    return config;
  },
};

module.exports = nextConfig;
