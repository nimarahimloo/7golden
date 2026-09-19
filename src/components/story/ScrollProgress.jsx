import React, { useEffect, useState } from 'react';

/**
 * ScrollProgress — a thin gold rail pinned to the top of the viewport
 * that tracks how far through the page the visitor has scrolled.
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

  return <div className="scroll-progress" style={{ transform: `scaleX(${ratio})` }} aria-hidden="true" />;
}
