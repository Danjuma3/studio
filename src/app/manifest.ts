
import { MetadataRoute } from 'next'
import data from './lib/placeholder-images.json'

export default function manifest(): MetadataRoute.Manifest {
  const icon192 = data.placeholderImages.find(img => img.id === 'pwa-icon-192')?.imageUrl || 'https://picsum.photos/seed/kitchen-prof-logo/192/192';
  const icon512 = data.placeholderImages.find(img => img.id === 'pwa-icon-512')?.imageUrl || 'https://picsum.photos/seed/kitchen-prof-logo/512/512';

  return {
    name: 'Kitchen Prof',
    short_name: 'KitchenProf',
    description: 'Intelligent food cost control and margin analysis for Lagos restaurants.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f0fdf4',
    theme_color: '#22c55e',
    icons: [
      {
        src: icon192,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: icon512,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
