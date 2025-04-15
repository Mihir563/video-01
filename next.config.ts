import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["storage.ealbum.in", "ealbum.in"],
    // Add remotePatterns for more flexibility
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.ealbum.in',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'ealbum.in',
        pathname: '**',
      }
    ],
    // Disable image optimization for cross-origin images if needed
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Add CORS headers
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};

export default nextConfig;