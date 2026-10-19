import { Router } from 'express';
import prisma from '../lib/prisma.js';
import {
  serializeProduct,
  serializeOrder,
  serializeGeneric,
  serializeNewsPost,
  normalizeRowMedia,
  prepareOrderData,
} from '../lib/serialize.js';
import { requireAuth, requireAdmin, optionalAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

const UNVERIFIED_TESTIMONIAL_NAMES = [
  "بستنی گلستان",
  "قنادی برتر",
  "شکلات‌سازی آریا",
  "هلدینگ خواروبار پارس",
  "گروه صنایع غذایی سرو"
];

// Products
router.get('/products', async (req, res) => {
  try {
    const where: any = { published: true };
    if (req.query.featured === 'true') where.featured = true;
    if (req.query.category) where.category = String(req.query.category);
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const items = await prisma.product.findMany({
      where,
      orderBy: { sort_order: 'asc' },
      take: limit,
    });
    res.json(items.map((x) => normalizeRowMedia(serializeProduct(x))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/products/:slug', async (req, res) => {
  try {
    const item = await prisma.product.findFirst({
      where: { slug: req.params.slug, published: true },
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(normalizeRowMedia(serializeProduct(item)));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Categories
router.get('/categories', async (_req, res) => {
  try {
    const items = await prisma.category.findMany({ orderBy: { sort_order: 'asc' }, take: 100 });
    res.json(items.map((x) => normalizeRowMedia(serializeGeneric(x))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Blog: the database/CMS is the source of truth. Pagination is offset-based,
// with stable ordering so records are not duplicated or skipped between requests.
router.get('/blog', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const requestedLimit = Math.trunc(Number(req.query.limit) || 12);
    const limit = Math.min(Math.max(requestedLimit, 1), 100);
    const skip = Math.max(0, Math.trunc(Number(req.query.skip) || 0));
    const where: any = { published: true };
const category = String(req.query.category || '').trim();
    if (category) where.category = category;

    const query = String(req.query.q || '').trim().slice(0, 200);
    if (query) {
      where.OR = [
        { title_fa: { contains: query, mode: 'insensitive' } },
        { excerpt_fa: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.blogPost.findMany({
      where,
      orderBy: [{ sort_order: 'asc' }, { createdAt: 'desc' }, { id: 'asc' }],
      skip,
      take: limit,
    });
    res.json(items.map((x) => normalizeRowMedia(serializeGeneric(x))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Sidebar counts come from published database records, not the currently-loaded page.
// Keep this route before /blog/:slug so "meta" is not treated as an article slug.
router.get('/blog/meta', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const where: any = { published: true };
const [total, grouped] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.groupBy({
        by: ['category'],
        where,
        _count: { _all: true },
        orderBy: { category: 'asc' },
      }),
    ]);

    res.json({
      total,
      categories: grouped
        .filter((row) => typeof row.category === 'string' && row.category.trim())
        .map((row) => ({ category: row.category, count: row._count._all })),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/blog/:slug', optionalAuth, async (req: AuthRequest, res) => {
  try {
const item = await prisma.blogPost.findFirst({
      where: { slug: req.params.slug, published: true },
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(normalizeRowMedia(serializeGeneric(item)));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// News: published NewsPost records are independent from the blog collection.
router.get('/news', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const requestedLimit = Math.trunc(Number(req.query.limit) || 12);
    const limit = Math.min(Math.max(requestedLimit, 1), 100);
    const skip = Math.max(0, Math.trunc(Number(req.query.skip) || 0));
    const where: any = { published: true };

    const category = String(req.query.category || '').trim();
    if (category) where.category = category;
    const query = String(req.query.q || '').trim().slice(0, 200);
    if (query) {
      where.OR = [
        { title_fa: { contains: query, mode: 'insensitive' } },
        { excerpt_fa: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.newsPost.findMany({
      where,
      orderBy: [{ sort_order: 'asc' }, { createdAt: 'desc' }, { id: 'asc' }],
      skip,
      take: limit,
    });
    res.json(items.map((item) => normalizeRowMedia(serializeNewsPost(item))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/news/meta', async (req, res) => {
  try {
    const where: any = { published: true };
    const [total, grouped] = await Promise.all([
      prisma.newsPost.count({ where }),
      prisma.newsPost.groupBy({
        by: ['category'],
        where,
        _count: { _all: true },
        orderBy: { category: 'asc' },
      }),
    ]);
    res.json({
      total,
      categories: grouped
        .filter((row) => typeof row.category === 'string' && row.category.trim())
        .map((row) => ({ category: row.category, count: row._count._all })),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/news/:slug', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const item = await prisma.newsPost.findFirst({
      where: { slug: req.params.slug, published: true },
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(normalizeRowMedia(serializeNewsPost(item)));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Testimonials
router.get('/testimonials', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const where: any = { published: true };
    if (req.user?.role !== 'admin') where.name_fa = { notIn: UNVERIFIED_TESTIMONIAL_NAMES };
    const items = await prisma.testimonial.findMany({
      where,
      orderBy: { sort_order: 'asc' },
      take: 100,
    });
    res.json(items.map((x) => normalizeRowMedia(serializeGeneric(x))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Gallery
router.get('/gallery', async (_req, res) => {
  try {
    const items = await prisma.galleryImage.findMany({
      where: { published: true },
      orderBy: { sort_order: 'asc' },
      take: 100,
    });
    res.json(items.map((x) => normalizeRowMedia(serializeGeneric(x))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Awards
router.get('/awards', async (_req, res) => {
  try {
    const items = await prisma.award.findMany({
      where: { published: true },
      orderBy: { sort_order: 'asc' },
      take: 100,
    });
    res.json(items.map((x) => normalizeRowMedia(serializeGeneric(x))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Contact
router.post('/contact', async (req, res) => {
  try {
    const { name, message, phone, email } = req.body;
    if (!name || !message) return res.status(422).json({ error: 'name and message required' });
    const row = await prisma.contactMessage.create({
      data: {
        name,
        message,
        phone: phone || null,
        email: email || null,
        status: 'new',
      },
    });
    res.status(201).json(normalizeRowMedia(serializeGeneric(row)));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Page Sections (public). Unpublished rows expose only a visibility marker so the
// homepage can honor an admin's hide toggle without leaking hidden copy/media.
router.get('/page-sections', async (req, res) => {
  try {
    const where: any = {};
    if (req.query.page) where.page_key = String(req.query.page);
    const items = await prisma.pageSection.findMany({
      where,
      orderBy: { sort_order: 'asc' },
      take: 200,
    });
    res.json(items.map((row) => row.published === false
      ? { id: row.id, page_key: row.page_key, section_key: row.section_key, published: false, sort_order: row.sort_order }
      : normalizeRowMedia(serializeGeneric(row))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Settings
router.get('/settings', async (_req, res) => {
  try {
    const items = await prisma.siteSettings.findMany({ take: 1 });
    res.json(items[0] ? serializeGeneric(items[0]) : null);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/settings/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const data = { ...req.body };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    const row = await prisma.siteSettings.update({ where: { id: req.params.id }, data });
    res.json(normalizeRowMedia(serializeGeneric(row)));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Orders
router.post('/orders', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const data = prepareOrderData(req.body);
    if (!data.order_number) {
      data.order_number = `7G-${Date.now().toString().slice(-6)}`;
    }
    if (!data.tracking_code) {
      data.tracking_code = `TRK${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    }
    if (req.user) data.userId = req.user.id;
    const row = await prisma.order.create({ data });
    res.status(201).json(serializeOrder(row));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/orders', requireAuth, async (req: AuthRequest, res) => {
  try {
    const where: any = {};
    if (req.user!.role !== 'admin') where.userId = req.user!.id;
    const items = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(items.map((x) => normalizeRowMedia(serializeOrder(x))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
