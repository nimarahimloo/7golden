import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
const HeroNutScene = lazy(() => import('@/components/home/HeroNutScene'));

const BASE_SLIDES = [
  {
    image: '/banner/tray-pistachio-almond.webp',
    imagePosition: 'center 54%',
    badge: 'هفت طلایی · قزوین',
    title: 'خشکبار فرآوری‌شده برای صنایع غذایی',
    accent: 'فندق، پسته و بادام در شکل‌های متنوع',
    description:
      'مواد اولیه برای شکلات‌سازی، قنادی و تولیدکنندگان غذایی؛ فعالیت فرآوری هفت طلایی در قزوین از سال ۱۳۷۷ آغاز شده است.',
  },
  {
    image: '/banner/hazelnut-chopped-dark.webp',
    imagePosition: 'center 48%',
    badge: 'گروه فندق',
    title: 'فندق، از مغز تا فرآورده',
    accent: 'برای شکلات، کرم و قنادی',
    description:
      'مغز فندق، خمیر، گرانول و پودر؛ شکل محصول و مشخصات سفارش را متناسب با کاربرد نهایی بررسی کنید.',
  },
  {
    image: '/banner/pistachio-bowl-green.webp',
    imagePosition: 'center 52%',
    badge: 'گروه پسته و بادام',
    title: 'پسته و بادام',
    accent: 'در شکل‌های مختلف فرآوری',
    description:
      'مغز و خلال پسته، همراه با مغز، خلال و پرک بادام؛ برای بررسی مشخصات و قیمت روز با واحد فروش در ارتباط باشید.',
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
  const [manuallyPaused, setManuallyPaused] = useState(true);
  const shouldPause = isPaused || manuallyPaused;
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
      shouldPause ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const timerId = window.setInterval(next, 7200);
    return () => window.clearInterval(timerId);
  }, [shouldPause, next]);

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
      aria-label="معرفی هفت طلایی"
      aria-roledescription="carousel"
      role="region"
      className="luxury-hero relative isolate w-full overflow-hidden text-white"
      style={{
        minHeight: '560px',
        height: 'clamp(560px, 82svh, 780px)',
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
        <img
          key={slide.image}
          src={slide.image}
          alt=""
          loading={current === 0 ? "eager" : "lazy"}
          fetchPriority={current === 0 ? "high" : "auto"}
          decoding="async"
          className="hero-kenburns absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: slide.imagePosition }}
        />
      </div>

      <Suspense fallback={null}><HeroNutScene /></Suspense>

      {/* Warm cinematic vignette */}
      <div
        className="absolute inset-0 z-[2]"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(270deg, rgba(10,9,7,.96) 0%, rgba(10,9,7,.82) 28%, rgba(10,9,7,.4) 55%, rgba(10,9,7,.15) 100%), linear-gradient(0deg, rgba(10,9,7,.92) 0%, rgba(10,9,7,0) 48%), radial-gradient(ellipse at 70% 40%, rgba(214,178,94,.08), transparent 55%)',
        }}
      />

      <div
        className="absolute inset-x-0 top-0 z-[2] h-36"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(180deg, rgba(10,9,7,.5), transparent)',
        }}
      />

      <div className="chapter-shell relative z-10 flex h-full flex-col justify-end pb-24 pt-28 sm:pb-28 md:pb-32">
        <div
          className="mb-5 flex items-center gap-3 text-[11px] text-white/65 sm:mb-7 sm:text-xs"
          style={{ fontFamily: "'Kalameh', system-ui, sans-serif" }}
        >
          <span
            className="h-px w-10"
            style={{ background: 'var(--gold-2)' }}
            aria-hidden="true"
          />
          <span className="tracking-[0.14em]">{slide.badge}</span>
          <span className="hidden text-white/35 sm:inline">·</span>
          <span className="hidden text-white/50 sm:inline">از ۱۳۷۷</span>
        </div>

        <div
          key={current}
          className="luxury-hero-copy hero-copy-entrance max-w-4xl lg:max-w-[54%]"
        >
          <h1
            className="mb-5 font-extrabold leading-[1.12] sm:mb-6"
            style={{
              fontFamily: "'Peyda', system-ui, sans-serif",
              fontSize: 'clamp(2.5rem, 6.2vw, 5.4rem)',
            }}
          >
            <span className="block text-white">{slide.title}</span>
            {slide.accent && (
              <span
                className="mt-2 block font-semibold"
                style={{
                  color: 'var(--gold-2)',
                  fontSize: 'clamp(1.15rem, 2.4vw, 1.85rem)',
                  fontFamily: "'Kalameh', system-ui, sans-serif",
                  fontWeight: 600,
                }}
              >
                {slide.accent}
              </span>
            )}
          </h1>

          <p
            className="mb-9 max-w-xl text-[0.95rem] leading-8 text-white/72 sm:text-base sm:leading-9 md:mb-11"
            style={{ fontFamily: "'YekanBakh', system-ui, sans-serif" }}
          >
            {slide.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to="/shop"
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold transition-all"
              style={{
                background: 'var(--gold-2)',
                color: 'var(--on-gold)',
                fontFamily: "'Kalameh', system-ui, sans-serif",
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
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-white/22 bg-white/[0.03] px-8 py-3.5 text-sm font-medium text-white/90 transition-colors hover:border-white/50 hover:bg-white/[0.07]"
              style={{ fontFamily: "'Kalameh', system-ui, sans-serif" }}
            >
              استعلام قیمت
              <ChevronLeft size={16} />
            </Link>
          </div>
        </div>

        <div className="hero-slider-controls absolute left-4 right-4 flex items-center justify-between gap-4 sm:left-8 sm:right-8 lg:left-10 lg:right-10">
          <div
            className="hidden items-center gap-x-5 text-xs text-white/45 sm:flex"
            style={{ fontFamily: "'Kalameh', system-ui, sans-serif" }}
          >
            <span>فندق</span>
            <span className="h-px w-3 bg-white/20" aria-hidden="true" />
            <span>پسته</span>
            <span className="h-px w-3 bg-white/20" aria-hidden="true" />
            <span>بادام</span>
          </div>

          <div className="mr-auto flex items-center gap-3">
            <span className="text-xs tabular-nums text-white/50">
              {String(current + 1).padStart(2, '0')}
              <span className="text-white/25"> / </span>
              {String(slideCount).padStart(2, '0')}
            </span>

            <button
              type="button"
              onClick={() => {
                setManuallyPaused((paused) => !paused);
                setIsPaused(false);
              }}
              aria-label={manuallyPaused ? 'ادامه پخش خودکار اسلایدها' : 'توقف پخش خودکار اسلایدها'}
              aria-pressed={manuallyPaused}
              title={manuallyPaused ? 'ادامه پخش خودکار' : 'توقف پخش خودکار'}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/18 text-white/80 transition-colors hover:border-[var(--gold-2)] hover:text-[var(--gold-2)]"
            >
              {manuallyPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>

            <button
              type="button"
              onClick={previous}
              aria-label="اسلاید قبلی"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/18 text-white/80 transition-colors hover:border-[var(--gold-2)] hover:text-[var(--gold-2)]"
            >
              <ChevronRight size={18} />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="اسلاید بعدی"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/18 text-white/80 transition-colors hover:border-[var(--gold-2)] hover:text-[var(--gold-2)]"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

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
                width: index === current ? '1.85rem' : '0.4rem',
                background:
                  index === current
                    ? 'var(--gold-2)'
                    : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
