import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSiteSettings } from '@/lib/api/content';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('7golden_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  const [themeManual, setThemeManual] = useState(() => localStorage.getItem('7golden_theme_manual') === 'true');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [siteMode, setSiteMode] = useState(() => localStorage.getItem('7golden_site_mode') || 'store');

  const isStoreMode = siteMode === 'store';

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('7golden_cart') || '[]');
    setCart(savedCart);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('7golden_theme', theme);
    // Update theme-color meta for mobile browser chrome
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#050402' : '#F9F7F2');
    }
  }, [theme]);

  // Follow system theme when user hasn't manually toggled
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (!themeManual) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themeManual]);

  useEffect(() => {
    localStorage.setItem('7golden_cart', JSON.stringify(cart));
  }, [cart]);

  // Load site mode from settings
  const refreshSiteMode = async () => {
    try {
      const settings = await getSiteSettings();
      if (settings?.site_mode) {
        setSiteMode(settings.site_mode);
        localStorage.setItem('7golden_site_mode', settings.site_mode);
      }
    } catch (e) {
      // keep current mode
    }
  };

  useEffect(() => {
    refreshSiteMode();
  }, []);

  const toggleTheme = () => {
    setThemeManual(true);
    localStorage.setItem('7golden_theme_manual', 'true');
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addToCart = (product, qty = 1, weight = 500) => {
    setCart(prev => {
      const key = `${product.id}-${weight}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { ...product, qty, weight, key }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (key) => {
    setCart(prev => prev.filter(i => i.key !== key));
  };

  const updateQty = (key, qty) => {
    if (qty < 1) return removeFromCart(key);
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, isTransitioning,
      cart, addToCart, removeFromCart, updateQty, clearCart,
      cartOpen, setCartOpen,
      cartCount, cartTotal,
      siteMode, isStoreMode, refreshSiteMode
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}