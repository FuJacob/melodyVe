/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
      },
    output: 'standalone',
    distDir: '.next',
    // Add this if you're using API routes
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ];
    },
  }
  
  module.exports = nextConfig