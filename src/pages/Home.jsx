import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { t } from '@/lib/i18n';
import { getProducts, getCategories, getGalleryImages } from '@/lib/api/content';
import LogoLoader from '@/components/LogoLoader';
import { SITE_SEO } from '@/lib/seo';
import ProductCard from '@/components/ProductCard';
import HeroSlider from '@/components/HeroSlider';
import GoldenEssence from '@/components/GoldenEssence';
import OriginStory from '@/components/OriginStory';
import MainProducts from '@/components/MainProducts';
import ProductionCapacity from '@/components/ProductionCapacity';
import ExportMarkets from '@/components/ExportMarkets';
import BusinessCTA from '@/components/BusinessCTA';
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
  const subFont = isFA ? 'Kalameh, serif' : 'Georgia, serif';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [prods, cats, gallery] = await Promise.all([
        getProducts(),
        getCategories(),
        getGalleryImages(),
      ]);
      const withCounts = cats.map(c => ({ ...c, count: prods.filter(p => p.category === c.slug).length }));
      setProducts(prods);
      setCategories(withCounts);
      setGalleryImages(gallery);
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

      <PullToRefresh onRefresh={loadData}>
      {/* ===== HERO SLIDER — Cinematic full-screen ===== */}
      <HeroSlider />

      {/* ===== GOLDEN ESSENCE — 3D luxury showcase ===== */}
      <GoldenEssence />

      {/* ===== MAIN PRODUCTS — pistachio, almond, hazelnut ===== */}
      <MainProducts categories={categories} products={products} />

      {/* ===== PRODUCTION & PROCESSING CAPACITY ===== */}
      <ProductionCapacity />

      {/* ===== EXPORT & GLOBAL MARKETS ===== */}
      {/* <ExportMarkets /> */}

      {/* ===== ORIGIN STORY ===== */}
      <OriginStory />

      {/* ===== ALL PRODUCTS ===== */}
      <section className="pb-8 md:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-lg md:text-2xl font-extrabold" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
              محصولات هفت‌طلایی
            </h2>
            <Link to="/shop" className="font-body text-sm flex items-center gap-1 transition-all hover:gap-2" style={{ color: 'var(--accent)' }}>
              {isFA ? 'مشاهده همه' : 'View All'}
              <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {allProducts.map((product, i) => (
              <AnimatedSection key={product.id} delay={(i % 4) * 100} className="scale-in-wrap">
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT TEASER ===== */}
      <section className="py-10 md:py-14" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
            <AnimatedSection>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/10]">
                <Image src="https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/2409232f9_generated_image.png" alt="About 7Golden" className="w-full h-full object-cover" fittingType="fill" />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <div>
                <span className="font-subheading text-sm uppercase block mb-2">
                  {t('about_sub')}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
                  {t('about_title')}
                </h2>
                <p className="font-body text-sm leading-relaxed mb-5" style={{ color: 'var(--fg-muted)' }}>
                  {t('about_body')}
                </p>
                <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body font-semibold text-sm transition-all hover:scale-105" style={{ border: '1.5px solid var(--accent)', color: 'var(--accent)' }}>
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