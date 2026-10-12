import React from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { t } from '@/lib/i18n';

const CONTACT_LINKS = [
  { id: 'phone', label: 'تماس تلفنی', href: 'tel:+989121823438', Icon: Phone },
  { id: 'email', label: 'ایمیل', href: 'mailto:info@7golden.co', Icon: Mail },
  { id: 'whatsapp', label: 'واتس‌اپ', href: 'https://wa.me/989121823438', Icon: MessageCircle, external: true },
];

export default function Footer() {
  return (
    <footer
      dir="rtl"
      className="relative flex flex-col items-center justify-center text-center px-6 py-16"
      style={{ background: 'var(--bg)', borderTop: '1px solid var(--hairline)' }}
    >
      <img src="/logo.webp" alt="هفت طلایی" className="h-16 w-auto object-contain mb-5" />
      <p className="font-body text-sm leading-relaxed max-w-md" style={{ color: '#fff' }}>
        {t('footer_tagline')}
      </p>

      <nav className="flex items-center gap-3 mt-7" aria-label="راه‌های تماس">
        {CONTACT_LINKS.map(({ id, label, href, Icon, external }) => (
          <a
            key={id}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={label}
            title={label}
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid var(--hairline)', color: 'var(--accent)' }}
          >
            <Icon size={19} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </footer>
  );
}
