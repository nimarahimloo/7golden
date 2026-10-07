import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPageHeroes } from '@/lib/api/content';
import PageHero from '@/components/PageHero';

/**
 * چند بنر هیرو از PageSection (section_key مثل hero / hero_2)
 * اگر یک اسلاید باشد → PageHero ساده؛ اگر بیشتر → اسلایدر
 */
export default function DynamicHeroSlider({
  pageKey,
  fallback = { image: '/banner/Hero.webp', title: '', subtitle: '', badge: '' },
  height = '72svh',
  intervalMs = 6000,
}) {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let on = true;
    getPageHeroes(pageKey)
      .then((list) => {
        if (!on) return;
        const mapped = (list || [])
          .filter((s) => s.image || s.title_fa)
          .map((s) => ({
            image: s.image || fallback.image,
            title: s.title_fa || fallback.title,
            subtitle: s.subtitle_fa || fallback.subtitle,
            badge: s.badge_fa || fallback.badge,
          }));
        setSlides(mapped.length ? mapped : [fallback]);
      })
      .catch(() => setSlides([fallback]));
    return () => { on = false; };
  }, [pageKey]);

  const n = slides.length || 1;
  const next = useCallback(() => setCurrent((c) => (c + 1) % n), [n]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + n) % n), [n]);

  useEffect(() => {
    if (paused || n <= 1) return;
    const t = setInterval(next, intervalMs);
    return () => clearInterval(t);
  }, [next, paused, n, intervalMs]);

  if (!slides.length) return null;

  // تک‌اسلاید
  if (slides.length === 1) {
    const s = slides[0];
    return (
      <PageHero
        image={s.image}
        title={s.title}
        subtitle={s.subtitle}
        badge={s.badge}
        height={height}
      />
    );
  }

  const s = slides[current];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <PageHero
        key={current}
        image={s.image}
        title={s.title}
        subtitle={s.subtitle}
        badge={s.badge}
        height={height}
      />
      <button
        type="button"
        aria-label="قبلی"
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.35)', color: '#fff' }}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        aria-label="بعدی"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.35)', color: '#fff' }}
      >
        <ChevronRight size={20} />
      </button>
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`اسلاید ${i + 1}`}
            onClick={() => setCurrent(i)}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              background: i === current ? 'var(--gold-2, #c9a227)' : 'rgba(255,255,255,0.4)',
              transform: i === current ? 'scale(1.3)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
