import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';
import { getNewsPosts } from '@/lib/api/content';
import { NEWS_CATEGORIES } from '@/lib/news-content';

function NewsTile({ item, featured = false }) {
  const category = NEWS_CATEGORIES[item.category];
  const label = category?.label || item.categoryLabel || item.category || 'خبر';
  return (
    <Link to={`/news/${item.slug || item.id}`} className={'home-news-tile group ' + (featured ? 'home-news-featured' : '')} aria-label={`مشاهده خبر: ${item.title}`}>
      <img src={item.image || '/banner/banner-four-bowls.webp'} alt="" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/banner/banner-four-bowls.webp'; }} />
      <span className="home-news-scrim" aria-hidden="true" />
      <span className="home-news-tile-content">
        <span className="home-news-meta"><i style={{ background: category?.tone || 'var(--gold-2)' }} aria-hidden="true" />{label} <b>·</b> {item.date || ''}</span>
        <strong>{item.title}</strong>
        {featured && <em>{item.excerpt}</em>}
        <span className="home-news-read">مشاهده خبر <ArrowLeft size={15} /></span>
      </span>
    </Link>
  );
}

export default function HomeNews({ section = {} }) {
  const [items, setItems] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getNewsPosts({ limit: 3, skip: 0 })
      .then((rows) => { if (active) { setItems(Array.isArray(rows) ? rows : []); setLoadError(false); } })
      .catch(() => { if (active) { setItems([]); setLoadError(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const [featured, ...rest] = items;
  return (
    <section className="chapter home-news-section" aria-label="اخبار و اطلاعیه‌های هفت طلایی">
      <div className="chapter-shell">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <StoryChapter index="07" eyebrow={section.badge_fa || 'اخبار و اطلاعیه‌ها'} title={section.title_fa || 'از هفت طلایی، نزدیک‌تر'} lead={section.subtitle_fa || 'روایت‌هایی از محصولات و فرآوری، برگرفته از اخبار منتشرشده در پایگاه محتوای مجموعه.'} />
          <Link to="/news" className="home-news-all">همه اخبار <ArrowLeft size={16} /></Link>
        </div>
        {loading ? <p className="home-content-status" role="status">در حال بارگذاری خبرها…</p> : items.length > 0 ? (
          <div className="home-news-grid">
            <Reveal variant="up" className="home-news-feature-wrap"><NewsTile item={featured} featured /></Reveal>
            <div className="home-news-stack">
              {rest.map((item, index) => <Reveal key={item.slug || item.id} delay={index * 100} variant="up"><NewsTile item={item} /></Reveal>)}
            </div>
          </div>
        ) : (
          <p className="home-content-status" role="status">{loadError ? 'خبرها از پایگاه داده دریافت نشدند.' : 'در حال حاضر خبر منتشرشده‌ای برای نمایش نیست.'}</p>
        )}
      </div>
    </section>
  );
}
