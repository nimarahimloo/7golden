import React, { useEffect, useState } from 'react';

/**
 * ScrollProgress — a refined gold rail pinned to the top of the viewport
 * that tracks how far through the page the visitor has scrolled. A faint
 * track sits behind a glowing gold fill, with a luminous dot at the leading
 * edge — so the reader always senses where they are in the story.
 */
export default function ScrollProgress() {
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setRatio(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
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
  }, []);

  return (
    <div className="scroll-progress-wrap" aria-hidden="true">
      <div className="scroll-progress-track" />
      <div
        className="scroll-progress-fill"
        style={{ transform: `scaleX(${ratio})` }}
      />
      <div
        className="scroll-progress-dot"
        style={{ left: `${ratio * 100}%`, opacity: ratio > 0.005 && ratio < 0.999 ? 1 : 0 }}
      />
    </div>
  );
}
