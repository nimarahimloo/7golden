import React from 'react';

const ARABIC_SCRIPT = /[\u0600-\u06FF]/;

const textOf = (children) =>
  React.Children.toArray(children).map((c) => (typeof c === 'string' || typeof c === 'number' ? String(c) : '')).join('');

/**
 * Small label above a heading. Latin text keeps the wide uppercase tracking;
 * Persian text gets `eyebrow-fa` (no letter-spacing) because tracking breaks
 * the joined letter shapes of Persian script.
 */
export function eyebrowClass(children, extra = '') {
  return `eyebrow${ARABIC_SCRIPT.test(textOf(children)) ? ' eyebrow-fa' : ''}${extra ? ` ${extra}` : ''}`;
}

export default function Eyebrow({ className = '', style, children }) {
  return <span className={eyebrowClass(children, className)} style={style}>{children}</span>;
}
