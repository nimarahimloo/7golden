import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSiteSettings } from '@/lib/api/content';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState('fa');
  const [theme, setTheme] = useState('dark');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [siteMode, setSiteMode] = useState(() => localStorage.getItem('7golden_site_mode') || 'store');

  const dir = lang === 'fa' ? 'rtl' : 'ltr';
  const isStoreMode = siteMode === 'store';

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('7golden_cart') || '[]');
    setCart(savedCart);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [lang, dir]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('7golden_theme', theme);
  }, [theme]);

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

  const toggleTheme = () => {};
  const toggleLang = () => setLang(prev => prev === 'fa' ? 'en' : 'fa');

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
      lang, toggleLang, dir,
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