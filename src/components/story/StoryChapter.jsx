import React from 'react';
import Reveal, { RuleGrow } from '@/components/story/Reveal';

/**
 * StoryChapter — the shared heading block for every chapter band:
 * a Latin eyebrow, a big gold display title, an optional lead and a
 * hairline that draws itself in. `index` renders the outlined numeral.
 */
export default function StoryChapter({
  index,
  eyebrow,
  title,
  lead,
  align = 'start',
  className = '',
  children,
}) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-start items-start';

  return (
    <div className={`flex flex-col ${alignment} ${className}`}>
      <Reveal variant="up">
        <div className={`flex items-center gap-4 mb-5 ${align === 'center' ? 'justify-center' : ''}`}>
          {index && <span className="outline-num text-3xl md:text-4xl leading-none">{index}</span>}
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        </div>
      </Reveal>

      {title && (
        <Reveal variant="up" delay={80}>
          <h2 className="display-lg max-w-3xl" style={{ color: 'var(--ink)' }}>{title}</h2>
        </Reveal>
      )}

      {lead && (
        <Reveal variant="up" delay={160}>
          <p
            className={`font-body text-sm md:text-base leading-relaxed mt-5 max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}
            style={{ color: 'var(--fg-muted)' }}
          >
            {lead}
          </p>
        </Reveal>
      )}

      <RuleGrow className="mt-8" />
      {children}
    </div>
  );
}
