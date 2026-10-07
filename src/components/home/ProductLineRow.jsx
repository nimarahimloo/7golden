import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * ردیف مارکی افقی — حرکت با transform (نه scrollLeft)
 * object-contain تا تصویر برش نخورد
 * درگ برای عقب/جلو
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
  const [dragX, setDragX] = useState(0);

  if (!products.length) return null;

  // دو کپی برای لوپ بی‌نهایت
  const loop = [...products, ...products];

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf;
    let last = performance.now();
    // سرعت بر حسب px/ms از duration و نصف عرض ترک
    const step = (now) => {
      if (!dragRef.current.on && !paused) {
        const half = el.scrollWidth / 2 || 1;
        // یک دور کامل در `duration` ثانیه
        const pxPerMs = half / (duration * 1000);
        const dt = now - last;
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
  }, [paused, duration, reverse, products.length]);

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
      const half = el.scrollWidth / 2 || 1;
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
        className="overflow-hidden w-full"
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
          className="flex gap-4 md:gap-5 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {loop.map((p, i) => {
            const id = p.slug || p.id;
            const name = p.nameFA || p.name_fa || '';
            return (
              <Link
                key={`${id}-${i}`}
                to={`/product/${id}`}
                className="relative flex-shrink-0 overflow-hidden rounded-2xl block"
                style={{
                  width: 'min(68vw, 240px)',
                  height: 'min(80vw, 300px)',
                  background: 'rgba(255,255,255,0.03)',
                }}
                draggable={false}
              >
                <img
                  src={p.image || '/logo.webp'}
                  alt={name}
                  width={480}
                  height={600}
                  loading="lazy"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-contain p-3"
                />
                <div
                  className="absolute inset-x-0 bottom-0 pt-10 pb-3 px-3 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
                  }}
                >
                  <span
                    className="block text-sm font-semibold text-center"
                    style={{ color: '#fff', fontFamily: 'Peyda, serif' }}
                  >
                    {name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
