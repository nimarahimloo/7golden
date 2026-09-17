import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Check, Minus, Plus, Truck, ShieldCheck, RotateCcw, MapPin, ChevronLeft, Package, Award, Leaf, Boxes, Phone, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { getProductBySlug, getProducts } from '@/lib/api/content';
import ProductCard from '@/components/ProductCard';
import ProductTabs from '@/components/ProductTabs';
import { Image } from '@/components/ui/image';
import Seo from '@/components/Seo';
import LogoLoader from '@/components/LogoLoader';
import { SITE_SEO, productJsonLd, breadcrumbJsonLd } from '@/lib/seo';

const CATEGORY_NAMES = {
  hazelnut: 'فندق',
  pistachio: 'پسته',
  almond: 'بادام',
};

function TasteBar({ label, value }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>{label}</span>
        <span className="font-body text-xs font-bold" style={{ color: 'var(--accent)' }}>{value}٪</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)' }}>
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, background: 'linear-gradient(90deg, #D4AF37, #C09B25)', boxShadow: '0 0 12px rgba(212,175,55,0.3)' }} />
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { lang, dir, addToCart, isStoreMode } = useApp();
  const isFA = lang === 'fa';
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(500);
  const [added, setAdded] = useState(false);
  const [showAddBar, setShowAddBar] = useState(false);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const prod = await getProductBySlug(id);
        if (!active) return;
        setProduct(prod);
        if (prod) {
          setSelectedWeight(prod.weights?.[1] || prod.weights?.[0] || 500);
          setMainImage(prod.image);
          const allProds = await getProducts();
          if (!active) return;
          setRelated(allProds.filter(p => p.id !== prod.id && p.category === prod.category).slice(0, 4));
        }
      } catch (e) {
        // graceful
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    const onScroll = () => setShowAddBar(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) {
    return <LogoLoader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <p className="font-body text-lg mb-4" style={{ color: 'var(--fg-muted)' }}>محصول یافت نشد</p>
          <Link to="/shop" className="font-body text-sm" style={{ color: 'var(--accent)' }}>بازگشت به فروشگاه</Link>
        </div>
      </div>
    );
  }

  const name = isFA ? product.nameFA : product.nameEN;
  const desc = isFA ? product.descFA : product.descEN;
  const origin = isFA ? product.originFA : product.originEN;
  const weights = product.weights || [];

  const handleAdd = () => {
    addToCart(product, qty, selectedWeight);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const gallery = product.gallery?.length > 0 ? product.gallery : [product.image];

  const seoTitle = isFA
    ? `${name} — ${origin} | ${SITE_SEO.siteNameFA}`
    : `${name} — ${origin} | ${SITE_SEO.siteNameEN}`;
  const seoDesc = isFA ? product.descFA : product.descEN;

  const trustItems = [
    { icon: Truck, label: 'ارسال سریع', sub: '۳-۵ روز کاری' },
    { icon: ShieldCheck, label: 'پرداخت امن', sub: 'درگاه معتبر' },
    { icon: RotateCcw, label: 'ضمانت بازگشت', sub: '۷ روز مهلت' },
  ];

  const specs = [
    { icon: Package, label: 'نوع محصول', value: 'خشکبار' },
    { icon: Boxes, label: 'دسته‌بندی', value: CATEGORY_NAMES[product.category] || 'خشکبار' },
    { icon: MapPin, label: 'خاستگاه', value: origin },
    { icon: Award, label: 'کیفیت', value: 'درجه یک' },
    { icon: Leaf, label: 'نوع کشت', value: 'ارگانیک' },
    { icon: Truck, label: 'بسته‌بندی', value: 'بهداشتی' },
  ];

  const liquidGlass = {
    background: 'rgba(18,18,18,0.38)',
    backdropFilter: 'blur(48px) saturate(240%)',
    WebkitBackdropFilter: 'blur(48px) saturate(240%)',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)',
  };

  const tabs = [
    {
      label: 'توضیحات',
      content: (
        <div className="p-5 rounded-2xl" style={liquidGlass}>
          <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{desc}</p>
        </div>
      ),
    },
    {
      label: 'مشخصات',
      content: (
        <div className="p-5 rounded-2xl overflow-hidden" style={liquidGlass}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <spec.icon size={14} style={{ color: 'var(--accent)' }} />
                </div>
                <span className="font-body text-xs flex-1" style={{ color: 'var(--fg-muted)' }}>{spec.label}</span>
                <span className="font-body text-xs font-bold" style={{ color: 'var(--fg)' }}>{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: 'پروفایل طعم',
      content: (
        <div className="p-5 rounded-2xl" style={liquidGlass}>
          <TasteBar label="طعم مغزی" value={product.taste?.nutty || 0} />
          <TasteBar label="شیرینی" value={product.taste?.sweet || 0} />
          <TasteBar label="طعم زمینی" value={product.taste?.earthy || 0} />
          <TasteBar label="تلخی" value={product.taste?.bitter || 0} />
        </div>
      ),
    },
    {
      label: 'ارزش غذایی',
      content: (
        <div className="p-5 rounded-2xl" style={liquidGlass}>
          <p className="font-body text-xs mb-4" style={{ color: 'var(--fg-muted)' }}>ارزش غذایی هر ۱۰۰ گرم:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'کالری', val: '۶۲۸', unit: 'کیلوکالری' },
              { label: 'پروتئین', val: '۱۵', unit: 'گرم' },
              { label: 'چربی', val: '۶۱', unit: 'گرم' },
              { label: 'کربوهیدرات', val: '۱۷', unit: 'گرم' },
            ].map((n, i) => (
              <div key={i} className="p-4 rounded-xl text-center" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="font-heading font-black text-xl" style={{ color: 'var(--accent)', fontFamily: headingFont }}>{n.val}</div>
                <div className="font-body text-[10px] mt-0.5" style={{ color: 'var(--fg-muted)' }}>{n.unit}</div>
                <div className="font-body text-xs font-semibold mt-1" style={{ color: 'var(--fg)' }}>{n.label}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div dir={dir} style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <Seo
        title={seoTitle}
        description={seoDesc}
        image={product.image}
        type="product"
        canonical={`${SITE_SEO.baseUrl}/product/${product.slug || product.id}`}
        jsonLd={productJsonLd(product, lang)}
      />

      {/* Breadcrumb */}
      <div className="pt-24 px-4 sm:px-8 lg:px-16 pb-2">
        <div className="flex items-center gap-2 font-body text-xs glass-pill inline-flex px-3 py-1.5 rounded-full" style={{ color: 'var(--fg-muted)' }}>
          <Link to="/" style={{ color: 'var(--fg-muted)' }}>{t(lang, 'home')}</Link>
          <span style={{ color: 'var(--fg-muted)' }}>/</span>
          <Link to="/shop" style={{ color: 'var(--fg-muted)' }}>{t(lang, 'shop')}</Link>
          <span style={{ color: 'var(--fg-muted)' }}>/</span>
          <span style={{ color: 'var(--fg)' }} className="truncate">{name}</span>
        </div>
      </div>

      {/* Main PDP */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left: Image Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex gap-4">
              {/* Desktop vertical thumbnails */}
              {gallery.length > 1 && (
                <div className="hidden lg:flex flex-col gap-3">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(img)}
                      className="w-20 h-20 rounded-2xl overflow-hidden cursor-pointer transition-all"
                      style={{
                        border: (mainImage || product.image) === img ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.06)',
                        opacity: (mainImage || product.image) === img ? 1 : 0.5,
                        background: 'rgba(0,0,0,0.2)',
                        boxShadow: (mainImage || product.image) === img ? '0 0 16px rgba(212,175,55,0.2)' : 'inset 0 1px 1px rgba(255,255,255,0.05)',
                      }}
                    >
                      <Image src={img} alt={name} className="w-full h-full object-cover" fittingType="fill" />
                    </button>
                  ))}
                </div>
              )}
              {/* Main image */}
              <div
                className="flex-1 rounded-3xl overflow-hidden aspect-square relative"
                style={liquidGlass}
              >
                <Image src={mainImage || product.image} alt={name} className="w-full h-full object-cover" fittingType="fill" />
              </div>
            </div>
            {/* Mobile horizontal thumbnails */}
            {gallery.length > 1 && (
              <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden cursor-pointer transition-all"
                    style={{
                      border: (mainImage || product.image) === img ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.06)',
                      opacity: (mainImage || product.image) === img ? 1 : 0.5,
                      background: 'rgba(0,0,0,0.2)',
                    }}
                  >
                    <Image src={img} alt={name} className="w-full h-full object-cover" fittingType="fill" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-5">
            {/* Badge & Name */}
            <div>
              {product.badge && (
                <span className="font-body text-xs px-3 py-1 rounded-full mb-3 inline-block" style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))', boxShadow: '0 4px 16px rgba(212,175,55,0.2)' }}>
                  {product.badge}
                </span>
              )}
              <h1 className="font-heading text-2xl md:text-4xl font-black leading-tight" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                {name}
              </h1>
            </div>

            {/* Short description */}
            <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{desc}</p>

            {/* Store mode: Price + Weight + Quantity + Add to cart */}
            {isStoreMode ? (
              <>
                {/* Price */}
                <div className="p-4 rounded-2xl" style={liquidGlass}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-black" style={{ color: 'var(--accent)', fontFamily: headingFont }}>
                      {product.priceDisplay}
                    </span>
                    <span className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>تومان / کیلو</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="glass-pill font-body text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1" style={{ color: '#22c55e' }}>
                      <Check size={10} /> موجود در انبار
                    </span>
                  </div>
                </div>

                {/* Weight selector */}
                {weights.length > 0 && (
                  <div>
                    <label className="font-body text-xs font-semibold mb-2.5 block" style={{ color: 'var(--fg)' }}>
                      انتخاب وزن: {selectedWeight >= 1000 ? `${selectedWeight / 1000} کیلوگرم` : `${selectedWeight} گرم`}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {weights.map(w => (
                        <button
                          key={w}
                          onClick={() => setSelectedWeight(w)}
                          className="px-5 py-3 rounded-xl font-body text-sm font-semibold transition-all"
                          style={{
                            background: selectedWeight === w ? 'var(--accent)' : 'rgba(0,0,0,0.2)',
                            color: selectedWeight === w ? 'hsl(var(--accent-foreground))' : 'var(--fg)',
                            border: selectedWeight === w ? 'none' : '1px solid rgba(255,255,255,0.06)',
                            boxShadow: selectedWeight === w ? '0 4px 16px rgba(212,175,55,0.2), inset 0 1px 1px rgba(255,255,255,0.2)' : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                          }}
                        >
                          {w >= 1000 ? `${w / 1000} ${t(lang, 'kg')}` : `${w} ${t(lang, 'gr')}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity + Add to cart */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-2xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center transition-colors hover:bg-white/5" style={{ color: 'var(--fg)' }}>
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-body font-black text-sm" style={{ color: 'var(--fg)' }}>{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="w-12 h-12 flex items-center justify-center transition-colors hover:bg-white/5" style={{ color: 'var(--accent)' }}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={handleAdd}
                    disabled={!product.inStock}
                    className="flex-1 py-4 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    style={{
                      background: added ? 'rgba(34,197,94,0.15)' : 'var(--accent)',
                      color: added ? '#22c55e' : 'hsl(var(--accent-foreground))',
                      border: added ? '1px solid rgba(34,197,94,0.3)' : 'none',
                      boxShadow: added ? 'none' : '0 8px 32px rgba(212,175,55,0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
                    }}
                  >
                    {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                    {added ? 'افزوده شد' : t(lang, 'add_to_cart')}
                  </button>
                </div>
              </>
            ) : (
              /* Corporate mode: Inquiry CTA */
              <div className="p-5 rounded-2xl flex flex-col gap-3" style={liquidGlass}>
                <div className="flex items-center gap-2">
                  <Phone size={16} style={{ color: 'var(--accent)' }} />
                  <span className="font-heading font-extrabold text-sm" style={{ color: 'var(--fg)' }}>
                    {isFA ? 'برای استعلام قیمت و سفارش تماس بگیرید' : 'Contact us for pricing and orders'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  <a
                    href="tel:+989121823438"
                    className="flex-1 py-3.5 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))', boxShadow: '0 8px 32px rgba(212,175,55,0.3), inset 0 1px 1px rgba(255,255,255,0.2)' }}
                  >
                    <Phone size={16} />
                    {isFA ? 'تماس تلفنی' : 'Call Us'}
                  </a>
                  <Link
                    to="/contact"
                    className="flex-1 py-3.5 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--fg)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {isFA ? 'ارسال درخواست' : 'Send Inquiry'}
                  </Link>
                </div>
              </div>
            )}

            {/* Trust badges — glass pills */}
            <div className="grid grid-cols-3 gap-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {trustItems.map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <item.icon size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <span className="font-body text-xs font-semibold" style={{ color: 'var(--fg)' }}>{item.label}</span>
                  <span className="font-body text-[10px]" style={{ color: 'var(--fg-muted)' }}>{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-12">
          <ProductTabs tabs={tabs} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl md:text-2xl font-black" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
                {isFA ? 'محصولات مشابه' : 'Related Products'}
              </h2>
              <Link to="/shop" className="font-body text-xs flex items-center gap-1 transition-all hover:gap-2" style={{ color: 'var(--accent)' }}>
                {isFA ? 'مشاهده همه' : 'View All'}
                <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add Bar (mobile only) — store mode only */}
      {isStoreMode && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 lg:hidden"
          style={{
            transform: showAddBar ? 'translateY(0)' : 'translateY(100%)',
            background: 'rgba(13,13,13,0.52)',
            backdropFilter: 'blur(56px) saturate(260%)',
            WebkitBackdropFilter: 'blur(56px) saturate(260%)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '0.75rem 1rem',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 -8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              <span className="font-body text-[10px] truncate" style={{ color: 'var(--fg-muted)' }}>{name}</span>
              <span className="font-heading font-black text-sm" style={{ color: 'var(--accent)', fontFamily: headingFont }}>
                {product.priceDisplay} ت
              </span>
            </div>
            <button
              onClick={handleAdd}
              className="flex-shrink-0 px-6 py-3 rounded-full font-body font-semibold text-sm flex items-center gap-2 transition-all hover:scale-105"
              style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))', boxShadow: '0 4px 16px rgba(212,175,55,0.3), inset 0 1px 1px rgba(255,255,255,0.2)' }}
            >
              <ShoppingBag size={16} />
              {t(lang, 'add_to_cart')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}