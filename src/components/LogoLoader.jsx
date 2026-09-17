import React from 'react';

export default function LogoLoader({ fullScreen = true }) {
  const wrapperClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center'
    : 'flex items-center justify-center py-20';
  return (
    <div className={wrapperClass} style={{ background: 'var(--bg)' }}>
      <div className="relative flex flex-col items-center gap-5">
        {/* Gold glow halo */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute rounded-full"
            style={{
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(212,175,55,0.22) 0%, transparent 70%)',
              animation: 'logoPulse 2.4s ease-in-out infinite',
            }}
          />
          <img
            src="https://7golden.co/wp-content/uploads/2023/08/logo-white.png"
            alt="7Golden"
            className="relative h-14 w-auto object-contain"
            style={{
              animation: 'logoBreathe 2.4s ease-in-out infinite',
              filter: 'drop-shadow(0 0 16px rgba(212,175,55,0.35))',
            }}
          />
        </div>
        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: '7px',
                height: '7px',
                background: 'var(--accent)',
                animation: `logoDot 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}