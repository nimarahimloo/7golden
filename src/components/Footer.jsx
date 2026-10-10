import React from 'react';
import { t } from '@/lib/i18n';

// Social channels — real brand logos, hosted locally in /public/social.
const SOCIALS = [
  { id: 'instagram', label: 'اینستاگرام', href: 'https://instagram.com', icon: '/social/instagram.svg' },
  { id: 'whatsapp', label: 'واتس‌اپ', href: 'https://wa.me/989121823438', icon: '/social/whatsapp.svg' },
  { id: 'rubika', label: 'روبیکا', href: 'https://rubika.ir', icon: '/social/rubika.png' },
  { id: 'bale', label: 'بله', href: 'https://bale.ai', icon: '/social/bale.svg' },
];

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="relative flex flex-col items-center justify-center text-center px-6 py-16"
      style={{ background: 'var(--bg)', borderTop: '1px solid var(--hairline)' }}
    >
      <img src="/logo.webp" alt="7Golden" className="h-16 w-auto object-contain mb-5" />
      <p className="font-body text-sm leading-relaxed max-w-md" style={{ color: '#fff' }}>
        {t('footer_tagline')}
      </p>

      <div className="flex items-center gap-3 mt-7">
        {SOCIALS.map((s) => (
          <a
            key={s.id}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            title={s.label}
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid var(--hairline)' }}
          >
            <img src={s.icon} alt={s.label} width={20} height={20} className="w-5 h-5 object-contain" loading="lazy" />
          </a>
        ))}
      </div>
    </footer>
  );
}
