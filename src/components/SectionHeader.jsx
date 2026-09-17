import React from 'react';
import { useApp } from '@/lib/AppContext';
import { PatternDivider } from '@/components/IranianPattern';

export default function SectionHeader({ title, subtitle, align = 'center' }) {
  const { lang } = useApp();
  const textAlign = align === 'center' ? 'text-center' : align === 'start' ? 'text-start' : 'text-end';
  const isFA = lang === 'fa';
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const subFont = isFA ? 'Kalameh, serif' : 'Georgia, serif';

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
        className="font-heading text-3xl md:text-4xl font-bold leading-tight"
        style={{ color: 'var(--fg)', fontFamily: headingFont }}
      >
        {title}
      </h2>
      {align === 'center' ? (
        <div className="mt-5">
          <PatternDivider />
        </div>
      ) : (
        <div className="w-12 h-0.5 mt-4" style={{ background: 'var(--accent)', margin: '1rem 0 0' }} />
      )}
    </div>
  );
}