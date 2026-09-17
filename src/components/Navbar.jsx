import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/lib/AuthContext';
import { t } from '@/lib/i18n';
import MobileMenu from '@/components/MobileMenu';
import NavbarParticles from '@/components/NavbarParticles';

export default function Navbar() {
  const { lang, cartCount, setCartOpen, dir, isStoreMode, toggleLang, theme, toggleTheme } = useApp();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { href: '/', label: t(lang, 'home') },
    { href: '/shop', label: t(lang, 'shop') },
    { href: '/about', label: t(lang, 'about') },
    { href: '/awards', label: t(lang, 'awards') },
    { href: '/blog', label: t(lang, 'blog') },
    { href: '/contact', label: t(lang, 'contact') },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 liquid-glass transition-all duration-500"
        style={{
          borderBottom: '1px solid var(--border)',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.08)' : 'inset 0 1px 1px rgba(255,255,255,0.06)',
          paddingTop: 'var(--safe-area-top)',
          paddingLeft: 'var(--safe-area-left)',
          paddingRight: 'var(--safe-area-right)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-24">

            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img
                src="/logo.png"
                alt="7Golden"
                className="h-16 md:h-20 w-auto object-contain transition-all group-hover:opacity-90"
                // style={{ filter: theme === 'light' ? 'brightness(0)' : 'none' }}
              />
            </Link>

            {/* Desktop Nav */}
            {/* <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-body text-lg md:text:sm transition-all duration-300 relative group px-3.5 py-2"
                  style={{
                    color: location.pathname === link.href ? 'var(--accent)' : 'var(--fg)',
                    opacity: location.pathname === link.href ? 1 : 0.75,
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-1/2 w-6 h-px -translate-x-1/2 transition-all duration-300 origin-center scale-x-0 group-hover:scale-x-100"
                    style={{ background: 'var(--accent)' }}
                  />
                </Link>
              ))}
            </div> */}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Admin panel */}
              {/* {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:flex w-11 h-11 rounded-full items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 glass-pill"
                  style={{ color: 'var(--accent)' }}
                  aria-label="پنل مدیریت"
                >
                  <LayoutDashboard size={16} />
                </Link>
              )} */}

              {/* Language switcher */}
              {/* <button
                onClick={toggleLang}
                className="hidden sm:flex w-11 h-11 rounded-full items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 glass-pill"
                style={{ color: 'var(--fg)' }}
                aria-label="Switch language"
              >
                <Languages size={16} />
              </button> */}

              {/* Theme toggle */}
              {/* <button
                onClick={toggleTheme}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 glass-pill"
                style={{ color: 'var(--fg)' }}
                aria-label={theme === 'dark' ? 'حالت روشن' : 'Dark mode'}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button> */}

              {/* Account / Login */}
              {/* <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 glass-pill"
                style={{ color: 'var(--fg)' }}
                aria-label={isAuthenticated ? 'پنل کاربری' : 'ورود'}
              >
                <User size={16} />
              </Link> */}

              {/* {isStoreMode && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))' }}
                  aria-label={t(lang, 'cart')}
                >
                  <ShoppingBag size={16} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: '#ef4444', color: '#fff' }}>
                      {cartCount}
                    </span>
                  )}
                </button>
              )} */}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-11 h-11 rounded-full glass-card flex items-center justify-center transition-all active:scale-90"
                style={{ color: 'var(--fg)', border: 'none' }}
                aria-label="Menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
        <NavbarParticles />
      </nav>

      {/* Mobile glass menu */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}