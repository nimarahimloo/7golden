import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-driven zoom — returns a ref and a scale factor that peaks when the
 * element sits at the centre of the viewport and eases back as it travels
 * away. The effect "leans in" toward the texture of a product photo as the
 * user scrolls it into focus, then settles back — a cinematic breath rather
 * than a static hover state.
 *
 * @param {number} maxZoom  - scale at viewport centre (e.g. 1.18)
 * @param {number} baseZoom - scale at the edges of the travel range
 * @param {number} reach    - how far (in viewport-height fractions) the
 *                            influence extends from centre before the zoom
 *                            bottoms out at `baseZoom`.
 */
export function useScrollZoom(maxZoom = 1.18, baseZoom = 1.0, reach = 0.6) {
  const ref = useRef(null);
  const [scale, setScale] = useState(baseZoom);

  useEffect(() => {
    // Respect users who asked for less motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const elCenter = rect.top + rect.height / 2;
        const viewportCenter = vh / 2;
        const distance = Math.abs(elCenter - viewportCenter);
        const radius = vh * reach;
        // 1 at centre, 0 once the element is `radius` away.
        const t = Math.max(0, Math.min(1, 1 - distance / radius));
        // smoothstep easing for an organic ramp in/out
        const eased = t * t * (3 - 2 * t);
        setScale(baseZoom + (maxZoom - baseZoom) * eased);
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
  }, [maxZoom, baseZoom, reach]);

  return { ref, scale };
}
