import { useMemo } from 'react';

// Enhanced gold dust particles for the footer — 120 particles, many bright,
// some with shimmer, creating a rich luxury sparkle.
export default function FooterParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1.5 + Math.random() * 6,
      duration: 4 + Math.random() * 12,
      delay: Math.random() * 10,
      bright: Math.random() > 0.5,
      shimmer: Math.random() > 0.7,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {particles.map(p => (
        <div
          key={p.id}
          className={`gold-particle ${p.shimmer ? 'shimmer-line' : ''}`}
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ...(p.bright ? {
              background: 'radial-gradient(circle, rgba(255,245,210,1) 0%, rgba(232,197,71,0) 70%)',
              boxShadow: '0 0 10px rgba(232,197,71,0.7)',
            } : {}),
          }}
        />
      ))}
    </div>
  );
}