import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude server-only packages from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'thread-stream': 'commonjs thread-stream',
        'pino': 'commonjs pino',
        '@walletconnect/logger': 'commonjs @walletconnect/logger',
        'pino-pretty': 'commonjs pino-pretty',
        'sonic-boom': 'commonjs sonic-boom'
      });
    }

    // Ignore test files and other unnecessary files
    config.module.rules.push({
      test: /\.(test|spec)\.(js|ts|tsx)$/,
      use: 'ignore-loader'
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mwtzwo37egeya3fd.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
