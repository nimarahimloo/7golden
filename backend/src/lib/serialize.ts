/** Parse JSON string fields back to objects for API responses */
export function serializeProduct(p: any) {
  if (!p) return p;
  const gallery = safeJson(p.gallery, []).map((g: any) =>
    typeof g === 'string' ? (g.replace(/^https?:\/\/[^/]+(:\d+)?/i, '') ) : g
  );
  return {
    ...p,
    image: typeof p.image === 'string' ? p.image.replace(/^https?:\/\/[^/]+(:\d+)?/i, '') : p.image,
    gallery,
    taste: safeJson(p.taste, { bitter: 0, sweet: 0, earthy: 0, nutty: 0 }),
    weights: safeJson(p.weights, []),
    created_date: p.createdAt,
    updated_date: p.updatedAt,
  };
}

export function serializeOrder(o: any) {
  if (!o) return o;
  return {
    ...o,
    items: safeJson(o.items, []),
    created_date: o.createdAt,
    updated_date: o.updatedAt,
  };
}

export function serializeGeneric(r: any) {
  if (!r) return r;
  return {
    ...r,
    created_date: r.createdAt,
    updated_date: r.updatedAt,
  };
}

function safeJson(val: any, fallback: any) {
  if (val == null) return fallback;
  if (typeof val !== 'string') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

/** Prepare write data: stringify JSON fields for SQLite */
export function prepareProductData(body: any) {
  const data = { ...body };
  // corporate site: no shop fields required from admin
  if (data.price === undefined || data.price === null || data.price === '') data.price = 0;
  if (data.price_display === undefined) data.price_display = null;
  if (data.in_stock === undefined) data.in_stock = true;
  if (data.featured === undefined) data.featured = false;
  if (data.badge === undefined) data.badge = null;
  if (!data.image && Array.isArray(data.gallery) && data.gallery[0]) data.image = data.gallery[0];
  if (!data.image) data.image = '/logo.png';
  // corporate defaults
  if (data.gallery !== undefined && typeof data.gallery !== 'string') {
    data.gallery = JSON.stringify(data.gallery);
  }
  if (data.taste !== undefined && typeof data.taste !== 'string') {
    data.taste = JSON.stringify(data.taste);
  }
  if (data.weights !== undefined && typeof data.weights !== 'string') {
    data.weights = JSON.stringify(data.weights);
  }
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.created_date;
  delete data.updated_date;
  return data;
}

export function prepareOrderData(body: any) {
  const data = { ...body };
  if (data.items !== undefined && typeof data.items !== 'string') {
    data.items = JSON.stringify(data.items);
  }
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.created_date;
  delete data.updated_date;
  delete data.user;
  return data;
}


export function prepareBlogPostData(body: any) {
  const data: any = { ...body };
  // map admin UI fields → schema
  if (data.cover && !data.image) data.image = data.cover;
  if (data.body_fa && !data.content) data.content = data.body_fa;
  if (data.body && !data.content) data.content = data.body;
  if (!data.image) data.image = '/logo.png';
  delete data.cover;
  delete data.body_fa;
    delete data.body;
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.created_date;
  delete data.updated_date;
  return data;
}

/** Force relative upload URLs (never :3001 public) */
export function normalizeMediaUrl(url: any): any {
  if (url == null || typeof url !== 'string') return url;
  let u = url.trim();
  // absolute to this server → path only
  u = u.replace(/^https?:\/\/[^/]+(:\d+)?/i, '');
  if (u.startsWith('/uploads/') || u.startsWith('/product/') || u.startsWith('/banner/') || u.startsWith('/certificates/')) {
    return u;
  }
  // leftover host-only
  if (u.includes('/uploads/')) {
    const i = u.indexOf('/uploads/');
    return u.slice(i);
  }
  return u;
}

/** FA-only site: normalize media, drop any leftover *_en keys. */
export function fillEnFromFa(body: any) {
  // schema is FA-only now — do not inject *_en
  const data: any = { ...body };
  for (const k of Object.keys(data)) {
    if (k.endsWith('_en')) delete data[k];
  }
  return data;
}

/** On read: fix bad absolute upload URLs in API responses */
export function normalizeRowMedia(row: any) {
  if (!row) return row;
  const r = { ...row };
  for (const k of ['image', 'cover', 'avatar']) {
    if (typeof r[k] === 'string') r[k] = normalizeMediaUrl(r[k]);
  }
  if (Array.isArray(r.gallery)) r.gallery = r.gallery.map((g: any) => normalizeMediaUrl(g));
  return r;
}


/** Allowed writable fields per Prisma model (no id/timestamps) */
export const ENTITY_WRITE_FIELDS: Record<string, string[]> = {
  Product: [
    'slug','name_fa','desc_fa','category','origin_fa',
    'price','price_display','image','gallery','badge',
    'taste','weights','in_stock','featured','published','sort_order',
  ],
  Category: ['slug','name_fa','desc_fa','image','sort_order'],
  BlogPost: [
    'slug','title_fa','excerpt_fa','content','date_fa','category','image','published','sort_order',
  ],
  Award: ['title_fa','desc_fa','image','sort_order','published'],
  GalleryImage: ['title_fa','image','sort_order','published'],
  Testimonial: ['name_fa','role_fa','text_fa','avatar','rating','sort_order','published'],
  ContactMessage: ['name','phone','email','message','status'],
  Order: [
    'customer_name','name','phone','email','address','status','notes','total','total_amount','items','userId',
  ],
  SiteSettings: [
    'site_name_fa','site_mode',
    'default_seo_title_fa','default_seo_desc_fa',
    'og_image','logo_url','contact_phone','contact_mobile','contact_email',
    'hq_address_fa','tehran_address_fa','working_hours_fa',
  ],
  User: ['email','name','role'],
  PageSection: ['page_key','section_key','title_fa','subtitle_fa','badge_fa','image','published','sort_order'],
};

/** Map aliases from admin UI → schema names */
export function applyFieldAliases(entity: string, body: any) {
  const data = { ...body };
  if (entity === 'SiteSettings') {
    if (data.email != null && data.contact_email == null) data.contact_email = data.email;
    if (data.phone != null && data.contact_phone == null) data.contact_phone = data.phone;
    if (data.mobile != null && data.contact_mobile == null) data.contact_mobile = data.mobile;
    if (data.seo_title_fa != null && data.default_seo_title_fa == null) data.default_seo_title_fa = data.seo_title_fa;
    if (data.seo_desc_fa != null && data.default_seo_desc_fa == null) data.default_seo_desc_fa = data.seo_desc_fa;
    delete data.email;
    delete data.phone;
    delete data.mobile;
    delete data.seo_title_fa;
    delete data.seo_desc_fa;
    delete data.instagram;
    delete data.whatsapp;
  }
  if (entity === 'BlogPost') {
    if (data.cover && !data.image) data.image = data.cover;
    if (data.body_fa && !data.content) data.content = data.body_fa;
    if (data.body && !data.content) data.content = data.body;
    delete data.cover;
    delete data.body_fa;
        delete data.body;
  }
  if (entity === 'Testimonial') {
    if (data.content_fa && !data.text_fa) data.text_fa = data.content_fa;
    delete data.content_fa;
  }
  return data;
}

/** Keep only fields that exist on the model */
export function pickAllowedFields(entity: string, body: any) {
  const allowed = ENTITY_WRITE_FIELDS[entity];
  if (!allowed) {
    const data = { ...body };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.created_date;
    delete data.updated_date;
    delete data.passwordHash;
    return data;
  }
  const out: any = {};
  for (const key of allowed) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}
