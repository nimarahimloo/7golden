import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
// import GoldDustField from '@/components/GoldDustField';

const SLIDES = [
  {
    image: '/banner/Hero.jpg',
    badge: '7GOLDEN',
    titleFA: 'طعم واقعی باغستان\u200cهای ایران',
    titleEN: 'The True Taste of Iranian Orchards',
    subFA: 'بزرگ\u200cترین تولیدکننده مغز فندق و خلال پسته در ایران',
    subEN: "Iran's largest producer of hazelnut kernels and pistachio slices",
  },
  {
    image: '/banner/Hero-Banner-3.jpg',
    badge: 'PISTACHIO',
    titleFA: 'سبزترین پسته\u200cهای قزوین',
    titleEN: 'The Greenest Pistachios of Qazvin',
    subFA: 'مغز پسته قزوین — معروف\u200cترین مغز پسته دنیا',
    subEN: "Qazvin pistachio kernels — the world's most renowned",
  },
  {
    image: '/banner/Hero-Banner-main.png',
    badge: 'HAZELNUT',
    titleFA: 'مغز فندق درجه یک',
    titleEN: 'Premium Hazelnut Kernels',
    subFA: 'از باغستان\u200cهای قزوین و اشنویه — طعم شیرین و خامه\u200cای',
    subEN: 'From Qazvin & Oshnavieh orchards — sweet and creamy flavor',
  },
];

export default function HeroSlider() {
  const { lang } = useApp();
  const isFA = lang === 'fa';
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
      style={{ height: '100vh', maxHeight: '650px', minHeight: '560px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={isFA ? s.titleFA : s.titleEN}
            className="w-full h-full object-cover"
            // style={{ animation: i === current ? 'kenBurns 8s ease-out forwards' : 'none' }}
          />
          <div className="absolute inset-0 cinematic-overlay" />
        </div>
      ))}

      {/* Gold dust — Three.js 3D particle field */}
      {/* <GoldDustField /> */}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-end">
        <div className="w-full px-5 sm:px-8 lg:px-16 pb-20 md:pb-28">
          <div className="" key={current}>
          
            <h1
              className="text-5xl sm:text-5xl md:text-7xl font-black leading-[1.1] mb-5"
            >
              {isFA ? slide.titleFA : slide.titleEN}
            </h1>
            <p
              className="text-rise font-body text-sm md:text-lg mb-8 max-w-lg"
              style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 2px 12px rgba(0,0,0,0.5)', animationDelay: '0.4s' }}
            >
              {isFA ? slide.subFA : slide.subEN}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop arrows */}
      <button onClick={prev} className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-luxury items-center justify-center transition-all hover:scale-110" style={{ left: '1.5rem', color: '#F0CE5A' }}>
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-luxury items-center justify-center transition-all hover:scale-110" style={{ right: '1.5rem', color: '#F0CE5A' }}>
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
              background: i === current ? '#F0CE5A' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>

    </section>
  );
}