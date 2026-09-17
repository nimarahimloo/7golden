import { useMemo } from 'react';

// Fixed, subtle gold dust particles that float across the entire viewport —
// gives every page a touch of luxury. Sits behind page content (z-index 0).
export default function GlobalGoldAmbient() {
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
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
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