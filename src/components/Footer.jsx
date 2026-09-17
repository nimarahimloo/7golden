import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, Clock, MapPin } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import TrustBadges from '@/components/TrustBadges';
import FooterParticles from '@/components/FooterParticles';

export default function Footer() {
  const { lang, dir } = useApp();

  const navLinks = [
    { href: '/', label: t(lang, 'home') },
    { href: '/shop', label: t(lang, 'shop') },
    { href: '/about', label: t(lang, 'about') },
    { href: '/blog', label: t(lang, 'blog') },
    { href: '/contact', label: t(lang, 'contact') },
  ];

  return (
    <footer dir={dir} style={{ background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
      <FooterParticles />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img
                src="https://7golden.co/wp-content/uploads/2023/08/logo-white.png"
                alt="7Golden"
                className="h-14 w-auto object-contain mb-3"
              />
              <div className="text-xs" style={{ color: 'var(--fg)', opacity: 0.7 }}>
                {t(lang, 'footer_tagline')}
              </div>
            </div>
            <p className="font-body text-sm leading-relaxed mb-4" style={{ color: 'var(--fg)', opacity: 0.65 }}>
              {lang === 'fa'
                ? 'از سال ۱۳۷۷، پیشرو در تولید و فرآوری خشکبار ایران — مستقیم از باغستان‌های قزوین و کرمان.'
                : 'Since 1998, leading the way in Iranian dried fruit processing — direct from Qazvin and Kerman orchards.'}
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a href="tel:+989121823438" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.15)', color: 'var(--accent)' }}>
                <Phone size={14} />
              </a>
              <a href="mailto:info@7golden.co" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.15)', color: 'var(--accent)' }}>
                <Mail size={14} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.15)', color: 'var(--accent)' }}>
                <Instagram size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-black text-sm mb-5" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
              {t(lang, 'quick_links')}
            </h4>
            <ul className="flex flex-col gap-3">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="font-body text-sm transition-all hover:pr-1" style={{ color: 'var(--fg)', opacity: 0.65 }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-black text-sm mb-5" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
              {t(lang, 'contact')}
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                <span className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg)', opacity: 0.65 }}>
                  {t(lang, 'hq_address')}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="flex-shrink-0" style={{ color: 'var(--accent)' }} />
                <a href="tel:+989121823438" className="font-body text-xs transition-colors hover:opacity-100" style={{ color: 'var(--fg)', opacity: 0.65, direction: 'ltr' }}>
                  {t(lang, 'support_mobile')}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="flex-shrink-0" style={{ color: 'var(--accent)' }} />
                <a href="mailto:info@7golden.co" className="font-body text-xs transition-colors hover:opacity-100" style={{ color: 'var(--fg)', opacity: 0.65 }}>
                  info@7golden.co
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="flex-shrink-0" style={{ color: 'var(--accent)' }} />
                <span className="font-body text-xs" style={{ color: 'var(--fg)', opacity: 0.65 }}>
                  {t(lang, 'working_hours')}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="font-heading font-black text-xs mb-4 text-center" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif', opacity: 0.8 }}>
            مجوزها و نشان‌های اعتماد
          </p>
          <TrustBadges />
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="font-body text-xs" style={{ color: 'var(--fg)', opacity: 0.5 }}>
            © {new Date().getFullYear()} {lang === 'fa' ? 'خشکبار هفت‌طلایی' : '7Golden Dried Fruits'} — {t(lang, 'footer_rights')}
          </p>
          <div className="flex gap-4">
            <a href="#" className="font-body text-xs transition-colors hover:opacity-100" style={{ color: 'var(--fg)', opacity: 0.5 }}>
              {lang === 'fa' ? 'حریم خصوصی' : 'Privacy'}
            </a>
            <a href="#" className="font-body text-xs transition-colors hover:opacity-100" style={{ color: 'var(--fg)', opacity: 0.5 }}>
              {lang === 'fa' ? 'شرایط استفاده' : 'Terms'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}