import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin, ArrowUp, ChevronLeft } from 'lucide-react';
import { t } from '@/lib/i18n';
import { MAIN_PRODUCTS } from '@/lib/corporate-content';

const QUICK_LINKS = [
  { href: '/about', label: t('about') },
  { href: '/shop', label: t('products_title') },
  { href: '/awards', label: t('awards') },
  { href: '/gallery', label: t('gallery') },
  { href: '/blog', label: t('blog') },
  { href: '/contact', label: t('contact') },
];

const CONTACT_ROWS = [
  { icon: MapPin, label: t('hq_title'), value: t('hq_address') },
  { icon: Phone, label: 'تلفن', value: '۰۲۸۳۳۲۳۴۰۰۵', href: 'tel:+982833234005', ltr: true },
  { icon: Phone, label: 'موبایل', value: '۰۹۱۲۱۸۲۳۴۳۸', href: 'tel:+989121823438', ltr: true },
  { icon: Mail, label: 'ایمیل', value: 'info@7golden.co', href: 'mailto:info@7golden.co', ltr: true },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer dir="rtl" className="relative overflow-hidden" style={{ background: 'var(--bg)', borderTop: '1px solid var(--hairline)' }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-8" style={{ zIndex: 2 }}>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-4">
            <img src="/logo.png" alt="7Golden" className="h-16 w-auto object-contain mb-4" />
            <p className="font-body text-sm leading-relaxed max-w-sm mb-2" style={{ color: '#fff' }}>
              {t('footer_tagline')}
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="اینستاگرام">
                <Instagram size={17} />
              </a>
              <a href="tel:+989121823438" className="footer-social" aria-label="تماس تلفنی">
                <Phone size={17} />
              </a>
              <a href="mailto:info@7golden.co" className="footer-social" aria-label="ایمیل">
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* Product lines */}
          <div className="lg:col-span-2">
            <h3 className="footer-heading">محصولات</h3>
            <ul className="flex flex-col gap-3">
              {MAIN_PRODUCTS.map(p => (
                <li key={p.category}>
                  <Link to={`/shop#${p.category}`} className="footer-link">{p.nameFA}</Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="footer-link" style={{ color: 'var(--gold-2)' }}>همه محصولات</Link>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h3 className="footer-heading">دسترسی سریع</h3>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="footer-heading">اطلاعات تماس</h3>
            <ul className="flex flex-col gap-3">
              {CONTACT_ROWS.map(row => {
                const content = (
                  <>
                    <span className="block text-xs mb-0.5" style={{ color: '#fff', fontFamily: 'Kalameh, serif', fontWeight: 500 }}>
                      {row.label}
                    </span>
                    <span
                      className="block text-sm leading-relaxed"
                      style={{ color: '#fff', ...(row.ltr ? { direction: 'ltr', textAlign: 'right', fontFamily: 'Peyda, serif', fontWeight: 600 } : {}) }}
                    >
                      {row.value}
                    </span>
                  </>
                );
                return (
                  <li key={row.label + row.value} className="flex items-start gap-3">
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(227,194,99,0.08)', border: '1px solid var(--hairline-strong)' }}
                    >
                      <row.icon size={16} style={{ color: 'var(--gold-2)' }} />
                    </span>
                    {row.href ? <a href={row.href} className="min-w-0 transition-colors hover:opacity-80">{content}</a> : <div className="min-w-0">{content}</div>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative" style={{ zIndex: 2, borderTop: '1px solid var(--hairline)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs" style={{ color: '#fff' }}>
            © {new Date().getFullYear()} بازرگانی هفت‌طلایی — {t('footer_rights')}
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 font-body text-xs transition-all hover:gap-3"
            style={{ color: '#fff' }}
          >
            بازگشت به بالا
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
              style={{ background: 'rgba(227,194,99,0.08)', border: '1px solid var(--hairline-strong)' }}
            >
              <ArrowUp size={14} style={{ color: 'var(--gold-2)' }} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
