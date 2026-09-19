import React from 'react';
import { useScrollAnimation } from '@/components/useScrollAnimation';

/**
 * Reveal — the shared entrance animation for the scroll story.
 * `variant` picks the gesture (up / left / right / scale / clip).
 */
export default function Reveal({ children, className = '', delay = 0, variant = 'up', as: Tag = 'div', threshold = 0.15 }) {
  const { ref, visible } = useScrollAnimation(threshold);
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/**
 * RuleGrow — a hairline that draws itself in from the start edge.
 */
export function RuleGrow({ className = '' }) {
  const { ref, visible } = useScrollAnimation(0.4);
  return <div ref={ref} className={`rule-grow ${visible ? 'is-visible' : ''} ${className}`} />;
}
