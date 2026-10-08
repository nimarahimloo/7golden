import { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import DynamicHeroSlider from '@/components/DynamicHeroSlider';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';
import PullToRefresh from '@/components/PullToRefresh';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import Marquee from '@/components/story/Marquee';
import { NEWS_ITEMS, NEWS_CATEGORIES, PHOTOS, VIDEOS } from '@/lib/news-content';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import { usePageHero } from '@/lib/usePageHero';
import useScrollMagic from '@/hooks/useScrollMagic';

export default function News() {
  const isFA = true;
  const [lightbox, setLightbox] = useState(null); // { type: 'video'|'photo', index }
  const [article, setArticle] = useState(null);   // open news item

  const { hero } = usePageHero('gallery', {
    image: '/banner/banner-four-bowls.webp',
    title: 'اخبار و اطلاعیه‌ها',
    subtitle: 'تازه‌ترین خبرهای تولید، صادرات، کیفیت و حضور هفت‌طلایی در نمایشگاه‌ها',
    badge: 'اخبار',
  });

  const auraRef = useScrollMagic({ speed: 0.18, max: 70 });

  const openLightbox = (type, index) => setLightbox({ type, index });
  const close = () => setLightbox(null);

  const nav = (dir) => {
    if (!lightbox) return;
    const list = lightbox.type === 'video' ? VIDEOS : PHOTOS;
    const n = list.length;
    setLightbox({ type: lightbox.type, index: (lightbox.index + dir + n) % n });
  };

  // Keyboard nav + scroll lock for the lightbox and the article modal
  useEffect(() => {
    if (!lightbox && !article) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setLightbox(null);
        setArticle(null);
      }
      if (!lightbox) return;
      if (e.key === 'ArrowLeft') nav(1);   // RTL: left arrow = next
      if (e.key === 'ArrowRight') nav(-1); // RTL: right arrow = prev
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, article]);

  // Touch swipe nav for the lightbox
  const touchRef = useRef({ x: 0, y: 0 });
  const onTouchStart = (e) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      nav(dx > 0 ? -1 : 1); // RTL: swipe left = next
    }
  };

  const [featured, ...rest] = NEWS_ITEMS;

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Seo
        title={isFA ? `اخبار و اطلاعیه‌های ${SITE_SEO.siteNameFA}` : `News & Announcements — ${SITE_SEO.siteNameEN}`}
        description={isFA
          ? 'آخرین اخبار و اطلاعیه‌های هفت‌طلایی: تولید و فرآوری فندق، پسته و بادام، صادرات، کنترل کیفی و حضور در نمایشگاه‌ها.'
          : 'Latest news and announcements from 7Golden: production, exports, quality control and trade-show appearances.'}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/news`}
      />

      <PullToRefresh onRefresh={() => Promise.resolve()}>
        {/* Hero */}
        <div className="relative">
          <DynamicHeroSlider pageKey="gallery" fallback={{ image: hero?.image || '/banner/Hero.webp', title: hero?.title || '', subtitle: hero?.subtitle || '', badge: hero?.badge || '' }} />
        </div>

        {/* ===== CHAPTER 01 — news & announcements ===== */}
        <section className="chapter" style={{ position: 'relative' }}>
          <div ref={auraRef} aria-hidden="true" style={{ position: 'absolute', top: '-10%', left: '-8%', width: '46%', height: '60%', pointerEvents: 'none', background: 'radial-gradient(circle at 40% 40%, rgba(212,175,55,0.10), transparent 70%)', filter: 'blur(8px)' }} />
          <div className="chapter-shell" style={{ position: 'relative' }}>
            <StoryChapter
              index="01"
              eyebrow="NEWS"
              title="اخبار و اطلاعیه‌ها"
              lead={isFA ? 'تازه‌ترین رویدادهای هفت‌طلایی — از خطوط فرآوری و کنترل کیفی تا صادرات و حضور در نمایشگاه‌ها.' : 'The latest from 7Golden — production lines, quality control, exports and trade shows.'}
              className="mb-10"
            />

            {/* Featured announcement */}
            <Reveal variant="up">
              <article
                onClick={() => setArticle(featured)}
                className="group grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden gold-frame cursor-pointer mb-6"
                style={{ background: 'var(--surface-subtle, rgba(255,255,255,0.03))' }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
                  <img src={featured.image} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full font-body text-[10px]" style={{ background: 'rgba(7,6,4,0.72)', border: '1px solid var(--hairline-strong)', color: NEWS_CATEGORIES[featured.category]?.tone, backdropFilter: 'blur(8px)' }}>
                    {NEWS_CATEGORIES[featured.category]?.label}
                  </span>
                </div>
                <div className="p-6 md:p-9 text-right flex flex-col gap-3">
                  <span className="font-body text-[11px]" style={{ color: 'var(--fg-muted)' }}>{featured.date}</span>
                  <h3 className="display-md" style={{ color: 'var(--ink)' }}>{featured.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{featured.excerpt}</p>
                  <span className="mt-auto font-body text-xs inline-flex items-center gap-1" style={{ color: 'var(--gold-2)' }}>
                    خواندن خبر <ChevronLeft size={14} />
                  </span>
                </div>
              </article>
            </Reveal>

            {/* Announcements grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {rest.map((item, i) => (
                <Reveal key={item.id} delay={(i % 3) * 90} variant="up">
                  <NewsCard item={item} onOpen={() => setArticle(item)} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 02 — videos ===== */}
        <section className="chapter" style={{ background: 'rgba(7, 6, 4, 0.5)' }}>
          <div className="chapter-shell">
            <StoryChapter
              index="02"
              eyebrow="VIDEO"
              title="ویدئوهای تولید و نمایشگاه"
              lead={isFA ? 'نگاهی از نزدیک به خطوط فرآوری، سالن بسته‌بندی و حضور در نمایشگاه‌ها.' : 'A close look at processing lines, packaging and exhibitions.'}
              className="mb-10"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {VIDEOS.map((v, i) => (
                <Reveal key={i} delay={(i % 3) * 90} variant="up">
                  <button
                    onClick={() => openLightbox('video', i)}
                    className="group relative block w-full rounded-3xl overflow-hidden gold-frame"
                    style={{ aspectRatio: '4 / 3' }}
                    aria-label={v.title}
                  >
                    <video
                      src={v.image}
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,6,4,0.8), rgba(7,6,4,0.2))' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ background: 'rgba(212,175,55,0.16)', border: '1px solid rgba(212,175,55,0.5)', backdropFilter: 'blur(8px)' }}>
                        <Play size={22} style={{ color: 'var(--gold-2)' }} fill="currentColor" />
                      </span>
                    </div>
                    <div className="absolute bottom-0 right-0 left-0 p-4 text-right">
                      <span className="display-sm block" style={{ color: 'var(--ink)' }}>{v.title}</span>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 03 — photos ===== */}
        <section className="chapter">
          <div className="chapter-shell">
            <StoryChapter
              index="03"
              eyebrow="GALLERY"
              title="تصاویر نمایشگاه‌ها و کارخانه"
              lead={isFA ? 'عکس‌هایی از غرفه هفت‌طلایی در نمایشگاه‌های داخلی و بین‌المللی و محیط کارخانه.' : 'Photos from 7Golden\'s booth at trade shows and the factory floor.'}
              className="mb-10"
            />

            <div className="gallery-mosaic">
              {PHOTOS.map((src, i) => (
                <PhotoTile
                  key={src}
                  src={src}
                  index={i}
                  onOpen={() => openLightbox('photo', i)}
                />
              ))}
            </div>
          </div>
        </section>

        <Marquee items={isFA ? ['اخبار', 'نمایشگاه', 'صادرات', 'تولید', 'کیفیت', 'فندق', 'پسته', 'بادام'] : ['News', 'Expo', 'Export', 'Production', 'Quality', 'Hazelnut', 'Pistachio', 'Almond']} />
      </PullToRefresh>

      {/* ===== ARTICLE MODAL ===== */}
      {article && (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)' }}
          onClick={() => setArticle(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-3xl gold-frame"
            style={{ background: 'var(--bg-2, #100d08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative" style={{ aspectRatio: '16 / 9' }}>
              <img src={article.image} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => setArticle(null)}
                className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.25)' }}
                aria-label="بستن"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 md:p-8 text-right">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full font-body text-[10px]" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--hairline-strong)', color: NEWS_CATEGORIES[article.category]?.tone }}>
                  {NEWS_CATEGORIES[article.category]?.label}
                </span>
                <span className="font-body text-[11px]" style={{ color: 'var(--fg-muted)' }}>{article.date}</span>
              </div>
              <h2 className="display-md mb-4" style={{ color: 'var(--ink)' }}>{article.title}</h2>
              <div className="flex flex-col gap-3">
                {article.body.map((p, i) => (
                  <p key={i} className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MEDIA LIGHTBOX ===== */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(8px)' }}
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            aria-label="بستن"
          >
            <X size={20} />
          </button>

          <button
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-10"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={(e) => { e.stopPropagation(); nav(-1); }}
            aria-label="قبلی"
          >
            <ChevronRight size={20} />
          </button>
          <button
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-10"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={(e) => { e.stopPropagation(); nav(1); }}
            aria-label="بعدی"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {lightbox.type === 'video' ? (
              <VideoPlayer src={VIDEOS[lightbox.index].image} type={VIDEOS[lightbox.index].type} />
            ) : (
              <img
                src={PHOTOS[lightbox.index]}
                alt=""
                className="w-full h-auto rounded-2xl"
                style={{ maxHeight: '86vh', objectFit: 'contain' }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NewsCard({ item, onOpen }) {
  const cat = NEWS_CATEGORIES[item.category];
  return (
    <article
      onClick={onOpen}
      className="group relative rounded-3xl overflow-hidden gold-frame cursor-pointer h-full flex flex-col"
      style={{ background: 'var(--surface-subtle, rgba(255,255,255,0.03))' }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
        <img src={item.image} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full font-body text-[10px]" style={{ background: 'rgba(7,6,4,0.72)', border: '1px solid var(--hairline-strong)', color: cat?.tone, backdropFilter: 'blur(8px)' }}>
          {cat?.label}
        </span>
      </div>
      <div className="p-5 text-right flex flex-col gap-2 flex-1">
        <span className="font-body text-[11px]" style={{ color: 'var(--fg-muted)' }}>{item.date}</span>
        <h3 className="display-sm" style={{ color: 'var(--ink)' }}>{item.title}</h3>
        <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{item.excerpt}</p>
        <span className="mt-auto pt-2 font-body text-[11px] inline-flex items-center gap-1" style={{ color: 'var(--gold-2)' }}>
          ادامه مطلب <ChevronLeft size={13} />
        </span>
      </div>
    </article>
  );
}

function VideoPlayer({ src, type }) {
  return (
    <video
      src={src}
      type={type}
      controls
      autoPlay
      playsInline
      className="w-full h-auto rounded-2xl"
      style={{ maxHeight: '86vh', objectFit: 'contain', background: '#000' }}
    />
  );
}

function PhotoTile({ src, index, onOpen }) {
  const { ref, visible } = useScrollAnimation();
  const span = index % 7 === 0 ? 'span-tall' : (index % 5 === 0 ? 'span-wide' : 'span-normal');
  return (
    <div
      ref={ref}
      className={`gallery-item ${span} fade-up ${visible ? 'visible' : ''}`}
      style={{ transitionDelay: `${(index % 4) * 90}ms` }}
      onClick={onOpen}
    >
      <img src={src} alt="" loading="lazy" />
      <div className="gallery-gold-ring" />
    </div>
  );
}
