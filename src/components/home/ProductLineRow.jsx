import React, { useRef, useEffect, useState } from 'react';
import ProductTile from '@/components/ProductTile';

/**
 * Horizontal product marquee — continuous transform loop (not scrollLeft).
 * Minimal-luxury: larger cards, more air, calm hover, clear category title.
 * Drag to scrub; pause on hover. Auto-copies so the loop never shows a gap.
 */
export default function ProductLineRow({
  title,
  products = [],
  duration = 80,
  reverse = false,
}) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const dragRef = useRef({ on: false, x: 0, base: 0, moved: false });
  const [paused, setPaused] = useState(false);
  const [copies, setCopies] = useState(4);

  const hasProducts = products.length > 0;

  useEffect(() => {
    if (!hasProducts) return;
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    const oneSetW = track.scrollWidth / copies;
    if (!oneSetW) return;
    const needed = Math.max(4, Math.ceil((vp.clientWidth * 2) / oneSetW) + 1);
    if (needed > copies) setCopies(needed);
  }, [hasProducts, products, copies]);

  const loop = hasProducts
    ? Array.from({ length: copies }, () => products).flat()
    : [];

  useEffect(() => {
    if (!hasProducts) return;
    const el = trackRef.current;
    if (!el) return;
    let raf;
    let last = performance.now();

    const step = (now) => {
      if (!dragRef.current.on && !paused) {
        const half = el.scrollWidth / copies || 1;
        const pxPerMs = half / (duration * 1000);
        const dt = Math.min(now - last, 64);
        offsetRef.current += (reverse ? -1 : 1) * pxPerMs * dt;
        while (offsetRef.current >= half) offsetRef.current -= half;
        while (offsetRef.current < 0) offsetRef.current += half;
        el.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
      }
      last = now;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, duration, reverse, hasProducts, copies]);

  const pointerDown = (e) => {
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    if (x == null) return;
    dragRef.current = { on: true, x, base: offsetRef.current, moved: false };
    setPaused(true);
  };

  const pointerMove = (e) => {
    if (!dragRef.current.on) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    if (x == null) return;
    const dx = dragRef.current.x - x;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    offsetRef.current = dragRef.current.base + dx;
    const el = trackRef.current;
    if (el) {
      const half = el.scrollWidth / copies || 1;
      while (offsetRef.current >= half) offsetRef.current -= half;
      while (offsetRef.current < 0) offsetRef.current += half;
      el.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
    }
  };

  const pointerUp = () => {
    dragRef.current.on = false;
    setPaused(false);
  };

  const clickCapture = (e) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  };

  if (!hasProducts) return null;

  return (
    <div className="w-full mb-10 md:mb-14" dir="rtl">
      {title ? (
        <div className="chapter-shell mb-5 md:mb-6">
          <div className="flex items-center gap-3">
            <span
              className="h-px w-8 shrink-0"
              style={{ background: 'var(--hairline-strong)' }}
              aria-hidden="true"
            />
            <h3
              className="text-sm md:text-base font-medium tracking-wide"
              style={{
                fontFamily: 'Peyda, serif',
                color: 'var(--fg-muted)',
              }}
            >
              {title}
            </h3>
          </div>
        </div>
      ) : null}

      <div
        ref={viewportRef}
        className="plr-viewport overflow-hidden w-full"
        style={{ cursor: 'grab', touchAction: 'pan-y' }}
        onMouseDown={pointerDown}
        onMouseMove={pointerMove}
        onMouseUp={pointerUp}
        onTouchStart={pointerDown}
        onTouchMove={pointerMove}
        onTouchEnd={pointerUp}
        onClickCapture={clickCapture}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          pointerUp();
        }}
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ width: 'max-content' }}
        >
          {loop.map((p, i) => (
            <ProductTile
              key={`${p.slug || p.id}-${i}`}
              product={p}
              loading={i < products.length ? 'eager' : 'lazy'}
              className="flex-shrink-0 px-4 md:px-5 box-content"
              style={{ width: 'min(52vw, 240px)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
