/** Parse JSON string fields back to objects for API responses */
export function serializeProduct(p: any) {
  if (!p) return p;
  return {
    ...p,
    gallery: safeJson(p.gallery, []),
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
