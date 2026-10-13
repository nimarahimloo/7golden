import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';
import { NEWS_CATEGORIES, NEWS_ITEMS } from '@/lib/news-content';

function NewsTile({ item, featured = false }) {
  const category = NEWS_CATEGORIES[item.category];

  return (
    <Link
      to="/news"
      className={'home-news-tile group ' + (featured ? 'home-news-featured' : '')}
      aria-label={`مشاهده خبر: ${item.title}`}
    >
      <img src={item.image} alt="" loading="lazy" decoding="async" />
      <span className="home-news-scrim" aria-hidden="true" />
      <span className="home-news-tile-content">
        <span className="home-news-meta">
          <i style={{ background: category?.tone }} aria-hidden="true" />
          {category?.label} <b>·</b> {item.date}
        </span>
        <strong>{item.title}</strong>
        {featured && <em>{item.excerpt}</em>}
        <span className="home-news-read">مشاهده خبر <ArrowLeft size={15} /></span>
      </span>
    </Link>
  );
}

export default function HomeNews() {
  const [featured, ...items] = NEWS_ITEMS;

  return (
    <section className="chapter home-news-section" aria-label="اخبار و اطلاعیه‌های هفت طلایی">
      <div className="chapter-shell">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <StoryChapter
            index="07"
            eyebrow="اخبار و اطلاعیه‌ها"
            title="از هفت طلایی، نزدیک‌تر"
            lead="روایت‌هایی از محصولات، فرآوری و حضور مجموعه؛ با تصاویر ثبت‌شده از خود هفت طلایی."
          />
          <Link to="/news" className="home-news-all">همه اخبار <ArrowLeft size={16} /></Link>
        </div>

        <div className="home-news-grid">
          <Reveal variant="up" className="home-news-feature-wrap"><NewsTile item={featured} featured /></Reveal>
          <div className="home-news-stack">
            {items.slice(0, 2).map((item, index) => (
              <Reveal key={item.id} delay={index * 100} variant="up"><NewsTile item={item} /></Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
