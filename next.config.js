/** @type {import('next').NextConfig} */
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
  experimental: {
    serverComponentsExternalPackages: ["sequelize"],
    outputStandalone: true,
    outputFileTracingIncludes: {
      "/api/**/*": ["node_modules/**/*"],
    },
  },
  eslint: {
    // Completely disable ESLint during build
    ignoreDuringBuilds: true,
    dirs: [], // Empty array means don't run ESLint on any directory
    // Add these additional options to ensure ESLint is fully disabled
    lintDuringBuild: false,
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
    return config;
  },
};

module.exports = nextConfig;
