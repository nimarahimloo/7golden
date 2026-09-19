import React from 'react';
import { useParallax } from '@/components/useParallax';
import { useScrollAnimation } from '@/components/useScrollAnimation';

/**
 * ParallaxMedia — an image band that drifts against the scroll and
 * unveils itself with a clip wipe. The picture carries the section;
 * `children` is the optional caption layer sitting on top of it.
 */
export default function ParallaxMedia({
  src,
  alt = '',
  speed = 0.16,
  clamp = 42,
  scale = 1.3,
  ratio = 'aspect-[4/3] md:aspect-[16/9]',
  className = '',
  overlay = true,
  children,
}) {
  const { ref: driftRef, offset } = useParallax(speed);
  const { ref, visible } = useScrollAnimation(0.18);
  const shift = Math.max(-clamp, Math.min(clamp, offset));

  return (
    <div
      ref={ref}
      className={`reveal reveal-clip ${visible ? 'is-visible' : ''} media-frame ${className}`}
    >
      <div ref={driftRef} className={`relative w-full ${ratio}`}>
        {src && (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            style={{ transform: `translate3d(0, ${shift}px, 0) scale(${scale})` }}
          />
        )}
        {overlay && <div className="media-scrim" />}
        {children}
      </div>
    </div>
  );
}
