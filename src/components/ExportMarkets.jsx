import React from 'react';
import { Globe, BadgeCheck } from 'lucide-react';
import { CERTIFICATES } from '@/lib/corporate-content';
import { useScrollAnimation } from '@/components/useScrollAnimation';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const { ref, visible } = useScrollAnimation();
  return (
    <div ref={ref} className={`fade-up ${visible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/**
 * Export & global markets — replaces the retail free-shipping banner.
 */
export default function ExportMarkets() {
  const headingFont = 'Peyda, serif';

  return (
    <section className="py-12 md:py-16" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14">

          {/* Markets */}
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center glass-luxury flex-shrink-0">
                <Globe size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <span className="font-subheading text-sm uppercase block" style={{ color: 'var(--accent)', fontFamily: 'Kalameh, serif' }}>
                  صادرات و بازارهای جهانی
                </span>
                <h2 className="font-heading text-xl md:text-2xl font-extrabold" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                  حضور فعال در بازارهای بین‌المللی
                </h2>
              </div>
            </div>
            <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--fg-muted)' }}>
              محصولات هفت‌طلایی علاوه بر بازار داخلی، به خریداران عمده و صنایع غذایی در بازارهای
              صادراتی بین‌المللی عرضه می‌شود. ارسال در قالب محموله‌های صنعتی و مطابق اسناد صادراتی انجام می‌گیرد.
            </p>
          </AnimatedSection>

          {/* Certificates */}
          <AnimatedSection delay={150}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center glass-luxury flex-shrink-0">
                <BadgeCheck size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <span className="font-subheading text-sm uppercase block" style={{ color: 'var(--accent)', fontFamily: 'Kalameh, serif' }}>
                  گواهینامه‌ها و استانداردها
                </span>
                <h2 className="font-heading text-xl md:text-2xl font-extrabold" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                  کیفیت قابل استناد در قرارداد
                </h2>
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {CERTIFICATES.map(item => (
                <li
                  key={item}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}
                >
                  <BadgeCheck size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <span className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
