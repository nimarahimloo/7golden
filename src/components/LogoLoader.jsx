import React from 'react';

export default function LogoLoader({ fullScreen = true }) {
  const wrapperClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center'
    : 'flex items-center justify-center py-20';
  return (
    <div className={wrapperClass} style={{ background: 'var(--bg)' }}>
      <div className="relative flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center">
          <img
            src="/logo.png"
            alt="7Golden"
            className="relative h-26 w-auto object-contain"
          />
        </div>
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