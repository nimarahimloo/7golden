import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Phone, ChevronLeft } from 'lucide-react';
import { t } from '@/lib/i18n';
import MobileMenu from '@/components/MobileMenu';

/**
 * Navbar — the site header.
 * Transparent over the page's hero, it turns into a solid blurred bar
 * (and shrinks) once the visitor scrolls. Desktop shows the full menu, the
 * trade-desk phone and a "request a quote" button; below `lg` the menu
 * collapses into the slide-in sheet. (Retail cart / account controls are
 * intentionally absent — 7Golden sells B2B only.)
 */
const NAV_LINKS = [
  { href: '/', label: t('home') },
  { href: '/shop', label: t('shop') },
  { href: '/about', label: t('about') },
  { href: '/news', label: t('news') },
  { href: '/blog', label: t('blog') },
  { href: '/contact', label: t('contact') },
];

function isActivePath(pathname, href) {
  if (href === '/') return pathname === '/';
  if (href === '/shop') return pathname === '/shop' || pathname.startsWith('/product/');
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        dir="rtl"
        className={`site-header ${scrolled ? 'is-scrolled' : ''}`}
        style={{
          paddingTop: 'var(--safe-area-top)',
          paddingLeft: 'var(--safe-area-left)',
          paddingRight: 'var(--safe-area-right)',
        }}
      >
        <div className="site-header-inner max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">

          {/* Brand */}
          <Link to="/" className="flex-shrink-0 flex items-center" aria-label="هفت‌طلایی — صفحه اصلی">
            <img src="/logo.webp" alt="7Golden" className="site-header-logo" />
          </Link>

          {/* Primary navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="منوی اصلی">
            {NAV_LINKS.map(link => {
              const active = isActivePath(location.pathname, link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`nav-link ${active ? 'is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Trade desk actions */}
          <div className="flex items-center gap-3">
            <a href="tel:+989121823438" className="header-phone hidden xl:inline-flex" aria-label="تماس با واحد بازرگانی">
              <span className="header-phone-icon"><Phone size={16} /></span>
              <span>۰۹۱۲ ۱۸۲ ۳۴۳۸</span>
            </a>

            <Link to="/contact" className="btn-gold btn-sm hidden md:inline-flex">
              درخواست قیمت و نمونه
              <ChevronLeft size={15} />
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
              style={{ color: '#fff', border: '1px solid var(--hairline-strong)', background: 'rgba(227,194,99,0.07)' }}
              aria-label="باز کردن منو"
              aria-expanded={menuOpen}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        <div className="nav-gold-sheen" />
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
