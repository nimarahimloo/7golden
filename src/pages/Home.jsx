import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getProducts, getCategories } from '@/lib/api/content';
import LogoLoader from '@/components/LogoLoader';
import { SITE_SEO } from '@/lib/seo';
import GoldenEssence from '@/components/GoldenEssence';
import Seo from '@/components/Seo';
import PullToRefresh from '@/components/PullToRefresh';

import CinematicHero from '@/components/CinematicHero';
import StickyScene from '@/components/story/StickyScene';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import ParallaxMedia from '@/components/story/ParallaxMedia';
import CountUp from '@/components/story/CountUp';
import Marquee from '@/components/story/Marquee';
import DepthParallax from '@/components/story/DepthParallax';
import MaskText from '@/components/story/MaskText';
import ExportProcess from '@/components/story/ExportProcess';

import { MAIN_PRODUCTS, CAPACITY_STATS, EXPORT_MARKETS, FALLBACK_PRODUCTS } from '@/lib/corporate-content';

// Full-bleed frames for the three flagship chapters of the scroll story.
const SCENE_IMAGE = {
  pistachio: '/banner/Hero-Banner-3.jpg',
  almond: '/banner/Hero-banner-2.jpg',
  hazelnut: '/banner/Hero.jpg',
};

export default function Home() {
  const isFA = true;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const timeout = new Promise((_, reject) => setTimeout(() => reject('timeout'), 6000));
    try {
      const [prods, cats] = await Promise.race([
        Promise.all([getProducts(), getCategories()]),
        timeout,
      ]);
      const finalProds = prods.length > 0 ? prods : FALLBACK_PRODUCTS;
      const withCounts = cats.map(c => ({ ...c, count: finalProds.filter(p => p.category === c.slug).length }));
      setProducts(finalProds);
      setCategories(withCounts);
    } catch (e) {
      // storefront degrades gracefully to fallback data
      setProducts(FALLBACK_PRODUCTS);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      await loadData();
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const allProducts = products.slice(0, 8);

  if (loading) {
    return <LogoLoader />;
  }

  const linkFor = (slug) => {
    const first = products.find(p => p.category === slug);
    return first ? `/product/${first.id}` : '/shop';
  };

  // Minimal scene items — image speaks, copy stays to eyebrow + title
  const sceneItems = MAIN_PRODUCTS.map((product) => ({
    key: product.category,
    eyebrow: product.category.toUpperCase(),
    title: product.nameFA,
    image: SCENE_IMAGE[product.category],
    href: linkFor(product.category),
    cta: isFA ? 'مشاهده محصول' : 'View product',
  }));

  return (
    <div dir="rtl" style={{ position: 'relative', zIndex: 1 }}>

      <Seo
        title={isFA ? SITE_SEO.defaultTitleFA : SITE_SEO.defaultTitleEN}
        description={isFA ? SITE_SEO.defaultDescriptionFA : SITE_SEO.defaultDescriptionEN}
        image={SITE_SEO.ogImage}
        canonical={SITE_SEO.baseUrl + '/'}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_SEO.siteNameEN,
          url: SITE_SEO.baseUrl,
          inLanguage: isFA ? 'fa' : 'en',
        }}
      />

      {/* ===== AMBIENT 3D GOLD BACKDROP — fixed behind the whole page ===== */}
      <GoldenEssence />

      <PullToRefresh onRefresh={loadData}>

        {/* ===== OPENING FRAME — full-height cinematic hero ===== */}
        <CinematicHero
          eyebrow=""
          title="تولید، فرآوری و صادرات"
          titleAccent="فندق، پسته و بادام"
          stats={CAPACITY_STATS}
          primary={{ label: isFA ? 'مشاهده محصولات' : 'View products', href: '/shop' }}
          secondary={{ label: isFA ? 'درخواست مشاوره' : 'Request a quote', href: '/contact' }}
        />

        {/* ===== EXPORT MARKETS — endless gold band ===== */}
        <Marquee items={EXPORT_MARKETS} />

        {/* ===== CHAPTER 01 — the three pillars, stepped through on vertical scroll ===== */}
        <StoryChapter
          index="01"
          eyebrow="MAIN PRODUCTS"
          title="سه ستون تولید هفت‌طلایی"
          align="start"
          className="chapter-shell pt-20 md:pt-28 pb-4"
        />
        <StickyScene items={sceneItems} />

        {/* ===== CHAPTER 02 — industrial scale ===== */}
        <section className="chapter">
          <div className="chapter-shell">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <ParallaxMedia
                src="/gallery/AQ8A1516AQ8A1516.JPG"
                alt="7Golden production"
                ratio="aspect-[4/3]"
                className="rounded-3xl"
              />

              <div>
                <StoryChapter
                  index="02"
                  eyebrow="CAPACITY"
                  title="مقیاس صنعتی، تحویل زمان‌بندی‌شده"
                />
                <div className="grid grid-cols-2 gap-x-6 gap-y-8 mt-10">
                  {CAPACITY_STATS.map((stat, i) => (
                    <Reveal key={stat.label} delay={i * 90}>
                      <div className="flex items-baseline gap-1.5">
                        <CountUp value={stat.value} className="display-md" style={{ color: 'var(--gold-2)' }} />
                        <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>{stat.unit}</span>
                      </div>
                      <span className="font-body text-xs block mt-1.5" style={{ color: 'var(--fg-muted)' }}>{stat.label}</span>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CHAPTER 03 — origin story (multi-layer depth parallax) ===== */}
        <section className="chapter">
          <div className="chapter-shell">
            <StoryChapter
              index="03"
              eyebrow="ORIGIN"
              title="از باغستان قزوین و اشنویه، بدون واسطه"
              align="center"
              className="mb-12 md:mb-16"
            />
            <DepthParallax
              src="/banner/Hero-main.jpg"
              alt="Iranian orchards"
              ratio="aspect-[4/3] md:aspect-[21/9]"
              className="rounded-3xl"
            >
              <div>
                <span className="eyebrow block mb-2">SINCE 1998</span>
                <span className="display-md" style={{ color: 'var(--ink)' }}>تأمین مستقیم از کشاورز</span>
              </div>
            </DepthParallax>

            <Reveal delay={120} className="mt-12 text-center">
              <Link to="/about" className="btn-ghost">
                {isFA ? 'داستان هفت‌طلایی' : 'Our story'}
                <ChevronLeft size={16} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ===== SIGNATURE BAND — image-filled word ===== */}
        <MaskText
          image="/banner/Hero-main.jpg"
          text="7GOLDEN"
          eyebrow="EST. ۱۳۷۷ · QAZVIN"
        />

        {/* ===== CHAPTER 04 — the full range (vertical parallax grid) ===== */}
        <section className="chapter pb-0">
          <div className="chapter-shell">
            <div className="flex items-end justify-between gap-4 mb-10">
              <StoryChapter
                index="04"
                eyebrow="PRODUCTS"
                title="محصولات هفت‌طلایی"
                className="flex-1"
              />
              <Link to="/shop" className="link-gold hidden md:inline-flex">
                {isFA ? 'مشاهده همه' : 'View all'}
                <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
              </Link>
            </div>
          </div>
        </section>

        <section className="chapter pt-0">
          <div className="chapter-shell">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {allProducts.map((product, i) => (
                <Reveal key={product.id} delay={(i % 4) * 80} variant="up">
                  <Link to={`/product/${product.id}`} className="block h-full">
                    <div className="film-card h-full" style={{ aspectRatio: '3 / 4' }}>
                      <div className="film-card-image absolute inset-0">
                        <img
                          src={product.image}
                          alt={product.nameFA}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="film-card-overlay" />
                      <div className="film-card-content">
                        <span className="eyebrow block mb-1">{product.category.toUpperCase()}</span>
                        <span className="display-sm" style={{ color: 'var(--ink)' }}>{product.nameFA}</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200} className="mt-10 text-center md:hidden">
              <Link to="/shop" className="btn-ghost">
                {isFA ? 'مشاهده همه' : 'View all'}
                <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ===== CHAPTER 05 — the export journey (pinned process rail) ===== */}
        <section className="chapter pb-0">
          <div className="chapter-shell">
            <StoryChapter
              index="05"
              eyebrow="PROCESS"
              title="از باغستان تا مقصد صادراتی"
            />
          </div>
        </section>
        <ExportProcess />

        {/* ===== CLOSING FRAME ===== */}
        <section className="closing-band" style={{ minHeight: '62vh' }}>
          <div className="closing-band-bg">
            <img src="/banner/Hero-main.jpg" alt="" />
          </div>
          <div className="relative z-10 chapter-shell py-24 md:py-32">
            <StoryChapter
              eyebrow="CONTACT"
              title="شریک صادراتی شما در صنعت خشکبار"
            />
            <Reveal delay={160} className="mt-10 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-gold">
                {isFA ? 'درخواست مشاوره' : 'Request a quote'}
                <ChevronLeft size={16} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
              </Link>
              <Link to="/shop" className="btn-ghost">{isFA ? 'مشاهده محصولات' : 'View products'}</Link>
            </Reveal>
          </div>
        </section>

      </PullToRefresh>
    </div>
  );
}
