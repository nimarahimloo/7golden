import { useEffect, useState } from 'react';
import { getAwards } from '@/lib/api/content';
import StoryChapter from '@/components/story/StoryChapter';

export default function HomeAwardsSlider() {
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    let active = true;
    const loadAwards = async () => {
      try {
        const items = await getAwards();
        if (!active || !Array.isArray(items)) return;
        const validItems = items.filter(
          (item) => item && typeof item.image === 'string' && item.image.trim().length > 0,
        );
        setAwards(validItems);
      } catch {
        // Keep local fallback data available.
      }
    };
    void loadAwards();
    return () => { active = false; };
  }, []);

  if (awards.length === 0) return null;

  const list = awards;
  const loop = [...list, ...list];

  return (
    <section className="chapter relative overflow-hidden" style={{ background: 'rgba(7, 6, 4, 0.55)' }}>
      <div className="chapter-shell">
        <StoryChapter
          index="۰۶"
          eyebrow="افتخارات و مدارک"
          title="مروری بر سوابق هفت طلایی"
          className="mb-10"
        />
      </div>

      <div className="awards-marquee" aria-label="تصاویر مدارک و تقدیرنامه‌های هفت طلایی">
        <div className="awards-marquee-track">
          {loop.map((award, index) => {
            const isDuplicate = index >= list.length;
            const title =
              award.title_fa ||
              award.titleFA ||
              award.title ||
              award.alt ||
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
    </section>
  );
}
