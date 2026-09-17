import React, { useMemo } from 'react';

export default function FooterParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1.5 + Math.random() * 5,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 8,
      bright: Math.random() > 0.7,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
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
            ...(p.bright ? {
              background: 'radial-gradient(circle, rgba(245,230,184,1) 0%, rgba(212,175,55,0) 70%)',
              boxShadow: '0 0 8px rgba(212,175,55,0.6)',
            } : {}),
          }}
        />
      ))}
    </div>
  );
}