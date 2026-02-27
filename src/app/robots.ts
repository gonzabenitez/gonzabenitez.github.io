import { MetadataRoute } from 'next';

export const dynamic = 'force-static' // Add this line!

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://gonzabenitez.github.io/sitemap.xml',
  }
}