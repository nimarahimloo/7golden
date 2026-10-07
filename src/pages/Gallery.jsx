import { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import DynamicHeroSlider from '@/components/DynamicHeroSlider';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';
import PullToRefresh from '@/components/PullToRefresh';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import Marquee from '@/components/story/Marquee';
import { EXHIBITION_PHOTOS, VIDEOS } from '@/lib/gallery-content';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import { usePageHero } from '@/lib/usePageHero';

export default function Gallery() {
  const isFA = true;
  const [lightbox, setLightbox] = useState(null); // { type: 'video'|'photo', index }

  const { hero } = usePageHero('gallery', {
    image: '/banner/banner-four-bowls.webp',
    title: 'گالری و نمایشگاه‌ها',
    subtitle: 'حضور هفت‌طلایی در نمایشگاه‌ها، خطوط تولید و گالری محصولات',
    badge: 'گالری',
  });

  const openLightbox = (type, index) => setLightbox({ type, index });
  const close = () => setLightbox(null);

  // Keyboard nav for the lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') nav(1);   // RTL: left arrow = next
      if (e.key === 'ArrowRight') nav(-1); // RTL: right arrow = prev
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  const nav = (dir) => {
    if (!lightbox) return;
    const list = lightbox.type === 'video' ? VIDEOS : EXHIBITION_PHOTOS;
    const n = list.length;
    setLightbox({ type: lightbox.type, index: (lightbox.index + dir + n) % n });
  };

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Seo
        title={isFA ? `گالری و نمایشگاه‌های ${SITE_SEO.siteNameFA}` : `Gallery & Exhibitions — ${SITE_SEO.siteNameEN}`}
        description={isFA
          ? 'گالری تصاویر و ویدئوهای نمایشگاهی، خطوط تولید و حضور هفت‌طلایی در نمایشگاه‌های داخلی و بین‌المللی.'
          : 'Photo and video gallery of 7Golden trade-show appearances, production lines and facilities.'}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/gallery`}
      />

      <PullToRefresh onRefresh={() => Promise.resolve()}>
        {/* Hero */}
        <div className="relative">
          <DynamicHeroSlider pageKey="gallery" fallback={{ image: hero?.image || '/banner/Hero.webp', title: hero?.title || '', subtitle: hero?.subtitle || '', badge: hero?.badge || '' }} />
        </div>

        {/* ===== CHAPTER 01 — videos ===== */}
        <section className="chapter">
          <div className="chapter-shell">
            <StoryChapter
              index="01"
              eyebrow="VIDEO"
              title="ویدئوهای تولید و نمایشگاه"
              lead={isFA ? 'نگاهی از نزدیک به خطوط فرآوری، گالری محصولات و حضور در نمایشگاه‌ها.' : 'A close look at processing lines, product galleries and exhibitions.'}
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
                        style={{ background: 'rgba(227,194,99,0.16)', border: '1px solid rgba(227,194,99,0.5)', backdropFilter: 'blur(8px)' }}>
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

        {/* ===== CHAPTER 02 — exhibition photos ===== */}
        <section className="chapter" style={{ background: 'rgba(7, 6, 4, 0.5)' }}>
          <div className="chapter-shell">
            <StoryChapter
              index="02"
              eyebrow="EXHIBITIONS"
              title="حضور در نمایشگاه‌ها"
              lead={isFA ? 'عکس‌هایی از غرفه و حضور هفت‌طلایی در نمایشگاه‌های داخلی و بین‌المللی.' : 'Photos from 7Golden\'s booth at domestic and international trade shows.'}
              className="mb-10"
            />

            <div className="gallery-mosaic">
              {EXHIBITION_PHOTOS.map((src, i) => (
                <PhotoTile
                  key={src}
                  src={src}
                  index={i}
                  isFA={isFA}
                  onOpen={() => openLightbox('photo', i)}
                />
              ))}
            </div>
          </div>
        </section>

        <Marquee items={isFA ? ['نمایشگاه', 'صادرات', 'تولید', 'کیفیت', 'فندق', 'پسته', 'بادام'] : ['Expo', 'Export', 'Production', 'Quality', 'Hazelnut', 'Pistachio', 'Almond']} />
      </PullToRefresh>

      {/* ===== LIGHTBOX ===== */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(8px)' }}
          onClick={close}
        >
          <button
            className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            aria-label="بستن"
          >
            <X size={20} />
          </button>

          {/* nav arrows */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 hidden md:flex"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={(e) => { e.stopPropagation(); nav(-1); }}
            aria-label="قبلی"
          >
            <ChevronRight size={22} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 hidden md:flex"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={(e) => { e.stopPropagation(); nav(1); }}
            aria-label="بعدی"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {lightbox.type === 'video' ? (
              <VideoPlayer src={VIDEOS[lightbox.index].image} type={VIDEOS[lightbox.index].type} />
            ) : (
              <img
                src={EXHIBITION_PHOTOS[lightbox.index]}
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

function VideoPlayer({ src, type }) {
  const ref = useRef(null);
  return (
    <video
      ref={ref}
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

function PhotoTile({ src, index, isFA, onOpen }) {
  const { ref, visible } = useScrollAnimation();
  // varied spans for an asymmetric mosaic
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
