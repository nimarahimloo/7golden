/**
 * 7Golden content API — talks to local backend (/api/*) via Vite proxy.
 * No Base44 dependency for public content.
 */

const API = '/api';

async function get(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function normalizeProduct(r) {
  return {
    id: r.slug || r.id,
    slug: r.slug,
    nameFA: r.name_fa,
    nameEN: r.name_en,
    descFA: r.desc_fa,
    descEN: r.desc_en,
    category: r.category,
    type: r.category,
    originFA: r.origin_fa,
    originEN: r.origin_en,
    price: r.price,
    priceDisplay: r.price_display,
    image: r.image,
    gallery: r.gallery || [],
    badge: r.badge || null,
    badgeEN: r.badge_en || null,
    taste: r.taste || { bitter: 0, sweet: 0, earthy: 0, nutty: 0 },
    weights: r.weights || [],
    inStock: r.in_stock !== false,
    featured: !!r.featured,
    published: r.published !== false,
  };
}

function normalizeCategory(r) {
  return {
    id: r.slug || r.id,
    slug: r.slug,
    nameFA: r.name_fa,
    nameEN: r.name_en,
    descFA: r.desc_fa,
    descEN: r.desc_en,
    image: r.image,
    count: 0,
  };
}

function normalizeTestimonial(r) {
  return {
    nameFA: r.name_fa,
    nameEN: r.name_en,
    roleFA: r.role_fa,
    roleEN: r.role_en,
    textFA: r.text_fa,
    textEN: r.text_en,
    rating: r.rating || 5,
  };
}

function normalizeBlogPost(r) {
  return {
    id: r.slug || r.id,
    slug: r.slug,
    titleFA: r.title_fa,
    titleEN: r.title_en,
    excerptFA: r.excerpt_fa,
    excerptEN: r.excerpt_en,
    content: r.content,
    date: r.date_fa,
    dateEN: r.date_en,
    category: r.category,
    image: r.image,
  };
}

function normalizeGalleryImage(r) {
  return {
    id: r.id,
    titleFA: r.title_fa,
    titleEN: r.title_en,
    descFA: r.desc_fa,
    descEN: r.desc_en,
    image: r.image,
    span: r.span || 'normal',
    sortOrder: r.sort_order || 0,
    published: r.published !== false,
  };
}

function normalizeAward(r) {
  return {
    id: r.id,
    titleFA: r.title_fa,
    titleEN: r.title_en,
    descFA: r.desc_fa,
    descEN: r.desc_en,
    image: r.image,
    sortOrder: r.sort_order || 0,
    published: r.published !== false,
  };
}

export async function getProducts(opts = {}) {
  const { featured, category, limit = 100 } = opts;
  const params = new URLSearchParams();
  if (featured) params.set('featured', 'true');
  if (category) params.set('category', category);
  if (limit) params.set('limit', String(limit));
  const q = params.toString() ? `?${params}` : '';
  const items = await get(`/products${q}`);
  return items.map(normalizeProduct);
}

export async function getProductBySlug(slug) {
  try {
    const item = await get(`/products/${encodeURIComponent(slug)}`);
    return normalizeProduct(item);
  } catch {
    return null;
  }
}

export async function getCategories() {
  const items = await get('/categories');
  return items.map(normalizeCategory);
}

export async function getTestimonials() {
  const items = await get('/testimonials');
  return items.map(normalizeTestimonial);
}

export async function getBlogPosts(opts = {}) {
  const { limit = 100 } = opts;
  const items = await get(`/blog?limit=${limit}`);
  return items.map(normalizeBlogPost);
}

export async function getBlogPostBySlug(slug) {
  try {
    const item = await get(`/blog/${encodeURIComponent(slug)}`);
    return normalizeBlogPost(item);
  } catch {
    return null;
  }
}

export async function getGalleryImages() {
  const items = await get('/gallery');
  return items.map(normalizeGalleryImage);
}

export async function getAwards() {
  const items = await get('/awards');
  return items.map(normalizeAward);
}

export async function createContactMessage(data) {
  return post('/contact', {
    name: data.name,
    phone: data.phone || '',
    email: data.email || '',
    message: data.message,
  });
}

export async function getSiteSettings() {
  return get('/settings');
}

export async function getSiteMode() {
  const settings = await getSiteSettings();
  return settings?.site_mode || 'corporate';
}

export async function createOrder(orderData) {
  return post('/orders', orderData);
}

export async function getOrders() {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${API}/orders`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}
