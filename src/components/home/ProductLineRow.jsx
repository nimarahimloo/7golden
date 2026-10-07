import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

/**
 * یک ردیف افقی: auto-scroll خیلی آهسته + درگ با ماوس/لمس
 * تصاویر object-cover
 */
export default function ProductLineRow({
  title,
  products = [],
  speed = 0.25, // px per frame (~15px/s at 60fps) — آهسته
  direction = 1, // 1 یا -1 برای تنوع ردیف‌ها
}) {
  const trackRef = useRef(null);
  const rafRef = useRef(0);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [paused, setPaused] = useState(false);

  // برای لوپ بی‌نهایت، لیست را ۲–۳ بار تکرار کن
  const loop = products.length ? [...products, ...products, ...products] : [];

  const tick = useCallback(() => {
    const el = trackRef.current;
    if (!el || paused || drag.current.active || products.length < 2) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    el.scrollLeft += speed * direction;
    // وقتی به یک‌سوم رسید (پایان کپی اول) برگرد
    const oneSet = el.scrollWidth / 3;
    if (direction > 0 && el.scrollLeft >= oneSet * 2) {
      el.scrollLeft -= oneSet;
    } else if (direction < 0 && el.scrollLeft <= 0) {
      el.scrollLeft += oneSet;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [paused, speed, direction, products.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (el && products.length >= 2) {
      // شروع از وسط مجموعه
      requestAnimationFrame(() => {
        el.scrollLeft = el.scrollWidth / 3;
      });
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick, products.length]);

  const onPointerDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    setPaused(true);
    el.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - dx;
  };

  const onPointerUp = (e) => {
    drag.current.active = false;
    setPaused(false);
    try {
      trackRef.current?.releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  // جلوگیری از کلیک بعد از درگ
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  if (!products.length) return null;

  return (
    <div className="mb-10 md:mb-14" dir="rtl">
      {title ? (
        <h3
          className="chapter-shell mb-4 md:mb-5 text-lg md:text-xl font-semibold"
          style={{ fontFamily: 'Peyda, serif', color: 'var(--fg)' }}
        >
          {title}
        </h3>
      ) : null}

      <div
        ref={trackRef}
        className="flex gap-4 md:gap-5 overflow-x-auto select-none cursor-grab active:cursor-grabbing px-4 md:px-[max(1rem,calc((100vw-72rem)/2))]"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          if (!drag.current.active) setPaused(false);
        }}
      >
        <style>{`.product-line-row-hide-scroll::-webkit-scrollbar{display:none}`}</style>
        {loop.map((product, i) => {
          const id = product.slug || product.id;
          const name = product.nameFA || product.name_fa || '';
          return (
            <Link
              key={`${id}-${i}`}
              to={`/product/${id}`}
              className="product-line-row-hide-scroll group relative flex-shrink-0 block overflow-hidden rounded-2xl"
              style={{ width: 'min(72vw, 280px)', aspectRatio: '3 / 4' }}
              draggable={false}
            >
              <img
                src={product.image || '/logo.webp'}
                alt={name}
                loading="lazy"
                width={560}
                height={747}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(7,6,4,0.9), transparent)',
                }}
              />
              <div className="absolute bottom-0 right-0 left-0 p-4 pointer-events-none">
                <span
                  className="block text-base md:text-lg font-semibold"
                  style={{ color: 'var(--ink, #fff)', fontFamily: 'Peyda, serif' }}
                >
                  {name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
