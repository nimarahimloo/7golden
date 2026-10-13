import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BASE_SLIDES = [
  {
    image: '/banner/hero-nuts-bowl.webp',
    imagePosition: 'center 54%',
    badge: 'هفت طلایی · قزوین',
    title: 'خشکبار هفت طلایی',
    accent: 'برای صنایع غذایی',
    description: 'فرآوری فندق، پسته و بادام برای کاربرد در صنایع غذایی؛ با سابقه فعالیت کارگاهی از سال ۱۳۷۷.',
  },
  {
    image: '/banner/hazelnut-spoon.webp',
    imagePosition: 'center 48%',
    badge: 'محصولات فندق',
    title: 'فندق، در اوج ظرافت',
    accent: 'برای تولید حرفه‌ای',
    description: 'مغز، خمیر و گرانول فندق برای شکلات، قنادی، بستنی و دیگر فرآورده‌های غذایی آماده می‌شوند.',
  },
  {
    image: '/banner/tray-pistachio-almond.webp',
    imagePosition: 'center 52%',
    badge: 'پسته و بادام',
    title: 'پسته و بادام،',
    accent: 'هم‌راستا با تولید شما',
    description: 'مغز و خلال پسته، همراه با شکل‌های فرآوری‌شده بادام؛ انتخاب محصول با کاربرد و نیاز هر مجموعه هماهنگ می‌شود.',
  },
];

