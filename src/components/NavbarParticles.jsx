import { useMemo } from 'react';

// Gold dust particles along the bottom edge of the navbar — subtle luxury accent.
export default function NavbarParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1 + Math.random() * 3.5,
      duration: 4 + Math.random() * 8,
      delay: Math.random() * 6,
      bright: Math.random() > 0.5,
    })), []
  );

  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1, height: '60px' }}
    >
      {particles.map(p => (
        <div
          key={p.id}
          className="gold-particle"
          style={{
            left: `${p.left}%`,
            bottom: '-5px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ...(p.bright ? {
              background: 'radial-gradient(circle, rgba(255,245,210,1) 0%, rgba(232,197,71,0) 70%)',
              boxShadow: '0 0 8px rgba(232,197,71,0.7)',
            } : {}),
          }}
        />
      ))}
    </div>
  );
}