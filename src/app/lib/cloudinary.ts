
/**
 * @fileOverview Cloudinary Asset Management Utility
 * 
 * Provides a standardized way to handle global assets for the platform.
 * Replace the placeholder values with your Cloudinary credentials.
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'kitchen-profit';

/**
 * Optimizes an image URL for the global platform.
 * @param src The original image path or URL.
 * @param width Optional target width.
 * @returns An optimized Cloudinary URL or the original src if Cloudinary is not configured.
 */
export function getOptimizedImageUrl(src: string, width?: number): string {
  if (!src) return '';
  if (src.startsWith('data:') || src.startsWith('/') || src.includes('picsum.photos')) return src;

  // If using Cloudinary for global scale
  if (CLOUDINARY_CLOUD_NAME && !src.includes('res.cloudinary.com')) {
    const transformations = width ? `c_limit,w_${width},q_auto,f_auto` : 'q_auto,f_auto';
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transformations}/${encodeURIComponent(src)}`;
  }

  return src;
}
