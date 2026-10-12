
import { useCallback, useEffect, useState } from 'react';

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

import CinematicHero from '@/components/CinematicHero';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import ParallaxMedia from '@/components/story/ParallaxMedia';
import CountUp from '@/components/story/CountUp';
import MaskText from '@/components/story/MaskText';

import HomeOrigin from '@/components/home/HomeOrigin';
import HomeClients from '@/components/home/HomeClients';
import HomeAwardsSlider from '@/components/home/HomeAwardsSlider';
import HomeContactForm from '@/components/home/HomeContactForm';
import ProductLineRow from '@/components/home/ProductLineRow';

import {
  CAPACITY_STATS,
  FALLBACK_PRODUCTS,
} from '@/lib/corporate-content';

const ORDER_STEPS = [
  {
    number: '۰۱',
    title: 'انتخاب محصول',
    text: 'پسته، بادام، فندق یا فرآورده‌های متنوع آن‌ها؛ انتخاب بر اساس نوع مصرف و نیاز مجموعه شما انجام می‌شود.',
  },
  {
    number: '۰۲',
    title: 'تعیین مشخصات سفارش',
    text: 'نوع محصول، شکل فرآوری، مقدار و بسته‌بندی موردنیاز، متناسب با جزئیات سفارش مشخص می‌شوند.',
  },
  {
    number: '۰۳',
    title: 'هماهنگی و آماده‌سازی',
    text: 'پس از مشخص‌شدن جزئیات سفارش، هماهنگی‌های لازم برای آماده‌سازی و زمان تحویل انجام می‌شود.',
  },
];

const DEFAULT_SECTION_IMAGES = {
  capacity: '/banner/img-6052.webp',
  products: '/gallery/AQ8A1505AQ8A1505.webp',
};

