import React from 'react';
import { Factory } from 'lucide-react';
import { CAPACITY_STATS, CAPACITY_NOTES } from '@/lib/corporate-content';
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
 * Production & processing capacity — replaces the retail trust badges
 * (fast shipping / secure payment / money-back guarantee).
 */
export default function ProductionCapacity() {
  const headingFont = 'Peyda, serif';

  return (
    <section className="py-12 md:py-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center glass-luxury flex-shrink-0">
              <Factory size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <span className="font-subheading text-sm uppercase" style={{ color: 'var(--accent)', fontFamily: 'Kalameh, serif' }}>
              ظرفیت تولید و فرآوری
            </span>
          </div>
          <h2 className="font-heading text-2xl md:text-4xl font-extrabold mb-3" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
            مقیاس صنعتی، تحویل زمان‌بندی‌شده
          </h2>
          <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            خطوط فرآوری و انبارهای ما امکان تأمین مستمر و بلندمدت خریداران عمده را فراهم می‌کند.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-8">
          {CAPACITY_STATS.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 100}>
              <div className="p-5 md:p-6 rounded-2xl h-full" style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="font-heading font-black text-2xl md:text-4xl" style={{ color: 'var(--accent)', fontFamily: headingFont }}>
                    {stat.value}
                  </span>
                  <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{stat.unit}</span>
                </div>
                <span className="font-body text-xs leading-relaxed block" style={{ color: 'var(--fg)' }}>
                  {stat.label}
                </span>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Capability notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CAPACITY_NOTES.map((note, i) => (
            <AnimatedSection key={note} delay={i * 80}>
              <div
                className="flex items-start gap-3 px-4 py-3.5 rounded-xl h-full"
                style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--accent)' }} />
                <span className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>{note}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
