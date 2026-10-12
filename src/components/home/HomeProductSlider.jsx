import { useState, useEffect, useRef, useCallback } from 'react';
import ProductTile from '@/components/ProductTile';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * HomeProductSlider — a proper carousel for the homepage product band.
 * Shows all products in one navigable slider with prev/next arrows, dot
 * indicators and auto-advance (pauses on hover/touch). Responsive: ~1.5
 * cards on mobile, 3 on tablet, 4 on desktop. Uses scroll-snap for buttery
 * native scrolling and programmatic scroll for arrow/dot navigation.
 */
const AUTO_ADVANCE_MS = 5500;

export default function HomeProductSlider({ products = [], title }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(1.5);
  const hasProducts = products.length > 0;

  // ---- responsive cards-per-view ----
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 480) setCardsPerView(1.4);
      else if (w < 768) setCardsPerView(2.2);
      else if (w < 1024) setCardsPerView(3);
      else setCardsPerView(4);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const maxIndex = Math.max(0, Math.ceil(products.length - cardsPerView));

  // ---- scroll a card into view ----
  const scrollToIndex = useCallback(
    (idx) => {
      const el = scrollRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(idx, maxIndex));
      const cardW = el.scrollWidth / products.length;
      // RTL: scrollRight is the natural direction; we offset from the right
      el.scrollTo({ left: clamped * cardW, behavior: 'smooth' });
      setActiveIndex(clamped);
    },
    [maxIndex, products.length],
  );

  const goPrev = useCallback(() => {
    // In RTL, "prev" (right arrow) moves to the earlier item (higher scroll-left)
    scrollToIndex(activeIndex - 1);
  }, [activeIndex, scrollToIndex]);

  const goNext = useCallback(() => {
    scrollToIndex(activeIndex + 1);
  }, [activeIndex, scrollToIndex]);

  // ---- track active index via scroll position ----
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !hasProducts) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const cardW = el.scrollWidth / products.length || 1;
        const idx = Math.round(el.scrollLeft / cardW);
        setActiveIndex(Math.max(0, Math.min(idx, maxIndex)));
        ticking = false;
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [hasProducts, products.length, maxIndex]);

  // ---- auto-advance ----
  useEffect(() => {
    if (!hasProducts || paused || maxIndex === 0) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev >= maxIndex ? 0 : prev + 1;
        scrollToIndex(next);
        return next;
      });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [hasProducts, paused, maxIndex, scrollToIndex]);

  // ---- dot count (one per scrollable page) ----
  const dotCount = maxIndex + 1;

  if (!hasProducts) return null;

  return (
    <section className="chapter pt-4 pb-2" dir="rtl">
      <div className="chapter-shell mb-6 flex items-center justify-between gap-4">
        <h3
          className="text-lg md:text-xl font-semibold"
          style={{ fontFamily: 'Peyda, serif', color: 'var(--fg)' }}
        >
          {title || 'محصولات'}
        </h3>

        {/* Arrow controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={goNext}
            aria-label="محصول بعدی"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              border: '1px solid var(--hairline-strong)',
              background: 'rgba(212,175,55,0.06)',
              color: 'var(--gold-2)',
            }}
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={goPrev}
            aria-label="محصول قبلی"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              border: '1px solid var(--hairline-strong)',
              background: 'rgba(212,175,55,0.06)',
              color: 'var(--gold-2)',
            }}
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>

      {/* Scroll-snap track */}
      <div
        ref={scrollRef}
        className="hps-track overflow-x-auto overflow-y-hidden"
        style={{
          display: 'flex',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {products.map((p, i) => (
          <div
            key={p.slug || p.id || i}
            className="hps-card flex-shrink-0"
            style={{
              scrollSnapAlign: 'start',
              width: `calc(100% / ${cardsPerView})`,
            }}
          >
            <ProductTile
              product={p}
              loading={i < Math.ceil(cardsPerView) ? 'eager' : 'lazy'}
              className="px-3 md:px-4"
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {dotCount > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              aria-label={`صفحه ${i + 1}`}
              className="hps-dot transition-all duration-300"
              style={{
                width: i === activeIndex ? '28px' : '8px',
                height: '8px',
                borderRadius: '999px',
                background:
                  i === activeIndex ? 'var(--gold-2)' : 'var(--hairline-strong)',
                opacity: i === activeIndex ? 1 : 0.5,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
