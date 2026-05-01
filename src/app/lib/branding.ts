import { PlaceHolderImages } from './placeholder-images';

/**
 * Ensures a valid URL or Base64 string is returned for the logo.
 * Handles raw Base64 strings by adding the necessary data URI prefix.
 * Falls back to a placeholder if the input is invalid or empty.
 */
export function getSafeLogoUrl(url?: string): string {
  const fallback = 'https://picsum.photos/seed/kitchen-prof-logo/512/512';
  
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    const placeholder = PlaceHolderImages.find(img => img.id === 'app-logo');
    return placeholder?.imageUrl || fallback;
  }
  
  const trimmed = url.trim();

  // Handle standard paths and already-prefixed Base64
  if (trimmed.startsWith('/') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Heuristic: If it's a very long string with no spaces, it's likely a raw Base64 that needs a prefix
  if (trimmed.length > 100 && !trimmed.includes(' ')) {
    return `data:image/png;base64,${trimmed}`;
  }
  
  // Validate as a standard URL
  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    return fallback;
  }
}
