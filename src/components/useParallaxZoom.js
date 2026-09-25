import { useEffect, useRef } from 'react';

/**
 * Combined parallax-drift + scroll-zoom hook using **direct DOM
 * manipulation** — no React state, so scroll never triggers a re-render.
 * This is what keeps the effect smooth on low-power mobile GPUs where a
 * per-frame setState would otherwise drop frames.
 *
 * The element the ref is attached to gets `transform: translate3d(…, scale(…))`
 * updated in a requestAnimationFrame loop. Intensity is reduced on small
 * screens but kept strong enough (0.7x) so the motion still feels alive.
 *
 * @param {object}  opts
 * @param {number}  opts.speed     - parallax drift strength (0.16 = moderate)
 * @param {number}  opts.maxZoom   - peak zoom at viewport centre (1.2 = 20%)
 * @param {number}  opts.baseScale - resting scale (use >1 when the element
 *                                   is inside an overflow-hidden clip so the
 *                                   parallax drift never reveals edges)
 * @param {number}  opts.reach     - viewport-height fraction over which the
 *                                   zoom influence extends from centre
 */
export function useParallaxZoom({
  speed = 0.16,
  maxZoom = 1.2,
  baseScale = 1.0,
  reach = 0.65,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const center = rect.top + rect.height / 2;
        const vpCenter = vh / 2;

        // Reduce intensity on small screens but keep it alive (0.7x not 0.5x).
        const isMobile = window.innerWidth < 768;
        const effSpeed = isMobile ? speed * 0.7 : speed;
        const effMaxZoom = isMobile ? 1 + (maxZoom - 1) * 0.75 : maxZoom;

        // Parallax drift — element moves opposite to scroll.
        const offset = (center - vpCenter) * effSpeed;

        // Scroll zoom — smoothstep ramp peaking at viewport centre.
        const distance = Math.abs(center - vpCenter);
        const radius = vh * reach;
        const t = Math.max(0, Math.min(1, 1 - distance / radius));
        const eased = t * t * (3 - 2 * t);
        const zoom = baseScale * (1 + (effMaxZoom - 1) * eased);

        el.style.transform = `translate3d(0, ${offset}px, 0) scale(${zoom})`;
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
  }, [speed, maxZoom, baseScale, reach]);

  return ref;
}