export default function Home() {
  const [products, setProducts] = useState < any[] > ([]);
  const [heroConfig, setHeroConfig] = useState < any > (null);
  const [sectionMap, setSectionMap] = useState < Record < string, any>> ({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(
    async (isActive: () => boolean = () => true) => {
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      let nextProducts: any[] = FALLBACK_PRODUCTS;

      try {
        const timeout = new Promise < never > ((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(new Error('Product request timed out'));
          }, 6000);
        });

        const result = await Promise.race([
          getProducts(),
          timeout,
        ]);

        nextProducts =
          Array.isArray(result) && result.length > 0
            ? result
            : FALLBACK_PRODUCTS;
      } catch {
        nextProducts = FALLBACK_PRODUCTS;
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
      .catch(() => {
        // The local presentation remains available when CMS data is unavailable.
      });

    getPageSections('home')
      .then((sections) => {
        if (!active) return;

        const map: Record<string, any> = {};

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
      .catch(() => {
        // Default images are used when section data cannot be loaded.
      });

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

  const byCat = (slug: string) =>
    products.filter(
      (product) =>
        product.category === slug &&
        product.published !== false,
    );

  const pistachioProducts = byCat('pistachio');
  const almondProducts = byCat('almond');
  const hazelnutProducts = byCat('hazelnut');

  const sec = (key: string) => sectionMap[key] || {};

  const sectionImages = {
    capacity:
      sec('capacity').image ||
      DEFAULT_SECTION_IMAGES.capacity,

    products:
      sec('products').image ||
      DEFAULT_SECTION_IMAGES.products,
  };

  if (loading) {
    return <LogoLoader />;
  }

  return (
    <div
      dir="rtl"
      style={{
        position: 'relative',
        zIndex: 1,
      }}
    >
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

        {/* 01 — معرفی برند */}

        <CinematicHero
          image={
            heroConfig?.image ||
            '/banner/tray-pistachio-almond.webp'
          }
          eyebrow="۷ گلدن · از ۱۳۷۷"
          title="دنیای خشکبار ممتاز"
          titleAccent="به انتخاب ۷ گلدن"
          lead="از پسته و بادام تا فندق و فرآورده‌های متنوع آن‌ها؛ ۷ گلدن بر شناخت محصول، دقت در آماده‌سازی و ارائه‌ای درخور کسب‌وکارهای حرفه‌ای تمرکز دارد."
          stats={CAPACITY_STATS}
          primary={{
            label: 'مشاوره و استعلام قیمت',
            href: '/contact',
          }}
          secondary={{
            label: 'مشاهده محصولات',
            href: '/shop',
          }}
        />

        {/* 02 — توانمندی‌ها */}

        <section className="chapter">
          <div className="chapter-shell">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <ParallaxMedia
                src={sectionImages.capacity}
                alt="محصولات و توانمندی‌های ۷ گلدن"
                ratio="aspect-[4/3]"
                className="rounded-3xl"
              />

              <div>
                <StoryChapter
                  index="02"
                  eyebrow="توانمندی‌های ۷ گلدن"
                  title="تخصص در محصول، دقت در فرآوری"
                  lead="شناخت ویژگی‌های پسته، بادام و فندق، در انتخاب شکل مناسب محصول و نحوه آماده‌سازی آن نقش دارد. تنوع محصولات و توجه به جزئیات، امکان انتخاب متناسب با نیاز مجموعه‌های حرفه‌ای را فراهم می‌کند."
                />

                <div className="grid grid-cols-2 gap-x-6 gap-y-8 mt-10">
                  {CAPACITY_STATS.map((stat, index) => (
                    <Reveal
                      key={stat.label}
                      delay={index * 90}
                    >
                      <div className="flex items-baseline gap-1.5">
                        <CountUp
                          value={stat.value}
                          className="display-md"
                          style={{
                            color: 'var(--gold-2)',
                          }}
                        />

                        <span
                          className="font-body text-xs"
                          style={{
                            color: 'var(--fg-muted)',
                          }}
                        >
                          {stat.unit}
                        </span>
                      </div>

                      <span
                        className="font-body text-xs block mt-1.5"
                        style={{
                          color: 'var(--fg-muted)',
                        }}
                      >
                        {stat.label}
                      </span>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — نگاه برند */}

        <HomeOrigin />

        {/* امضای بصری برند */}

        <MaskText
          image={sectionImages.products}
          text="7GOLDEN"
          eyebrow="از ۱۳۷۷ · قزوین"
        />

        {/* 04 — محصولات */}

        <section className="chapter pt-4 pb-2">
          <div className="chapter-shell mb-6">
            <StoryChapter
              index="04"
              eyebrow="مجموعه محصولات"
              title="پسته، بادام و فندق؛ با انتخابی دقیق"
              lead="هر محصول ویژگی‌های خاص خود را دارد. مجموعه ۷ گلدن، گونه‌های مختلف این سه گروه و فرآورده‌های متنوع آن‌ها را برای کاربردهای گوناگون عرضه می‌کند."
            />
          </div>

          <ProductLineRow
            title="محصولات پسته"
            products={pistachioProducts}
            duration={90}
          />

          <ProductLineRow
            title="محصولات بادام"
            products={almondProducts}
            duration={85}
          />

          <ProductLineRow
            title="محصولات فندق"
            products={hazelnutProducts}
            duration={100}
            reverse
          />
        </section>

        {/* 05 — فرایند همکاری */}

        <section className="chapter">
          <div className="chapter-shell">
            <StoryChapter
              index="05"
              eyebrow="فرایند همکاری"
              title="از انتخاب محصول تا آماده‌سازی سفارش"
              lead="هر سفارش با شناخت نیاز مجموعه شما آغاز می‌شود. مشخصات محصول، مقدار و نوع بسته‌بندی در کنار هم بررسی می‌شوند تا مسیر سفارش بر مبنای نیاز واقعی شما شکل بگیرد."
              align="center"
              className="mb-12 md:mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {ORDER_STEPS.map((step, index) => (
                <Reveal
                  key={step.number}
                  delay={index * 90}
                >
                  <article className="fact-card h-full">
                    <span
                      className="block font-body text-sm mb-6"
                      style={{
                        color: 'var(--gold-2)',
                      }}
                    >
                      {step.number}
                    </span>

                    <h3
                      className="display-sm mb-4"
                      style={{
                        color: '#fff',
                      }}
                    >
                      {step.title}
                    </h3>

                    <p
                      className="font-body text-sm leading-relaxed"
                      style={{
                        color: '#fff',
                      }}
                    >
                      {step.text}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* افتخارات و دستاوردها */}

        <HomeAwardsSlider />

        {/* مجموعه‌های همکار */}

        <HomeClients />

        {/* ارتباط با ۷ گلدن */}

        <HomeContactForm />

      </PullToRefresh>
    </div>
  );
}
