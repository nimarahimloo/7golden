import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BASE_SLIDES = [
  {
    image: '/banner/tray-pistachio-almond.webp',
    imagePosition: 'center 54%',
    badge: 'هفت طلایی · قزوین',
    title: 'خشکبار هفت طلایی',
    accent: 'برای صنایع غذایی',
    description:
      'فرآوری محصولات فندق، پسته و بادام برای استفاده در قنادی، شکلات‌سازی، بستنی و دیگر بخش‌های صنایع غذایی.',
  },
  {
    image: '/banner/hazelnut-chopped-dark.webp',
    imagePosition: 'center 48%',
    badge: 'محصولات فندق',
    title: 'فندق، از مغز تا فرآورده',
    accent: 'برای شکلات و قنادی',
    description:
      'از مغز فندق خام و رست‌شده تا خمیر، گرانول و پودر فندق؛ محصولاتی برای تهیه شکلات، کرم فندق، شیرینی و بستنی.',
  },
  {
    image: '/banner/IMG_2437.webp',
    imagePosition: 'center 52%',
    badge: 'پسته و بادام',
    title: 'پسته و بادام',
    accent: 'در شکل‌های موردنیاز تولید',
    description:
      'مغز و خلال پسته، همراه با مغز، خلال و پرک بادام؛ محصولاتی برای تهیه و تزئین انواع شیرینی، دسر و فرآورده‌های غذایی.',
  },
  {
    image: '/banner/IMG_2448.webp',
    imagePosition: 'center 52%',
    badge: 'فندق، پسته و بادام',
    title: 'جزئیات مهم‌اند',
    accent: 'از انتخاب تا فرآوری',
    description:
      'اندازه برش، بافت و شکل نهایی مواد اولیه در تولید اهمیت دارند. انتخاب نوع مناسب فرآوری به کاربرد محصول نهایی بستگی دارد.',
  },
  {
    image: '/banner/IMG_2335.webp',
    imagePosition: 'center 52%',
    badge: 'فرآورده‌های خشکبار',
    title: 'از مغز تا محصول آماده',
    accent: 'متناسب با نیاز تولید',
    description:
      'مغز کامل، خلال، پرک، گرانول، خمیر و پودر؛ هرکدام برای کاربردی متفاوت در تولید محصولات غذایی به کار می‌روند.',
  },
  {
    image: '/banner/IMG_2371.webp',
    imagePosition: 'center 54%',
    badge: 'از سال ۱۳۷۷',
    title: 'تجربه‌ای که ادامه دارد',
    accent: 'از قزوین',
    description:
      'فرآوری خشکبار در این مجموعه از سال ۱۳۷۷ در قزوین آغاز شد. امروز تمرکز هفت طلایی بر فرآوری فندق، پسته و بادام و عرضه محصولات موردنیاز صنایع غذایی است.',
  },
];

