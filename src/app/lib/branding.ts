
import { PlaceHolderImages } from './placeholder-images';

/**
 * Ensures a valid URL or Base64 string is returned for the logo.
 * Handles raw Base64 strings by adding the necessary data URI prefix.
 * Returns an empty string if no valid logo is found, allowing components to handle the empty state.
 */
export function getSafeLogoUrl(url?: string): string {
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    // Check if there's a user-defined placeholder in the JSON
    const images = Array.isArray(PlaceHolderImages) ? PlaceHolderImages : [];
    const placeholder = images.find(img => img.id === 'app-logo');
    
    // If the placeholder is the old picsum link, ignore it to "remove" the initial logo
    if (placeholder?.imageUrl && !placeholder.imageUrl.includes('picsum.photos')) {
      return placeholder.imageUrl;
    }
    
    return ''; // Return empty to prevent showing the "initial" logo
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
    return '';
  }
}
