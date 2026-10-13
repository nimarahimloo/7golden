import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import DynamicHeroSlider from '@/components/DynamicHeroSlider';
import PullToRefresh from '@/components/PullToRefresh';
import Seo from '@/components/Seo';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import Marquee from '@/components/story/Marquee';
import { usePageHero } from '@/lib/usePageHero';
import { SITE_SEO } from '@/lib/seo';
import { NEWS_CATEGORIES, NEWS_ITEMS, PHOTOS, VIDEOS } from '@/lib/news-content';

function NewsCard({ item, onSelect, featured = false }) {
  const category = NEWS_CATEGORIES[item.category];
  return (
    <button type="button" onClick={() => onSelect(item)} className={'news-card ' + (featured ? 'news-card-featured' : '')}>
      <img src={item.image} alt="" loading={featured ? 'eager' : 'lazy'} decoding="async" />
      <span className="news-card-shade" aria-hidden="true" />
      <span className="news-card-content">
        <span className="news-card-meta"><i style={{ background: category?.tone }} />{category?.label}<b>·</b>{item.date}</span>
        <strong>{item.title}</strong>
        <em>{item.excerpt}</em>
        <span className="news-card-action">جزئیات خبر <ChevronLeft size={16} /></span>
      </span>
    </button>
  );
}

function MediaCard({ video, index, onSelect }) {
  return (
    <button type="button" className="news-media-card group" onClick={() => onSelect(index)}>
      <video src={video.image} muted playsInline preload="metadata" />
      <span className="news-media-shade" aria-hidden="true" />
      <span className="news-media-play"><Play size={17} fill="currentColor" /></span>
      <span>{video.title}</span>
    </button>
  );
}

export default function News() {
  const [article, setArticle] = useState(null);
  const [videoIndex, setVideoIndex] = useState(null);
  const touchStart = useRef(null);
  const { hero } = usePageHero('gallery', {
    image: '/banner/banner-four-bowls.webp',
    title: 'اخبار و اطلاعیه‌ها',
    subtitle: 'رویدادها، محصولات و فضای مجموعه هفت طلایی',
    badge: 'اخبار',
  });
  const [featured, ...rest] = NEWS_ITEMS;
  const modalOpen = article || videoIndex !== null;

  useEffect(() => {
    if (!modalOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { setArticle(null); setVideoIndex(null); }
      if (videoIndex === null) return;
      if (event.key === 'ArrowLeft') setVideoIndex((index) => (index + 1) % VIDEOS.length);
      if (event.key === 'ArrowRight') setVideoIndex((index) => (index - 1 + VIDEOS.length) % VIDEOS.length);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [modalOpen, videoIndex]);

  const moveVideo = (direction) => setVideoIndex((index) => (index + direction + VIDEOS.length) % VIDEOS.length);
  const handleTouchStart = (event) => { touchStart.current = event.touches[0]?.clientX ?? null; };
  const handleTouchEnd = (event) => {
    if (videoIndex === null || touchStart.current === null) return;
    const distance = event.changedTouches[0]?.clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) > 48) moveVideo(distance < 0 ? 1 : -1);
  };

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Seo title={`اخبار و اطلاعیه‌های ${SITE_SEO.siteNameFA}`} description="رویدادها، محصولات، فرآوری و تصاویر ثبت‌شده از مجموعه هفت طلایی." image={SITE_SEO.ogImage} canonical={`${SITE_SEO.baseUrl}/news`} />
      <PullToRefresh onRefresh={() => Promise.resolve()}>
        <DynamicHeroSlider pageKey="gallery" fallback={{ image: hero?.image || '/banner/banner-four-bowls.webp', title: hero?.title || '', subtitle: hero?.subtitle || '', badge: hero?.badge || '' }} />

        <section className="chapter news-feed-section">
          <div className="chapter-shell">
            <StoryChapter index="01" eyebrow="NEWSROOM" title="اخبار و اطلاعیه‌ها" lead="اطلاعیه‌های مجموعه، معرفی سبد محصولات و اطلاعات کاربردی برای شروع گفت‌وگوی تجاری." className="mb-10 md:mb-14" />
            <Reveal variant="up"><NewsCard item={featured} onSelect={setArticle} featured /></Reveal>
            <div className="news-feed-grid mt-4 md:mt-6">
              {rest.map((item, index) => <Reveal key={item.id} delay={(index % 3) * 80} variant="up"><NewsCard item={item} onSelect={setArticle} /></Reveal>)}
            </div>
          </div>
        </section>

        <section className="chapter news-video-section">
          <div className="chapter-shell">
            <StoryChapter index="02" eyebrow="VIDEO ARCHIVE" title="هفت طلایی در حرکت" lead="چند قاب ویدئویی از محصولات، فضای مجموعه و فرآیند کار." className="mb-10" />
            <div className="news-video-grid">
              {VIDEOS.map((video, index) => <Reveal key={video.image} delay={(index % 4) * 75} variant="up"><MediaCard video={video} index={index} onSelect={setVideoIndex} /></Reveal>)}
            </div>
          </div>
        </section>

        <section className="chapter news-photo-band">
          <div className="chapter-shell"><div className="news-photo-rail" aria-label="تصاویر ثبت‌شده از مجموعه">
            {PHOTOS.slice(0, 12).map((src, index) => <img key={src} src={src} alt="" loading="lazy" decoding="async" className={index === 0 ? 'is-featured' : ''} />)}
          </div></div>
        </section>
        <Marquee items={['اخبار', 'نمایشگاه', 'تولید', 'محصولات', 'فندق', 'پسته', 'بادام']} />
      </PullToRefresh>

      {article && (
        <div className="news-modal" role="dialog" aria-modal="true" aria-label="جزئیات خبر" onMouseDown={(event) => { if (event.target === event.currentTarget) setArticle(null); }}>
          <article className="news-article-modal" style={{ maxHeight: 'min(88svh, 900px)', overflowY: 'auto' }}>
            <img src={article.image} alt="" />
            <button type="button" onClick={() => setArticle(null)} aria-label="بستن"><X size={20} /></button>
            <div className="news-article-copy">
              <span>{NEWS_CATEGORIES[article.category]?.label} · {article.date}</span>
              <h1>{article.title}</h1>
              <p className="news-article-lead">{article.excerpt}</p>
              <div className="news-article-body">
                {(article.body || []).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            </div>
          </article>
        </div>
      )}

      {videoIndex !== null && (
        <div className="news-modal news-video-modal" role="dialog" aria-modal="true" aria-label="پخش ویدئو" onMouseDown={(event) => { if (event.target === event.currentTarget) setVideoIndex(null); }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <button type="button" className="news-modal-close" onClick={() => setVideoIndex(null)} aria-label="بستن"><X size={20} /></button>
          <button type="button" className="news-modal-arrow news-modal-prev" onClick={() => moveVideo(-1)} aria-label="ویدئوی قبلی"><ChevronRight size={24} /></button>
          <div className="news-video-modal-content"><video src={VIDEOS[videoIndex].image} controls autoPlay playsInline /><span>{VIDEOS[videoIndex].title}</span></div>
          <button type="button" className="news-modal-arrow news-modal-next" onClick={() => moveVideo(1)} aria-label="ویدئوی بعدی"><ChevronLeft size={24} /></button>
        </div>
      )}
    </div>
  );
}
