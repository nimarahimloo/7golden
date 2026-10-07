import { useEffect, useRef } from 'react';

/**
 * ScrollAura — a fixed, scroll-linked golden light that travels through the
 * viewport as the visitor moves down the page. Two soft gold blooms drift in
 * opposite directions and breathe with scroll progress, so every page feels
 * lit from within and "alive" while scrolling.
 *
 * Updates run through requestAnimationFrame and only touch CSS custom
 * properties + opacity — never a React re-render. Disabled under
 * prefers-reduced-motion so nothing moves for users who asked for calm.
 */
export default function ScrollAura() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        el.style.setProperty('--aura-a-x', `${14 + p * 72}%`);
        el.style.setProperty('--aura-a-y', `${6 + p * 86}%`);
        el.style.setProperty('--aura-b-x', `${86 - p * 72}%`);
        el.style.setProperty('--aura-b-y', `${94 - p * 86}%`);
        el.style.opacity = String(0.55 + 0.45 * Math.sin(p * Math.PI));
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
  }, []);

  return <div ref={ref} className="scroll-aura" aria-hidden="true" />;
}
