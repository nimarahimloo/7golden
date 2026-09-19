import React, { useEffect, useRef, useState } from 'react';

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
 * HorizontalScroll — a pinned band where vertical scroll drives a
 * horizontal gallery. While the tall track is on screen the inner strip
 * translates left-to-right (RTL aware), turning a row of cards into a
 * scroll-controlled film strip. Under prefers-reduced-motion it degrades
 * to an ordinary horizontal scroller (overflow-x) so nothing is hidden.
 *
 * `items` render via `renderItem(item, index)`.
 */
export default function HorizontalScroll({
  items = [],
  renderItem,
  itemWidth = 320,
  gap = 28,
  className = '',
}) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef(null);
  const stripRef = useRef(null);
  const [distance, setDistance] = useState(0); // px to translate

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    const strip = stripRef.current;
    if (!track || !strip) return;
    let raf = 0;
    const update = () => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress 0..1 across the pinned dwell
      const travel = rect.height - vh;
      const prog = travel > 0 ? Math.max(0, Math.min(1, -rect.top / travel)) : 0;
      const max = strip.scrollWidth - strip.clientWidth;
      setDistance(max > 0 ? prog * max : 0);
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
      <div className={`hscroll-fallback ${className}`} dir="rtl">
        <div className="hscroll-strip" style={{ gap }}>
          {items.map((item, i) => (
            <div key={i} className="hscroll-card" style={{ width: itemWidth }}>
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // track height scales with how much horizontal content there is
  const trackHeight = Math.max(100, Math.min(220, items.length * 18));

  return (
    <section
      ref={trackRef}
      className={`hscroll-track ${className}`}
      style={{ height: `${trackHeight}svh` }}
      dir="rtl"
    >
      <div className="hscroll-sticky">
        <div
          ref={stripRef}
          className="hscroll-strip"
          style={{ gap, transform: `translate3d(${distance}px, 0, 0)` }}
        >
          {items.map((item, i) => (
            <div key={i} className="hscroll-card" style={{ width: itemWidth }}>
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
