import { useEffect, useRef } from 'react';

/**
 * Scroll parallax with **direct DOM manipulation** — no React state,
 * so scroll never triggers a re-render. This is what keeps the motion
 * buttery-smooth even on low-power mobile GPUs where a per-frame
 * setState would otherwise drop frames.
 *
 * The ref'd element gets `transform: translate3d(…, scale(…))` updated
 * in a requestAnimationFrame loop. Intensity is reduced (not halved)
 * on small screens so the motion stays smooth yet still feels alive.
 *
 * @param {object}  opts
 * @param {number}  opts.speed     - parallax drift strength (0.22 = moderate, 0.35 = strong)
 * @param {number}  opts.maxZoom   - peak zoom at viewport centre (1.0 = no zoom)
 * @param {number}  opts.baseScale - resting scale (use >1 when the element
 *                                  is inside an overflow-hidden clip so the
 *                                  parallax drift never reveals edges)
 * @param {number}  opts.clamp     - max pixel drift in either direction
 * @param {number}  opts.reach     - viewport-height fraction over which the
 *                                  zoom influence extends from centre
 */
export function useParallax({
  speed = 0.3,
  maxZoom = 1.0,
  baseScale = 1.0,
  clamp = 9999,
  reach = 0.7,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const center = rect.top + rect.height / 2;
        const vpCenter = vh / 2;
        const distance = center - vpCenter;

        // Reduce intensity on small screens, but keep it alive (0.7x not 0.5x).
        const isMobile = window.innerWidth < 768;
        const effSpeed = isMobile ? speed * 0.7 : speed;

        let offset = distance * effSpeed;
        offset = Math.max(-clamp, Math.min(clamp, offset));

        let transform;
        if (maxZoom > 1.0) {
          const effMaxZoom = isMobile ? 1 + (maxZoom - 1) * 0.75 : maxZoom;
          const radius = vh * reach;
          const t = Math.max(0, Math.min(1, 1 - Math.abs(distance) / radius));
          const eased = t * t * (3 - 2 * t);
          const zoom = baseScale * (1 + (effMaxZoom - 1) * eased);
          transform = `translate3d(0, ${offset}px, 0) scale(${zoom})`;
        } else {
          transform = `translate3d(0, ${offset}px, 0) scale(${baseScale})`;
        }

        el.style.transform = transform;
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
  }, [speed, maxZoom, baseScale, clamp, reach]);

  return ref;
}
