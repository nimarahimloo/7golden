import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, MapPin, Clock, ArrowUp, ChevronLeft, ShieldCheck } from 'lucide-react';
import { t } from '@/lib/i18n';
import FooterParticles from '@/components/FooterParticles';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import Reveal from '@/components/story/Reveal';
import { MAIN_PRODUCTS, CERTIFICATES, EXPORT_MARKETS } from '@/lib/corporate-content';

/**
 * Footer — the site's closing argument for a B2B visitor.
 *   1. a trade-desk call to action (quote / sample / phone)
 *   2. a real directory: brand, product lines, quick links, contact details
 *   3. trust signals: certifications and export markets
 *   4. the giant image-filled 7GOLDEN wordmark as a signature
 */
const QUICK_LINKS = [
  { href: '/about', label: t('about') },
  { href: '/awards', label: t('awards') },
  { href: '/gallery', label: t('gallery') },
  { href: '/blog', label: t('blog') },
  { href: '/contact', label: t('contact') },
];

const CONTACT_ROWS = [
  { icon: MapPin, label: t('hq_title'), value: t('hq_address') },
  { icon: MapPin, label: t('tehran_title'), value: t('tehran_address') },
  { icon: Phone, label: 'تلفن', value: '۰۲۸۳۳۲۳۴۰۰۵', href: 'tel:+982833234005', ltr: true },
  { icon: Phone, label: 'موبایل', value: '۰۹۱۲۱۸۲۳۴۳۸', href: 'tel:+989121823438', ltr: true },
  { icon: Mail, label: 'ایمیل', value: 'info@7golden.co', href: 'mailto:info@7golden.co', ltr: true },
  { icon: Clock, label: 'ساعات کاری', value: t('working_hours') },
];

const CERTIFICATE_LABELS = CERTIFICATES.map(c => c.split('—')[0].trim());

export default function Footer() {
  const { ref: maskRef, visible: maskVisible } = useScrollAnimation(0.15);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer dir="rtl" className="relative overflow-hidden" style={{ background: 'var(--bg)', borderTop: '1px solid var(--hairline)' }}>

      {/* Ambient gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            'radial-gradient(ellipse 70% 40% at 15% 0%, rgba(227,194,99,0.10), transparent 70%), radial-gradient(ellipse 60% 40% at 90% 100%, rgba(227,194,99,0.08), transparent 70%)',
        }}
      />
      <FooterParticles />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 md:pt-24" style={{ zIndex: 2 }}>

        {/* ===== 1 · Trade desk call to action ===== */}
        <Reveal variant="up">
          <div className="footer-cta p-7 md:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="eyebrow block mb-3">TRADE DESK</span>
              <h2 className="display-md mb-3" style={{ color: '#fff' }}>
                آماده دریافت نمونه و پیش‌فاکتور هستید؟
              </h2>
              <p className="font-body text-sm md:text-base leading-relaxed" style={{ color: '#fff' }}>
                محصول، گرید و حجم مورد نیازتان را بفرستید؛ واحد بازرگانی هفت‌طلایی ظرف ۲۴ ساعت پاسخ می‌دهد.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
              <Link to="/contact" className="btn-gold">
                درخواست قیمت و نمونه
                <ChevronLeft size={16} />
              </Link>
              <a href="tel:+989121823438" className="btn-ghost" style={{ direction: 'ltr' }}>
                <Phone size={16} />
                ۰۹۱۲ ۱۸۲ ۳۴۳۸
              </a>
            </div>
          </div>
        </Reveal>

        {/* ===== 2 · Directory ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mt-14 md:mt-20">

          {/* Brand */}
          <Reveal variant="up" className="lg:col-span-4">
            <img src="/logo.png" alt="7Golden" className="h-20 w-auto object-contain mb-5" />
            <p className="font-body text-sm leading-relaxed max-w-sm mb-2" style={{ color: '#fff' }}>
              {t('footer_tagline')}
            </p>
            <p className="font-body text-sm leading-relaxed max-w-sm" style={{ color: '#fff' }}>
              تأمین‌کننده مغز و خلال پسته، بادام و فندق برای صنایع شکلات، قنادی و بستنی — فعال از سال ۱۳۷۷ در قزوین.
            </p>
            <div className="flex items-center gap-3 mt-6">
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
          </Reveal>

          {/* Product lines */}
          <Reveal variant="up" delay={80} className="lg:col-span-2">
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
          </Reveal>

          {/* Quick links */}
          <Reveal variant="up" delay={160} className="lg:col-span-2">
            <h3 className="footer-heading">دسترسی سریع</h3>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="footer-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Contact */}
          <Reveal variant="up" delay={240} className="sm:col-span-2 lg:col-span-4">
            <h3 className="footer-heading">اطلاعات تماس</h3>
            <ul className="flex flex-col gap-4">
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
          </Reveal>
        </div>

        {/* ===== 3 · Trust signals ===== */}
        <Reveal variant="up" className="mt-14 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8" >
          <div>
            <h3 className="footer-heading">استانداردها و گواهی‌ها</h3>
            <div className="flex flex-wrap gap-2">
              {CERTIFICATE_LABELS.map(label => (
                <span key={label} className="footer-chip">
                  <ShieldCheck size={13} style={{ color: 'var(--gold-2)' }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="footer-heading">بازارهای صادراتی</h3>
            <div className="flex flex-wrap gap-2">
              {EXPORT_MARKETS.map(market => (
                <span key={market} className="footer-chip">{market}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ===== 4 · Signature wordmark ===== */}
      <div ref={maskRef} className="relative text-center mt-14 md:mt-20 overflow-hidden" style={{ zIndex: 2 }}>
        <h2
          className={`footer-mask-word ${maskVisible ? 'is-visible' : ''}`}
          aria-hidden="true"
          style={{
            fontFamily: 'Peyda, serif',
            fontWeight: 900,
            fontSize: 'clamp(3rem, 17vw, 13rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            margin: 0,
            backgroundImage: 'url(/gallery/AQ8A1505AQ8A1505.JPG)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(227,194,99,0.22)',
          }}
        >
          7GOLDEN
        </h2>
      </div>

      {/* ===== Bottom bar ===== */}
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
