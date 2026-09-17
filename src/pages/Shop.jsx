import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, ChevronLeft } from 'lucide-react';
import { t } from '@/lib/i18n';
import { getProducts, getCategories } from '@/lib/api/content';
import ProductCard from '@/components/ProductCard';
import LogoLoader from '@/components/LogoLoader';
import PageHero from '@/components/PageHero';
import PullToRefresh from '@/components/PullToRefresh';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';
import { MAIN_PRODUCTS, CERTIFICATES } from '@/lib/corporate-content';
import { Image } from '@/components/ui/image';

/**
 * Products page — the business catalogue.
 * Replaces the old retail shop: no prices, no filters, no cart, no sorting.
 * Three flagship products are presented first, then the rest of the range.
 */
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFA = true;
  const headingFont = 'Peyda, serif';

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats.map(c => ({ ...c, count: prods.filter(p => p.category === c.slug).length })));
    } catch (e) {
      // graceful degradation
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

  if (loading) {
    return <LogoLoader />;
  }

  const imageFor = (slug) => categories.find(c => c.slug === slug)?.image || null;
  const firstProductFor = (slug) => products.find(p => p.category === slug);
  const mainSlugs = MAIN_PRODUCTS.map(p => p.category);
  const otherProducts = products.filter(p => !mainSlugs.includes(p.category));

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <Seo
        title={`${SITE_SEO.siteNameFA} — محصولات: فندق، پسته و بادام`}
        description={SITE_SEO.defaultDescriptionFA}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/shop`}
      />

      <PullToRefresh onRefresh={loadData}>
        {/* ===== HERO ===== */}
        <PageHero
          image="https://7golden.co/wp-content/uploads/2023/08/IMG_2279-scaled-e1693054143453.jpg"
          title={t('products_title')}
          subtitle="پسته، بادام و فندق — تأمین صنعتی برای صنایع غذایی"
          badge={isFA ? 'محصولات' : 'Products'}
        />

        {/* ===== FLAGSHIP PRODUCTS ===== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {MAIN_PRODUCTS.map(product => {
              const image = imageFor(product.category);
              const first = firstProductFor(product.category);
              return (
                <Link
                  key={product.category}
                  to={first ? `/product/${first.id}` : '/shop'}
                  className="group rounded-2xl overflow-hidden block transition-all duration-300 hover:shadow-2xl"
                  style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {image ? (
                      <Image src={image} alt={product.nameFA} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" fittingType="fill" />
                    ) : (
                      <div className="w-full h-full" style={{ background: 'hsl(var(--muted))' }} />
                    )}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }} />
                    <span className="absolute bottom-4 right-4 font-heading font-black text-2xl text-white" style={{ fontFamily: headingFont }}>
                      {product.nameFA}
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="font-subheading text-sm uppercase block mb-2" style={{ color: 'var(--accent)', fontFamily: 'Kalameh, serif' }}>
                      {product.tagline}
                    </span>
                    <dl className="flex flex-col gap-2 mb-4">
                      {product.specs.slice(0, 2).map(spec => (
                        <div key={spec.label} className="flex items-start gap-2">
                          <dt className="font-body text-xs flex-shrink-0 w-20" style={{ color: 'var(--fg-muted)' }}>{spec.label}</dt>
                          <dd className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg)' }}>{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <span className="inline-flex items-center gap-2 font-body text-sm font-semibold transition-all group-hover:gap-3" style={{ color: 'var(--accent)' }}>
                      مشاهده مشخصات کامل
                      <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ===== OTHER PRODUCTS ===== */}
        {otherProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
            <h2 className="font-heading text-lg md:text-2xl font-extrabold mb-5" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
              سایر محصولات
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {otherProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>
        )}

        {/* ===== STANDARDS ===== */}
        <section className="border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <h2 className="font-heading text-lg md:text-xl font-extrabold mb-5" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
              گواهینامه‌ها و استانداردهای صادراتی
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CERTIFICATES.map(item => (
                <div
                  key={item}
                  className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
                  style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}
                >
                  <BadgeCheck size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  <span className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PullToRefresh>

      {/* ---------------------------------------------------------------------
          RETAIL SHOP UI — DISABLED
          The old page had a category chip selector, a sticky toolbar with
          price sorting, a filter sidebar/sheet (ShopFilters) and retail trust
          badges (fast shipping / secure payment / support). All of it is gone
          because 7Golden does not sell online.
          --------------------------------------------------------------------- */}
    </div>
  );
}
