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
  if (!data.title_en && data.title_fa) data.title_en = data.title_fa;
  if (!data.excerpt_en && data.excerpt_fa) data.excerpt_en = data.excerpt_fa;
  delete data.cover;
  delete data.body_fa;
  delete data.body_en;
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

/** Always sync *_en from *_fa (FA is source of truth). Normalize images. */
export function fillEnFromFa(body: any) {
  const data: any = { ...body };
  for (const key of Object.keys(data)) {
    if (key.endsWith('_fa') && data[key] != null && data[key] !== '') {
      const enKey = key.slice(0, -3) + '_en';
      data[enKey] = data[key];
    }
  }
  if (data.badge != null && data.badge !== '') data.badge_en = data.badge;
  if (data.name_fa) data.name_en = data.name_fa;
  if (data.title_fa) data.title_en = data.title_fa;
  if (data.desc_fa) data.desc_en = data.desc_fa;
  if (data.excerpt_fa) data.excerpt_en = data.excerpt_fa;
  if (data.origin_fa) data.origin_en = data.origin_fa;
  if (data.cover && !data.image) data.image = data.cover;
  if (data.image) data.image = normalizeMediaUrl(data.image);
  if (data.cover) data.cover = normalizeMediaUrl(data.cover);
  if (Array.isArray(data.gallery)) {
    data.gallery = data.gallery.map((g: any) => normalizeMediaUrl(g));
  }
  delete data.cover;
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
    'slug','name_fa','name_en','desc_fa','desc_en','category','origin_fa','origin_en',
    'price','price_display','image','gallery','badge','badge_en','taste','weights',
    'in_stock','featured','published','sort_order',
  ],
  Category: ['slug','name_fa','name_en','desc_fa','desc_en','image','sort_order'],
  BlogPost: [
    'slug','title_fa','title_en','excerpt_fa','excerpt_en','content',
    'date_fa','date_en','category','image','published','sort_order',
  ],
  Award: ['title_fa','title_en','desc_fa','desc_en','image','sort_order','published'],
  GalleryImage: ['title_fa','title_en','image','sort_order','published'],
  Testimonial: [
    'name_fa','name_en','role_fa','role_en','text_fa','text_en','avatar','sort_order','published',
  ],
  ContactMessage: ['name','phone','email','message','status'],
  Order: [
    'customer_name','name','phone','email','address','status','notes','total','total_amount','items','userId',
  ],
  SiteSettings: [
    'site_name_fa','site_name_en','site_mode',
    'default_seo_title_fa','default_seo_title_en','default_seo_desc_fa','default_seo_desc_en',
    'og_image','logo_url','contact_phone','contact_mobile','contact_email',
    'hq_address_fa','hq_address_en','tehran_address_fa','tehran_address_en',
    'working_hours_fa','working_hours_en',
  ],
  User: ['email','name','role'],
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
    delete data.body_en;
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
