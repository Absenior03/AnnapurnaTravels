/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  transpilePackages: ["undici", "firebase"],
  experimental: {
    swcPlugins: [["next-superjson-plugin", {}]],
  },
  eslint: {
    // This completely disables ESLint during builds
    ignoreDuringBuilds: true,
    dirs: [],
  },
  typescript: {
    // This completely disables TypeScript during builds
    ignoreBuildErrors: true,
  },
  // Suppress warnings that aren't critical
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
