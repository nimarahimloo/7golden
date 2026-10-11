import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ChevronLeft, Calendar, Clock } from 'lucide-react';
import Seo from '@/components/Seo';
import Reveal from '@/components/story/Reveal';
import NewsCard from '@/components/news/NewsCard';
import MediaLightbox from '@/components/news/MediaLightbox';
import { PhotoGroup, VideoBlock } from '@/components/news/ArticleMedia';
import { NEWS_ITEMS, NEWS_CATEGORIES } from '@/lib/news-content';
import { SITE_SEO } from '@/lib/seo';

// Each article body is its own module so a reader only downloads the one they open.
const LOADERS = import.meta.glob('../lib/news-articles/*.js');

const wordsOf = (sections) =>
  sections.reduce(
    (sum, s) => sum + [s.h, ...(s.p || []), ...(s.ul || [])].join(' ').split(/\s+/).filter(Boolean).length,
    0,
  );

export default function NewsArticle() {
  const { slug } = useParams();
  const item = NEWS_ITEMS.find((n) => n.id === slug);
  const [sections, setSections] = useState(null);
  const [lightbox, setLightbox] = useState(null); // index into item.photos

  useEffect(() => {
    setSections(null);
    setLightbox(null);
    const load = LOADERS[`../lib/news-articles/${slug}.js`];
    if (!item || !load) {
      setSections([]);
      return undefined;
    }
    let active = true;
    load().then((m) => active && setSections(m.default));
    return () => { active = false; };
  }, [slug, item]);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const openPhoto = useCallback((src) => setLightbox(Math.max(0, item.photos.indexOf(src))), [item]);

  const minutes = useMemo(() => (sections?.length ? Math.max(1, Math.round(wordsOf(sections) / 190)) : null), [sections]);

  if (!item) {
    return (
      <div dir="rtl" className="min-h-[70vh] flex items-center justify-center px-6 text-center" style={{ background: 'var(--bg)' }}>
        <div>
          <p className="font-body text-lg mb-4" style={{ color: 'var(--fg-muted)' }}>این خبر پیدا نشد.</p>
          <Link to="/news" className="font-body text-sm" style={{ color: 'var(--gold-2)' }}>بازگشت به اخبار و اطلاعیه‌ها</Link>
        </div>
      </div>
    );
  }

  const cat = NEWS_CATEGORIES[item.category];
  const usedPhotos = new Set();
  (sections || []).forEach((s) => (s.media?.photos || []).forEach((i) => usedPhotos.add(item.photos[i])));
  const restPhotos = item.photos.filter((p) => !usedPhotos.has(p));
  const related = NEWS_ITEMS.filter((n) => n.id !== item.id).slice(0, 3);
  const url = `${SITE_SEO.baseUrl}/news/${item.id}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: item.title,
      description: item.excerpt,
      image: `${SITE_SEO.baseUrl}${item.image}`,
      inLanguage: 'fa-IR',
      author: { '@type': 'Organization', name: '7Golden', url: SITE_SEO.baseUrl },
      publisher: { '@type': 'Organization', name: '7Golden', logo: { '@type': 'ImageObject', url: `${SITE_SEO.baseUrl}/logo.webp` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'خانه', item: `${SITE_SEO.baseUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'اخبار و اطلاعیه‌ها', item: `${SITE_SEO.baseUrl}/news` },
        { '@type': 'ListItem', position: 3, name: item.title, item: url },
      ],
    },
  ];

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Seo title={`${item.title} | ${SITE_SEO.siteNameFA}`} description={item.excerpt} image={item.image} type="article" canonical={url} jsonLd={jsonLd} />

      {/* ===== HERO ===== */}
      <header className="relative w-full overflow-hidden" style={{ height: 'clamp(340px, 62svh, 560px)' }}>
        <img src={item.image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(0.6)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(7,6,4,0.45) 0%, rgba(7,6,4,0.25) 40%, rgba(7,6,4,0.96) 100%)' }} />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 pb-10 md:pb-14 w-full text-center">
            <div className="flex items-center justify-center flex-wrap gap-2.5 mb-4">
              <span className="px-3.5 py-1 rounded-full font-body text-xs" style={{ background: 'rgba(7,6,4,0.7)', border: '1px solid var(--hairline-strong)', color: cat?.tone }}>
                {cat?.label}
              </span>
              <span className="inline-flex items-center gap-1.5 font-body text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <Calendar size={13} /> {item.date}
              </span>
              {minutes && (
                <span className="inline-flex items-center gap-1.5 font-body text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <Clock size={13} /> {minutes.toLocaleString('fa-IR')} دقیقه مطالعه
                </span>
              )}
            </div>
            <h1 className="display-lg" style={{ color: 'var(--ink)' }}>{item.title}</h1>
          </div>
        </div>
      </header>

      {/* ===== ARTICLE ===== */}
      <article className="max-w-3xl mx-auto px-5 sm:px-8 py-10 md:py-16">
        <nav aria-label="breadcrumb" className="flex items-center flex-wrap gap-2 font-body text-xs mb-8" style={{ color: 'var(--fg-muted)' }}>
          <Link to="/" style={{ color: 'var(--fg-muted)' }}>خانه</Link>
          <ChevronLeft size={12} />
          <Link to="/news" style={{ color: 'var(--fg-muted)' }}>اخبار و اطلاعیه‌ها</Link>
          <ChevronLeft size={12} />
          <span style={{ color: 'var(--fg)' }}>{cat?.label}</span>
        </nav>

        <p className="font-body text-base md:text-lg leading-[2] pb-8 mb-8" style={{ color: 'var(--fg)', borderBottom: '1px solid var(--hairline)' }}>
          {item.excerpt}
        </p>

        {sections === null && (
          <div className="py-24 text-center font-body text-sm" style={{ color: 'var(--fg-muted)' }}>در حال بارگذاری…</div>
        )}

        {(sections || []).map((s, i) => (
          <section key={s.h} className={i ? 'mt-10 md:mt-12' : ''}>
            <h2 className="font-heading font-extrabold text-xl md:text-2xl leading-snug mb-4" style={{ color: 'var(--ink)' }}>
              {s.h}
            </h2>
            {(s.p || []).map((para, j) => (
              <p key={j} className="font-body text-[15px] md:text-base leading-[2.05] mb-4" style={{ color: 'var(--fg-muted)' }}>{para}</p>
            ))}
            {s.ul && (
              <ul className="mb-5 space-y-2.5">
                {s.ul.map((li) => (
                  <li key={li} className="flex gap-3 items-start font-body text-[15px] md:text-base leading-[2]" style={{ color: 'var(--fg-muted)' }}>
                    <span className="mt-[0.9em] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            )}
            {s.media?.photos && <PhotoGroup srcs={s.media.photos.map((k) => item.photos[k]).filter(Boolean)} onOpen={openPhoto} />}
            {s.media?.video !== undefined && <VideoBlock video={item.videos[s.media.video]} />}
          </section>
        ))}

        {/* Remaining photos of this report */}
        {restPhotos.length > 0 && (
          <section className="mt-14">
            <h2 className="font-heading font-extrabold text-xl md:text-2xl leading-snug mb-5" style={{ color: 'var(--ink)' }}>گزارش تصویری</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {restPhotos.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => openPhoto(src)}
                  className="group relative block w-full overflow-hidden rounded-2xl"
                  style={{ aspectRatio: '4 / 3', background: 'var(--bg-secondary)', border: '1px solid var(--hairline)' }}
                  aria-label="نمایش تصویر"
                >
                  <img src={src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 pt-6 flex items-center justify-between gap-4" style={{ borderTop: '1px solid var(--hairline)' }}>
          <Link to="/news" className="inline-flex items-center gap-2 font-body text-sm font-semibold" style={{ color: 'var(--gold-2)' }}>
            <ArrowRight size={15} /> بازگشت به اخبار
          </Link>
          <Link to="/contact" className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>تماس با واحد بازرگانی</Link>
        </div>
      </article>

      {/* ===== RELATED ===== */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-16 md:pb-24">
        <h2 className="font-heading font-extrabold text-xl md:text-2xl mb-6 md:mb-8" style={{ color: 'var(--ink)' }}>اخبار دیگر</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {related.map((n, i) => (
            <Reveal key={n.id} delay={i * 90} variant="up"><NewsCard item={n} /></Reveal>
          ))}
        </div>
      </section>

      {lightbox !== null && (
        <MediaLightbox photos={item.photos} index={lightbox} onClose={closeLightbox} onIndex={setLightbox} />
      )}
    </div>
  );
}
