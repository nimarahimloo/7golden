import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { t } from '@/lib/i18n';
import { getProducts, getCategories } from '@/lib/api/content';
import LogoLoader from '@/components/LogoLoader';
import DynamicHeroSlider from '@/components/DynamicHeroSlider';
import PullToRefresh from '@/components/PullToRefresh';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';
import { usePageHero } from '@/lib/usePageHero';
import Reveal from '@/components/story/Reveal';
import ProductTile from '@/components/ProductTile';

// Category card art (kept in sync with the Category rows in the DB seed).
const CATEGORY_IMAGE = {
  pistachio: '/product/pistachio-category.webp',
  hazelnut: '/product/hazelnut-category.webp',
  almond: '/product/almond-category.webp',
};

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSlug = searchParams.get('line') || '';

  const { hero } = usePageHero('shop', {
    image: '/banner/product-nuts-assortment.webp',
    title: t('products_title') || 'محصولات',
    subtitle: 'پسته، بادام و فندق — تأمین صنعتی برای صنایع غذایی',
    badge: 'محصولات',
  });

  const loadData = async () => {
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      const validProducts = Array.isArray(prods) ? prods : [];
      const validCategories = Array.isArray(cats) ? cats : [];
      setProducts(validProducts);
      const fromApi = validCategories
        .map((category) => {
          const slug = category.slug || category.id;
          return {
            slug,
            nameFA: category.nameFA || category.name_fa || slug,
            descFA: category.descFA || category.desc_fa || '',
            image: category.image || CATEGORY_IMAGE[slug] || '/logo-symbol.webp',
            count: validProducts.filter((product) => product.category === slug).length,
          };
        })
        .filter((category) => category.slug && category.nameFA);
      setLines(fromApi);
      setLoadError(false);
    } catch {
      setLines([]);
      setProducts([]);
      setLoadError(true);
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

  const activeLine = useMemo(
    () => lines.find((l) => l.slug === activeSlug) || null,
    [lines, activeSlug],
  );

  const lineProducts = useMemo(() => {
    if (!activeSlug) return [];
    return products.filter((p) => p.category === activeSlug && p.published !== false);
  }, [products, activeSlug]);

  const openLine = (slug) => setSearchParams({ line: slug });
  const backToLines = () => setSearchParams({});

  if (loading) return <LogoLoader />;

  return (
    <div dir="rtl" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Seo
        title={
          activeLine
            ? `${activeLine.nameFA} — ${SITE_SEO.siteNameFA || 'هفت طلایی'}`
            : `محصولات — ${SITE_SEO.siteNameFA || 'هفت طلایی'}`
        }
        description={activeLine?.descFA || hero.subtitle || SITE_SEO.defaultDescriptionFA}
        image={activeLine?.image || hero.image || SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/shop${activeSlug ? `?line=${activeSlug}` : ''}`}
      />

      <PullToRefresh onRefresh={loadData}>
        {!activeSlug && (
          <DynamicHeroSlider pageKey="shop" fallback={{ image: hero?.image || '/banner/Hero.webp', title: hero?.title || '', subtitle: hero?.subtitle || '', badge: hero?.badge || '' }} />
        )}

        {/* ===== مرحله ۱: خطوط محصول ===== */}
        {!activeSlug && (
          <section className="chapter" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
            <div className="chapter-shell">
              <div className="mb-10 md:mb-14 max-w-2xl">
<h2
                  className="display-md"
                  style={{ fontFamily: 'Peyda, serif', color: 'var(--fg)' }}
                >
                  انتخاب خط محصول
                </h2>
</div>

              {lines.length === 0 ? (
                <div className="rounded-3xl panel-strong p-8 md:p-12 text-center" role="status">
                  <h3 className="display-sm mb-3" style={{ color: 'var(--fg)' }}>
                    {loadError ? 'بارگذاری فهرست محصولات انجام نشد.' : 'گروه محصولی برای نمایش ثبت نشده است.'}
                  </h3>
                  <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--fg-muted)' }}>
                    {loadError
                      ? 'برای مشاهده محصولات، لطفاً دوباره تلاش کنید یا از راه‌های تماس با مجموعه استعلام بگیرید.'
                      : 'برای اطلاع از موجودی و شکل‌های قابل‌عرضه محصول، با مجموعه تماس بگیرید.'}
                  </p>
                  <Link to="/contact" className="btn-gold inline-flex">تماس و استعلام محصول</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                  {lines.map((line, i) => (
                    <Reveal key={line.slug} delay={i * 90}>
                      <button
                        type="button"
                        onClick={() => openLine(line.slug)}
                        className="group relative w-full text-right overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.01]"
                        style={{
                          background: 'var(--card, var(--bg))',
                          boxShadow: 'var(--shadow-sm, none)',
                          minHeight: '320px',
                        }}
                      >
                        <div className="absolute inset-0">
                          <img
                            src={line.image}
                            alt={line.nameFA}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                            width={800}
                            height={1000}
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                'linear-gradient(to top, rgba(7,6,4,0.92) 0%, rgba(7,6,4,0.35) 45%, rgba(7,6,4,0.15) 100%)',
                            }}
                          />
                        </div>
                        <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8 min-h-[320px]">
                          <h3 className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Peyda, serif', color: '#fff' }}>
                            {line.nameFA}
                          </h3>
                        </div>
                      </button>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ===== مرحله ۲: محصولات همان خط ===== */}
        {activeSlug && (
          <section className="chapter" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="chapter-shell">
              <button
                type="button"
                onClick={backToLines}
                className="inline-flex items-center gap-2 mb-8 font-body text-sm transition-opacity hover:opacity-80"
                style={{ color: 'var(--fg-muted)' }}
              >
                <ArrowRight size={16} />
                بازگشت به خطوط محصول
              </button>

              <div className="relative overflow-hidden rounded-3xl mb-12 min-h-[200px] md:min-h-[280px]">
                <img
                  src={activeLine?.image || '/logo-symbol.webp'}
                  alt={activeLine?.nameFA || ''}
                  className="absolute inset-0 w-full h-full object-cover"
                  width={1600}
                  height={600}
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to left, rgba(7,6,4,0.85), rgba(7,6,4,0.4))',
                  }}
                />
                <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end min-h-[200px] md:min-h-[280px]">
<h1
                    className="display-md"
                    style={{ fontFamily: 'Peyda, serif', color: '#fff' }}
                  >
                    {activeLine?.nameFA || 'گروه محصول پیدا نشد'}
                  </h1>
                  {activeLine?.descFA ? (
                    <p
                      className="font-body text-sm mt-3 max-w-xl leading-relaxed"
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                      {activeLine.descFA}
                    </p>
                  ) : null}
                </div>
              </div>

              {lineProducts.length === 0 ? (
                <p className="font-body text-center py-16" style={{ color: 'var(--fg-muted)' }}>
                  هنوز محصولی در این گروه ثبت نشده است.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                  {lineProducts.map((product, i) => (
                    <Reveal key={product.slug || product.id} delay={(i % 4) * 70}>
                      <ProductTile product={product} />
                    </Reveal>
                  ))}
                </div>
              )}

              <div className="mt-16 text-center">
                <Link to="/contact" className="btn-gold inline-flex items-center gap-2">
                  درخواست پیش‌فاکتور و نمونه
                  <ChevronLeft size={16} style={{ transform: 'scaleX(-1)' }} />
                </Link>
              </div>
            </div>
          </section>
        )}
      </PullToRefresh>
    </div>
  );
}
