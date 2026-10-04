/**
 * Local API adapter — replaces @base44/sdk.
 * Public pages use src/lib/api/content.js; admin still calls base44.entities.*
 */

const TOKEN_KEY = 'access_token';

function token() {
  return localStorage.getItem(TOKEN_KEY);
}

async function req(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function entityApi(name) {
  const base = `/entities/${name}`;
  return {
    list: async (sort, limit = 100) => {
      const q = new URLSearchParams();
      if (typeof sort === 'string') q.set('sort_by', sort);
      if (limit) q.set('limit', String(limit));
      const qs = q.toString() ? `?${q}` : '';
      return req(`${base}${qs}`);
    },
    filter: async (filter = {}, sort, limit = 100) => {
      const q = new URLSearchParams();
      q.set('q', JSON.stringify(filter));
      if (typeof sort === 'string') q.set('sort_by', sort);
      if (limit) q.set('limit', String(limit));
      return req(`${base}?${q}`);
    },
    get: (id) => req(`${base}/${id}`),
    create: (body) => req(base, { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => req(`${base}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => req(`${base}/${id}`, { method: 'DELETE' }),
    bulkCreate: (items) => req(`${base}/bulk`, { method: 'POST', body: JSON.stringify(items) }),
  };
}

const entityNames = [
  'Product', 'Category', 'BlogPost', 'Award', 'GalleryImage',
  'Testimonial', 'ContactMessage', 'Order', 'SiteSettings', 'User',
  'PageSection',
];

const entities = {};
for (const n of entityNames) entities[n] = entityApi(n);

export const base44 = {
  auth: {
    me: () => req('/auth/me'),
    logout: (redirect) => {
      localStorage.removeItem(TOKEN_KEY);
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      if (redirect) window.location.href = typeof redirect === 'string' ? redirect : '/';
    },
    loginViaEmailPassword: async (email, password) => {
      const data = await req('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
      return data;
    },
    register: async ({ email, password, name }) => {
      const data = await req('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      if (data.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
      return data;
    },
    updateMe: (body) => req('/auth/me', { method: 'PATCH', body: JSON.stringify(body) }),
    loginWithProvider: () => { throw new Error('OAuth not configured on local backend'); },
    redirectToLogin: () => { window.location.href = '/login'; },
    resetPasswordRequest: async () => ({ ok: true }),
    resetPassword: async () => ({ ok: true }),
    verifyOtp: async () => { throw new Error('OTP not configured'); },
    resendOtp: async () => ({ ok: true }),
    deleteAccount: async () => { throw new Error('Not implemented'); },
    setToken: (t) => localStorage.setItem(TOKEN_KEY, t),
    isAuthenticated: () => !!token(),
  },
  users: {
    deleteUser: async () => { throw new Error('Not implemented'); },
  },
  entities,
  agents: {
    createConversation: async () => ({ id: 'local-disabled' }),
    getConversation: async () => ({ id: 'local-disabled', messages: [] }),
    addMessage: async () => ({}),
    subscribeToConversation: () => () => {},
    getConversations: async () => [],
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: token() ? { Authorization: `Bearer ${token()}` } : {},
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        return data;
      },
    },
  },
};

export default base44;
