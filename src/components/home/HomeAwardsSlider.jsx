
import { useEffect, useState } from 'react';
import { getAwards } from '@/lib/api/content';
import StoryChapter from '@/components/story/StoryChapter';

type AwardItem = {
  id: string | number;
  image: string;
  title?: string;
  alt?: string;
};

const FALLBACK_AWARDS: AwardItem[] = [
  {
    id: 'award-01',
    image: '/awards/award-01-tabriz-exhibition.webp',
    alt: 'حضور در نمایشگاه تبریز',
  },
  {
    id: 'award-02',
    image: '/awards/award-02-qazvin-appreciation.webp',
    alt: 'تقدیر از مجموعه ۷ گلدن در قزوین',
  },
  {
    id: 'award-03',
    image: '/awards/award-03-tabriz-university.webp',
    alt: 'لوح تقدیر دانشگاه تبریز',
  },
  {
    id: 'award-04',
    image: '/awards/award-04-training-ut.webp',
    alt: 'گواهی دوره آموزشی',
  },
  {
    id: 'award-05',
    image: '/awards/award-05-coaching-ut.webp',
    alt: 'گواهی برنامه آموزشی',
  },
  {
    id: 'award-06',
    image: '/awards/award-06-membership.webp',
    alt: 'مدرک عضویت',
  },
];

export default function HomeAwardsSlider() {
  const [awards, setAwards] = useState<AwardItem[]>([]);

  useEffect(() => {
    let active = true;

    const loadAwards = async () => {
      try {
        const items = await getAwards();

        if (!active || !Array.isArray(items)) return;

        const validItems = items.filter(
          (item: AwardItem) =>
            item &&
            typeof item.image === 'string' &&
            item.image.trim().length > 0,
        );

        if (validItems.length > 0) {
          setAwards(validItems);
        }
      } catch {
        // Keep the local fallback collection available.
      }
    };

    void loadAwards();

    return () => {
      active = false;
    };
  }, []);

  const list = awards.length > 0 ? awards : FALLBACK_AWARDS;
  const loop = [...list, ...list];

  return (
    <section
      className="chapter relative overflow-hidden"
      style={{ background: 'rgba(7, 6, 4, 0.55)' }}
    >
      <div className="chapter-shell">
        <StoryChapter
          index="۰۶"
          eyebrow="مروری بر افتخارات"
          title="دستاوردهای ۷ گلدن"
          className="mb-10"
        />
      </div>

      <div
        className="awards-marquee"
        aria-label="افتخارات و تقدیرهای ۷ گلدن"
      >
        <div className="awards-marquee-track">
          {loop.map((award, index) => {
            const isDuplicate = index >= list.length;

            return (
              <figure
                key={`${award.id}-${index}`}
                className="award-frame"
                aria-hidden={isDuplicate ? true : undefined}
              >
                <img
                  src={award.image}
                  alt={
                    isDuplicate
                      ? ''
                      : award.alt || award.title || 'از افتخارات ۷ گلدن'
                  }
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
