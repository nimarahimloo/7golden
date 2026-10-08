import React, { useRef, useEffect, useState } from 'react';
import ProductTile from '@/components/ProductTile';

/**
 * ردیف مارکی افقی — حرکت پیوسته با transform (نه scrollLeft).
 * کارت نزدیک مرکز صفحه نور می‌گیرد (spotlight) تا ردیف‌ها زنده و هماهنگ دیده شوند.
 * درگ برای عقب/جلو، توقف روی هاور.
 */
export default function ProductLineRow({
  title,
  products = [],
  duration = 80,
  reverse = false,
}) {
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const dragRef = useRef({ on: false, x: 0, base: 0, moved: false });
  const [paused, setPaused] = useState(false);

  const hasProducts = products.length > 0;
  // دو کپی برای لوپ بی‌نهایت
  const COPIES = 4;
  const loop = hasProducts ? Array.from({ length: COPIES }, () => products).flat() : [];

  useEffect(() => {
    if (!hasProducts) return;
    const el = trackRef.current;
    if (!el) return;
    let raf;
    let last = performance.now();

    const step = (now) => {
      if (!dragRef.current.on && !paused) {
        const half = el.scrollWidth / COPIES || 1;
        // یک دور کامل در `duration` ثانیه
        const pxPerMs = half / (duration * 1000);
        const dt = Math.min(now - last, 64);
        offsetRef.current += (reverse ? -1 : 1) * pxPerMs * dt;
        // نرمال‌سازی در بازه [0, half)
        while (offsetRef.current >= half) offsetRef.current -= half;
        while (offsetRef.current < 0) offsetRef.current += half;
        el.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
      }
      last = now;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, duration, reverse, hasProducts]);

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
      const half = el.scrollWidth / COPIES || 1;
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
        <div className="chapter-shell mb-4">
          <h3
            className="text-base md:text-lg font-semibold"
            style={{ fontFamily: 'Peyda, serif', color: 'var(--fg)' }}
          >
            {title}
          </h3>
        </div>
      ) : null}

      <div
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
              className="flex-shrink-0 px-3 md:px-4 box-content"
              style={{ width: 'min(46vw, 210px)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
