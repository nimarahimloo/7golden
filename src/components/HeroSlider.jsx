import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';

const SLIDES = [
  {
    image: 'https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/ad2b537bb_generated_image.png',
    badge: '7GOLDEN',
    titleFA: 'طعم واقعی باغستان\u200cهای ایران',
    titleEN: 'The True Taste of Iranian Orchards',
    subFA: 'بزرگ\u200cترین تولیدکننده مغز فندق و خلال پسته در ایران',
    subEN: "Iran's largest producer of hazelnut kernels and pistachio slices",
  },
  {
    image: 'https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/b2f4bdaf0_generated_image.png',
    badge: 'PISTACHIO',
    titleFA: 'سبزترین پسته\u200cهای قزوین',
    titleEN: 'The Greenest Pistachios of Qazvin',
    subFA: 'مغز پسته قزوین — معروف\u200cترین مغز پسته دنیا',
    subEN: "Qazvin pistachio kernels — the world's most renowned",
  },
  {
    image: 'https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/1ff738aeb_generated_image.png',
    badge: 'HAZELNUT',
    titleFA: 'مغز فندق درجه یک',
    titleEN: 'Premium Hazelnut Kernels',
    subFA: 'از باغستان\u200cهای قزوین و اشنویه — طعم شیرین و خامه\u200cای',
    subEN: 'From Qazvin & Oshnavieh orchards — sweet and creamy flavor',
  },
];

function GoldParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 5,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 5 }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="gold-particle"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSlider() {
  const { lang, dir } = useApp();
  const isFA = lang === 'fa';
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const subFont = isFA ? 'Kalameh, serif' : 'Georgia, serif';
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    setTouchStart(null);
  };

  const slide = SLIDES[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', maxHeight: '850px', minHeight: '560px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides with Ken Burns + crossfade */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={isFA ? s.titleFA : s.titleEN}
            className="w-full h-full object-cover"
            style={{ animation: i === current ? 'kenBurns 8s ease-out forwards' : 'none' }}
          />
          <div className="absolute inset-0 cinematic-overlay" />
        </div>
      ))}

      {/* Gold particles */}
      <GoldParticles />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-end" dir={dir}>
        <div className="w-full px-5 sm:px-8 lg:px-16 pb-20 md:pb-28">
          <div className="max-w-2xl" key={current}>
            <span
              className="text-rise glass-luxury inline-block px-4 py-2 rounded-full font-subheading text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-4"
              style={{ color: '#D4AF37', fontFamily: subFont, animationDelay: '0.1s' }}
            >
              {slide.badge} · {t(lang, 'hero_est')}
            </span>
            <h1
              className="text-reveal font-heading text-3xl sm:text-5xl md:text-7xl font-black leading-[1.1] mb-5 gold-text-glow"
              style={{ color: '#fff', fontFamily: headingFont, animationDelay: '0.2s' }}
            >
              {isFA ? slide.titleFA : slide.titleEN}
            </h1>
            <p
              className="text-rise font-body text-sm md:text-lg mb-8 max-w-lg"
              style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 2px 12px rgba(0,0,0,0.5)', animationDelay: '0.4s' }}
            >
              {isFA ? slide.subFA : slide.subEN}
            </p>
            <div className="text-rise" style={{ animationDelay: '0.6s' }}>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-body font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl gold-border-luxury"
                style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.95), rgba(184,148,42,0.95))', color: '#0D0D0D' }}
              >
                {t(lang, 'hero_cta')}
                <ChevronLeft size={16} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop arrows */}
      <button onClick={prev} className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-luxury items-center justify-center transition-all hover:scale-110" style={{ left: '1.5rem', color: '#D4AF37' }}>
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-luxury items-center justify-center transition-all hover:scale-110" style={{ right: '1.5rem', color: '#D4AF37' }}>
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-7 md:bottom-9 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? '32px' : '8px',
              height: '8px',
              background: i === current ? '#D4AF37' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 hidden md:block scroll-indicator">
        <div className="w-6 h-10 rounded-full flex items-start justify-center p-1.5" style={{ border: '1.5px solid rgba(212,175,55,0.4)' }}>
          <div className="w-1 h-2 rounded-full" style={{ background: '#D4AF37' }} />
        </div>
      </div>
    </section>
  );
}