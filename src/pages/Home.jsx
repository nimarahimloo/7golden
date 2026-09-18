import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { t } from '@/lib/i18n';
import { getProducts, getCategories } from '@/lib/api/content';
import LogoLoader from '@/components/LogoLoader';
import { SITE_SEO } from '@/lib/seo';
import ProductCardRound from '@/components/ProductCardRound';
import HeroSlider from '@/components/HeroSlider';
import GoldenEssence from '@/components/GoldenEssence';
import OriginStory from '@/components/OriginStory';
import MainProducts from '@/components/MainProducts';
import ProductionCapacity from '@/components/ProductionCapacity';
import Seo from '@/components/Seo';
import { Image } from '@/components/ui/image';
import { useScrollAnimation } from '@/components/useScrollAnimation';
import PullToRefresh from '@/components/PullToRefresh';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const { ref, visible } = useScrollAnimation();
  return (
    <div ref={ref} className={`fade-up ${visible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Home() {
  const isFA = true;
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      const withCounts = cats.map(c => ({ ...c, count: prods.filter(p => p.category === c.slug).length }));
      setProducts(prods);
      setCategories(withCounts);
    } catch (e) {
      // storefront degrades gracefully to empty sections
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
      {/* ===== HERO — image-led intro ===== */}
      <HeroSlider />

      {/* ===== MAIN PRODUCTS — pistachio, almond, hazelnut ===== */}
      <MainProducts categories={categories} products={products} />

      {/* ===== PRODUCTION & PROCESSING CAPACITY ===== */}
      <ProductionCapacity />

      {/* ===== EXPORT & GLOBAL MARKETS ===== */}
      {/* <ExportMarkets /> */}

      {/* ===== ORIGIN STORY ===== */}
      <OriginStory />

      {/* ===== ALL PRODUCTS ===== */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <span className="eyebrow block mb-3">PRODUCTS</span>
              <h2 className="font-heading text-2xl md:text-4xl font-extrabold" style={{ color: 'var(--ink)', fontFamily: headingFont }}>
                محصولات هفت‌طلایی
              </h2>
            </div>
            <Link to="/shop" className="font-body text-sm flex items-center gap-1 transition-all hover:gap-2 whitespace-nowrap" style={{ color: 'var(--brass)' }}>
              {isFA ? 'مشاهده همه' : 'View All'}
              <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
            </Link>
          </div>
          <hr className="hairline mb-8 md:mb-12" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-9 md:gap-x-10 md:gap-y-14">
            {allProducts.map((product, i) => (
              <AnimatedSection key={product.id} delay={(i % 4) * 100} className="scale-in-wrap">
                <ProductCardRound product={product} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT TEASER — image and name only ===== */}
      <section className="py-14 md:py-20" style={{ background: 'rgba(6, 4, 2, 0.55)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
            <AnimatedSection>
              <div
                className="rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/10]"
                style={{ boxShadow: 'var(--soft-shadow)', border: '1px solid var(--hairline)' }}
              >
                <Image src="https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/2409232f9_generated_image.png" alt="About 7Golden" className="w-full h-full object-cover" fittingType="fill" />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <div>
                <span className="eyebrow block mb-3">COMPANY</span>
                <h2 className="text-2xl md:text-4xl font-extrabold mb-7" style={{ color: 'var(--ink)', fontFamily: headingFont }}>
                  {t('about_title')}
                </h2>
                <hr className="hairline mb-7" />
                <Link to="/about" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-body font-semibold text-sm transition-all hover:scale-105" style={{ background: 'var(--accent)', color: '#0D0D0D' }}>
                  {isFA ? 'بیشتر بدانید' : 'Learn More'}
                  <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      </PullToRefresh>
    </div>
  );
}
