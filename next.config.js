/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  // Basic settings
  reactStrictMode: false,
  swcMinify: true,

  // Configure images
  images: {
    domains: [
      "images.pexels.com",
      "firebasestorage.googleapis.com",
      "randomuser.me",
    ],
    unoptimized: false,
  },

  // Basic webpack config for aliases only
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./src"),
    };
    return config;
  },
};

module.exports = nextConfig;
