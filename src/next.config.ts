
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  turbo: {
    resolve: {
      alias: {
        async_hooks: false,
      },
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure resolve and fallback objects exist before trying to assign to fallback
      config.resolve = config.resolve || {};
      config.resolve.fallback = config.resolve.fallback || {};

      // Prevent 'async_hooks' from being bundled on the client
      config.resolve.fallback.async_hooks = false;
      
      // You could also add fallbacks for other Node.js core modules if they cause issues, e.g.:
      // config.resolve.fallback.fs = false;
      // config.resolve.fallback.net = false;
      // config.resolve.fallback.tls = false;
    }
    return config;
  },
};

export default nextConfig;
