/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure we're only using App Router by limiting page extensions
  // This helps prevent Pages Router from picking up unexpected files
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
};

module.exports = nextConfig;
