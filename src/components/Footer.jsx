import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, ArrowUp } from 'lucide-react';
import { t } from '@/lib/i18n';
import FooterParticles from '@/components/FooterParticles';
import { useParallax } from '@/components/useParallax';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import Reveal from '@/components/story/Reveal';

/**
 * Footer — a cinematic closing frame, not a standard link grid.
 * A full-bleed parallax orchard image sits behind a gold-dust veil,
 * a giant mask-text "7GOLDEN" rises through it, and the contact
 * details float as glass tiles over the scene. A back-to-top
 * scroll cue anchors the composition. Images carry the story;
 * copy stays minimal.
 */
export default function Footer() {
  const bgRef = useParallax({ speed: 0.2, baseScale: 1.3, clamp: 60 });
  const { ref: maskRef, visible: maskVisible } = useScrollAnimation(0.15);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setScrollPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/shop', label: t('shop') },
    { href: '/about', label: t('about') },
    { href: '/blog', label: t('blog') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <footer dir="rtl" className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* ===== Full-bleed parallax orchard backdrop ===== */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <img
          ref={bgRef}
          src="/gallery/AQ8A1571AQ8A1571.JPG"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.18, willChange: 'transform' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, var(--bg) 0%, rgba(7,6,4,0.92) 35%, rgba(7,6,4,0.7) 70%, rgba(7,6,4,0.88) 100%)',
          }}
        />
      </div>

      <FooterParticles />

      {/* ===== Giant mask-text wordmark ===== */}
      <div
        ref={maskRef}
        className="relative pt-20 md:pt-28 pb-6 text-center"
        style={{ zIndex: 2 }}
      >
        <Reveal variant="up">
          <span className="eyebrow block mb-6">EST. ۱۳۷۷ · QAZVIN</span>
        </Reveal>
        <h2
          className={`footer-mask-word ${maskVisible ? 'is-visible' : ''}`}
          style={{
            fontFamily: 'Peyda, serif',
            fontWeight: 900,
            fontSize: 'clamp(3rem, 18vw, 14rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            margin: 0,
            backgroundImage: 'url(/banner/Hero-main.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(227,194,99,0.18)',
          }}
        >
          7GOLDEN
        </h2>
        <div className="header-gold-rule mx-auto mt-6" />
      </div>

      {/* ===== Floating glass contact tiles ===== */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8" style={{ zIndex: 2 }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

          {/* Logo tile — spans 2 on mobile */}
          <Reveal variant="up" delay={0} className="col-span-2 md:col-span-1">
            <div className="panel rounded-3xl p-6 h-full flex flex-col justify-between gold-frame" style={{ minHeight: '180px' }}>
              <img src="/logo.png" alt="7Golden" className="h-12 w-auto object-contain mb-4" />
              <p className="font-body text-[11px] leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                {t('footer_tagline')}
              </p>
            </div>
          </Reveal>

          {/* Phone tile */}
          <Reveal variant="up" delay={80}>
            <a
              href="tel:+989121823438"
              className="panel rounded-3xl p-5 h-full flex flex-col items-center justify-center gap-3 gold-frame transition-all hover:scale-[1.03]"
              style={{ minHeight: '180px' }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(227,194,99,0.1)', border: '1px solid var(--hairline-strong)' }}
              >
                <Phone size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <span className="font-body text-[10px]" style={{ color: 'var(--fg-muted)' }}>تماس</span>
              <span className="font-heading font-black text-xs" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif', direction: 'ltr' }}>
                ۰۹۱۲۱۸۲۳۴۳۸
              </span>
            </a>
          </Reveal>

          {/* Email tile */}
          <Reveal variant="up" delay={160}>
            <a
              href="mailto:info@7golden.co"
              className="panel rounded-3xl p-5 h-full flex flex-col items-center justify-center gap-3 gold-frame transition-all hover:scale-[1.03]"
              style={{ minHeight: '180px' }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(227,194,99,0.1)', border: '1px solid var(--hairline-strong)' }}
              >
                <Mail size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <span className="font-body text-[10px]" style={{ color: 'var(--fg-muted)' }}>ایمیل</span>
              <span className="font-heading font-black text-[10px]" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
                info@7golden.co
              </span>
            </a>
          </Reveal>

          {/* Instagram tile */}
          <Reveal variant="up" delay={240}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="panel rounded-3xl p-5 h-full flex flex-col items-center justify-center gap-3 gold-frame transition-all hover:scale-[1.03]"
              style={{ minHeight: '180px' }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(227,194,99,0.1)', border: '1px solid var(--hairline-strong)' }}
              >
                <Instagram size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <span className="font-body text-[10px]" style={{ color: 'var(--fg-muted)' }}>دنبال کنید</span>
              <span className="font-heading font-black text-xs" style={{ color: 'var(--fg)', fontFamily: 'Peyda, serif' }}>
                @7golden
              </span>
            </a>
          </Reveal>

        </div>

        {/* ===== Minimal nav row ===== */}
        <Reveal variant="up" delay={200} className="mt-10">
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="nav-link"
                style={{ color: 'var(--fg)', opacity: 0.7 }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Reveal>
      </div>

      {/* ===== Bottom bar with scroll progress ===== */}
      <div className="relative mt-12" style={{ zIndex: 2 }}>
        {/* Gold scroll progress line */}
        <div className="h-px w-full" style={{ background: 'var(--hairline)' }}>
          <div
            className="h-full transition-all duration-150"
            style={{
              width: `${scrollPct}%`,
              background: 'linear-gradient(90deg, var(--gold-3), var(--gold-1))',
              boxShadow: '0 0 12px rgba(227,194,99,0.4)',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs" style={{ color: 'var(--fg)', opacity: 0.4 }}>
            © {new Date().getFullYear()} بازرگانی هفت‌طلایی — {t('footer_rights')}
          </p>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 font-body text-xs transition-all hover:gap-3"
            style={{ color: 'var(--fg)', opacity: 0.5 }}
          >
            {t('home')}
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
              style={{ background: 'rgba(227,194,99,0.08)', border: '1px solid var(--hairline)' }}
            >
              <ArrowUp size={14} style={{ color: 'var(--accent)' }} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
