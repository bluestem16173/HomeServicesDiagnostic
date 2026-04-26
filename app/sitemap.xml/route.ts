import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = 'https://homeservicediagnostics.com';

  // Base static routes
  const routes = [
    { url: baseUrl, priority: 1.0, changefreq: 'weekly' },
    { url: `${baseUrl}/about`, priority: 0.8, changefreq: 'monthly' },
    { url: `${baseUrl}/privacy`, priority: 0.5, changefreq: 'yearly' },
    { url: `${baseUrl}/terms`, priority: 0.5, changefreq: 'yearly' }
  ];

  try {
    const res = await query("SELECT slug FROM pages WHERE status = 'published'");
    res.rows.forEach((row: any) => {
      routes.push({
        url: `${baseUrl}${row.slug.startsWith('/') ? '' : '/'}${row.slug}`,
        priority: 0.7,
        changefreq: 'weekly'
      });
    });
  } catch (error) {
    console.error("Failed to fetch dynamic routes for sitemap:", error);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
    }
  });
}
