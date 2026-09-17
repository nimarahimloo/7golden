import React from 'react';

// Iranian eight-pointed star (ستاره هشت‌ضلعی) decorative divider
export function PatternDivider({ className = '', width = 140 }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(90deg, transparent, var(--accent))' }} />
      <svg width={width} height="22" viewBox="0 0 140 22" fill="none" className="flex-shrink-0 mx-4" style={{ color: 'var(--accent)' }}>
        <path d="M14 11 L20 5 L26 11 L20 17 Z" fill="currentColor" opacity="0.4" />
        <line x1="26" y1="11" x2="54" y2="11" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <g transform="translate(70 11)">
          <path d="M0 -10 L2.8 -2.8 L10 0 L2.8 2.8 L0 10 L-2.8 2.8 L-10 0 L-2.8 -2.8 Z" fill="currentColor" />
          <circle cx="0" cy="0" r="2.5" fill="var(--bg)" />
          <circle cx="0" cy="0" r="1" fill="currentColor" />
        </g>
        <line x1="86" y1="11" x2="114" y2="11" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        <path d="M114 11 L120 5 L126 11 L120 17 Z" fill="currentColor" opacity="0.4" />
      </svg>
      <span className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
    </div>
  );
}

// Subtle Iranian geometric star pattern background
export function PatternBackground({ className = '', opacity = 0.05, color = '%23B8945A', style = {} }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${color}' stroke-width='0.6'%3E%3Cpath d='M30 5 L36 24 L55 30 L36 36 L30 55 L24 36 L5 30 L24 24 Z'/%3E%3Crect x='22' y='22' width='16' height='16' transform='rotate(45 30 30)'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
        opacity,
        ...style,
      }}
    />
  );
}

// Small diamond accent for cards
export function DiamondAccent({ size = 8, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill="none" style={{ color: 'var(--accent)', opacity: 0.5, ...style }}>
      <path d="M4 0 L6 4 L4 8 L2 4 Z" fill="currentColor" />
    </svg>
  );
}