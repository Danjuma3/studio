
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
  // Ensure Server Actions can handle large payloads (photos and videos)
  serverActions: {
    bodySizeLimit: '10mb',
  },
  experimental: {
    // Fallback for certain Next.js environments that still look here
    serverActions: {
      bodySizeLimit: '10mb',
    } as any,
  },
};

export default nextConfig;
