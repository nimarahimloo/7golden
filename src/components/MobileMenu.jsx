import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, ShoppingBag, Info, BookOpen, Mail, Award, Languages } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';

export default function MobileMenu({ open, onClose }) {
  const { lang, dir, cartCount, setCartOpen, toggleLang } = useApp();
  const location = useLocation();
  const isFA = lang === 'fa';
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';

  const links = [
    { href: '/', label: t(lang, 'home'), icon: Home, desc: isFA ? 'صفحه اصلی' : 'Main page' },
    { href: '/shop', label: t(lang, 'shop'), icon: ShoppingBag, desc: isFA ? 'محصولات هفت‌طلایی' : 'Our products' },
    { href: '/about', label: t(lang, 'about'), icon: Info, desc: isFA ? 'داستان ما' : 'Our story' },
    { href: '/awards', label: t(lang, 'awards'), icon: Award, desc: isFA ? 'مجوزها و جوایز' : 'Awards & licenses' },
    { href: '/blog', label: t(lang, 'blog'), icon: BookOpen, desc: isFA ? 'اخبار و مطالب' : 'News & articles' },
    { href: '/contact', label: t(lang, 'contact'), icon: Mail, desc: isFA ? 'تماس با ما' : 'Get in touch' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] md:hidden transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.25)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Glass panel */}
      <div
        className="fixed top-0 left-0 right-0 z-[70] md:hidden glass-strong"
        style={{
          transform: open ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
          minHeight: '100vh',
        }}
        dir={dir}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16">
          <span className="font-heading font-extrabold text-lg" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
            {isFA ? 'منو' : 'Menu'}
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'var(--border)', color: 'var(--fg)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links — card style */}
        <div className="px-4 pt-3 pb-4 flex flex-col gap-2.5">
          {links.map(link => {
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className="flex items-center gap-4 p-3.5 rounded-2xl transition-all active:scale-[0.97]"
                style={{
                  background: active ? 'hsl(var(--accent-hsl) / 0.1)' : 'var(--glass)',
                  backdropFilter: active ? 'none' : 'blur(12px)',
                  WebkitBackdropFilter: active ? 'none' : 'blur(12px)',
                  border: active ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: active ? 'var(--accent)' : 'hsl(var(--muted))',
                    color: active ? 'hsl(var(--accent-foreground))' : 'var(--accent)',
                  }}
                >
                  <link.icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-heading font-extrabold text-base"
                    style={{ color: 'var(--fg)', fontFamily: headingFont }}
                  >
                    {link.label}
                  </div>
                  <div className="font-body text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>
                    {link.desc}
                  </div>
                </div>
                {active && (
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom actions — glass cards */}
        <div className="px-4 pt-2 pb-6">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Language toggle */}
            <button
              onClick={() => { onClose(); toggleLang(); }}
              className="glass-card flex flex-col items-center gap-1.5 py-4 transition-all active:scale-95"
              style={{ color: 'var(--fg)' }}
            >
              <Languages size={20} style={{ color: 'var(--accent)' }} />
              <span className="font-body text-[10px] font-semibold" style={{ color: 'var(--fg-muted)' }}>
                {isFA ? 'English' : 'فارسی'}
              </span>
            </button>
            {/* Cart */}
            <button
              onClick={() => { onClose(); setCartOpen(true); }}
              className="glass-card flex flex-col items-center gap-1.5 py-4 transition-all active:scale-95 relative"
              style={{ color: 'var(--fg)' }}
            >
              <div className="relative">
                <ShoppingBag size={20} style={{ color: 'var(--accent)' }} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full flex items-center justify-center font-body text-[9px] font-bold"
                    style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))' }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-body text-[10px] font-semibold" style={{ color: 'var(--fg-muted)' }}>
                سبد خرید
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}