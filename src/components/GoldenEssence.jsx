import { createPortal } from 'react-dom';

/**
 * GoldenEssence — a lightweight CSS-only ambient backdrop.
 *
 * A fixed, non-interactive layer behind the page content: a subtle gold
 * radial wash. No WebGL, no particles, no requestAnimationFrame loop —
 * keeps the GPU free so scroll-driven animations (parallax, reveals,
 * sticky scenes) stay buttery-smooth.
 */
export default function GoldenEssence() {
  return createPortal(
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse 70% 55% at 50% 28%, rgba(212,175,55,0.10) 0%, transparent 62%),' +
          'radial-gradient(ellipse 60% 45% at 12% 82%, rgba(212,175,55,0.06) 0%, transparent 65%),' +
          'radial-gradient(ellipse 55% 40% at 88% 68%, rgba(212,175,55,0.05) 0%, transparent 65%)',
      }}
    />,
    document.body
  );
}
