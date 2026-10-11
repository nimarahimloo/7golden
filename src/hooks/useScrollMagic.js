import { useEffect, useRef } from 'react';

/**
 * useScrollMagic — a light, GPU-only scroll drift.
 *
 * Gently translates the element as it moves through the viewport so sections
 * feel alive while scrolling, without any layout work. It is rAF-throttled,
 * viewport-gated (no work for off-screen elements) and fully disabled for
 * visitors who prefer reduced motion — so it stays smooth on low-end devices.
 *
 * Attach the returned ref to a wrapper element. Keep it on a decorative or
 * media wrapper so it never fights a component's own transform.
 *
 *   const ref = useScrollMagic({ speed: 0.15 });
 *   <div ref={ref}>…</div>
 */
export default function useScrollMagic({ speed = 0.12, max = 60 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let ticking = false;
    let visible = false;

    const update = () => {
      ticking = false;
      if (!visible) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // -1 (below fold) → 0 (centred) → 1 (above fold)
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const offset = Math.max(-max, Math.min(max, -progress * speed * 100));
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    };

    const request = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) request();
      },
      { rootMargin: '140px' }
    );
    io.observe(el);

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });
    request();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      cancelAnimationFrame(raf);
    };
  }, [speed, max]);

  return ref;
}
