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
        <h1
          className="font-heading font-black text-3xl md:text-5xl text-white mb-3"
          style={{ fontFamily: headingFont, textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
        >
          {title}
        </h1>
      </div>
    </section>
  );
}