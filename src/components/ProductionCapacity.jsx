import React from 'react';
import { Factory } from 'lucide-react';
import { CAPACITY_STATS, CAPACITY_NOTES } from '@/lib/corporate-content';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import CountUp from '@/components/story/CountUp';

/**
 * Production & processing capacity — replaces the retail trust badges
 * (fast shipping / secure payment / money-back guarantee).
 */
export default function ProductionCapacity() {
  return (
    <section className="chapter">
      <div className="chapter-shell">
        <StoryChapter
          index="04"
          eyebrow="CAPACITY"
          title="مقیاس صنعتی، تحویل زمان‌بندی‌شده"
          className="mb-10"
        />

        {/* Stats — figures count up as they enter the viewport */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
          {CAPACITY_STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90}>
              <div className="gold-frame panel p-5 md:p-7 rounded-2xl h-full">
                <div className="flex items-baseline gap-1.5 mb-2">
                  <CountUp
                    value={stat.value}
                    className="display-md"
                    style={{ color: 'var(--gold-2)' }}
                  />
                  <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>{stat.unit}</span>
                </div>
                <span className="font-body text-xs leading-relaxed block" style={{ color: 'var(--fg)' }}>
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Capability notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CAPACITY_NOTES.map((note, i) => (
            <Reveal key={note} delay={i * 80}>
              <div
                className="flex items-start gap-3 px-5 py-4 rounded-xl h-full"
                style={{ background: 'var(--panel)', border: '1px solid var(--hairline)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--gold-2)' }} />
                <span className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>{note}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-10" style={{ color: 'var(--fg-muted)' }}>
          <Factory size={16} style={{ color: 'var(--gold-2)' }} />
          <span className="font-body text-xs">ظرفیت تولید و فرآوری — قزوین، ایران</span>
        </div>
      </div>
    </section>
  );
}
