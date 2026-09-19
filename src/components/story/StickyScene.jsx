import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);
  return reduced;
}

/**
 * StickyScene — the scroll-story core.
 * A tall track holds one sticky, full-height viewport whose picture and
 * copy step through `items` as the visitor scrolls. Each item:
 * { key, eyebrow, title, lead, image, specs: [{label, value}], href, cta }
 *
 * Under prefers-reduced-motion it renders every chapter as a static band
 * so no content is ever hidden behind an animation.
 */
export default function StickyScene({ items = [], id }) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? (-rect.top) / total : 0;
      setProgress(Math.max(0, Math.min(0.9999, p)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced, items.length]);

  const active = useMemo(
    () => Math.min(items.length - 1, Math.floor(progress * items.length)),
    [progress, items.length]
  );

  if (!items.length) return null;

  // ---------- static fallback ----------
  if (reduced) {
    return (
      <section id={id} className="chapter" dir="rtl">
        <div className="chapter-shell flex flex-col gap-16">
          {items.map((item) => (
            <article key={item.key} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="media-frame aspect-[4/3]">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <SceneCopy item={item} />
            </article>
          ))}
        </div>
      </section>
    );
  }

  const current = items[active];

  return (
    <section id={id} ref={trackRef} className="scene-track" style={{ height: `${items.length * 100}svh` }} dir="rtl">
      <div className="scene-viewport">
        {/* ---- media layers ---- */}
        {items.map((item, i) => (
          <div
            key={item.key}
            className="scene-media"
            style={{ opacity: i === active ? 1 : 0, transform: `scale(${i === active ? 1 : 1.06})` }}
            aria-hidden={i !== active}
          >
            <img src={item.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
        <div className="scene-scrim" />

        {/* ---- copy ---- */}
        <div className="relative z-10 h-full chapter-shell flex items-center">
          <div className="w-full max-w-xl" key={current.key}>
            <SceneCopy item={current} animated />
          </div>
        </div>

        {/* ---- chapter rail ---- */}
        <div className="absolute bottom-8 z-10 chapter-shell w-full">
          <div className="flex items-center justify-between gap-6">
            <div className="scene-rail">
              {items.map((item, i) => (
                <span key={item.key} className={`scene-rail-dot ${i <= active ? 'is-done' : ''}`}>
                  <span />
                </span>
              ))}
            </div>
            <span className="font-subheading text-xs tracking-[0.3em]" style={{ color: 'var(--fg-muted)' }}>
              {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SceneCopy({ item, animated = false }) {
  return (
    <div className={animated ? 'text-rise' : ''}>
      <span className="eyebrow block mb-4">{item.eyebrow}</span>
      <h3 className="display-lg mb-5">
        <span className="gold-text">{item.title}</span>
      </h3>
      <p className="font-body text-sm md:text-base leading-relaxed mb-7" style={{ color: 'var(--fg-muted)' }}>
        {item.lead}
      </p>

      {item.specs?.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8 max-w-md">
          {item.specs.map((spec) => (
            <div key={spec.label}>
              <dt className="font-body text-[11px] mb-1" style={{ color: 'var(--fg-muted)' }}>{spec.label}</dt>
              <dd className="font-body text-sm" style={{ color: 'var(--fg)' }}>{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {item.href && (
        <Link to={item.href} className="link-gold">
          {item.cta || 'مشاهده محصول'}
          <ChevronLeft size={14} style={{ transform: 'scaleX(-1)' }} />
        </Link>
      )}
    </div>
  );
}
