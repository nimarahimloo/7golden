import React from 'react';
import { useParallax } from '@/components/useParallax';
import { useScrollAnimation } from '@/components/useScrollAnimation';

/**
 * ParallaxMedia — an image band that drifts against the scroll and
 * unveils itself with a clip wipe. The picture carries the section;
 * `children` is the optional caption layer sitting on top of it.
 *
 * Uses direct DOM manipulation for buttery-smooth scroll motion.
 */
export default function ParallaxMedia({
  src,
  alt = '',
  speed = 0.24,
  clamp = 64,
  scale = 1.35,
  zoom = 1.15,
  ratio = 'aspect-[4/3] md:aspect-[16/9]',
  className = '',
  overlay = true,
  children,
}) {
  const driftRef = useParallax({ speed, maxZoom: zoom, baseScale: scale, clamp });
  const { ref, visible } = useScrollAnimation(0.18);

  return (
    <div
      ref={ref}
      className={`reveal reveal-clip ${visible ? 'is-visible' : ''} media-frame ${className}`}
    >
      <div className={`relative w-full ${ratio}`}>
        {src && (
          <img
            ref={driftRef}
            src={src}
            alt={alt}
            loading="lazy"
            style={{ willChange: 'transform' }}
          />
        )}
        {overlay && <div className="media-scrim" />}
        {children}
      </div>
    </div>
  );
}
