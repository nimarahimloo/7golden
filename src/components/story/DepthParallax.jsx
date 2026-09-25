import React, { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '@/components/useScrollAnimation';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);
  return reduced;
}

/**
 * DepthParallax — a multi-layer parallax scene.
 * One image is stacked three deep: a blurred, zoomed atmosphere layer
 * (slowest), the sharp picture (mid), and a foreground glass copy panel
 * plus a travelling gold light beam (fastest). The speed differential is
 * what sells real depth, which a single drifting image never can.
 *
 * All transforms are applied via direct DOM manipulation in a single
 * requestAnimationFrame loop — no React state, no re-renders — so the
 * motion stays buttery-smooth even on low-power mobile GPUs.
 *
 * `layers` lets a caller swap the back/mid image; defaults to `src`.
 * `children` is the caption block pinned to the foreground panel.
 */
export default function DepthParallax({
  src,
  alt = '',
  ratio = 'aspect-[4/3] md:aspect-[21/9]',
  className = '',
  children,
  beam = true,
}) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef(null);
  const backRef = useRef(null);
  const midRef = useRef(null);
  const frontRef = useRef(null);
  const beamRef = useRef(null);
  const { ref: revealRef, visible } = useScrollAnimation(0.12);

  useEffect(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 when the frame top hits the viewport bottom, 1 when its bottom
        // hits the viewport top — the full travel of the element through view.
        const travel = rect.height + vh;
        const p = Math.max(0, Math.min(1, (vh - rect.top) / travel));

        const isMobile = window.innerWidth < 768;

        // Depth offsets — back drifts least, front drifts most.
        // Intensified for a more dramatic, alive sense of depth.
        const back = (p - 0.5) * (isMobile ? 0 : 44);
        const mid = (p - 0.5) * (isMobile ? 52 : 104);
        const front = (p - 0.5) * (isMobile ? 78 : 168);
        const beamX = p * 180 - 90;

        // Scroll-driven zoom on the mid layer — peaks when centred.
        const distance = Math.abs((rect.top + rect.height / 2) - vh / 2);
        const radius = vh * 0.7;
        const t = Math.max(0, Math.min(1, 1 - distance / radius));
        const eased = t * t * (3 - 2 * t);
        const midZoom = (isMobile ? 1.22 : 1.3) + eased * (isMobile ? 0.06 : 0.08);

        if (backRef.current)
          backRef.current.style.transform = `translate3d(0, ${back}px, 0) scale(1.4)`;
        if (midRef.current)
          midRef.current.style.transform = `translate3d(0, ${mid}px, 0) scale(${midZoom})`;
        if (frontRef.current)
          frontRef.current.style.transform = `translate3d(0, ${front}px, 0)`;
        if (beamRef.current)
          beamRef.current.style.transform = `translateX(${beamX}%)`;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={(node) => {
        trackRef.current = node;
        revealRef.current = node;
      }}
      className={`reveal reveal-clip ${visible ? 'is-visible' : ''} depth-scene media-frame ${ratio} ${className}`}
    >
      {/* ---- back: blurred atmosphere ---- */}
      <div
        ref={backRef}
        className="depth-layer depth-back"
        aria-hidden
      >
        {src && <img src={src} alt="" loading="lazy" />}
      </div>

      {/* ---- mid: sharp picture ---- */}
      <div
        ref={midRef}
        className="depth-layer depth-mid"
      >
        {src && <img src={src} alt={alt} loading="lazy" />}
      </div>

      {/* ---- scrim ---- */}
      <div className="depth-scrim" />

      {/* ---- travelling gold light beam ---- */}
      {beam && !reduced && (
        <div ref={beamRef} className="depth-beam" aria-hidden />
      )}

      {/* ---- foreground caption ---- */}
      {children && (
        <div
          ref={frontRef}
          className="depth-foreground"
        >
          {children}
        </div>
      )}
    </div>
  );
}
