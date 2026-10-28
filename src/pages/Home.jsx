
import { Fragment, useCallback, useEffect, useState } from 'react';

import {
  getProducts,
  getPageHero,
  getPageSections,
} from '@/lib/api/content';

import LogoLoader from '@/components/LogoLoader';
import { SITE_SEO } from '@/lib/seo';
import GoldenEssence from '@/components/GoldenEssence';
import Seo from '@/components/Seo';
import PullToRefresh from '@/components/PullToRefresh';

import HeroSlider from '@/components/HeroSlider';
import HomeVideoShowcase from '@/components/home/HomeVideoShowcase';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import ParallaxMedia from '@/components/story/ParallaxMedia';
import CountUp from '@/components/story/CountUp';

import HomeOrigin from '@/components/home/HomeOrigin';
import HomeFeaturedProducts from '@/components/home/HomeFeaturedProducts';
import HomeClients from '@/components/home/HomeClients';
import HomeAwardsSlider from '@/components/home/HomeAwardsSlider';
import HomeContactForm from '@/components/home/HomeContactForm';
import HomeNews from '@/components/home/HomeNews';
import HomeMagazine from '@/components/home/HomeMagazine';

import {
  CAPACITY_STATS,
} from '@/lib/corporate-content';

const ORDER_STEPS = [
  { number: '۰۱', title: 'انتخاب محصول', text: 'از مغز فندق و خمیر فندق تا مغز و خلال پسته و فرآورده‌های بادام؛ محصول را بر اساس کاربرد آن در شکلات، بستنی یا قنادی انتخاب کنید.' },
  { number: '۰۲', title: 'بررسی مشخصات سفارش', text: 'شکل محصول، مقدار موردنیاز و نوع بسته‌بندی هنگام استعلام قیمت مشخص می‌شوند.' },
  { number: '۰۳', title: 'هماهنگی تحویل', text: 'زمان آماده‌سازی و تحویل بر اساس موجودی و جزئیات نهایی سفارش هماهنگ می‌شود.' },
];

