import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const DOMAINS = ['https://7golden.co', 'https://7golden.ir' , "http://localhost:4400"];
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/shop', priority: '0.9', changefreq: 'daily' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
];

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch all products and blog posts (service role for public sitemap)
    const [products, blogPosts] = await Promise.all([
      base44.asServiceRole.entities.Product.list('-updated_date', 500),
      base44.asServiceRole.entities.BlogPost.list('-updated_date', 500),
    ]);

    const now = new Date().toISOString().split('T')[0];
    let urls = [];

    // Static pages for each domain
    for (const domain of DOMAINS) {
      for (const page of STATIC_PAGES) {
        urls.push(urlEntry(`${domain}${page.path}`, now, page.changefreq, page.priority));
      }

      // Product pages
      for (const p of products) {
        const slug = p.slug || p.id;
        const lastmod = p.updated_date ? new Date(p.updated_date).toISOString().split('T')[0] : now;
        urls.push(urlEntry(`${domain}/product/${slug}`, lastmod, 'weekly', '0.8'));
      }

      // Blog post pages
      for (const post of blogPosts) {
        if (post.published === false) continue;
        const slug = post.slug || post.id;
        const lastmod = post.updated_date ? new Date(post.updated_date).toISOString().split('T')[0] : now;
        urls.push(urlEntry(`${domain}/blog/${slug}`, lastmod, 'monthly', '0.7'));
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}