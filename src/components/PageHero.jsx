import React from 'react';
import { useApp } from '@/lib/AppContext';

export default function PageHero({ image, title, subtitle, badge }) {
  const { lang, dir } = useApp();
  const isFA = lang === 'fa';
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const subFont = isFA ? 'Kalameh, serif' : 'Georgia, serif';

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '52vh', minHeight: '340px', maxHeight: '520px', marginTop: '4rem' }}
      dir={dir}
    >
      {/* Image */}
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" style={{ animation: 'kenBurns 8s ease-out forwards' }} />

      {/* Gradient overlay + fade to body color */}
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
            className="font-subheading text-[10px] sm:text-xs uppercase block mb-3 tracking-wider glass-card inline-block px-3.5 py-1.5 rounded-full"
            style={{ color: '#D4AF37', fontFamily: subFont }}
          >
            {badge}
          </span>
        )}
        <h1
          className="font-heading font-black text-3xl md:text-5xl text-white mb-3"
          style={{ fontFamily: headingFont, textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="font-body text-sm md:text-base max-w-xl"
            style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}