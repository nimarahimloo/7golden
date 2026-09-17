import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, Package, Info, BookOpen, Mail, Award } from 'lucide-react';
import { t } from '@/lib/i18n';

export default function MobileMenu({ open, onClose }) {
  // const { cartCount, setCartOpen } = useApp(); // retail cart — disabled
  const location = useLocation();
  const isFA = true;
  const headingFont = 'Peyda, serif';

  const links = [
    { href: '/', label: t('home'), icon: Home, desc: isFA ? 'صفحه اصلی' : 'Main page' },
    { href: '/shop', label: t('shop'), icon: Package, desc: isFA ? 'پسته، بادام و فندق' : 'Pistachio, almond & hazelnut' },
    { href: '/about', label: t('about'), icon: Info, desc: isFA ? 'داستان ما' : 'Our story' },
    { href: '/awards', label: t('awards'), icon: Award, desc: isFA ? 'مجوزها و جوایز' : 'Awards & licenses' },
    { href: '/blog', label: t('blog'), icon: BookOpen, desc: isFA ? 'اخبار و مطالب' : 'News & articles' },
    { href: '/contact', label: t('contact'), icon: Mail, desc: isFA ? 'تماس با ما' : 'Get in touch' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.25)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Glass panel */}
      <div
        className={`fixed top-0 left-0 right-0 md:left-auto md:right-0 md:w-[420px] z-[70] glass-strong transform transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open
            ? 'translate-y-0 md:translate-x-0'
            : '-translate-y-full md:translate-y-0 md:translate-x-full'
        }`}
        style={{
          borderBottom: '1px solid hsl(var(--border))',
          boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
          minHeight: '100vh',
        }}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16">
          <span className="font-heading font-extrabold text-lg" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
            {isFA ? 'منو' : 'Menu'}
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'hsl(var(--border))', color: 'var(--fg)' }}
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
                  border: active ? '1.5px solid var(--accent)' : '1px solid hsl(var(--border))',
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
                  <div className="font-body text-sm mt-0.5" style={{ color: 'var(--fg-muted)' }}>
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

        {/* Bottom action — business contact. Retail cart entry point is disabled. */}
        <div className="px-4 pt-2 pb-6">
          <Link
            to="/contact"
            onClick={onClose}
            className="glass-card flex items-center justify-center gap-2 py-4 transition-all active:scale-95"
            style={{ color: 'var(--accent)' }}
          >
            <Mail size={18} />
            <span className="font-body text-sm font-semibold">تماس با واحد بازرگانی</span>
          </Link>
        </div>

        {/* Retail cart button — disabled
        <button onClick={() => { onClose(); setCartOpen(true); }}>سبد خرید</button>
        */}
      </div>
    </>
  );
}