export default function HeroSlider({ cmsHero = null }) {
  const slides = useMemo(() => BASE_SLIDES.map((slide, index) => {
    if (index !== 0 || !cmsHero) return slide;
    return {
      ...slide,
      image: typeof cmsHero.image === 'string' && cmsHero.image.trim() ? cmsHero.image.trim() : slide.image,
      badge: cmsHero.badge_fa || cmsHero.badge || slide.badge,
      title: cmsHero.title_fa || slide.title,
      accent: cmsHero.title_fa ? (cmsHero.title_accent_fa || '') : slide.accent,
      description: cmsHero.subtitle_fa || slide.description,
    };
  }), [cmsHero?.image, cmsHero?.badge_fa, cmsHero?.badge, cmsHero?.title_fa, cmsHero?.title_accent_fa, cmsHero?.subtitle_fa]);

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStart = useRef(null);
  const slideCount = slides.length;

  const next = useCallback(() => setCurrent((index) => (index + 1) % slideCount), [slideCount]);
  const previous = useCallback(() => setCurrent((index) => (index - 1 + slideCount) % slideCount), [slideCount]);

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timerId = window.setInterval(next, 6800);
    return () => window.clearInterval(timerId);
  }, [isPaused, next]);

  const handleTouchStart = (event) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (event) => {
    const start = touchStart.current;
    const end = event.changedTouches[0]?.clientX;
    touchStart.current = null;
    if (start === null || typeof end !== 'number') return;
    const delta = start - end;
    if (Math.abs(delta) >= 50) delta > 0 ? next() : previous();
  };

  const slide = slides[current] || slides[0];

  return (
    <section
      dir="rtl"
      aria-label="اسلایدر معرفی هفت طلایی"
      aria-roledescription="carousel"
      role="region"
      className="luxury-hero relative isolate w-full overflow-hidden bg-[#100f0c] text-white"
      style={{ minHeight: 'min(800px, 100svh)', height: '100svh' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((item, index) => (
          <img
            key={item.image + index}
            src={item.image}
            alt=""
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="hero-kenburns absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out"
            style={{ objectPosition: item.imagePosition, opacity: index === current ? 1 : 0 }}
          />
        ))}
      </div>

      <div className="luxury-hero-grain absolute inset-0" aria-hidden="true" />
      <div className="luxury-hero-orbit luxury-hero-orbit-one" aria-hidden="true" />
      <div className="luxury-hero-orbit luxury-hero-orbit-two" aria-hidden="true" />

      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(270deg, rgba(8,7,5,.93) 0%, rgba(8,7,5,.79) 28%, rgba(8,7,5,.42) 58%, rgba(8,7,5,.15) 100%), linear-gradient(0deg, rgba(8,7,5,.92) 0%, rgba(8,7,5,0) 43%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-40"
        aria-hidden="true"
        style={{ background: 'linear-gradient(180deg, rgba(8,7,5,.40), transparent)' }}
      />

      <div className="chapter-shell relative z-10 flex h-full flex-col justify-end pb-32 pt-28 sm:pb-36 md:pb-40">
        <div className="mb-6 flex items-center gap-3 text-[11px] tracking-[.14em] text-white/75 sm:mb-8 sm:text-xs">
          <span className="h-px w-10 bg-[#c7a75b]" aria-hidden="true" />
          <span>{slide.badge}</span>
          <span className="hidden h-1 w-1 rounded-full bg-[#c7a75b] sm:block" aria-hidden="true" />
          <span className="hidden text-white/50 sm:block">EST. 1998</span>
        </div>

        <div key={current} className="luxury-hero-copy hero-copy-entrance max-w-4xl">
          <p className="luxury-hero-kicker">دقت در انتخاب، کیفیت در فرآوری</p>
          <h1 className="mb-5 font-black leading-[1.18] tracking-normal sm:mb-6" style={{ fontFamily: 'Peyda, serif', fontSize: 'clamp(2.45rem, 6.1vw, 5.7rem)' }}>
            <span className="block text-white">{slide.title}</span>
            {slide.accent && <span className="mt-1 block text-[#d7b765]">{slide.accent}</span>}
          </h1>
          <p className="mb-7 max-w-xl text-sm leading-8 text-white/80 sm:text-base sm:leading-9 md:mb-9 md:text-lg">
            {slide.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link to="/shop" className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-[#d7b765] bg-[#d7b765] px-6 py-3 text-sm font-bold text-[#16130b] transition-colors hover:bg-[#f0d995] sm:px-7">
              مشاهده محصولات
              <ChevronLeft size={17} className="transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link to="/contact" className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/35 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10 sm:px-7">
              گفت‌وگو درباره سفارش
              <ChevronLeft size={17} />
            </Link>
          </div>
        </div>

        <div className="luxury-hero-details absolute bottom-20 left-4 right-4 flex items-end justify-between gap-5 sm:bottom-24 sm:left-8 sm:right-8 lg:left-10 lg:right-10">
          <div className="hidden flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/70 sm:flex sm:gap-x-7 sm:text-sm">
            <span>از ۱۳۷۷</span><span className="h-1 w-1 rounded-full bg-[#d7b765]" />
            <span>قزوین</span><span className="h-1 w-1 rounded-full bg-[#d7b765]" />
            <span>فندق · پسته · بادام</span>
          </div>

          <div className="mr-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="text-xs tabular-nums text-white/70">{String(current + 1).padStart(2, '0')} <span className="text-white/35">/</span> {String(slideCount).padStart(2, '0')}</span>
            <button type="button" onClick={previous} aria-label="اسلاید قبلی" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white transition-colors hover:border-[#d7b765] hover:text-[#d7b765] sm:h-12 sm:w-12">
              <ChevronRight size={19} />
            </button>
            <button type="button" onClick={next} aria-label="اسلاید بعدی" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white transition-colors hover:border-[#d7b765] hover:text-[#d7b765] sm:h-12 sm:w-12">
              <ChevronLeft size={19} />
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10" aria-hidden="true">
          <div className="h-full bg-[#d7b765] transition-all duration-500" style={{ width: (((current + 1) / slideCount) * 100) + '%' }} />
        </div>
      </div>

      <div className="luxury-hero-slides absolute bottom-0 left-0 right-0 z-20" aria-label="انتخاب اسلاید">
        <div className="chapter-shell flex gap-2 overflow-x-auto pb-3 sm:gap-3 sm:pb-4">
        {slides.map((item, index) => (
          <button key={item.image + '-dot-' + index} type="button" onClick={() => setCurrent(index)}
            aria-label={'اسلاید ' + (index + 1) + ' از ' + slideCount}
            aria-current={index === current ? 'true' : undefined}
            className={'luxury-hero-slide-button ' + (index === current ? 'is-active' : '')}
          >
            <img src={item.image} alt="" loading="lazy" decoding="async" />
            <span><b>{String(index + 1).padStart(2, '0')}</b><em>{item.badge}</em></span>
          </button>
        ))}
        </div>
      </div>
    </section>
  );
}
