import React from 'react';
import { t } from '@/lib/i18n';

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
    </footer>
  );
}
