
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
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
        src: 'https://picsum.photos/seed/kitchen-prof-logo/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/kitchen-prof-logo/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
