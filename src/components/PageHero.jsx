import React from 'react';
import { useParallax } from '@/components/useParallax';

/**
 * PageHero — the opening frame of every inner page.
 * Full-bleed, parallaxed media with the page title in gold display type,
 * closing on a hairline so the chapter bands below feel like a continuation
 * of the same story. Same props as before: image, title, subtitle, badge.
 */
export default function PageHero({ image, title, subtitle, badge, height = '72svh' }) {
  const { ref, offset } = useParallax(0.22);
  const shift = Math.max(-70, Math.min(70, offset));

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height, minHeight: '440px' }}
      dir="rtl"
    >
      <div ref={ref} className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: `translate3d(0, ${shift}px, 0) scale(1.25)` }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, var(--bg) 0%, rgba(7,6,4,0.86) 30%, rgba(7,6,4,0.42) 70%, rgba(7,6,4,0.72) 100%)',
        }}
      />

      <div className="relative z-10 h-full chapter-shell flex flex-col justify-end pb-14 md:pb-20">
        {badge && (
          <span className="eyebrow block mb-5">{badge}</span>
        )}
        <h1 className="display-xl max-w-4xl" style={{ color: 'var(--ink)' }}>
          <span className="gold-text">{title}</span>
        </h1>
        {subtitle && (
          <p className="font-body text-sm md:text-base mt-6 max-w-xl leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
            {subtitle}
          </p>
        )}
        <div
          className="mt-9 h-px w-full"
          style={{ background: 'linear-gradient(90deg, var(--hairline-strong), rgba(227,194,99,0.03))' }}
        />
      </div>
    </section>
  );
}
