import { MetadataRoute } from 'next'
import { query } from '../lib/db'

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://homeservicediagnostics.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  try {
    const res = await query(`SELECT slug FROM pages WHERE status = 'published'`);
    
    const dynamicRoutes: MetadataRoute.Sitemap = res.rows.map((row: any) => ({
      url: `${baseUrl}${row.slug.startsWith('/') ? '' : '/'}${row.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Failed to fetch dynamic routes for sitemap:", error);
    return staticRoutes;
  }
}
