import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import StoryChapter from '@/components/story/StoryChapter';
import { HOME_MEDIA_ITEMS } from '@/lib/home-media';

const HOME_FEATURED_MEDIA_IDS = [
  'video-facility-1',
  'photo-AQ8A1640AQ8A1640',
  'video-processing-1',
  'photo-AQ8A1665AQ8A1665',
];

/** Customer-facing copy — never show developer/CMS notes on the homepage. */
const GALLERY_COPY = {
  eyebrow: 'از نزدیک',
  title: 'نگاهی به فضای تولید',
  lead: 'تصاویری از کارخانه، خطوط فرآوری و محصولات هفت طلایی در قزوین.',
};

const BAD_GALLERY_LEADS = [
  'روایتی موزاییکی از فضای کارخانه، فرآوری و تصاویر ثبت‌شدهٔ محصولات هفت طلایی؛ ویدیوها بی‌صدا و پیوسته مانند تصویر متحرک نمایش داده می‌شوند.',
  'گزیده‌ای خلوت از تصاویر منتخب کارخانه، فرآوری و محصولات هفت طلایی؛ ویدیوهای منتخب بی‌صدا و پیوسته نمایش داده می‌شوند.',
  'گزیده‌ای کنترل‌شده از تصاویر باکیفیت کارخانه، فرآوری و محصولات هفت طلایی؛ ویدیوهای منتخب به‌صورت بی‌صدا و پیوسته نمایش داده می‌شوند.',
];

function resolveLead(subtitle) {
  const value = typeof subtitle === 'string' ? subtitle.trim() : '';
  if (!value) return GALLERY_COPY.lead;
  if (BAD_GALLERY_LEADS.includes(value)) return GALLERY_COPY.lead;
  if (/بی‌صدا|موزاییک|تصویر متحرک|CMS|پایگاه محتوا/i.test(value)) return GALLERY_COPY.lead;
  return value;
}

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

  const visibleMedia = useMemo(() => {
    const byId = new Map(media.map((item) => [item.id, item]));
    const selected = HOME_FEATURED_MEDIA_IDS.map((id) => byId.get(id)).filter(Boolean);
    const seen = new Set(selected.map((item) => item.id));
    for (const item of media) {
      if (selected.length >= 4) break;
      if (!seen.has(item.id)) { selected.push(item); seen.add(item.id); }
    }
    return selected.slice(0, 4).map((item, index) => ({
      ...item,
      shape: index === 0 ? 'feature' : (index === 1 ? 'wide' : (index === 2 ? 'standard' : 'wide')),
    }));
  }, [media]);
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
  }, [activeItem, visibleMedia]);

  const moveLightbox = (delta) => {
    if (!activeItem || !visibleMedia.length) return;
    const index = visibleMedia.findIndex((item) => item.id === activeItem.id);
    setActiveId(visibleMedia[(index + delta + visibleMedia.length) % visibleMedia.length]?.id || null);
  };

  if (!visibleMedia.length) return null;

  const eyebrow = section.badge_fa && !/تصاویر واقعی/i.test(section.badge_fa)
    ? section.badge_fa
    : GALLERY_COPY.eyebrow;
  const title = section.title_fa && section.title_fa !== 'زیبایی در جزئیات است'
    ? section.title_fa
    : GALLERY_COPY.title;
  const lead = resolveLead(section.subtitle_fa);

  return (
    <section className="chapter relative overflow-hidden home-media-section" aria-label="گالری تصاویر هفت طلایی">
      {section.image && <img src={section.image} alt="" aria-hidden="true" loading="lazy" decoding="async" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.055]" />}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(190,151,62,.08), transparent 70%)' }} />
      <div className="chapter-shell relative">
        <div className="mb-10 md:mb-14">
          <StoryChapter
            index="04"
            eyebrow={eyebrow}
            title={title}
            lead={lead}
            align="center"
          />
        </div>

        <div className="home-media-mosaic home-media-mosaic--curated">
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
                  <span className="home-media-kind">{item.type === 'video' ? 'ویدیو' : 'تصویر'}</span>
                  <strong title={item.title}>{item.title}</strong>
                  <span className="home-media-open"><ArrowUpLeft size={17} /></span>
                </span>
              </button>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t pt-5" style={{ borderColor: 'var(--hairline)' }}>
          <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>هفت طلایی · قزوین</span>
          <span className="text-xs" style={{ color: 'var(--gold-2)' }}>فندق · پسته · بادام</span>
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
