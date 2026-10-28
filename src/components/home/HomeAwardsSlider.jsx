import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronLeft } from 'lucide-react';
import { getAwards } from '@/lib/api/content';
import StoryChapter from '@/components/story/StoryChapter';

export default function HomeAwardsSlider({ section = {} }) {
  const [awards, setAwards] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;

    const loadAwards = async () => {
      try {
        const items = await getAwards();
        if (!active) return;

        const publishedItems = Array.isArray(items)
          ? items.filter((item) =>
              item &&
              item.published !== false &&
              typeof item.image === 'string' &&
              item.image.trim().length > 0,
            )
          : [];

        setAwards(publishedItems);
        setStatus('ready');
      } catch {
        if (active) setStatus('error');
      }
    };

    void loadAwards();
    return () => {
      active = false;
    };
  }, []);

  const loop = [...awards, ...awards];

  return (
    <section className="chapter relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      <div className="chapter-shell">
        <StoryChapter
          index="۰۷"
          eyebrow={section.badge_fa || 'افتخارات و مدارک'}
          title={section.title_fa || 'مروری بر سوابق هفت طلایی'}
          lead={section.subtitle_fa || undefined}
          className="mb-10"
        />
      </div>

      {status === 'loading' ? (
        <div className="chapter-shell">
          <div className="home-catalog-status" role="status" aria-live="polite">
            <span className="home-catalog-status-icon" aria-hidden="true"><Award size={23} /></span>
            <div className="min-w-0 flex-1">
              <strong>در حال دریافت مدارک منتشرشده…</strong>
              <p>تصاویر این بخش از سوابق تأییدشدهٔ سامانه خوانده می‌شوند.</p>
            </div>
          </div>
        </div>
      ) : status === 'error' ? (
        <div className="chapter-shell">
          <div className="home-catalog-status" role="alert" aria-live="polite">
            <span className="home-catalog-status-icon" aria-hidden="true"><Award size={23} /></span>
            <div className="min-w-0 flex-1">
              <strong>بارگذاری مدارک با مشکل روبه‌رو شد.</strong>
              <p>برای دریافت اطلاعات بیشتر با مجموعه تماس بگیرید.</p>
            </div>
            <Link to="/contact" className="home-catalog-contact">
              تماس با ما
              <ChevronLeft size={15} />
            </Link>
          </div>
        </div>
      ) : awards.length === 0 ? (
        <div className="chapter-shell">
          <p className="home-content-status" role="status" aria-live="polite">
            در حال حاضر مدرک منتشرشده‌ای برای نمایش وجود ندارد.
          </p>
        </div>
      ) : (
        <div className="awards-marquee" role="region" aria-label="تصاویر مدارک منتشرشدهٔ هفت طلایی">
          <div className="awards-marquee-track">
            {loop.map((award, index) => {
              const isDuplicate = index >= awards.length;
              const title =
                award.title_fa ||
                award.titleFA ||
                award.title ||
                'از مدارک و تقدیرنامه‌های هفت طلایی';

              return (
                <figure
                  key={`${award.id || title}-${index}`}
                  className="award-frame"
                  aria-hidden={isDuplicate ? true : undefined}
                >
                  <img
                    src={award.image}
                    alt={isDuplicate ? '' : title}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
