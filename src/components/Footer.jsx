import React from 'react';
import { Mail, Phone, Send } from 'lucide-react';
import { t } from '@/lib/i18n';

const CONTACT_LINKS = [
  { id: 'phone', label: 'تماس تلفنی', href: 'tel:+989121823438', Icon: Phone, display: '۰۹۱۲ ۱۸۲ ۳۴۳۸' },
  { id: 'email', label: 'ایمیل', href: 'mailto:info@7golden.co', Icon: Mail, display: 'info@7golden.co' },
];

const SOCIAL_CANDIDATES = [
  { id: 'instagram', label: 'اینستاگرام', href: import.meta.env.VITE_INSTAGRAM_URL, icon: '/social/instagram.svg', hosts: ['instagram.com'] },
  { id: 'rubika', label: 'روبیکا', href: import.meta.env.VITE_RUBIKA_URL, icon: '/social/rubika.png', hosts: ['rubika.ir'] },
  { id: 'telegram', label: 'تلگرام', href: import.meta.env.VITE_TELEGRAM_URL, icon: '/social/telegram.svg', hosts: ['t.me', 'telegram.me'] },
  { id: 'bale', label: 'بله', href: import.meta.env.VITE_BALE_URL, mark: 'ب', hosts: ['ble.ir', 'bale.ai'] },
];

function isValidProfileUrl(value, hosts) {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const url = new URL(value.trim());
    const validHost = hosts.some((host) => url.hostname === host || url.hostname.endsWith('.' + host));
    const hasProfilePath = url.pathname.split('/').filter(Boolean).length > 0;
    return url.protocol === 'https:' && validHost && hasProfilePath;
  } catch {
    return false;
  }
}

const SOCIAL_LINKS = [
  { id: 'whatsapp', label: 'واتس‌اپ', href: 'https://wa.me/989121823438', icon: '/social/whatsapp.svg', enabled: true },
  ...SOCIAL_CANDIDATES.map((item) => ({
    ...item,
    enabled: isValidProfileUrl(item.href, item.hosts),
  })),
];

export default function Footer() {
  return (
    <footer dir="rtl" className="relative overflow-hidden border-t py-12 sm:py-14 lg:py-16"
      style={{ background: '#090806', borderColor: 'var(--hairline)' }}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at 88% 0%, rgba(193,154,57,.10), transparent 42%), radial-gradient(ellipse at 8% 100%, rgba(193,154,57,.06), transparent 35%)' }} />

      <div className="chapter-shell relative z-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-14">
          <div>
            <img src="/logo-white.webp" alt="هفت طلایی" className="mb-5 h-14 w-auto object-contain object-right" />
            <div className="mb-5 h-px w-14" style={{ background: 'var(--gold-2)' }} />
            <p className="max-w-sm text-sm leading-8 text-white/75">{t('footer_tagline')}</p>
            <p className="mt-3 text-xs tracking-wide text-white/45">قزوین <span className="px-2 text-[#c9a958]">·</span> از ۱۳۷۷</p>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-bold text-white">ارتباط با هفت طلایی</h2>
            <nav className="flex flex-col items-start gap-4" aria-label="راه‌های تماس">
              {CONTACT_LINKS.map(({ id, label, href, Icon, display }) => (
                <a key={id} href={href} className="group inline-flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-[#d7b765]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] transition-colors group-hover:border-[#c9a958]/50">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span>{label}</span>
                  <span dir="ltr" className="text-xs text-white/45">{display}</span>
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-bold text-white">در ارتباط بمانیم</h2>
            <p className="mb-5 max-w-sm text-xs leading-7 text-white/55">برای گفت‌وگو درباره محصولات و سفارش، از مسیرهای ارتباطی زیر استفاده کنید.</p>
            <nav className="flex flex-wrap items-center gap-3" aria-label="شبکه‌های اجتماعی">
              {SOCIAL_LINKS.map((social) => {
                const mark = social.icon
                  ? <img src={social.icon} alt="" aria-hidden="true" loading="lazy" width="20" height="20" className="h-5 w-5 object-contain" />
                  : <span className="footer-social-mark" aria-hidden="true">{social.mark}</span>;
                const className = `footer-social border border-white/10 bg-white/[0.03] ${social.enabled ? '' : 'footer-social-pending'}`;

                return social.enabled ? (
                  <a key={social.id} href={social.href} target="_blank" rel="noopener noreferrer"
                    aria-label={social.label} title={social.label} className={className}
                    style={{ color: 'var(--gold-2)' }}>
                    {mark}
                  </a>
                ) : (
                  <span key={social.id} aria-label={`${social.label}؛ نشانی رسمی هنوز ثبت نشده`}
                    title={`${social.label}؛ نشانی رسمی هنوز ثبت نشده`} aria-disabled="true"
                    className={className} style={{ color: 'var(--gold-2)' }}>
                    {mark}
                  </span>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} هفت طلایی · تمامی حقوق محفوظ است.</span>
          <a href="https://7golden.co" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#d7b765]">7golden.co</a>
        </div>
      </div>
    </footer>
  );
}
