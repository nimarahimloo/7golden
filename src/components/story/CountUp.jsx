import React, { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '@/components/useScrollAnimation';

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

function toLatin(str) {
  return String(str)
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));
}

function toPersian(str) {
  return String(str).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/**
 * CountUp — counts a figure up when it scrolls into view.
 * Accepts the Persian-formatted strings used in corporate-content.js
 * (e.g. '۳٬۵۰۰', '۱۵+') and renders back in Persian digits.
 */
export default function CountUp({ value, duration = 1700, className = '', style }) {
  const { ref, visible } = useScrollAnimation(0.35);
  const [display, setDisplay] = useState(() => toPersian('0'));

  const raw = toLatin(value).replace(/[٬,،\s]/g, '');
  const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : '';
  const grouped = raw.includes('٬') || raw.includes(',');

  const frame = useRef(0);

  useEffect(() => {
    if (!visible || target === null) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      // easeOutExpo — fast start, soft landing
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const current = Math.round(target * eased);
      const text = grouped ? current.toLocaleString('en-US') : String(current);
      setDisplay(toPersian(text) + suffix);
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [visible, target, suffix, duration, grouped]);

  // Non-numeric figures (e.g. '—') render as-is.
  if (target === null) {
    return <span ref={ref} className={className} style={style}>{value}</span>;
  }

  return <span ref={ref} className={className} style={style}>{display}</span>;
}
