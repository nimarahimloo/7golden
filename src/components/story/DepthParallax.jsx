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
  const { ref: revealRef, visible } = useScrollAnimation(0.12);
  const [p, setP] = useState(0); // 0..1 progress through the frame

  useEffect(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the frame top hits the viewport bottom, 1 when its bottom
      // hits the viewport top — the full travel of the element through view.
      const travel = rect.height + vh;
      const prog = (vh - rect.top) / travel;
      setP(Math.max(0, Math.min(1, prog)));
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

  // depth offsets — back drifts least, front drifts most
  const back = (p - 0.5) * 26;   // atmosphere
  const mid = (p - 0.5) * 64;    // sharp picture
  const front = (p - 0.5) * 104; // glass panel
  const beamX = p * 140 - 70;    // gold beam sweeps -70%..70%

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
        className="depth-layer depth-back"
        style={reduced ? undefined : { transform: `translate3d(0, ${back}px, 0) scale(1.35)` }}
        aria-hidden
      >
        {src && <img src={src} alt="" loading="lazy" />}
      </div>

      {/* ---- mid: sharp picture ---- */}
      <div
        className="depth-layer depth-mid"
        style={reduced ? undefined : { transform: `translate3d(0, ${mid}px, 0) scale(1.18)` }}
      >
        {src && <img src={src} alt={alt} loading="lazy" />}
      </div>

      {/* ---- scrim ---- */}
      <div className="depth-scrim" />

      {/* ---- travelling gold light beam ---- */}
      {beam && !reduced && (
        <div className="depth-beam" style={{ transform: `translateX(${beamX}%)` }} aria-hidden />
      )}

      {/* ---- foreground caption ---- */}
      {children && (
        <div
          className="depth-foreground"
          style={reduced ? undefined : { transform: `translate3d(0, ${front}px, 0)` }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
