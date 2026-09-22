import { useEffect, useRef, useState } from 'react';

/**
 * Gentle scroll parallax — returns a ref and a translateY offset.
 * The element drifts opposite to scroll, creating a 3D depth effect.
 * @param {number} speed - 0.1 = subtle, 0.3 = moderate, 0.5 = strong
 */
export function useParallax(speed = 0.25) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let raf;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const center = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const distance = center - viewportCenter;
        // Reduce parallax intensity on mobile for smoother scrolling.
        const isMobile = window.innerWidth < 768;
        setOffset(distance * speed * (isMobile ? 0.5 : 1));
      });
    };
    const onScroll = () => update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return { ref, offset };
}