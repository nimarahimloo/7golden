import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getProducts, getCategories } from '@/lib/api/content';
import { getPageHero, getPageSections } from '@/lib/api/content';
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
import MaskText from '@/components/story/MaskText';
import ExportProcess from '@/components/story/ExportProcess';
import HomeOrigin from '@/components/home/HomeOrigin';
import HomeClients from '@/components/home/HomeClients';
import HomeAwardsSlider from '@/components/home/HomeAwardsSlider';

import { MAIN_PRODUCTS, CAPACITY_STATS, FALLBACK_PRODUCTS } from '@/lib/corporate-content';

// Full-bleed frames for the three flagship chapters — each uses a different
// gallery/banner photo so no two scenes repeat.
const DEFAULT_SCENE_IMAGE = {
  pistachio: '/banner/pistachio-kernels.webp',
  almond: '/gallery/AQ8A1516AQ8A1516.webp',
  hazelnut: '/banner/hazelnut-spoon.webp',
};

export default function Home() {
  const isFA = true;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [heroConfig, setHeroConfig] = useState(null);
  const [sectionMap, setSectionMap] = useState({});
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
    getPageHero('home').then(s => setHeroConfig(s)).catch(() => {});
    getPageSections('home').then(list => {
      const map = {};
      (list || []).forEach(s => {
        const k = String(s.section_key || '').trim().toLowerCase();
        if (k) map[k] = s;
      });
      setSectionMap(map);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      await loadData();
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const allProducts = products.slice(0, 8);
  const sec = (key) => sectionMap[key] || {};
  const SCENE_IMAGE = {
    pistachio: sec('scene_pistachio').image || DEFAULT_SCENE_IMAGE.pistachio,
    almond: sec('scene_almond').image || DEFAULT_SCENE_IMAGE.almond,
    hazelnut: sec('scene_hazelnut').image || DEFAULT_SCENE_IMAGE.hazelnut,
  };


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
          image={heroConfig?.image || "/banner/tray-pistachio-almond.webp"}
          eyebrow={heroConfig?.badge_fa || "EST. ۱۳۷۷ · QAZVIN"}
          title={heroConfig?.title_fa || "تولید، فرآوری و صادرات"}
          titleAccent="فندق، پسته و بادام"
          lead={heroConfig?.subtitle_fa || "مغز و خلال پسته، بادام و فندق برای کارخانه‌های شکلات، قنادی و بستنی — مستقیم از باغ، با کنترل کیفی آزمایشگاهی و تحویل زمان‌بندی‌شده."}
          stats={CAPACITY_STATS}
          primary={{ label: isFA ? 'درخواست قیمت و نمونه' : 'Request a quote', href: '/contact' }}
          secondary={{ label: isFA ? 'مشاهده محصولات' : 'View products', href: '/shop' }}
        />
{/* ===== CHAPTER 02 — industrial scale ===== */}
        <section className="chapter">
          <div className="chapter-shell">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <ParallaxMedia
                src={sec('capacity').image || "/banner/img-6052.webp"}
                alt="7Golden production"
                ratio="aspect-[4/3]"
                className="rounded-3xl"
              />

              <div>
                <StoryChapter
                  index="02"
                  eyebrow={sec('capacity').badge_fa || "CAPACITY"}
                  title={sec('capacity').title_fa || "مقیاس صنعتی، تحویل زمان‌بندی‌شده"}
                  lead="ظرفیت یعنی اطمینان از اینکه سفارش عمده شما سر موعد و با همان کیفیتِ نمونه تحویل می‌شود، نه فقط یک عدد روی کاغذ."
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

        {/* ===== CHAPTER 03 — why direct sourcing wins (trust + CTA) ===== */}
        <HomeOrigin />

        {/* ===== SIGNATURE BAND — image-filled word ===== */}
        <MaskText
          image={sec('products').image || "/gallery/AQ8A1505AQ8A1505.webp"}
          text="7GOLDEN"
          eyebrow="EST. ۱۳۷۷ · QAZVIN"
        />

        {/* ===== PRODUCTS — simple, no background cards ===== */}
        <section className="chapter pb-0">
          <div className="chapter-shell">
            <div className="flex items-end justify-between gap-4 mb-10">
              <StoryChapter
                index="۰۴"
                eyebrow="PRODUCTS"
                title="محصولات هفت‌طلایی"
                lead="نمونه‌ای از کاتالوگ ما. وارد صفحه هر محصول شوید تا شرح کامل، بسته‌بندی و مشخصات فنی را ببینید و پیش‌فاکتور بخواهید."
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
                  <Link to={`/product/${product.id}`} className="block group">
                    {/* Simple card — no background, image speaks */}
                    <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
                      <img
                        src={product.image}
                        alt={product.nameFA}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                      {/* Minimal gradient only at bottom for readability */}
                      <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: 'linear-gradient(to top, rgba(7,6,4,0.92), transparent)' }} />
                      <div className="absolute bottom-0 right-0 left-0 p-4">
                        <span className="display-sm block" style={{ color: 'var(--ink)', fontFamily: 'Peyda, serif', fontWeight: 600 }}>
                          {product.nameFA}
                        </span>
                        <span className="font-body text-xs block mt-1" style={{ color: 'var(--gold-2)', fontFamily: 'Kalameh, serif', fontWeight: 500 }}>
                          {product.category.toUpperCase()}
                        </span>
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

        {/* ===== EXPORT BAND — focused on export with gallery photo ===== */}
        <MaskText
          image={sec('export_band').image || "/gallery/AQ8A1571AQ8A1571.webp"}
          text={sec('export_band').title_fa || "EXPORT"}
          eyebrow={sec('export_band').badge_fa || "صادرات بین‌المللی"}
        />

        {/* ===== CHAPTER 06 — the export journey (pinned process rail) ===== */}
        <section className="chapter pb-0">
          <div className="chapter-shell">
            <StoryChapter
              index="۰۵"
              eyebrow="PROCESS"
              title="از باغستان تا مقصد صادراتی"
              lead="مسیر یک سفارش عمده در پنج گام شفاف: از برداشت و فرآوری تا کنترل کیفیت، بسته‌بندی و تحویل."
            />
          </div>
        </section>
        <ExportProcess />

        {/* ===== CHAPTER 06 — awards & honors (full-view slider) ===== */}
        <HomeAwardsSlider />

        {/* ===== CHAPTER 07 — featured buyers brand slider ===== */}
        <HomeClients />

      </PullToRefresh>
    </div>
  );
}
