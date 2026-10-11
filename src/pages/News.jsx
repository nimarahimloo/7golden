import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import DynamicHeroSlider from '@/components/DynamicHeroSlider';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';
import PullToRefresh from '@/components/PullToRefresh';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import Marquee from '@/components/story/Marquee';
import NewsCard from '@/components/news/NewsCard';
import { NEWS_ITEMS, NEWS_CATEGORIES } from '@/lib/news-content';
import { usePageHero } from '@/lib/usePageHero';
import useScrollMagic from '@/hooks/useScrollMagic';

/**
 * /news — the announcements feed. Every card opens its own article page
 * (/news/:slug); the photos and videos live inside those articles.
 */
export default function News() {
  const { hero } = usePageHero('gallery', {
    image: '/banner/banner-four-bowls.webp',
    title: 'اخبار و اطلاعیه‌ها',
    subtitle: 'تازه‌ترین خبرهای تولید، صادرات، کیفیت و حضور هفت‌طلایی در نمایشگاه‌ها',
    badge: 'اخبار',
  });

  const auraRef = useScrollMagic({ speed: 0.18, max: 70 });
  const [featured, ...rest] = NEWS_ITEMS;
  const featuredCat = NEWS_CATEGORIES[featured.category];

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Seo
        title={`اخبار و اطلاعیه‌های ${SITE_SEO.siteNameFA}`}
        description="آخرین اخبار و اطلاعیه‌های هفت‌طلایی: تولید و فرآوری فندق، پسته و بادام، صادرات، کنترل کیفی و حضور در نمایشگاه‌ها."
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/news`}
      />

      <PullToRefresh onRefresh={() => Promise.resolve()}>
        <div className="relative">
          <DynamicHeroSlider pageKey="gallery" fallback={{ image: hero?.image || '/banner/Hero.webp', title: hero?.title || '', subtitle: hero?.subtitle || '', badge: hero?.badge || '' }} />
        </div>

        <section className="chapter" style={{ position: 'relative', overflow: 'clip' }}>
          <div ref={auraRef} aria-hidden="true" style={{ position: 'absolute', top: '-10%', left: '-8%', width: '46%', height: '60%', pointerEvents: 'none', background: 'radial-gradient(circle at 40% 40%, rgba(212,175,55,0.10), transparent 70%)', filter: 'blur(8px)' }} />
          <div className="chapter-shell" style={{ position: 'relative' }}>
            <StoryChapter
              index="01"
              eyebrow="NEWS"
              title="اخبار و اطلاعیه‌ها"
              lead="تازه‌ترین رویدادهای هفت‌طلایی — از خطوط فرآوری و کنترل کیفی تا صادرات و حضور در نمایشگاه‌ها. هر خبر یک گزارش کامل با تصاویر و ویدئوهای خودش است."
              className="mb-10"
            />

            {/* Featured announcement */}
            <Reveal variant="up">
              <Link
                to={`/news/${featured.id}`}
                className="group grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden gold-frame mb-6"
                style={{ background: 'var(--surface-subtle, rgba(255,255,255,0.03))' }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
                  <img src={featured.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full font-body text-xs" style={{ background: 'rgba(7,6,4,0.72)', border: '1px solid var(--hairline-strong)', color: featuredCat?.tone, backdropFilter: 'blur(8px)' }}>
                    {featuredCat?.label}
                  </span>
                </div>
                <div className="p-6 md:p-9 text-right flex flex-col gap-3">
                  <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>{featured.date}</span>
                  <h3 className="display-md" style={{ color: 'var(--ink)' }}>{featured.title}</h3>
                  <p className="font-body text-sm md:text-base leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{featured.excerpt}</p>
                  <span className="mt-auto font-body text-sm inline-flex items-center gap-1" style={{ color: 'var(--gold-2)' }}>
                    خواندن گزارش کامل <ChevronLeft size={15} />
                  </span>
                </div>
              </Link>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {rest.map((item, i) => (
                <Reveal key={item.id} delay={(i % 3) * 90} variant="up">
                  <NewsCard item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Marquee items={['اخبار', 'نمایشگاه', 'صادرات', 'تولید', 'کیفیت', 'فندق', 'پسته', 'بادام']} />
      </PullToRefresh>
    </div>
  );
}
