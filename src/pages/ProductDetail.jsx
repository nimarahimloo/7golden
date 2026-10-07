// @ts-ignore
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ChevronLeft, Package, Award, Leaf, Boxes, Phone, BadgeCheck, Factory, CheckCircle2 } from 'lucide-react';
import { getProductBySlug, getProducts } from '@/lib/api/content';
import ProductCard from '@/components/ProductCard';
import { Image } from '@/components/ui/image';
import Seo from '@/components/Seo';
import LogoLoader from '@/components/LogoLoader';
import PullToRefresh from '@/components/PullToRefresh';
import { SITE_SEO, productJsonLd } from '@/lib/seo';
import { MAIN_PRODUCTS, CERTIFICATES } from '@/lib/corporate-content';
import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';
import DepthParallax from '@/components/story/DepthParallax';
import Marquee from '@/components/story/Marquee';
import { getPackagingOptions } from '@/lib/product-facts';

const CATEGORY_NAMES = {
  hazelnut: 'فندق',
  pistachio: 'پسته',
  almond: 'بادام',
};

// Full-bleed gallery images for the origin band — different per category
const ORIGIN_IMAGES = {
  hazelnut: '/gallery/AQ8A1499AQ8A1499.webp',
  pistachio: '/gallery/AQ8A1516AQ8A1516.webp',
  almond: '/gallery/AQ8A1524AQ8A1524.webp',
};

