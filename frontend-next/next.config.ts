import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for Docker production builds
  output: 'standalone',

  // Enable experimental features for better performance
  experimental: {
    // Optimize CSS loading
    optimizeCss: true,
  },

  // Compress images for better performance
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
