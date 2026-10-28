import React from 'react';
import { useParallax } from '@/components/useParallax';
import Eyebrow from '@/components/ui/eyebrow';

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
      className="relative w-full overflow-hidden page-hero-frame"
      style={{ height: 'var(--page-hero-h, 72svh)', minHeight: '440px' }}
      dir="rtl"
    >
      <div className="absolute inset-0">
        <img
          ref={driftRef}
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: 'transform' }}
          fetchpriority="high"
          decoding="async"
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(26, 20, 12, 0.92) 0%, rgba(26, 20, 12, 0.78) 30%, rgba(26, 20, 12, 0.3) 68%, rgba(26, 20, 12, 0.55) 100%)',
        }}
      />

      <div className="relative z-10 h-full chapter-shell flex flex-col justify-end pb-14 md:pb-20">
        {badge && (
          <Eyebrow className="block mb-5" style={{ color: '#E3C57E' }}>{badge}</Eyebrow>
        )}
        <h1 className="display-xl max-w-4xl" style={{ color: '#F8F4EA' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-sm md:text-base mt-6 max-w-xl leading-relaxed" style={{ color: 'rgba(248, 244, 234, 0.78)' }}>
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