export default function HeroSlider({ cmsHero = null }) {
  const slides = useMemo(
    () =>
      BASE_SLIDES.map((slide, index) => {
        if (index !== 0 || !cmsHero) return slide;

        return {
          ...slide,
          image:
            typeof cmsHero.image === 'string' && cmsHero.image.trim()
              ? cmsHero.image.trim()
              : slide.image,
          badge: cmsHero.badge_fa || cmsHero.badge || slide.badge,
          title: cmsHero.title_fa || slide.title,
          accent: cmsHero.title_fa
            ? cmsHero.title_accent_fa || ''
            : slide.accent,
          description: cmsHero.subtitle_fa || slide.description,
        };
      }),
    [
      cmsHero?.image,
      cmsHero?.badge_fa,
      cmsHero?.badge,
      cmsHero?.title_fa,
      cmsHero?.title_accent_fa,
      cmsHero?.subtitle_fa,
    ],
  );

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStart = useRef(null);
  const slideCount = slides.length;

  const next = useCallback(
    () => setCurrent((index) => (index + 1) % slideCount),
    [slideCount],
  );

  const previous = useCallback(
    () => setCurrent((index) => (index - 1 + slideCount) % slideCount),
    [slideCount],
  );

  useEffect(() => {
    if (
      isPaused ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const timerId = window.setInterval(next, 7200);
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

    if (Math.abs(delta) >= 50) {
      delta > 0 ? next() : previous();
    }
  };

  const slide = slides[current] || slides[0];

  return (
    <section
      dir="rtl"
      aria-label="اسلایدر معرفی هفت طلایی"
      aria-roledescription="carousel"
      role="region"
      className="luxury-hero relative isolate w-full overflow-hidden bg-[#070706] text-white"
      style={{
        minHeight: 'min(780px, max(100svh, 640px))',
        height: 'max(100svh, 640px)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
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
            fetchPriority={index === 0 ? 'high' : 'low'}
            decoding="async"
            className="hero-kenburns absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out"
            style={{
              objectPosition: item.imagePosition,
              opacity: index === current ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* Soft editorial vignette — no decorative orbits */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(270deg, rgba(7,7,6,.94) 0%, rgba(7,7,6,.78) 30%, rgba(7,7,6,.35) 58%, rgba(7,7,6,.12) 100%), linear-gradient(0deg, rgba(7,7,6,.88) 0%, rgba(7,7,6,0) 45%)',
        }}
      />

      <div
        className="absolute inset-x-0 top-0 h-32"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(180deg, rgba(7,7,6,.45), transparent)',
        }}
      />

      <div className="chapter-shell relative z-10 flex h-full flex-col justify-end pb-24 pt-28 sm:pb-28 md:pb-32">
        <div className="mb-5 flex items-center gap-3 text-[11px] text-white/65 sm:mb-7 sm:text-xs">
          <span
            className="h-px w-8"
            style={{ background: 'var(--gold-2)' }}
            aria-hidden="true"
          />
          <span>{slide.badge}</span>
          <span className="hidden text-white/40 sm:inline">·</span>
          <span className="hidden text-white/45 sm:inline">از ۱۳۷۷</span>
        </div>

        <div
          key={current}
          className="luxury-hero-copy hero-copy-entrance max-w-3xl"
        >
          <h1
            className="mb-5 font-extrabold leading-[1.15] tracking-normal sm:mb-6"
            style={{
              fontFamily: 'Peyda, serif',
              fontSize: 'clamp(2.35rem, 5.8vw, 5.1rem)',
            }}
          >
            <span className="block text-white">{slide.title}</span>
            {slide.accent && (
              <span
                className="mt-1.5 block font-semibold"
                style={{ color: 'var(--gold-2)' }}
              >
                {slide.accent}
              </span>
            )}
          </h1>

          <p className="mb-8 max-w-lg text-sm leading-8 text-white/72 sm:text-base sm:leading-9 md:mb-10">
            {slide.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to="/shop"
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-full px-7 py-3 text-sm font-semibold transition-colors"
              style={{
                background: 'var(--gold-2)',
                color: 'var(--on-gold)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--gold-2)';
              }}
            >
              مشاهده محصولات
              <ChevronLeft
                size={16}
                className="transition-transform group-hover:-translate-x-0.5"
              />
            </Link>

            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-white/25 bg-transparent px-7 py-3 text-sm font-medium text-white/90 transition-colors hover:border-white/55 hover:bg-white/[0.06]"
            >
              درخواست قیمت
              <ChevronLeft size={16} />
            </Link>
          </div>
        </div>

        {/* Minimal controls: counter + arrows + thin progress */}
        <div className="absolute bottom-8 left-4 right-4 flex items-center justify-between gap-4 sm:bottom-10 sm:left-8 sm:right-8 lg:left-10 lg:right-10">
          <div className="hidden items-center gap-x-5 text-xs text-white/50 sm:flex">
            <span>فندق</span>
            <span className="h-px w-3 bg-white/25" aria-hidden="true" />
            <span>پسته</span>
            <span className="h-px w-3 bg-white/25" aria-hidden="true" />
            <span>بادام</span>
          </div>

          <div className="mr-auto flex items-center gap-3">
            <span className="text-xs tabular-nums text-white/55">
              {String(current + 1).padStart(2, '0')}
              <span className="text-white/30"> / </span>
              {String(slideCount).padStart(2, '0')}
            </span>

            <button
              type="button"
              onClick={previous}
              aria-label="اسلاید قبلی"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-[var(--gold-2)] hover:text-[var(--gold-2)]"
            >
              <ChevronRight size={18} />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="اسلاید بعدی"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-[var(--gold-2)] hover:text-[var(--gold-2)]"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        {/* Slim progress line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-white/10"
          aria-hidden="true"
        >
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: ((current + 1) / slideCount) * 100 + '%',
              background: 'var(--gold-2)',
            }}
          />
        </div>

        {/* Simple dot indicators (replaces heavy thumbnail strip) */}
        <div
          className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 gap-2 md:flex"
          aria-label="انتخاب اسلاید"
        >
          {slides.map((item, index) => (
            <button
              key={item.image + '-dot-' + index}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={'اسلاید ' + (index + 1)}
              aria-current={index === current ? 'true' : undefined}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: index === current ? '1.75rem' : '0.4rem',
                background:
                  index === current
                    ? 'var(--gold-2)'
                    : 'rgba(255,255,255,0.28)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
