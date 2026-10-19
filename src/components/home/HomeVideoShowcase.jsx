import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import StoryChapter from '@/components/story/StoryChapter';
import { HOME_MEDIA_ITEMS } from '@/lib/home-media';

function LazyLoopVideo({ item, title }) {
  const videoRef = useRef(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === 'undefined') {
      setNearViewport(true);
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) setNearViewport(true);
      else video.pause();
    }, { rootMargin: '220px 0px' });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay={nearViewport}
      muted
      loop
      playsInline
      preload={nearViewport ? 'metadata' : 'none'}
      poster={item.poster}
      aria-label={title}
      className="home-media-video"
    >
      {nearViewport && <source src={item.url} type={/\.mov(?:$|\?)/i.test(item.url) ? 'video/quicktime' : 'video/mp4'} />}
    </video>
  );
}

export default function HomeVideoShowcase({ section = {}, mediaSections = [] }) {
  const [activeId, setActiveId] = useState(null);
  const overrideById = useMemo(() => {
    const map = new Map();
    mediaSections.forEach((record) => {
      const key = String(record.section_key || '');
      if (key.startsWith('media-item-')) map.set(key.slice('media-item-'.length), record);
    });
    return map;
  }, [mediaSections]);

  const media = useMemo(() => {
    const base = HOME_MEDIA_ITEMS.map((item) => {
      const override = overrideById.get(item.id);
      if (override?.published === false) return null;
      return {
        ...item,
        title: override?.title_fa || item.title,
        url: override?.media_url || item.url,
        type: override?.media_type || item.type,
        poster: override?.image || item.poster,
        order: override && Number(override.sort_order) > 0 ? Number(override.sort_order) : item.defaultOrder,
      };
    }).filter(Boolean);

    const defaultIds = new Set(HOME_MEDIA_ITEMS.map((item) => item.id));
    const custom = mediaSections
      .filter((record) => {
        const key = String(record.section_key || '');
        return key.startsWith('media-item-')
          && !defaultIds.has(key.slice('media-item-'.length))
          && record.published !== false
          && typeof record.media_url === 'string'
          && record.media_url.trim();
      })
      .map((record, index) => ({
        id: String(record.section_key).slice('media-item-'.length),
        title: record.title_fa || 'تصویر از مجموعه هفت طلایی',
        url: record.media_url,
        type: record.media_type || 'image',
        poster: record.image || record.media_url,
        shape: 'standard',
        order: Number(record.sort_order) > 0 ? Number(record.sort_order) : HOME_MEDIA_ITEMS.length + index + 1,
      }));

    return [...base, ...custom].sort((a, b) => a.order - b.order);
  }, [mediaSections, overrideById]);

  // Show a deliberately small five-item selection on the homepage; the admin ordering decides which items lead.
  const visibleMedia = media.slice(0, 5);
  const activeItem = visibleMedia.find((item) => item.id === activeId) || null;

  useEffect(() => {
    if (!activeItem) return undefined;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveId(null);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const index = visibleMedia.findIndex((item) => item.id === activeItem.id);
        const delta = event.key === 'ArrowLeft' ? 1 : -1;
        const next = visibleMedia[(index + delta + visibleMedia.length) % visibleMedia.length];
        setActiveId(next?.id || null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = priorOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeItem, media]);

  const moveLightbox = (delta) => {
    if (!activeItem || !visibleMedia.length) return;
    const index = visibleMedia.findIndex((item) => item.id === activeItem.id);
    setActiveId(visibleMedia[(index + delta + visibleMedia.length) % visibleMedia.length]?.id || null);
  };

  if (!visibleMedia.length) return null;

  return (
    <section className="chapter relative overflow-hidden home-media-section" aria-label="گالری ویدیو و تصاویر هفت طلایی">
      {section.image && <img src={section.image} alt="" aria-hidden="true" loading="lazy" decoding="async" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.055]" />}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(190,151,62,.10), transparent 70%)' }} />
      <div className="chapter-shell relative">
        <div className="mb-10 md:mb-14">
          <StoryChapter
            index="05"
            eyebrow={section.badge_fa || 'تصاویر واقعی از مجموعه'}
            title={section.title_fa || 'زیبایی در جزئیات است'}
            lead={section.subtitle_fa || 'روایتی موزاییکی از فضای کارخانه، فرآوری و تصاویر ثبت‌شدهٔ محصولات هفت طلایی؛ ویدیوها بی‌صدا و پیوسته مانند تصویر متحرک نمایش داده می‌شوند.'}
            align="center"
          />
        </div>

        <div className="home-media-mosaic">
          {visibleMedia.map((item, index) => (
            <article key={item.id} className={`home-media-tile home-media-tile--${item.shape || (index % 7 === 0 ? 'wide' : 'standard')}`}>
              <button type="button" className="home-media-trigger group" onClick={() => setActiveId(item.id)} aria-label={`نمایش ${item.title}`}>
                {item.type === 'video' ? (
                  <LazyLoopVideo item={item} title={item.title} />
                ) : (
                  <img src={item.url} alt={item.title} loading="lazy" decoding="async" />
                )}
                <span className="home-media-shade" aria-hidden="true" />
                <span className="home-media-meta">
                  <span className="home-media-kind">{item.type === 'video' ? 'ویدیو · تولید و فرآوری' : 'تصویر · 7GOLDEN'}</span>
                  <strong title={item.title}>{item.title}</strong>
                  <span className="home-media-open"><ArrowUpLeft size={17} /></span>
                </span>
              </button>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t pt-5" style={{ borderColor: 'var(--hairline)' }}>
          <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>هفت طلایی · قزوین</span>
          <span className="text-xs tracking-[.12em]" style={{ color: 'var(--gold-2)' }}>PRODUCT · PROCESS · DETAIL</span>
        </div>
      </div>

      {activeItem && (
        <div className="home-media-lightbox" role="dialog" aria-modal="true" aria-label={activeItem.title} onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveId(null); }}>
          <button type="button" className="home-media-lightbox-close" onClick={() => setActiveId(null)} aria-label="بستن"><X size={22} /></button>
          <button type="button" className="home-media-lightbox-prev" onClick={() => moveLightbox(-1)} aria-label="مورد قبلی"><ChevronRight size={25} /></button>
          <div className="home-media-lightbox-content">
            {activeItem.type === 'video' ? (
              <video src={activeItem.url} poster={activeItem.poster} controls autoPlay muted loop playsInline />
            ) : (
              <img src={activeItem.url} alt={activeItem.title} />
            )}
            <p>{activeItem.title}</p>
          </div>
          <button type="button" className="home-media-lightbox-next" onClick={() => moveLightbox(1)} aria-label="مورد بعدی"><ChevronLeft size={25} /></button>
        </div>
      )}
    </section>
  );
}
