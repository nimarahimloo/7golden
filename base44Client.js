/**
 * Local Base44-compatible client facade.
 * Talks only to the project's own backend (/api/*). Zero external Base44 dependency.
 */

const API = '/api';
const TOKEN_KEY = 'access_token';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('base44_access_token');
}

function setToken(token) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('base44_access_token', token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('base44_access_token');
  }
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

const auth = {
  async me() {
    return request('/auth/me');
  },
  async loginViaEmailPassword(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (data.access_token) setToken(data.access_token);
    return data;
  },
  async register({ email, password, name }) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: { email, password, name },
    });
    if (data.access_token) setToken(data.access_token);
    return data;
  },
  async updateMe(payload) {
    return request('/auth/me', { method: 'PATCH', body: payload });
  },
  async logout(redirectTo) {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {
      /* ignore */
    }
    setToken(null);
    if (redirectTo && typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
  },
  setToken,
  getToken,
  loginWithProvider() {
    throw new Error('OAuth (Google/Apple) is not available on the local backend. Use email/password.');
  },
  redirectToLogin(returnTo) {
    if (typeof window !== 'undefined') {
      const q = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : '';
      window.location.href = `/login${q}`;
    }
  },
  async resetPasswordRequest() {
    throw new Error('Password reset email is not configured on the local backend yet.');
  },
  async resetPassword() {
    throw new Error('Password reset is not configured on the local backend yet.');
  },
  async verifyOtp() {
    throw new Error('OTP verification is not used by the local backend. Registration is immediate.');
  },
  async resendOtp() {
    throw new Error('OTP is not used by the local backend.');
  },
  isAuthenticated() {
    return !!getToken();
  },
};

function entityHandler(entityName) {
  return {
    async list(sort, limit) {
      const params = new URLSearchParams();
      if (sort) params.set('sort_by', sort);
      if (limit) params.set('limit', String(limit));
      const qs = params.toString() ? `?${params}` : '';
      try {
        return await request(`/entities/${entityName}${qs}`);
      } catch {
        const map = {
          Product: '/products',
          Category: '/categories',
          BlogPost: '/blog',
          Award: '/awards',
          GalleryImage: '/gallery',
          Testimonial: '/testimonials',
          SiteSettings: '/settings',
        };
        if (map[entityName]) return request(map[entityName]);
        throw new Error(`Entity ${entityName} list failed`);
      }
    },
    async get(id) {
      return request(`/entities/${entityName}/${id}`);
    },
    async create(body) {
      return request(`/entities/${entityName}`, { method: 'POST', body });
    },
    async update(id, body) {
      return request(`/entities/${entityName}/${id}`, { method: 'PUT', body });
    },
    async delete(id) {
      return request(`/entities/${entityName}/${id}`, { method: 'DELETE' });
    },
    async filter(query, sort, limit) {
      const params = new URLSearchParams();
      if (query) params.set('q', JSON.stringify(query));
      if (sort) params.set('sort_by', sort);
      if (limit) params.set('limit', String(limit));
      return request(`/entities/${entityName}?${params}`);
    },
  };
}

const entities = new Proxy(
  {},
  {
    get(_t, prop) {
      if (typeof prop === 'string') return entityHandler(prop);
      return undefined;
    },
  }
);

const integrations = {
  Core: {
    async UploadFile({ file }) {
      const form = new FormData();
      form.append('file', file);
      const token = getToken();
      const res = await fetch(`${API}/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
      return { file_url: data.file_url || data.url };
    },
  },
};

const agents = {
  async createConversation() {
    throw new Error('Support agents are not available on the local backend.');
  },
  async getConversation() {
    throw new Error('Support agents are not available on the local backend.');
  },
  async addMessage() {
    throw new Error('Support agents are not available on the local backend.');
  },
  subscribeToConversation() {
    return () => {};
  },
};

const users = {
  async deleteUser(id) {
    return request(`/entities/User/${id}`, { method: 'DELETE' });
  },
};

export const base44 = {
  auth,
  entities,
  integrations,
  agents,
  users,
};

export default base44;
