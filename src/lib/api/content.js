// Storefront data-access layer.
// All pages should import from here instead of touching entities or static
// data directly. Returns view-model objects shaped to match the existing
// storefront components (camelCase fields, id === slug for routing compat).
import { base44 } from '@/api/base44Client';

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

export async function getProducts(opts = {}) {
  const { featured, category, limit = 100 } = opts;
  const query = { published: true };
  if (featured) query.featured = true;
  if (category) query.category = category;
  const items = await base44.entities.Product.filter(query, 'sort_order', limit);
  return items.map(normalizeProduct);
}

export async function getProductBySlug(slug) {
  const items = await base44.entities.Product.filter({ slug, published: true }, 'sort_order', 1);
  return items[0] ? normalizeProduct(items[0]) : null;
}

export async function getCategories() {
  const items = await base44.entities.Category.list('sort_order', 100);
  return items.map(normalizeCategory);
}

export async function getTestimonials() {
  const items = await base44.entities.Testimonial.list('sort_order', 100);
  return items.map(normalizeTestimonial);
}

export async function getBlogPosts(opts = {}) {
  const { limit = 100 } = opts;
  const items = await base44.entities.BlogPost.filter({ published: true }, 'sort_order', limit);
  return items.map(normalizeBlogPost);
}

export async function getBlogPostBySlug(slug) {
  const items = await base44.entities.BlogPost.filter({ slug, published: true }, 'sort_order', 1);
  return items[0] ? normalizeBlogPost(items[0]) : null;
}

function normalizeGalleryImage(r) {
  return {
    id: r.slug || r.id,
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

export async function getGalleryImages() {
  const items = await base44.entities.GalleryImage.filter({ published: true }, 'sort_order', 100);
  return items.map(normalizeGalleryImage);
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

export async function getAwards() {
  const items = await base44.entities.Award.filter({ published: true }, 'sort_order', 100);
  return items.map(normalizeAward);
}

export async function createContactMessage(data) {
  return base44.entities.ContactMessage.create({
    name: data.name,
    phone: data.phone || '',
    email: data.email || '',
    message: data.message,
    status: 'new',
  });
}

export async function getSiteSettings() {
  const items = await base44.entities.SiteSettings.list();
  return items[0] || null;
}

export async function getSiteMode() {
  const settings = await getSiteSettings();
  return settings?.site_mode || 'store';
}