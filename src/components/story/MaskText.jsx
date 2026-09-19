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
 * MaskText — a signature "special style" band: oversized display type
 * filled with a moving image (background-clip: text). The image pans
 * slowly as the band travels through the viewport, so the word itself
 * becomes a window onto the orchard. A thin gold rule draws in beneath.
 *
 * Under prefers-reduced-motion the image is static and the text resolves
 * to the gold ramp so it stays fully legible.
 */
export default function MaskText({
  image,
  text,
  eyebrow,
  className = '',
  scale = 1.4,
}) {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef(null);
  const { ref: revealRef, visible } = useScrollAnimation(0.2);
  const [pan, setPan] = useState(50); // background-position x %

  useEffect(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = rect.height + vh;
      const prog = (vh - rect.top) / travel;
      const clamped = Math.max(0, Math.min(1, prog));
      // pan from 18% to 82% across the travel
      setPan(18 + clamped * 64);
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

  const fillStyle = reduced
    ? undefined
    : {
        backgroundImage: `url(${image})`,
        backgroundSize: `cover`,
        backgroundPosition: `${pan}% center`,
        backgroundRepeat: 'no-repeat',
      };

  return (
    <div
      ref={(node) => {
        trackRef.current = node;
        revealRef.current = node;
      }}
      className={`mask-band ${className}`}
      dir="rtl"
    >
      {eyebrow && (
        <span className="eyebrow block text-center mb-5 reveal reveal-up" style={{ opacity: visible ? 1 : undefined }}>
          {eyebrow}
        </span>
      )}
      <h2
        className={`mask-word ${reduced ? 'is-static' : ''} reveal reveal-clip ${visible ? 'is-visible' : ''}`}
        style={fillStyle}
      >
        {text}
      </h2>
      <div className={`header-gold-rule mx-auto mt-7 reveal ${visible ? 'is-visible' : ''}`} />
    </div>
  );
}
