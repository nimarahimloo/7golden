import React, { useEffect, useRef, useState } from 'react';
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
 * VitrineScroll — a pinned, full-height "luxury store window" where
 * vertical scroll drives a horizontal slide of large product panels.
 * Each panel is a full-bleed image with a glass caption overlay — the
 * visitor browses the three flagship nuts as if walking past vitrine
 * displays. Degrades to a static stacked layout under reduced motion.
 *
 * Items: { key, eyebrow, title, lead, desc, specs, image, href, cta }
 */
export default function VitrineScroll({ items = [], id }) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef(null);
  const stripRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    const strip = stripRef.current;
    if (!track || !strip) return;
    let raf = 0;
    const update = () => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = rect.height - vh;
      const prog = travel > 0 ? Math.max(0, Math.min(1, -rect.top / travel)) : 0;
      const max = strip.scrollWidth - strip.clientWidth;
      setDistance(max > 0 ? prog * max : 0);
      setActive(Math.min(items.length - 1, Math.round(prog * (items.length - 1))));
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
                <p className="font-body text-sm md:text-base leading-relaxed mb-5" style={{ color: 'var(--fg-muted)' }}>{item.lead}</p>
                {item.specs?.length > 0 && (
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 max-w-md">
                    {item.specs.map((spec) => (
                      <div key={spec.label}>
                        <dt className="font-body text-[11px] mb-0.5" style={{ color: 'var(--fg-muted)' }}>{spec.label}</dt>
                        <dd className="font-body text-sm" style={{ color: 'var(--gold-1)' }}>{spec.value}</dd>
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
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id={id} ref={trackRef} className="vitrine-track" style={{ height: `${items.length * 100}svh` }} dir="rtl">
      <div className="vitrine-viewport">
        <div ref={stripRef} className="vitrine-strip" style={{ transform: `translate3d(${distance}px, 0, 0)` }}>
          {items.map((item, i) => (
            <article key={item.key} className="vitrine-panel">
              <div className="vitrine-image">
                <img src={item.image} alt={item.title} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
              <div className="vitrine-scrim" />
              <div className="vitrine-caption">
                <span className="eyebrow block mb-3">{item.eyebrow}</span>
                <h3 className="display-lg mb-3"><span className="gold-text">{item.title}</span></h3>
                <p className="font-body text-sm md:text-base leading-relaxed mb-4" style={{ color: 'var(--fg-muted)' }}>{item.lead}</p>
                {item.desc && (
                  <p className="font-body text-xs md:text-sm leading-relaxed mb-5 max-w-lg hidden md:block" style={{ color: 'var(--fg-muted)', opacity: 0.7 }}>{item.desc}</p>
                )}
                {item.specs?.length > 0 && (
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 max-w-md">
                    {item.specs.map((spec) => (
                      <div key={spec.label}>
                        <dt className="font-body text-[11px] mb-0.5" style={{ color: 'var(--fg-muted)' }}>{spec.label}</dt>
                        <dd className="font-body text-sm" style={{ color: 'var(--gold-1)' }}>{spec.value}</dd>
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
            </article>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="vitrine-progress">
          <div className="vitrine-rail">
            {items.map((item, i) => (
              <span key={item.key} className={`vitrine-dot ${i <= active ? 'is-done' : ''}`}>
                <span />
              </span>
            ))}
          </div>
          <span className="font-subheading text-xs tracking-[0.3em]" style={{ color: 'var(--fg-muted)' }}>
            {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
