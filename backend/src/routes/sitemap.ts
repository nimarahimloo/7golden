import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();
const DOMAINS = ['https://7golden.co', 'https://7golden.ir'];
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/shop', priority: '0.9', changefreq: 'daily' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
];

function escapeXml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

router.get('/sitemap.xml', async (_req, res) => {
  try {
    const [products, blogPosts] = await Promise.all([
      prisma.product.findMany({ where: { published: true }, orderBy: { updatedAt: 'desc' }, take: 500 }),
      prisma.blogPost.findMany({ where: { published: true }, orderBy: { updatedAt: 'desc' }, take: 500 }),
    ]);
    const now = new Date().toISOString().split('T')[0];
    const urls: string[] = [];

    for (const domain of DOMAINS) {
      for (const page of STATIC_PAGES) {
        urls.push(`  <url>\n    <loc>${escapeXml(domain + page.path)}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`);
      }
      for (const p of products) {
        const lastmod = p.updatedAt.toISOString().split('T')[0];
        urls.push(`  <url>\n    <loc>${escapeXml(`${domain}/product/${p.slug}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
      }
      for (const post of blogPosts) {
        const lastmod = post.updatedAt.toISOString().split('T')[0];
        urls.push(`  <url>\n    <loc>${escapeXml(`${domain}/blog/${post.slug}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
