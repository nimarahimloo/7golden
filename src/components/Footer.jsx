import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { t } from '@/lib/i18n';
import { CONTACT_INFO } from '@/lib/contact-info';

const CONTACT_LINKS = [
  { id: 'phone', label: 'تماس تلفنی', href: CONTACT_INFO.mobileLink, Icon: Phone, display: CONTACT_INFO.mobile },
  { id: 'email', label: 'ایمیل', href: CONTACT_INFO.emailLink, Icon: Mail, display: CONTACT_INFO.email },
];

const SOCIAL_CANDIDATES = [
  { id: 'instagram', label: 'اینستاگرام', href: import.meta.env.VITE_INSTAGRAM_URL, icon: '/social/instagram.svg', hosts: ['instagram.com'] },
  { id: 'facebook', label: 'فیس‌بوک', href: import.meta.env.VITE_FACEBOOK_URL, icon: '/social/facebook.svg', hosts: ['facebook.com', 'fb.com'] },
  { id: 'rubika', label: 'روبیکا', href: import.meta.env.VITE_RUBIKA_URL, icon: '/social/rubika.png', hosts: ['rubika.ir'] },
  { id: 'telegram', label: 'تلگرام', href: import.meta.env.VITE_TELEGRAM_URL, icon: '/social/telegram.svg', hosts: ['t.me', 'telegram.me'] },
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
    <footer
      dir="rtl"
      className="relative overflow-hidden border-t py-14 sm:py-16 lg:py-20"
      style={{ background: 'var(--bg)', borderColor: 'var(--hairline)' }}
    >
      <div className="chapter-shell relative z-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 md:gap-10">
          <div>
            <img
              src="/logo-symbol.webp"
              alt="هفت طلایی"
              className="mb-6 h-12 w-auto object-contain object-right opacity-95"
            />
            <div className="mb-5 h-px w-10" style={{ background: 'var(--gold-2)', opacity: 0.7 }} />
            <p className="max-w-sm text-sm leading-8" style={{ color: 'var(--fg-muted)' }}>
              {t('footer_tagline')}
            </p>
            <p className="mt-4 text-xs tracking-wide" style={{ color: 'var(--fg-muted)' }}>
              قزوین <span className="px-2" style={{ color: 'var(--gold-2)' }}>·</span> از ۱۳۷۷
            </p>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-semibold" style={{ color: 'var(--fg)' }}>
              ارتباط با هفت طلایی
            </h2>
            <nav className="flex flex-col items-start gap-4" aria-label="راه‌های تماس">
              {CONTACT_LINKS.map(({ id, label, href, Icon, display }) => (
                <a
                  key={id}
                  href={href}
                  className="group inline-flex items-center gap-3 text-sm transition-colors"
                  style={{ color: 'var(--fg-muted)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold-2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-muted)'; }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
                    style={{ borderColor: 'var(--hairline)', background: 'var(--surface-subtle)' }}
                  >
                    <Icon size={15} aria-hidden="true" />
                  </span>
                  <span>{label}</span>
                  <span dir="ltr" className="text-xs opacity-70">{display}</span>
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-semibold" style={{ color: 'var(--fg)' }}>
              دسترسی سریع
            </h2>
            <nav className="footer-nav-list flex flex-col gap-3" aria-label="دسترسی سریع">
              {[
                { to: '/shop', label: 'محصولات' },
                { to: '/about', label: 'درباره هفت طلایی' },
                { to: '/news', label: 'اخبار و اطلاعیه‌ها' },
                { to: '/blog', label: 'مجله تخصصی' },
                { to: '/contact', label: 'تماس با ما' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--fg-muted)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold-2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-muted)'; }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold" style={{ color: 'var(--fg)' }}>
              در ارتباط بمانیم
            </h2>
            <p className="mb-5 max-w-sm text-xs leading-7" style={{ color: 'var(--fg-muted)' }}>
              برای گفت‌وگو درباره محصولات و سفارش، از مسیرهای ارتباطی زیر استفاده کنید.
            </p>
            <nav className="flex flex-wrap items-center gap-2.5" aria-label="شبکه‌های اجتماعی">
              {SOCIAL_LINKS.map((social) => {
                const mark = social.icon ? (
                  <img
                    src={social.icon}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width="18"
                    height="18"
                    className="h-[18px] w-[18px] object-contain"
                  />
                ) : null;
                const className = `footer-social flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${social.enabled ? '' : 'opacity-40'}`;

                return social.enabled ? (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className={className}
                    style={{ borderColor: 'var(--hairline)', color: 'var(--gold-2)' }}
                  >
                    {mark}
                  </a>
                ) : (
                  <span
                    key={social.id}
                    aria-label={`${social.label}؛ نشانی رسمی هنوز ثبت نشده`}
                    title={`${social.label}؛ نشانی رسمی هنوز ثبت نشده`}
                    aria-disabled="true"
                    className={className}
                    style={{ borderColor: 'var(--hairline)', color: 'var(--gold-2)' }}
                  >
                    {mark}
                  </span>
                );
              })}
            </nav>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: 'var(--hairline)', color: 'var(--fg-muted)' }}
        >
          <span>© {new Date().getFullYear()} هفت طلایی · تمامی حقوق محفوظ است.</span>
          <a
            href="https://7golden.co"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:opacity-100"
            style={{ color: 'var(--fg-muted)' }}
          >
            7golden.co
          </a>
        </div>
      </div>
    </footer>
  );
}
