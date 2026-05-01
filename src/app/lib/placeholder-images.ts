
import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

/**
 * Exported placeholder images with a safety fallback to ensure
 * the array is never undefined during SSR.
 */
export const PlaceHolderImages: ImagePlaceholder[] = data?.placeholderImages || [];