export default function ProductDetail() {
  const { id } = useParams();
  const isFA = true;
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const bodyFont = isFA ? 'YekanBakh, sans-serif' : 'system-ui, sans-serif';

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);

  const loadData = async () => {
    try {
      const prod = await getProductBySlug(id);
      // @ts-ignore
      setProduct(prod);
      if (prod) {
        setMainImage(prod.image);
        const allProds = await getProducts();
        // @ts-ignore
        setRelated(allProds.filter(p => p.id !== prod.id && p.category === prod.category).slice(0, 4));
      }
    } catch (e) {
      // graceful
    }
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      await loadData();
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return <LogoLoader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <p className="font-body text-lg mb-4" style={{ color: 'var(--fg-muted)' }}>محصول یافت نشد</p>
          <Link to="/shop" className="font-body text-sm" style={{ color: 'var(--accent)' }}>بازگشت به محصولات</Link>
        </div>
      </div>
    );
  }

  // @ts-ignore
  const name = isFA ? product.nameFA : product.nameEN;
  // @ts-ignore
  const desc = isFA ? product.descFA : product.descEN;
  // @ts-ignore
  const origin = isFA ? product.originFA : product.originEN;
  // @ts-ignore
  const gallery = product.gallery?.length > 0 ? product.gallery : [product.image];

  const seoTitle = isFA
    ? `${name} — ${origin} | ${SITE_SEO.siteNameFA}`
    : `${name} — ${origin} | ${SITE_SEO.siteNameEN}`;
  // @ts-ignore
  const seoDesc = isFA ? product.descFA : product.descEN;

  return (
    <PullToRefresh onRefresh={loadData}>
      <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>

        <Seo
          title={seoTitle}
          description={seoDesc}
          // @ts-ignore
          image={product.image}
          type="product"
          // @ts-ignore
          canonical={`${SITE_SEO.baseUrl}/product/${product.slug || product.id}`}
          jsonLd={productJsonLd(product)}
        />

        {/* Main PDP — starts right under the header so the name, description,
            specs and quote CTA are all visible without scrolling past a hero. */}
        <div className="chapter" style={{ paddingTop: 'clamp(7rem, 12vw, 9.5rem)' }}>
          <div className="chapter-shell">
            {/* Breadcrumb */}
            <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-2 mb-8 font-body text-xs" style={{ color: '#fff' }}>
              <Link to="/" className="transition-opacity hover:opacity-70">خانه</Link>
              <ChevronLeft size={12} style={{ color: 'var(--gold-2)' }} />
              <Link to="/shop" className="transition-opacity hover:opacity-70">محصولات</Link>
              <ChevronLeft size={12} style={{ color: 'var(--gold-2)' }} />
              <Link to={`/shop#${product.category}`} className="transition-opacity hover:opacity-70">
                {CATEGORY_NAMES[product.category] || 'محصول'}
              </Link>
              <ChevronLeft size={12} style={{ color: 'var(--gold-2)' }} />
              <span style={{ color: 'var(--gold-2)' }}>{name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

              {/* Left: Image Gallery */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="flex gap-4">
                  {/* Desktop vertical thumbnails */}
                  {gallery.length > 1 && (
                    <div className="hidden lg:flex flex-col gap-3">
                      {gallery.map((
                        // @ts-ignore
                        img, i) => (
                        <button
                          key={i}
                          onClick={() => setMainImage(img)}
                          className="w-20 h-20 rounded-2xl overflow-hidden cursor-pointer transition-all"
                          style={{
                            // @ts-ignore
                            border: (mainImage || product.image) === img ? '2px solid var(--accent)' : '1px solid var(--hairline)',
                            // @ts-ignore
                            opacity: (mainImage || product.image) === img ? 1 : 0.5,
                            background: 'rgba(0,0,0,0.2)',
                          }}
                        >
                          <Image
                            // @ts-ignore
                            src={img} alt={name} className="w-full h-full object-cover" fittingType="fill" />
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Main image — large and clean */}
                  <div
                    className="flex-1 rounded-3xl overflow-hidden aspect-square relative"
                    style={{
                      background: 'var(--panel-strong)',
                      border: '1px solid var(--hairline)',
                    }}
                  >
                    <div className="absolute inset-0">
                      <Image
                        // @ts-ignore
                        src={mainImage || product.image} alt={name} className="w-full h-full object-cover" fittingType="fill" />
                    </div>
                  </div>
                </div>
                {/* Mobile horizontal thumbnails */}
                {gallery.length > 1 && (
                  <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                    {gallery.map((
                      // @ts-ignore
                      img, i) => (
                      <button
                        key={i}
                        onClick={() => setMainImage(img)}
                        className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden cursor-pointer transition-all"
                        style={{
                          // @ts-ignore
                          border: (mainImage || product.image) === img ? '2px solid var(--accent)' : '1px solid var(--hairline)',
                          // @ts-ignore
                          opacity: (mainImage || product.image) === img ? 1 : 0.5,
                          background: 'rgba(0,0,0,0.2)',
                        }}
                      >
                        <Image
                          // @ts-ignore
                          src={img} alt={name} className="w-full h-full object-cover" fittingType="fill" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="flex flex-col gap-6">
                {/* Name + description */}
                <Reveal variant="up">
                  <span className="eyebrow block mb-3">
                    {CATEGORY_NAMES[product.category] || 'محصول'} — {origin}
                  </span>
                  <h1 className="display-lg leading-tight" style={{ color: 'var(--ink)' }}>
                    <span className="gold-text">{name}</span>
                  </h1>
                </Reveal>

                {/* Full product description — plain markup so it is never hidden */}
                {desc && (
                  <p className="font-body text-base md:text-lg leading-loose" style={{ color: '#fff' }}>
                    {desc}
                  </p>
                )}

                {/* Business inquiry CTA */}
                <Reveal variant="up" delay={120}>
                  <div className="p-5 rounded-2xl panel">
                    <div className="flex items-center gap-2 mb-3">
                      <Phone size={16} style={{ color: 'var(--accent)' }} />
                      <span className="font-heading font-extrabold text-sm" style={{ color: 'var(--fg)', fontFamily: headingFont, fontWeight: 700 }}>
                        {isFA ? 'برای دریافت پیش‌فاکتور و نمونه تماس بگیرید' : 'Contact us for a quotation and samples'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="tel:+989121823438"
                        className="flex-1 py-3.5 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        style={{ background: 'var(--accent)', color: '#14100A', boxShadow: '0 8px 32px rgba(212,175,55,0.3)' }}
                      >
                        <Phone size={16} />
                        {isFA ? 'تماس با بازرگانی' : 'Call the trade desk'}
                      </a>
                      <Link
                        to="/contact"
                        className="flex-1 py-3.5 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--fg)', border: '1px solid var(--hairline-strong)' }}
                      >
                        {isFA ? 'درخواست همکاری' : 'Send an inquiry'}
                      </Link>
                    </div>
                  </div>
                </Reveal>


                {/* Standards strip */}
                <div className="grid grid-cols-1 gap-3 py-4" style={{ borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
                  {CERTIFICATES.slice(0, 2).map(item => (
                    <div key={item} className="flex items-start gap-2.5 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--hairline)' }}>
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                      <span className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== Per-product facts: uses, pack sizes, taste ===== */}
{/* ===== Full-bleed origin band with gallery image ===== */}
{/* Related Products */}
            {related.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl md:text-2xl font-black" style={{ color: 'var(--fg)', fontFamily: headingFont, fontWeight: 800 }}>
                    {isFA ? 'سایر محصولات' : 'Other Products'}
                  </h2>
                  <Link to="/shop" className="font-body text-xs flex items-center gap-1 transition-all hover:gap-2" style={{ color: 'var(--accent)' }}>
                    {isFA ? 'مشاهده همه' : 'View All'}
                    <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                  {related.map(p => <ProductCard key={p.
                    // @ts-ignore
                    id} product={p} />)}
                </div>
              </div>
            )}
          </div>
        </div>

        <Marquee items={CERTIFICATES.map(c => c.split('—')[0].trim())} />
      </div>
    </PullToRefresh >
  );
}
