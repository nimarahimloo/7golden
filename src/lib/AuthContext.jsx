import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
const TOKEN_KEY = 'access_token';

async function api(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`/api${path}`, {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      // Public pages must remain available even when the settings service is slow.
      const settingsController = new AbortController();
      const settingsTimeoutId = window.setTimeout(() => settingsController.abort(), 4000);
      try {
        const response = await fetch('/api/settings', { signal: settingsController.signal });
        const settings = response.ok ? await response.json().catch(() => null) : null;
        setAppPublicSettings(settings || { site_mode: 'corporate', public: true });
      } catch {
        setAppPublicSettings({ site_mode: 'corporate', public: true });
      } finally {
        window.clearTimeout(settingsTimeoutId);
        setIsLoadingPublicSettings(false);
      }

      if (localStorage.getItem(TOKEN_KEY)) {
        await checkUserAuth();
      } else {
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
        setAuthChecked(true);
      }
    } catch (error) {
      console.error('App state check failed:', error);
      setAppPublicSettings({ site_mode: 'corporate', public: true });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
      setAuthError(null); // public site must still load
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await api('/auth/me');
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const login = async (email, password) => {
    const data = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
    setUser(data.user || null);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (email, password, name) => {
    const data = await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    if (data.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
    setUser(data.user || null);
    setIsAuthenticated(true);
    return data;
  };

  const logout = (shouldRedirect = true) => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    if (shouldRedirect) window.location.href = '/';
  };

  const navigateToLogin = () => {
    window.location.href = `/login?returnTo=${encodeURIComponent(window.location.href)}`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
        login,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
