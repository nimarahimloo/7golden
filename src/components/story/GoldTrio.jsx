import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

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

// The caption moves to a different corner on every stage, so it never reads
// as a label stuck on a card.
const CORNERS = ['is-br', 'is-tl', 'is-bl'];

/**
 * GoldTrio — the home page's signature image band.
 * One sticky full-height frame per item; scrolling sweeps a gold curtain
 * across the cut and dissolves the next product out of it, while the frame
 * slowly zooms into the product's own texture. No cards, no grid, no long
 * copy: the picture does the talking.
 *
 * Each item: { key, eyebrow, title, image, href }
 *
 * Under prefers-reduced-motion — and on small screens — the three frames
 * stack as plain full-width bands so nothing is hidden behind an animation.
 */
export default function GoldTrio({ items = [] }) {
  const reduced = usePrefersReducedMotion();
  const [narrow, setNarrow] = useState(false);
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  const isStatic = reduced || narrow;

  useEffect(() => {
    if (isStatic) return;
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? -rect.top / total : 0;
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
  }, [isStatic, items.length]);

  const active = useMemo(
    () => Math.min(items.length - 1, Math.floor(progress * items.length)),
    [progress, items.length]
  );

  if (!items.length) return null;

  // ---------- static fallback (reduced motion / small screens) ----------
  if (isStatic) {
    return (
      <section className="trio-static" dir="rtl">
        {items.map((item, i) => (
          <Frame
            key={item.key}
            item={item}
            index={i}
            className={`trio-band ${i === 0 ? 'is-active' : ''}`}
          />
        ))}
      </section>
    );
  }

  const local = progress * items.length - active;
  // the curtain starts late in a frame's dwell and finishes on the cut
  const sweep = Math.max(0, Math.min(1, (local - 0.6) / 0.4));
  const curtainX = -160 + sweep * 420;

  return (
    <section
      ref={trackRef}
      className="trio-track"
      style={{ height: `${items.length * 100}svh` }}
      dir="rtl"
    >
      <div className="trio-viewport">
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <Frame
              key={item.key}
              item={item}
              index={i}
              className={`trio-layer ${isActive ? 'is-active' : ''}`}
              style={{
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
                zIndex: isActive ? 2 : 1,
              }}
              subjectStyle={{ transform: `scale(${(1 + local * 0.14).toFixed(4)})` }}
              tabIndex={isActive ? 0 : -1}
              ariaHidden={!isActive}
            />
          );
        })}

        <div className="trio-curtain" style={{ transform: `translate3d(${curtainX}%, 0, 0)` }} aria-hidden="true" />

        {/* ---- stage ruler ---- */}
        <div className="trio-rail" aria-hidden="true">
          {items.map((item, i) => (
            <span key={item.key} className={`trio-tick ${i <= active ? 'is-done' : ''}`}>
              <span />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Frame({ item, index, className = '', style, subjectStyle, tabIndex, ariaHidden }) {
  const Tag = item.href ? Link : 'div';
  const linkProps = item.href ? { to: item.href, 'aria-label': item.title } : {};

  return (
    <Tag className={`trio-frame ${className}`} style={style} tabIndex={tabIndex} aria-hidden={ariaHidden} {...linkProps}>
      {/* blurred atmosphere — the product's own image, opened up to fill the frame */}
      <div className="trio-atmos">
        <img src={item.image} alt="" loading={index === 0 ? 'eager' : 'lazy'} />
      </div>
      <div className="trio-scrim" />
      <div className="trio-glow" />

      {/* sharp subject */}
      <div className="trio-subject">
        <img src={item.image} alt="" loading={index === 0 ? 'eager' : 'lazy'} style={subjectStyle} />
      </div>

      <div className={`trio-caption ${CORNERS[index % CORNERS.length]}`}>
        <span className="trio-rule" />
        <span className="eyebrow block mb-2">{item.eyebrow}</span>
        <span className="display-md" style={{ color: 'var(--ink)' }}>{item.title}</span>
      </div>
    </Tag>
  );
}
