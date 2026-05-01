
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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // High-priority body size limit configuration for Next.js 15 Server Actions
  serverActions: {
    bodySizeLimit: '10mb',
  },
  experimental: {
    // Redundant configuration for maximum compatibility with different Next.js versions
    serverActions: {
      bodySizeLimit: '10mb',
    } as any,
  },
};

export default nextConfig;
