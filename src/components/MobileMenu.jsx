import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Phone, Mail, ChevronLeft } from 'lucide-react';
import { t } from '@/lib/i18n';
import { CONTACT_INFO } from '@/lib/contact-info';

const LINKS = [
  { href: '/', label: t('home'), desc: 'صفحه اصلی' },
  { href: '/shop', label: t('shop'), desc: 'پسته، بادام و فندق' },
  { href: '/about', label: t('about'), desc: 'داستان و ظرفیت تولید' },
  { href: '/news', label: 'اخبار', desc: 'اطلاعیه‌های مجموعه' },
  { href: '/blog', label: 'مجله', desc: 'راهنماهای تخصصی صنایع غذایی' },
  { href: '/contact', label: t('contact'), desc: 'درخواست قیمت و نمونه' },
];

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const toFa = (n) => String(n).replace(/\d/g, d => FA_DIGITS[Number(d)]);

function isActivePath(pathname, href) {
  if (href === '/') return pathname === '/';
  if (href === '/shop') return pathname === '/shop' || pathname.startsWith('/product/');
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * MobileMenu — slide-in sheet used below the `lg` breakpoint.
 * Solid dark surface (readable over any page), numbered links, and the
 * trade-desk contact details pinned at the bottom.
 */
export default function MobileMenu({ open, onClose }) {
  const location = useLocation();
  const sheetRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Treat the sheet as a modal: keep keyboard focus inside, close on Escape,
  // lock background scrolling, and return focus to the menu trigger afterwards.
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement;
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(sheetRef.current?.querySelectorAll(focusableSelector) || [])
        .filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focusIsOutside = !sheetRef.current?.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || focusIsOutside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || focusIsOutside)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      if (previousActiveElement instanceof HTMLElement) previousActiveElement.focus();
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80]"
        style={{
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <aside
        ref={sheetRef}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-label="منوی سایت"
        aria-hidden={!open}
        className="fixed top-0 bottom-0 left-0 z-[90] flex flex-col"
        style={{
          width: 'min(92vw, 400px)',
          background: 'linear-gradient(180deg, #0C0A07 0%, #070604 100%)',
          borderRight: '1px solid var(--hairline-strong)',
          boxShadow: '24px 0 80px rgba(0,0,0,0.6)',
          transform: open ? 'translateX(0)' : 'translateX(-105%)',
          visibility: open ? 'visible' : 'hidden',
          transition: open
            ? 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1), visibility 0s linear'
            : 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1), visibility 0s linear 0.45s',
          paddingTop: 'var(--safe-area-top)',
          paddingBottom: 'var(--safe-area-bottom)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-20 flex-shrink-0" style={{ borderBottom: '1px solid var(--hairline)' }}>
          <img src="/logo-symbol.webp" alt="7Golden" className="h-12 w-auto object-contain" />
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ color: '#fff', border: '1px solid var(--hairline-strong)', background: 'rgba(227,194,99,0.07)' }}
            aria-label="بستن منو"
            ref={closeButtonRef}
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="منوی موبایل">
          {LINKS.map((link, i) => {
            const active = isActivePath(location.pathname, link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className="flex items-center gap-4 py-3.5 transition-all active:opacity-70"
                style={{ borderBottom: '1px solid var(--hairline)' }}
                aria-current={active ? 'page' : undefined}
              >
                <span className="outline-num text-xl w-9 flex-shrink-0 text-center">{toFa(i + 1)}</span>
                <span className="flex-1 min-w-0">
                  <span
                    className="block text-xl leading-tight"
                    style={{ fontFamily: 'Peyda, serif', fontWeight: 700, color: active ? 'var(--gold-2)' : '#fff' }}
                  >
                    {link.label}
                  </span>
                  <span className="block text-xs mt-0.5" style={{ fontFamily: 'Kalameh, serif', color: '#fff' }}>
                    {link.desc}
                  </span>
                </span>
                <ChevronLeft size={18} style={{ color: active ? 'var(--gold-2)' : 'var(--hairline-strong)' }} />
              </Link>
            );
          })}
        </nav>

        {/* Trade desk */}
        <div className="flex-shrink-0 px-5 pt-4 pb-6" style={{ borderTop: '1px solid var(--hairline)' }}>
          <Link to="/contact" onClick={onClose} className="btn-gold w-full justify-center">
            درخواست قیمت و نمونه
          </Link>
          <div className="flex items-center justify-between gap-3 mt-4 text-sm" style={{ color: '#fff' }}>
            <a href={CONTACT_INFO.mobileLink} className="inline-flex items-center gap-2" style={{ direction: 'ltr', fontFamily: 'Peyda, serif', fontWeight: 600 }}>
              <Phone size={15} style={{ color: 'var(--gold-2)' }} />
              {CONTACT_INFO.mobile}
            </a>
            <a href={CONTACT_INFO.emailLink} className="inline-flex items-center gap-2" style={{ fontFamily: 'Peyda, serif', fontWeight: 600 }}>
              <Mail size={15} style={{ color: 'var(--gold-2)' }} />
              {CONTACT_INFO.email}
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
