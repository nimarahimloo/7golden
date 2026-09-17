import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, CreditCard, Headphones, ChevronLeft } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { getProducts, getCategories, getGalleryImages } from '@/lib/api/content';
import LogoLoader from '@/components/LogoLoader';
import { SITE_SEO } from '@/lib/seo';
import ProductCard from '@/components/ProductCard';
import HeroSlider from '@/components/HeroSlider';
import OriginStory from '@/components/OriginStory';
import ProductionGallery from '@/components/ProductionGallery';
import PromoBanner from '@/components/PromoBanner';
import Seo from '@/components/Seo';
import { Image } from '@/components/ui/image';
import { useScrollAnimation } from '@/components/useScrollAnimation';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const { ref, visible } = useScrollAnimation();
  return (
    <div ref={ref} className={`fade-up ${visible ? 'visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Home() {
  const { lang, dir } = useApp();
  const isFA = lang === 'fa';
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const subFont = isFA ? 'Kalameh, serif' : 'Georgia, serif';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [prods, cats, gallery] = await Promise.all([
          getProducts(),
          getCategories(),
          getGalleryImages(),
        ]);
        if (!active) return;
        const withCounts = cats.map(c => ({ ...c, count: prods.filter(p => p.category === c.slug).length }));
        setProducts(prods);
        setCategories(withCounts);
        setGalleryImages(gallery);
      } catch (e) {
        // storefront degrades gracefully to empty sections
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const featuredProducts = products.filter(p => p.featured);
  const allProducts = products.slice(0, 8);

  const trustBadges = [
    { icon: Truck, key: 'trust_1_title', descKey: 'trust_1_desc' },
    { icon: ShieldCheck, key: 'trust_2_title', descKey: 'trust_2_desc' },
    { icon: CreditCard, key: 'trust_3_title', descKey: 'trust_3_desc' },
    { icon: Headphones, key: 'trust_4_title', descKey: 'trust_4_desc' },
  ];

  if (loading) {
    return <LogoLoader />;
  }

  return (
    <div dir={dir} style={{ background: 'var(--bg)' }}>

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

      {/* ===== HERO SLIDER — Cinematic full-screen ===== */}
      <HeroSlider />

      {/* ===== TRUST BADGES ===== */}
      <section className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {trustBadges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-5 px-3"
                style={{ borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 glass-luxury">
                  <badge.icon size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <div className="font-body font-semibold text-xs" style={{ color: 'var(--fg)' }}>{t(lang, badge.key)}</div>
                  <div className="font-body text-[10px]" style={{ color: 'var(--fg-muted)' }}>{t(lang, badge.descKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-lg md:text-2xl font-extrabold" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
              {t(lang, 'categories_title')}
            </h2>
            <Link to="/shop" className="font-body text-xs flex items-center gap-1 transition-all hover:gap-2" style={{ color: 'var(--accent)' }}>
              {isFA ? 'مشاهده همه' : 'View All'}
              <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-5">
            {categories.map((cat, i) => (
              <AnimatedSection key={cat.slug} delay={i * 80}>
                <Link to={`/shop?category=${cat.slug}`} className="group relative rounded-xl overflow-hidden aspect-square md:aspect-[4/3] block transition-all duration-300 hover:shadow-lg" style={{ boxShadow: 'var(--shadow)' }}>
                  <Image src={cat.image} alt={isFA ? cat.nameFA : cat.nameEN} className="w-full h-full object-cover" fittingType="fill" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
                  <div className="absolute bottom-0 p-3 md:p-4 w-full">
                    <h3 className="font-heading font-extrabold text-white text-sm md:text-lg mb-0.5" style={{ fontFamily: headingFont }}>
                      {isFA ? cat.nameFA : cat.nameEN}
                    </h3>
                    <span className="font-body text-[10px] text-white/70">{cat.count} {t(lang, 'cat_products')}</span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNER 1 ===== */}
      <PromoBanner
        image="https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/04ad74413_generated_image.png"
        badge="ارسال رایگان"
        title="ارسال رایگان به سراسر ایران"
        subtitle="برای سفارش‌های بالای ۵۰۰٬۰۰۰ تومان — تحویل ۲۴ تا ۴۸ ساعته"
        cta="مشاهده محصولات"
        to="/shop"
      />

      {/* ===== PRODUCTION GALLERY ===== */}
      <ProductionGallery images={galleryImages} />

      {/* ===== ORIGIN STORY ===== */}
      <OriginStory />

      {/* ===== ALL PRODUCTS ===== */}
      <section className="pb-8 md:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-lg md:text-2xl font-extrabold" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
              {t(lang, 'products_title')}
            </h2>
            <Link to="/shop" className="font-body text-xs flex items-center gap-1 transition-all hover:gap-2" style={{ color: 'var(--accent)' }}>
              {isFA ? 'مشاهده همه' : 'View All'}
              <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {allProducts.map((product, i) => (
              <AnimatedSection key={product.id} delay={(i % 4) * 80}>
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
                <span className="font-subheading text-xs uppercase block mb-2" style={{ color: 'var(--accent)', fontFamily: subFont }}>
                  {t(lang, 'about_sub')}
                </span>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-4" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                  {t(lang, 'about_title')}
                </h2>
                <p className="font-body text-sm leading-relaxed mb-5" style={{ color: 'var(--fg-muted)' }}>
                  {t(lang, 'about_body')}
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

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden">
        <img src="https://media.base44.com/images/public/6a9ea5d67a95141fb1f84b4a/4e88900f9_generated_image.png" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ animation: 'kenBurns 10s ease-out forwards' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%)' }} />
        <div className="relative z-10 py-14 md:py-20 text-center px-4">
          <span className="font-subheading text-xs uppercase block mb-3 tracking-wider" style={{ color: '#D4AF37', fontFamily: subFont }}>
            {isFA ? 'هفت طلایی' : '7Golden'}
          </span>
          <h2 className="font-heading text-2xl md:text-5xl font-black text-white mb-4 gold-text-glow" style={{ fontFamily: headingFont }}>
            {isFA ? 'همین امروز سفارش دهید' : 'Order Today'}
          </h2>
          <p className="font-body text-white/70 text-sm mb-7 max-w-md mx-auto">
            {isFA ? 'ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان' : 'Free shipping on orders over 500,000 IRR'}
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-body font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl gold-border-luxury" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.95), rgba(184,148,42,0.95))', color: '#0D0D0D' }}>
            {t(lang, 'shop')}
            <ChevronLeft size={16} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
          </Link>
        </div>
      </section>
    </div>
  );
}