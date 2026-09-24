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
 * copy step through `items` as the visitor scrolls vertically. Each item:
 * { key, eyebrow, title, image, href, cta }
 *
 * Enhancements: Ken Burns zoom on the active image, a gold light beam
 * that sweeps across with scroll progress, a parallax drift on the copy,
 * and a parallax drift on the active image itself — all driven via direct
 * DOM manipulation so scroll never triggers a React re-render.
 *
 * Under prefers-reduced-motion it renders every chapter as a static band
 * so no content is ever hidden behind an animation.
 */
export default function StickyScene({ items = [], id }) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef(null);
  const mediaRefs = useRef([]);
  const copyRef = useRef(null);
  const beamRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    let lastActive = -1;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progress = total > 0 ? Math.max(0, Math.min(0.9999, (-rect.top) / total)) : 0;

        // Active index — only setState when it actually changes.
        const newActive = Math.min(items.length - 1, Math.floor(progress * items.length));
        if (newActive !== lastActive) {
          lastActive = newActive;
          setActive(newActive);
        }

        // Step progress within the current item — drives copy + image parallax.
        const stepProgress = (progress * items.length) - newActive;

        // Copy drift — intensified for a more alive feel.
        const copyY = stepProgress * -42;
        if (copyRef.current) {
          copyRef.current.style.transform = `translate3d(0, ${copyY}px, 0)`;
        }

        // Active image parallax drift — the picture moves opposite to scroll.
        const activeMedia = mediaRefs.current[newActive];
        if (activeMedia) {
          const img = activeMedia.querySelector('img');
          if (img) {
            const isMobile = window.innerWidth < 768;
            const drift = (stepProgress - 0.5) * (isMobile ? 36 : 64);
            img.style.transform = `translate3d(0, ${drift}px, 0) scale(1.12)`;
          }
        }

        // Beam sweep.
        if (beamRef.current) {
          beamRef.current.style.transform = `translateX(${(progress - 0.5) * 220}%)`;
        }
      });
    };

    const onScroll = () => update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced, items.length]);

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
              <div>
                <span className="eyebrow block mb-3">{item.eyebrow}</span>
                <h3 className="display-lg mb-3"><span className="gold-text">{item.title}</span></h3>
                {item.href && (
                  <Link to={item.href} className="link-gold">
                    {item.cta || 'مشاهده محصول'}
                    <ChevronLeft size={14} style={{ transform: 'scaleX(-1)' }} />
                  </Link>
                )}
              </div>
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
        {/* ---- media layers with Ken Burns zoom + parallax drift ---- */}
        {items.map((item, i) => (
          <div
            key={item.key}
            ref={(node) => { mediaRefs.current[i] = node; }}
            className={`scene-media ${i === active ? 'is-active' : ''}`}
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          >
            <img src={item.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} style={{ willChange: 'transform' }} />
          </div>
        ))}

        {/* ---- cinematic scrim ---- */}
        <div className="scene-scrim" />

        {/* ---- gold light beam — sweeps with scroll ---- */}
        <div ref={beamRef} className="scene-beam" />

        {/* ---- copy (minimal — image speaks) ---- */}
        <div className="relative z-10 h-full chapter-shell flex items-center">
          <div className="w-full max-w-xl" key={current.key}>
            <div ref={copyRef} className="text-rise">
              <span className="eyebrow block mb-4">{current.eyebrow}</span>
              <h3 className="display-xl">
                <span className="gold-text">{current.title}</span>
              </h3>
              {current.href && (
                <Link to={current.href} className="link-gold mt-6">
                  {current.cta || 'مشاهده محصول'}
                  <ChevronLeft size={14} style={{ transform: 'scaleX(-1)' }} />
                </Link>
              )}
            </div>
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
