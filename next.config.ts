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
          // Change this from "require-corp" to "credentialless" to avoid CORS issues
          // while maintaining some security benefits

          // Add CORS headers
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      fs: false,
      path: false,
    };
    // Enable WebAssembly support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true, // Enable module layer rules
    };
    // Add specific handling for wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "javascript/auto",
      use: {
        loader: "file-loader",
        options: {
          name: "static/wasm/[name].[hash].[ext]",
          publicPath: "/_next/",
        },
      },
    });
    return config;
  },
};

export default nextConfig;