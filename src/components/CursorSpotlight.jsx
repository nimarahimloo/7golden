import { useEffect, useRef } from 'react';

/**
 * CursorSpotlight — a soft golden light that trails the pointer across the
 * whole site, the way getlayers.ai lights its dark surfaces. Fixed, blended
 * in "screen" mode so it only ever adds light and never dulls content.
 *
 * Desktop pointers only (no touch), and disabled under prefers-reduced-motion
 * so nothing moves for visitors who asked for calm. The element is moved with
 * transform only (GPU) and never triggers a React re-render.
 */
export default function CursorSpotlight() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = ref.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.4;
    let x = targetX;
    let y = targetY;
    let raf = 0;
    let visible = false;

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = '1';
      }
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = '0';
    };

    const step = () => {
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(step);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(step);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="cursor-spotlight" aria-hidden="true" />;
}
