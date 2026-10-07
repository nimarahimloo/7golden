import { useEffect, useMemo, useRef } from 'react';

// Fixed, subtle gold dust particles that float across the entire viewport —
// gives every page a touch of luxury. Sits behind page content (z-index 0).
// The whole field drifts gently against the scroll so the ambience feels
// alive without ever drawing attention away from the content.
export default function GlobalGoldAmbient() {
  const fieldRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = fieldRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(0, ${-(window.scrollY * 0.045)}px, 0)`;
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', update);
      cancelAnimationFrame(raf);
    };
  }, []);

  const particles = useMemo(() =>
    Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1 + Math.random() * 4,
      duration: 8 + Math.random() * 15,
      delay: Math.random() * 12,
      bright: Math.random() > 0.6,
    })), []
  );

  return (
    <div
      ref={fieldRef}
      style={{
        position: 'fixed',
        inset: '-12% 0',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        willChange: 'transform',
      }}
    >
      {particles.map(p => (
        <div
          key={p.id}
          className="gold-particle"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.5,
            ...(p.bright ? {
              background: 'radial-gradient(circle, rgba(255,245,210,1) 0%, rgba(240,206,90,0) 70%)',
              boxShadow: '0 0 10px rgba(240,206,90,0.6)',
            } : {}),
          }}
        />
      ))}
    </div>
  );
}