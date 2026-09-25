import { Router } from 'express';
import prisma from '../lib/prisma.js';
import {
  serializeProduct,
  serializeOrder,
  serializeGeneric,
  prepareProductData,
  prepareOrderData,
} from '../lib/serialize.js';
import { requireAuth, requireAdmin, optionalAuth, type AuthRequest } from '../middleware/auth.js';

const router = Router();

type ModelName =
  | 'product'
  | 'category'
  | 'blogPost'
  | 'award'
  | 'galleryImage'
  | 'testimonial'
  | 'contactMessage'
  | 'order'
  | 'siteSettings'
  | 'user';

const ENTITY_MAP: Record<string, ModelName> = {
  Product: 'product',
  Category: 'category',
  BlogPost: 'blogPost',
  Award: 'award',
  GalleryImage: 'galleryImage',
  Testimonial: 'testimonial',
  ContactMessage: 'contactMessage',
  Order: 'order',
  SiteSettings: 'siteSettings',
  User: 'user',
};

const PUBLIC_CREATE = new Set(['ContactMessage']);
const PUBLIC_READ_ALL = new Set(['Category', 'Testimonial', 'SiteSettings']);
const HAS_PUBLISHED = new Set(['Product', 'BlogPost', 'Award', 'GalleryImage']);

function getDelegate(name: ModelName) {
  return (prisma as any)[name];
}

function parseQuery(req: any) {
  let filter: Record<string, any> = {};
  if (req.query.q) {
    try {
      filter = typeof req.query.q === 'string' ? JSON.parse(req.query.q) : req.query.q;
    } catch {
      /* ignore */
    }
  }
  // Also accept flat query params
  for (const key of ['published', 'featured', 'category', 'slug', 'status']) {
    if (req.query[key] !== undefined) {
      const v = req.query[key];
      filter[key] = v === 'true' ? true : v === 'false' ? false : v;
    }
  }
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const skip = Number(req.query.skip) || 0;
  let orderBy: any = { sort_order: 'asc' };
  if (req.query.sort_by) {
    const s = String(req.query.sort_by);
    if (s.startsWith('-')) {
      const field = s.slice(1);
      orderBy = { [field === 'created_date' ? 'createdAt' : field === 'updated_date' ? 'updatedAt' : field]: 'desc' };
    } else {
      orderBy = { [s === 'created_date' ? 'createdAt' : s === 'updated_date' ? 'updatedAt' : s]: 'asc' };
    }
  }
  return { filter, limit, skip, orderBy };
}

function serialize(entity: string, row: any) {
  if (entity === 'Product') return serializeProduct(row);
  if (entity === 'Order') return serializeOrder(row);
  return serializeGeneric(row);
}

function prepare(entity: string, body: any) {
  if (entity === 'Product') return prepareProductData(body);
  if (entity === 'Order') return prepareOrderData(body);
  const data = { ...body };
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.created_date;
  delete data.updated_date;
  delete data.passwordHash;
  return data;
}

// Generic list
router.get('/entities/:entity', optionalAuth, async (req: AuthRequest, res) => {
  const entity = req.params.entity;
  const model = ENTITY_MAP[entity];
  if (!model) return res.status(404).json({ error: 'Unknown entity' });

  try {
    const { filter, limit, skip, orderBy } = parseQuery(req);
    const isAdmin = req.user?.role === 'admin';

    if (HAS_PUBLISHED.has(entity) && !isAdmin && filter.published === undefined) {
      filter.published = true;
    }
    if (entity === 'ContactMessage' && !isAdmin) {
      return res.status(403).json({ error: 'Admin only' });
    }
    if (entity === 'Order' && !isAdmin) {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      filter.userId = req.user.id;
    }
    if (entity === 'User' && !isAdmin) {
      return res.status(403).json({ error: 'Admin only' });
    }

    // Remove password from user list
    const rows = await getDelegate(model).findMany({
      where: filter,
      take: limit,
      skip,
      orderBy: model === 'order' || model === 'contactMessage' || model === 'user' || model === 'siteSettings'
        ? (Object.keys(orderBy)[0] === 'sort_order' ? { createdAt: 'desc' } : orderBy)
        : orderBy,
    });

    const out = rows.map((r: any) => {
      const s = serialize(entity, r);
      if (entity === 'User') {
        const { passwordHash, ...rest } = s;
        return rest;
      }
      return s;
    });
    res.json(out);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Create
router.post('/entities/:entity', optionalAuth, async (req: AuthRequest, res) => {
  const entity = req.params.entity;
  const model = ENTITY_MAP[entity];
  if (!model) return res.status(404).json({ error: 'Unknown entity' });

  try {
    const isAdmin = req.user?.role === 'admin';
    if (!PUBLIC_CREATE.has(entity) && entity !== 'Order' && !isAdmin) {
      return res.status(403).json({ error: 'Admin only' });
    }

    const data = prepare(entity, req.body);
    if (entity === 'Order' && req.user) {
      data.userId = req.user.id;
    }
    if (entity === 'User') {
      return res.status(400).json({ error: 'Use /api/auth/register' });
    }

    const row = await getDelegate(model).create({ data });
    res.status(201).json(serialize(entity, row));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Get by id
router.get('/entities/:entity/:id', optionalAuth, async (req: AuthRequest, res) => {
  const entity = req.params.entity;
  const model = ENTITY_MAP[entity];
  if (!model) return res.status(404).json({ error: 'Unknown entity' });

  try {
    const row = await getDelegate(model).findUnique({ where: { id: req.params.id } });
    if (!row) return res.status(404).json({ error: 'Not found' });

    if (HAS_PUBLISHED.has(entity) && !(row as any).published && req.user?.role !== 'admin') {
      return res.status(404).json({ error: 'Not found' });
    }
    if (entity === 'ContactMessage' && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    if (entity === 'Order') {
      const isAdmin = req.user?.role === 'admin';
      if (!isAdmin && (row as any).userId !== req.user?.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    const s = serialize(entity, row);
    if (entity === 'User') {
      const { passwordHash, ...rest } = s;
      return res.json(rest);
    }
    res.json(s);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Update
router.put('/entities/:entity/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  const entity = req.params.entity;
  const model = ENTITY_MAP[entity];
  if (!model) return res.status(404).json({ error: 'Unknown entity' });
  if (entity === 'User' && req.body.passwordHash) delete req.body.passwordHash;

  try {
    const data = prepare(entity, req.body);
    const row = await getDelegate(model).update({
      where: { id: req.params.id },
      data,
    });
    res.json(serialize(entity, row));
  } catch (e: any) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Not found' });
    res.status(500).json({ error: e.message });
  }
});

// Delete
router.delete('/entities/:entity/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  const entity = req.params.entity;
  const model = ENTITY_MAP[entity];
  if (!model) return res.status(404).json({ error: 'Unknown entity' });

  try {
    await getDelegate(model).delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e: any) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Not found' });
    res.status(500).json({ error: e.message });
  }
});

// Bulk create
router.post('/entities/:entity/bulk', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  const entity = req.params.entity;
  const model = ENTITY_MAP[entity];
  if (!model) return res.status(404).json({ error: 'Unknown entity' });

  try {
    const items = Array.isArray(req.body) ? req.body : req.body.items || [];
    const created = [];
    for (const item of items) {
      const data = prepare(entity, item);
      const row = await getDelegate(model).create({ data });
      created.push(serialize(entity, row));
    }
    res.status(201).json(created);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
