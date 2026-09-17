import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Truck, ShieldCheck, CreditCard, Headphones, SlidersHorizontal, X, ChevronLeft, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { getProducts, getCategories } from '@/lib/api/content';
import ProductCard from '@/components/ProductCard';
import LogoLoader from '@/components/LogoLoader';
import ShopFilters from '@/components/ShopFilters';
import PageHero from '@/components/PageHero';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';

export default function Shop() {
  const { lang, dir } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ priceRanges: [], inStock: false, featured: false });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFA = lang === 'fa';
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
        if (!active) return;
        setProducts(prods);
        setCategories(cats.map(c => ({ ...c, count: prods.filter(p => p.category === c.slug).length })));
      } catch (e) {
        // graceful degradation
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const activeCategory = searchParams.get('category') || 'all';
  const activeCat = categories.find(c => c.id === activeCategory);

  const setCategory = (cat) => {
    if (cat === 'all') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    if (filters.priceRanges.length > 0) {
      list = list.filter(p => filters.priceRanges.some(r => p.price >= r.min && p.price < r.max));
    }
    if (filters.inStock) list = list.filter(p => p.inStock);
    if (filters.featured) list = list.filter(p => p.featured);
    if (sort === 'price_low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price_high') list.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') list.reverse();
    return list;
  }, [products, activeCategory, sort, filters]);

  const sortOptions = [
    { value: 'popular', label: t(lang, 'popular') },
    { value: 'price_low', label: t(lang, 'price_low') },
    { value: 'price_high', label: t(lang, 'price_high') },
    { value: 'newest', label: t(lang, 'newest') },
  ];

  const trustBadges = [
    { icon: Truck, key: 'trust_1_title', descKey: 'trust_1_desc' },
    { icon: ShieldCheck, key: 'trust_2_title', descKey: 'trust_2_desc' },
    { icon: CreditCard, key: 'trust_3_title', descKey: 'trust_3_desc' },
    { icon: Headphones, key: 'trust_4_title', descKey: 'trust_4_desc' },
  ];

  const heroImage = activeCat
    ? activeCat.image
    : 'https://7golden.co/wp-content/uploads/2023/08/IMG_2279-scaled-e1693054143453.jpg';
  const heroTitle = activeCat ? (isFA ? activeCat.nameFA : activeCat.nameEN) : t(lang, 'shop');
  const heroDesc = activeCat ? (isFA ? activeCat.descFA : activeCat.descEN) : (isFA ? 'مجموعه کامل محصولات هفت‌طلایی' : 'The complete 7Golden collection');

  const activeFilterCount = filters.priceRanges.length + (filters.inStock ? 1 : 0) + (filters.featured ? 1 : 0);

  if (loading) {
    return <LogoLoader />;
  }

  return (
    <div dir={dir} style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <Seo
        title={lang === 'fa' ? `${SITE_SEO.siteNameFA} — فروشگاه خشکبار` : `${SITE_SEO.siteNameEN} — Shop`}
        description={lang === 'fa' ? SITE_SEO.defaultDescriptionFA : SITE_SEO.defaultDescriptionEN}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/shop`}
      />

      {/* ===== HERO ===== */}
      <PageHero
        image={heroImage}
        title={heroTitle}
        subtitle={heroDesc}
        badge={isFA ? 'فروشگاه' : 'Shop'}
      />

      {/* ===== CATEGORY CARDS — Visual selector ===== */}
      <section className="px-4 sm:px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {/* "All" card */}
            <button
              onClick={() => setCategory('all')}
              className="flex-shrink-0 w-28 sm:w-36 rounded-2xl overflow-hidden transition-all relative group"
              style={{
                border: activeCategory === 'all' ? '2px solid var(--accent)' : '1px solid var(--border)',
                opacity: activeCategory === 'all' ? 1 : 0.7,
                boxShadow: activeCategory === 'all' ? '0 0 20px rgba(212,175,55,0.25)' : 'none',
              }}
            >
              <div className="aspect-square relative" style={{ background: activeCategory === 'all' ? 'rgba(212,175,55,0.12)' : 'hsl(var(--muted))' }}>
                {activeCategory === 'all' && (
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(212,175,55,0.15) 0%, transparent 70%)' }} />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-3xl font-extrabold" style={{ color: 'var(--accent)', fontFamily: headingFont }}>
                    {products.length}
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-2 text-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                  <span className="font-body text-xs font-semibold text-white">{t(lang, 'all')}</span>
                </div>
              </div>
            </button>
            {/* Category cards */}
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className="flex-shrink-0 w-28 sm:w-36 rounded-2xl overflow-hidden transition-all relative group"
                style={{
                  border: activeCategory === cat.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                  opacity: activeCategory === cat.id ? 1 : 0.85,
                  boxShadow: activeCategory === cat.id ? '0 0 20px rgba(212,175,55,0.25)' : 'none',
                }}
              >
                <div className="aspect-square relative">
                  <img src={cat.image} alt={isFA ? cat.nameFA : cat.nameEN} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                  {activeCategory === cat.id && (
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, transparent 50%, rgba(212,175,55,0.15) 100%)' }} />
                  )}
                  <div className="absolute bottom-0 inset-x-0 p-2 text-center">
                    <span className="font-heading text-xs sm:text-sm font-extrabold text-white block" style={{ fontFamily: headingFont }}>
                      {isFA ? cat.nameFA : cat.nameEN}
                    </span>
                    <span className="font-body text-[10px] text-white/70">{cat.count} {t(lang, 'cat_products')}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STICKY TOOLBAR ===== */}
      <div className="sticky top-16 z-30" style={{ background: 'hsl(var(--card))', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-body text-sm font-extrabold" style={{ color: 'var(--fg)' }}>
              {filtered.length}
            </span>
            <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>
              {isFA ? 'محصول' : 'products'}
            </span>
            {activeCategory !== 'all' && activeCat && (
              <button
                onClick={() => setCategory('all')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full font-body text-xs font-semibold transition-all hover:scale-105"
                style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--accent)', border: '1px solid rgba(212,175,55,0.3)' }}
              >
                {isFA ? activeCat.nameFA : activeCat.nameEN}
                <X size={12} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-full font-body text-xs font-semibold transition-all relative"
              style={{ background: 'hsl(var(--muted))', color: 'var(--fg)', border: '1px solid var(--border)' }}
            >
              <SlidersHorizontal size={14} />
              {isFA ? 'فیلتر' : 'Filter'}
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-body text-[9px] font-extrabold" style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
            {/* Sort dropdown */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-3 py-2 rounded-full font-body text-xs font-semibold outline-none cursor-pointer"
              style={{ background: 'hsl(var(--muted))', color: 'var(--fg)', border: '1px solid var(--border)' }}
            >
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ===== MAIN: Sidebar + Grid ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 p-5 rounded-2xl" style={{ background: 'hsl(var(--card))', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <SlidersHorizontal size={16} style={{ color: 'var(--accent)' }} />
                <h2 className="font-body font-extrabold text-sm" style={{ color: 'var(--fg)' }}>
                  {isFA ? 'فیلترها' : 'Filters'}
                </h2>
              </div>
              <ShopFilters lang={lang} filters={filters} setFilters={setFilters} categories={categories} activeCategory={activeCategory} onCategoryChange={setCategory} />
            </div>
          </aside>

          {/* Product grid */}
          <div>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filtered.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'hsl(var(--muted))' }}>
                  <SlidersHorizontal size={28} style={{ color: 'var(--fg-muted)' }} />
                </div>
                <p className="font-body text-base mb-2" style={{ color: 'var(--fg)' }}>
                  {isFA ? 'محصولی با این فیلترها یافت نشد' : 'No products match these filters'}
                </p>
                <button
                  onClick={() => { setFilters({ priceRanges: [], inStock: false, featured: false }); setCategory('all'); }}
                  className="font-body text-sm font-semibold py-2 px-5 rounded-full transition-all"
                  style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))' }}
                >
                  {isFA ? 'پاک کردن همه' : 'Clear all'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== MOBILE FILTER SHEET ===== */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" dir={dir}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className={`absolute bottom-0 inset-x-0 rounded-t-3xl max-h-[80vh] flex flex-col ${isFA ? '' : ''}`} style={{ background: 'var(--bg)' }}>
            {/* Handle */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border)' }} />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="font-heading text-lg font-extrabold" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                {isFA ? 'فیلترها' : 'Filters'}
              </h2>
              <button onClick={() => setMobileFilterOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'hsl(var(--muted))' }}>
                <X size={16} style={{ color: 'var(--fg)' }} />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <ShopFilters lang={lang} filters={filters} setFilters={setFilters} categories={categories} activeCategory={activeCategory} onCategoryChange={setCategory} />
            </div>
            {/* Footer */}
            <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 rounded-2xl font-body font-semibold text-sm transition-all"
                style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))' }}
              >
                {isFA ? `نمایش ${filtered.length} محصول` : `Show ${filtered.length} products`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TRUST BADGES ===== */}
      <section className="border-t" style={{ background: 'hsl(var(--card))', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {trustBadges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2 px-3"
                style={{ borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'hsl(var(--muted))' }}>
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
    </div>
  );
}