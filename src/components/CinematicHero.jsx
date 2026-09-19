import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import CountUp from '@/components/story/CountUp';

/**
 * CinematicHero — the full-height opening frame of the site.
 * A looping video (or still) fills the viewport, the headline sits in
 * oversized gold display type, and a strip of figures anchors the bottom.
 * The media drifts and the copy lifts away as the visitor starts scrolling,
 * which is what hands the page over to the scroll story below.
 */
export default function CinematicHero({
  video = '/9a4201778861aaa70701702683a138d9-0.mp4',
  poster = '/banner/Hero.jpg',
  eyebrow = '7GOLDEN · QAZVIN, IRAN',
  title,
  titleAccent,
  lead,
  stats = [],
  primary,
  secondary,
}) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fade = Math.max(0, 1 - scrollY / 620);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '620px' }}
      dir="rtl"
    >
      {/* ---- media ---- */}
      <div
        className="absolute inset-0"
        style={{ transform: `translate3d(0, ${scrollY * 0.28}px, 0) scale(1.12)` }}
      >
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={video}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* ---- scrims ---- */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(7,6,4,1) 0%, rgba(7,6,4,0.82) 26%, rgba(7,6,4,0.32) 62%, rgba(7,6,4,0.72) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 70% 40%, transparent 20%, rgba(7,6,4,0.7) 100%)' }}
      />

      {/* ---- copy ---- */}
      <div
        className="relative z-10 h-full chapter-shell flex flex-col justify-end pb-28 md:pb-32"
        style={{ opacity: fade, transform: `translateY(${Math.min(60, scrollY * 0.12)}px)` }}
      >
        <span className="eyebrow block mb-6">{eyebrow}</span>

        <h1 className="display-xl mb-6 max-w-4xl" style={{ color: 'var(--ink)' }}>
          {title}
          {titleAccent && (
            <>
              <br />
              <span className="gold-text">{titleAccent}</span>
            </>
          )}
        </h1>

        {lead && (
          <p className="font-body text-sm md:text-lg leading-relaxed max-w-xl mb-9" style={{ color: 'var(--fg-muted)' }}>
            {lead}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {primary && (
            <Link to={primary.href} className="btn-gold">
              {primary.label}
              <ChevronLeft size={16} style={{ transform: 'scaleX(-1)' }} />
            </Link>
          )}
          {secondary && (
            <Link to={secondary.href} className="btn-ghost">{secondary.label}</Link>
          )}
        </div>
      </div>

      {/* ---- figure strip ---- */}
      {stats.length > 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{ opacity: fade, borderTop: '1px solid var(--hairline)', background: 'rgba(7,6,4,0.45)', backdropFilter: 'blur(14px)' }}
        >
          <div className="chapter-shell">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--hairline)] rtl:divide-x-reverse">
              {stats.map((stat) => (
                <div key={stat.label} className="py-4 md:py-5 px-3 md:px-6">
                  <div className="flex items-baseline gap-1.5">
                    <CountUp
                      value={stat.value}
                      className="display-md"
                      style={{ color: 'var(--gold-2)' }}
                    />
                    <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>{stat.unit}</span>
                  </div>
                  <span className="font-body text-[11px] md:text-xs block mt-1" style={{ color: 'var(--fg-muted)' }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---- scroll cue ---- */}
      <div className="absolute bottom-32 left-6 md:left-10 z-10 hidden md:flex flex-col items-center gap-3" style={{ opacity: fade }}>
        <span className="font-subheading text-[10px] tracking-[0.3em]" style={{ color: 'var(--fg-muted)', writingMode: 'vertical-rl' }}>
          SCROLL
        </span>
        <div className="scroll-cue" />
      </div>
    </section>
  );
}
