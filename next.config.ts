
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
  // Explicitly set body size limit for Server Actions to handle high-quality photos/videos
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
