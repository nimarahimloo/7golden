import React from 'react';
import { useApp } from '@/lib/AppContext';

export default function PageHero({ image, title, subtitle, badge }) {
  const isFA = true;
  const headingFont = 'Peyda, serif';
  const subFont = 'Kalameh, serif';

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '52vh', minHeight: '340px', maxHeight: '520px', marginTop: '4rem' }}
      dir="rtl"
    >
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />

      <div className="absolute inset-0" style={{
        background: `linear-gradient(to bottom,
          rgba(0,0,0,0.25) 0%,
          rgba(0,0,0,0.45) 35%,
          rgba(0,0,0,0.65) 65%,
          var(--bg) 100%)`,
      }} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10" style={{ paddingBottom: '3rem' }}>
        {badge && (
          <span
            className="font-subheading inline-block mb-4 px-4 py-1.5 rounded-full"
            style={{
              color: 'var(--accent)',
              background: 'rgba(240,206,90,0.08)',
              border: '1px solid rgba(240,206,90,0.22)',
              fontFamily: subFont,
              fontSize: '0.75rem',
            }}
          >
            {badge}
          </span>
        )}
        <h1
          className="font-heading font-black text-3xl md:text-5xl header-gold-sheen mb-4"
          style={{ fontFamily: headingFont, filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.6))' }}
        >
          {title}
        </h1>
        <div className="header-gold-rule" />
        {subtitle && (
          <p
            className="font-body text-sm md:text-base mt-5 max-w-xl mx-auto"
            style={{ color: 'var(--fg-muted)', fontFamily: subFont }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}