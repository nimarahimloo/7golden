import React from 'react';
export default function SectionHeader({ title, subtitle, align = 'center' }) {
  const textAlign = align === 'center' ? 'text-center' : align === 'start' ? 'text-start' : 'text-end';
  const headingFont = 'Peyda, serif';
  const subFont = 'Kalameh, serif';

  return (
    <div className={`mb-12 ${textAlign}`}>
      {subtitle && (
        <span
          className="font-subheading text-xs uppercase block mb-3"
          style={{ color: 'var(--accent)', fontFamily: subFont }}
        >
          {subtitle}
        </span>
      )}
      <h2
        className="font-heading text-3xl md:text-4xl font-bold leading-tight header-gold-sheen"
        style={{ fontFamily: headingFont }}
      >
        {title}
      </h2>
      <div className={`header-gold-rule mt-5 ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
}