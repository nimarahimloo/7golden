import { useState, useEffect } from 'react';
import { getAwards } from '@/lib/api/content';
import StoryChapter from '@/components/story/StoryChapter';

/**
 * HomeAwardsSlider — the homepage awards band as a self-moving strip.
 * The certificates drift across the section on their own (pure CSS
 * animation — no per-frame React work, pause on hover) with no captions or
 * copy on each item: the images speak for themselves. The full, described
 * awards collection lives on the About page (`AwardsSection`).
 * Degrades to a curated fallback when the API is empty.
 */
const FALLBACK_AWARDS = [
  { id: 'award-01', image: '/awards/award-01-tabriz-exhibition.webp' },
  { id: 'award-02', image: '/awards/award-02-qazvin-appreciation.webp' },
  { id: 'award-03', image: '/awards/award-03-tabriz-university.webp' },
  { id: 'award-04', image: '/awards/award-04-training-ut.webp' },
  { id: 'award-05', image: '/awards/award-05-coaching-ut.webp' },
  { id: 'award-06', image: '/awards/award-06-membership.webp' },
];

export default function HomeAwardsSlider() {
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const items = await getAwards();
        if (active && items.length > 0) setAwards(items);
      } catch {
        // graceful — fall back to the curated set below
      }
    })();
    return () => { active = false; };
  }, []);

  const list = awards.length > 0 ? awards : FALLBACK_AWARDS;
  // Two identical halves → the -50% keyframe loops seamlessly.
  const loop = [...list, ...list];

  return (
    <section className="chapter relative overflow-hidden" style={{ background: 'rgba(7, 6, 4, 0.55)' }}>
      <div className="chapter-shell">
        <StoryChapter
          index="۰۷"
          eyebrow="جوایز و گواهینامه‌ها"
          title="کیفیتی که مراجع معتبر تأیید کرده‌اند"
          className="mb-10"
        />
      </div>

      {/* Self-moving, caption-free strip */}
      <div className="awards-marquee" aria-label="جوایز و گواهینامه‌های هفت‌طلایی">
        <div className="awards-marquee-track">
          {loop.map((a, i) => (
            <figure key={`${a.id}-${i}`} className="award-frame">
              <img src={a.image} alt="" loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
