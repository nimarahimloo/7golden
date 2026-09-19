import React from 'react';

/**
 * Marquee — an endless gold band, used for export markets and
 * certificate lists. Duplicated content makes the loop seamless.
 */
export default function Marquee({ items = [], separator = '✦' }) {
  const row = [...items, ...items];

  return (
    <div className="marquee" dir="rtl" aria-label={items.join('، ')}>
      <div className="marquee-track">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-12 whitespace-nowrap">
            <span className="font-subheading text-lg md:text-2xl" style={{ color: 'var(--fg)' }}>{item}</span>
            <span style={{ color: 'var(--gold-3)' }}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