const DEFAULT_SECTION_IMAGES = {
  capacity: '/banner/img-6052.webp',
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [heroConfig, setHeroConfig] = useState(null);
  const [sectionMap, setSectionMap] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(
    async (isActive = () => true) => {
      let timeoutId;
      let nextProducts = [];

      try {
        const timeout = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Product request timed out'));
          }, 6000);
        });

        const result = await Promise.race([
          getProducts(),
          timeout,
        ]);

        nextProducts = Array.isArray(result) ? result : [];
      } catch {
        nextProducts = [];
      } finally {
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }
      }

      if (isActive()) {
        setProducts(nextProducts);
      }
    },
    [],
  );

  useEffect(() => {
    let active = true;

    getPageHero('home')
      .then((hero) => {
        if (active && hero) {
          setHeroConfig(hero);
        }
      })
      .catch(() => {});

    getPageSections('home')
      .then((sections) => {
        if (!active) return;

        const map = {};

        (sections || []).forEach((section) => {
          const key = String(section.section_key || '')
            .trim()
            .toLowerCase();

          if (key) {
            map[key] = section;
          }
        });

        setSectionMap(map);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      await loadData(() => active);

      if (active) {
        setLoading(false);
      }
    };

    void initialize();

    return () => {
      active = false;
    };
  }, [loadData]);

  const sec = (key) => sectionMap[key] || {};

  const sectionImages = {
    capacity: sec('capacity').image || DEFAULT_SECTION_IMAGES.capacity,
  };
  const sectionVisible = (key) => sec(key).published !== false;
  const homeMediaSections = Object.values(sectionMap).filter((section) =>
    String(section.section_key || '').startsWith('media-item-'),
  );

  if (loading) {
    return <LogoLoader />;
  }

  const homepageSections = [
    {
      key: 'capacity',
      defaultOrder: 20,
      content: (
        <section className="chapter">
          <div className="chapter-shell">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <ParallaxMedia
                src={sectionImages.capacity}
                alt="محصولات و توانمندی‌های هفت طلایی"
                ratio="aspect-[4/3]"
                className="rounded-3xl"
              />
              <div>
                <StoryChapter
                  index="02"
                  eyebrow={sec('capacity').badge_fa || 'توانمندی‌های هفت طلایی'}
                  title={sec('capacity').title_fa || 'فرآوری خشکبار در قزوین'}
                  lead={sec('capacity').subtitle_fa || 'فعالیت فرآوری هفت طلایی از سال ۱۳۷۷ آغاز شده است. فهرست محصولات شامل مغز فندق، خمیر و گرانول فندق، مغز و خلال پسته و شکل‌های مختلف بادام است.'}
                />
                <div className="grid grid-cols-2 gap-x-6 gap-y-8 mt-10">
                  {CAPACITY_STATS.map((stat, index) => (
                    <Reveal key={stat.label} delay={index * 90}>
                      <div className="flex items-baseline gap-1.5">
                        <CountUp
                          value={stat.value}
                          className="display-md"
                          style={{ color: 'var(--gold-2)' }}
                        />
                        {stat.unit ? (
                          <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>
                            {stat.unit}
                          </span>
                        ) : null}
                      </div>
                      <span className="font-body text-xs block mt-1.5" style={{ color: 'var(--fg-muted)' }}>
                        {stat.label}
                      </span>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ),
    },
    { key: 'origin', defaultOrder: 30, content: <HomeOrigin section={sec('origin')} /> },
    {
      key: 'products',
      defaultOrder: 40,
      content: (
        <HomeFeaturedProducts section={sec('products')} products={products} />
      ),
    },
    {
      key: 'visual-gallery',
      defaultOrder: 50,
      content: (
        <HomeVideoShowcase
          section={sec('visual-gallery')}
          mediaSections={homeMediaSections}
        />
      ),
    },
    { key: 'news', defaultOrder: 60, content: <HomeNews section={sec('news')} /> },
    { key: 'magazine', defaultOrder: 70, content: <HomeMagazine section={sec('magazine')} /> },
    {
      key: 'order',
      defaultOrder: 80,
      content: (
        <section className="chapter">
          <div className="chapter-shell">
            <StoryChapter
              index="09"
              eyebrow={sec('order').badge_fa || 'فرایند همکاری'}
              title={sec('order').title_fa || 'از انتخاب محصول تا آماده‌سازی سفارش'}
              lead={sec('order').subtitle_fa || 'هر سفارش با شناخت نیاز مجموعه شما آغاز می‌شود. مشخصات محصول، مقدار و نوع بسته‌بندی در کنار هم بررسی می‌شوند.'}
              align="center"
              className="mb-12 md:mb-16"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {ORDER_STEPS.map((step, index) => (
                <Reveal key={step.number} delay={index * 90}>
                  <article className="fact-card h-full">
                    <span className="block font-body text-sm mb-6" style={{ color: 'var(--gold-2)' }}>
                      {step.number}
                    </span>
                    <h3 className="display-sm mb-4" style={{ color: 'var(--fg)' }}>
                      {step.title}
                    </h3>
                    <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
                      {step.text}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ),
    },
    { key: 'awards', defaultOrder: 90, content: <HomeAwardsSlider section={sec('awards')} /> },
    { key: 'clients', defaultOrder: 100, content: <HomeClients section={sec('clients')} /> },
    { key: 'contact', defaultOrder: 110, content: <HomeContactForm section={sec('contact')} /> },
  ]
    .filter((section) => sectionVisible(section.key))
    .sort((a, b) => {
      const aOrder = Number(sec(a.key).sort_order) || a.defaultOrder;
      const bOrder = Number(sec(b.key).sort_order) || b.defaultOrder;
      return aOrder - bOrder;
    });

  return (
    <div dir="rtl" style={{ position: 'relative', zIndex: 1 }}>
      <Seo
        title={SITE_SEO.defaultTitleFA}
        description={SITE_SEO.defaultDescriptionFA}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_SEO.siteNameEN,
          url: SITE_SEO.baseUrl,
          inLanguage: 'fa-IR',
        }}
      />

      <GoldenEssence />

      <PullToRefresh onRefresh={() => loadData()}>
        {sectionVisible('hero') && <HeroSlider cmsHero={heroConfig} />}

        {homepageSections.map((section) => (
          <Fragment key={section.key}>{section.content}</Fragment>
        ))}
      </PullToRefresh>
    </div>
  );
}
