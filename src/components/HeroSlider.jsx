import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: '/banner/Hero.jpg',
    badge: '7GOLDEN',
    titleFA: 'تولید، فرآوری و صادرات فندق، پسته و بادام',
    titleEN: 'Producer & Exporter of Hazelnut, Pistachio and Almond',
    subFA: 'تأمین‌کننده صنعتی مغز فندق، خلال پسته و مغز بادام برای صنایع شکلات، قنادی و بستنی',
    subEN: 'Industrial supplier of hazelnut kernels, pistachio slices and almond kernels for the chocolate, confectionery and ice-cream industry',
  },
  {
    image: '/banner/Hero-Banner-3.jpg',
    badge: 'PISTACHIO',
    titleFA: 'خلال پسته و مغز پسته قزوین',
    titleEN: 'Qazvin Pistachio Kernels & Slices',
    subFA: 'گریدبندی یکنواخت، بسته‌بندی صنعتی و ظرفیت تأمین مستمر',
    subEN: 'Uniform grading, industrial packaging and continuous supply capacity',
  },
  {
    image: '/banner/Hero-Banner-main.png',
    badge: 'HAZELNUT',
    titleFA: 'مغز فندق درجه یک برای صنایع شکلات',
    titleEN: 'Premium Hazelnut Kernels for the Chocolate Industry',
    subFA: 'از باغستان‌های قزوین و اشنویه — تأمین مستقیم و بدون واسطه',
    subEN: 'From Qazvin & Oshnavieh orchards — sourced directly, without middlemen',
  },
];

export default function HeroSlider() {
  const isFA = true;
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
      style={{ background: 'var(--bg)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-8 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">

          {/* Image — large, one side */}
          <div
            className="order-1 md:order-2 relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[6/5]"
            style={{ background: 'var(--bg-secondary)', boxShadow: 'var(--soft-shadow)' }}
          >
            {SLIDES.map((s, i) => (
              <img
                key={i}
                src={s.image}
                alt={isFA ? s.titleFA : s.titleEN}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                style={{ opacity: i === current ? 1 : 0 }}
              />
            ))}
          </div>

          {/* Text — one short block */}
          <div className="order-2 md:order-1">
            <span className="eyebrow block mb-5">{slide.badge}</span>
            <h1
              key={`t${current}`}
              className="text-rise text-3xl sm:text-4xl md:text-5xl font-black leading-[1.3] mb-5"
              style={{ color: 'var(--ink)', fontFamily: 'Peyda, serif' }}
            >
              {isFA ? slide.titleFA : slide.titleEN}
            </h1>
            <p
              key={`s${current}`}
              className="text-rise font-body text-sm md:text-base leading-relaxed max-w-md mb-9"
              style={{ color: 'var(--fg-muted)', animationDelay: '0.15s' }}
            >
              {isFA ? slide.subFA : slide.subEN}
            </p>

            {/* Controls */}
            <div className="flex items-center gap-5">
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  style={{ border: '1px solid var(--hairline)', color: 'var(--ink)', background: '#fff' }}
                  aria-label="Previous"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={next}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  style={{ border: '1px solid var(--hairline)', color: 'var(--ink)', background: '#fff' }}
                  aria-label="Next"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>

              <div className="flex gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === current ? '30px' : '8px',
                      height: '8px',
                      background: i === current ? 'var(--brass)' : 'rgba(28,26,23,0.18)',
                    }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}