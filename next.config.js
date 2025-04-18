/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  // Basic image configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },

  // Output standalone build
  output: "standalone",

  // Ignore all issues with ESLint and TypeScript
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Explicit disabling of features
  experimental: {
    serverComponentsExternalPackages: ["sequelize"],
    outputFileTracingIncludes: {
      "/api/**/*": ["node_modules/**/*"],
    },
    swcMinify: true,
    forceSwcTransforms: true,
  },

  // Webpack configuration for module resolution
  webpack: (config, { isServer }) => {
    // Ignore all warnings
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
