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

