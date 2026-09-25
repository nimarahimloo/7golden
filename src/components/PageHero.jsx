import React from 'react';
import { useParallax } from '@/components/useParallax';

/**
 * PageHero — the opening frame of every inner page.
 * Full-bleed, parallaxed media with the page title in gold display type,
 * closing on a hairline so the chapter bands below feel like a continuation
 * of the same story. Same props as before: image, title, subtitle, badge.
 *
 * Uses direct DOM manipulation for smooth, powerful parallax + zoom.
 */
export default function PageHero({ image, title, subtitle, badge, height = '72svh' }) {
  const driftRef = useParallax({ speed: 0.3, maxZoom: 1.15, baseScale: 1.28, clamp: 90 });

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height, minHeight: '440px' }}
      dir="rtl"
    >
      <div className="absolute inset-0">
        <img
          ref={driftRef}
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: 'transform' }}
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
