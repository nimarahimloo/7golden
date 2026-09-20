import React, { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';

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
 * SpecialtyShowcase — a luxury parallax band highlighting the flagship
 * grades: مغز پسته، خلال پسته، مغز فندق. Each product gets a full-width
 * image with depth parallax drift, a glass caption panel with specs,
 * and a gold grade badge. The image carries the story — copy stays minimal.
 *
 * Under prefers-reduced-motion it renders as static stacked cards.
 */
export default function SpecialtyShowcase({ items = [] }) {
  const reduced = usePrefersReducedMotion();

  if (!items.length) return null;

  return (
    <section className="chapter" dir="rtl">
      <div className="chapter-shell">
        <StoryChapter
          index="★"
          eyebrow="SIGNATURE GRADES"
          title="تخصص ما: مغز پسته، خلال پسته و مغز فندق"
          lead="گریدهای منتخب صنعتی — فرآوری شده برای صنایع شکلات، قنادی و بستنی."
          align="center"
          className="mb-14 md:mb-20"
        />
      </div>

      <div className="chapter-shell flex flex-col gap-10 md:gap-16">
        {items.map((item, i) => (
          <SpecialtyCard key={item.key} item={item} index={i} reduced={reduced} reverse={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function SpecialtyCard({ item, index, reduced, reverse }) {
  const trackRef = useRef(null);
  const { ref: revealRef, visible } = useScrollAnimation(0.12);
  const [p, setP] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = rect.height + vh;
      const prog = (vh - rect.top) / travel;
      setP(Math.max(0, Math.min(1, prog)));
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
  }, [reduced]);

  // Depth offsets — image drifts, foreground counter-drifts
  const imgShift = reduced ? 0 : (p - 0.5) * 48;
  const fgShift = reduced ? 0 : (p - 0.5) * -24;
  const scale = reduced ? 1 : 1.12 + (p - 0.5) * 0.04;

  return (
    <Reveal variant="up" delay={index * 80}>
      <div
        ref={(node) => {
          trackRef.current = node;
          revealRef.current = node;
        }}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center ${reverse ? 'lg:grid-flow-dense' : ''}`}
      >
        {/* ---- Image with depth parallax ---- */}
        <div className={`media-frame aspect-[4/3] lg:aspect-[5/4] overflow-hidden ${reverse ? 'lg:col-start-2' : ''}`}>
          <div
            className="absolute inset-0"
            style={reduced ? undefined : { transform: `translate3d(0, ${imgShift}px, 0) scale(${scale})` }}
          >
            <img src={item.image} alt={item.nameFA} loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="media-scrim" />

          {/* Gold grade badge */}
          <div className="absolute top-5 right-5 z-10">
            <span className="glass-pill inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold" style={{ color: 'var(--gold-1)' }}>
              {item.grade}
            </span>
          </div>
        </div>

        {/* ---- Caption ---- */}
        <div
          className={`panel rounded-3xl p-6 md:p-10 ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}
          style={reduced ? undefined : { transform: `translate3d(0, ${fgShift}px, 0)` }}
        >
          <span className="eyebrow block mb-4">{item.nameFA.toUpperCase()}</span>
          <h3 className="display-lg mb-4">
            <span className="gold-text">{item.nameFA}</span>
          </h3>
          <p className="font-body text-sm md:text-base leading-relaxed mb-6" style={{ color: 'var(--fg-muted)' }}>
            {item.desc}
          </p>

          {item.specs?.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {item.specs.map((spec) => (
                <div key={spec.label} className="border-b pb-3" style={{ borderColor: 'var(--hairline)' }}>
                  <dt className="font-body text-[11px] mb-1" style={{ color: 'var(--fg-muted)' }}>{spec.label}</dt>
                  <dd className="font-body text-sm font-bold" style={{ color: 'var(--gold-1)' }}>{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </Reveal>
  );
}
