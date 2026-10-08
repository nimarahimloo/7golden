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

const FALLBACK_LINES = [
  { slug: 'pistachio', nameFA: 'پسته', image: '/gallery/AQ8A1516AQ8A1516.webp', descFA: 'مغز و خلال پسته صادراتی' },
  { slug: 'hazelnut', nameFA: 'فندق', image: '/gallery/AQ8A1499AQ8A1499.webp', descFA: 'مغز فندق فرآوری‌شده' },
  { slug: 'almond', nameFA: 'بادام', image: '/gallery/AQ8A1508AQ8A1508.webp', descFA: 'مغز و خلال بادام' },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setProducts(Array.isArray(prods) ? prods : []);
      const fromApi = (cats || []).map((c) => ({
        slug: c.slug || c.id,
        nameFA: c.nameFA || c.name_fa || c.slug,
        descFA: c.descFA || c.desc_fa || '',
        image: c.image || FALLBACK_LINES.find((f) => f.slug === c.slug)?.image || '/logo.webp',
        count: (prods || []).filter((p) => p.category === c.slug).length,
      }));
      setLines(fromApi.length ? fromApi : FALLBACK_LINES.map((f) => ({
        ...f,
        count: (prods || []).filter((p) => p.category === f.slug).length,
      })));
    } catch {
      setLines(FALLBACK_LINES);
      setProducts([]);
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
        description={activeLine?.descFA || hero.subtitle}
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
<h3
                          className="text-2xl md:text-3xl font-semibold"
                          style={{ fontFamily: 'Peyda, serif', color: 'var(--ink, #fff)' }}
                        >
                          {line.nameFA}
                        </h3>
</div>
                    </button>
                  </Reveal>
                ))}
              </div>
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
                  src={activeLine?.image || '/logo.webp'}
                  alt={activeLine?.nameFA || ''}
                  className="absolute inset-0 w-full h-full object-cover"
                  width={1600}
                  height={600}
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
                    style={{ fontFamily: 'Peyda, serif', color: 'var(--ink, #fff)' }}
                  >
                    {activeLine?.nameFA || activeSlug}
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
