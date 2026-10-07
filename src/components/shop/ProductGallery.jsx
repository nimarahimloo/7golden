import React from 'react';
import Reveal from '@/components/story/Reveal';
import { useParallax } from '@/components/useParallax';

/**
 * PRODUCT_CLOSEUPS — the close-up product gallery shown on the products page.
 * Each entry is a single frame: a macro/close shot of one grade, with the
 * product line as eyebrow and a short B2B note. Edit copy and images here.
 */
export const PRODUCT_CLOSEUPS = [
  {
    eyebrow: 'پسته',
    title: 'مغز پسته قزوین',
    note: 'سبز مطلوب، دانه‌بندی یکنواخت و کنترل‌شده در آزمایشگاه',
    image: '/banner/pistachio-kernels.webp',
  },
  {
    eyebrow: 'پسته',
    title: 'خلال پسته',
    note: 'برش یکنواخت برای قنادی و شکلات',
    image: '/product/khelal-qazvin-slice.webp',
  },
  {
    eyebrow: 'فندق',
    title: 'مغز فندق',
    note: 'تفکیک دقیق سایز، بدون آلودگی',
    image: '/banner/hazelnut-spoon.webp',
  },
  {
    eyebrow: 'فندق',
    title: 'خمیر فندق',
    note: 'آماده برای خط تولید شکلات و کرم',
    image: '/product/hazelnut-paste.webp',
  },
  {
    eyebrow: 'بادام',
    title: 'پرک بادام درختی',
    note: 'ضخامت دقیق، شکستگی کنترل‌شده',
    image: '/product/almond-flakes.webp',
  },
  {
    eyebrow: 'مجموعه',
    title: 'ترکیب گریدها',
    note: 'نمونه‌ای از گریدهای آمادهٔ ارسال',
    image: '/banner/product-nuts-assortment.webp',
  },
];

/**
 * GalleryTile — one close-up frame. The picture drifts and gently zooms with
 * scroll (direct DOM parallax, no re-renders) while the frame unveils with a
 * clip wipe. A gold hairline frame lights up on hover.
 */
function GalleryTile({ item, index, delay = 0, ratio = 'aspect-[4/3]', className = '' }) {
  const driftRef = useParallax({
    speed: 0.18,
    maxZoom: 1.24,
    baseScale: 1.2,
    clamp: 56,
  });

  return (
    <Reveal variant="clip" delay={delay} className={className}>
      <div className={`media-frame gold-frame gallery-tile-frame ${ratio}`}>
        <img ref={driftRef} src={item.image} alt={item.title} loading="lazy" />
        <div className="media-scrim" />
        <span className="gallery-tile-index outline-num">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="gallery-tile-caption">
          <span className="eyebrow">{item.eyebrow}</span>
          <h3 className="display-sm" style={{ color: 'var(--ink, #fff)' }}>
            {item.title}
          </h3>
          <p className="font-body text-xs md:text-sm" style={{ color: 'var(--fg-muted)', opacity: 0.85 }}>
            {item.note}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * ProductGallery — an artistic, scroll-reactive close-up gallery of the
 * 7Golden grades. An editorial mosaic (one full-bleed feature, a portrait
 * triptych, a wide pair) built to read as a luxury industrial vitrine.
 */
export default function ProductGallery({ items = PRODUCT_CLOSEUPS }) {
  if (!items.length) return null;

  return (
    <section className="chapter" dir="rtl">
      <div className="chapter-shell">
        <div className="mb-10 md:mb-14 max-w-2xl">
          <span className="eyebrow block mb-3">نمای نزدیک محصول</span>
          <h2 className="display-md" style={{ color: 'var(--fg)' }}>
            کیفیتی که از نزدیک دیده می‌شود
          </h2>
          <p
            className="font-body text-sm md:text-base leading-relaxed mt-4"
            style={{ color: 'var(--fg-muted)', opacity: 0.85 }}
          >
            پیش از ثبت سفارش، محصول را همان‌طور که هست نشان می‌دهیم؛ رنگ، دانه‌بندی و بافت
            هر گرید را از نمای نزدیک ببینید.
          </p>
        </div>

        {/* Feature frame */}
        <GalleryTile
          item={items[0]}
          index={0}
          ratio="aspect-[4/3] md:aspect-[16/9]"
          className="mb-4 md:mb-5"
        />

        {/* Portrait triptych */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">
          {items.slice(1, 4).map((item, i) => (
            <GalleryTile key={item.title} item={item} index={i + 1} delay={i * 90} ratio="aspect-[3/4]" />
          ))}
        </div>

        {/* Wide pair */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {items.slice(4, 6).map((item, i) => (
            <GalleryTile key={item.title} item={item} index={i + 4} delay={i * 90} ratio="aspect-[4/3]" />
          ))}
        </div>
      </div>
    </section>
  );
}
