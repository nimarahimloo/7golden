import React from 'react';
import { useApp } from '@/lib/AppContext';

export default function ThemeTransition() {
  const { isTransitioning } = useApp();

  if (!isTransitioning) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg)',
        zIndex: 9999,
        pointerEvents: 'none',
        animation: 'louverGate 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      }}
    />
  );
}