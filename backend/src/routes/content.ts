import { Router } from 'express';
import prisma from '../lib/prisma.js';
import {
  serializeProduct,
  serializeOrder,
  serializeGeneric,
  prepareOrderData,
} from '../lib/serialize.js';
import { requireAuth, requireAdmin, optionalAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

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
    res.json(items.map(serializeProduct));
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
    res.json(serializeProduct(item));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Categories
router.get('/categories', async (_req, res) => {
  try {
    const items = await prisma.category.findMany({ orderBy: { sort_order: 'asc' }, take: 100 });
    res.json(items.map(serializeGeneric));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Blog
router.get('/blog', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const items = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { sort_order: 'asc' },
      take: limit,
    });
    res.json(items.map(serializeGeneric));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/blog/:slug', async (req, res) => {
  try {
    const item = await prisma.blogPost.findFirst({
      where: { slug: req.params.slug, published: true },
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(serializeGeneric(item));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Testimonials
router.get('/testimonials', async (_req, res) => {
  try {
    const items = await prisma.testimonial.findMany({ orderBy: { sort_order: 'asc' }, take: 100 });
    res.json(items.map(serializeGeneric));
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
    res.json(items.map(serializeGeneric));
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
    res.json(items.map(serializeGeneric));
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
    res.status(201).json(serializeGeneric(row));
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
    res.json(serializeGeneric(row));
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
    res.json(items.map(serializeOrder));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
