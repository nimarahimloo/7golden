import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState({
    id: 'local',
    site_mode: 'corporate',
    public: true,
  });

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      if (!base44.auth.getToken()) {
        setUser(null);
        setIsAuthenticated(false);
        setAuthChecked(true);
        setIsLoadingAuth(false);
        return;
      }
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthChecked(true);
    } catch (error) {
      console.error('User auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true);
      if (error.status === 401 || error.status === 403) {
        base44.auth.setToken(null);
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const checkAppState = async () => {
    await checkUserAuth();
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      base44.auth.logout('/');
    } else {
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
