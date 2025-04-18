/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'randomuser.me'],
  },
  // Uncomment the following line if you want to use Stripe
  // transpilePackages: ['@stripe/react-stripe-js'],
}

module.exports = nextConfig 