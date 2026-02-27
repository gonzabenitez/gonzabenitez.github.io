import { MetadataRoute } from 'next';

export const dynamic = 'force-static' // Add this line!

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://gonzabenitez.github.io',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}