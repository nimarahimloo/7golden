// @ts-ignore
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ChevronLeft, Package, Award, Leaf, Boxes, Phone, BadgeCheck, Factory } from 'lucide-react';
import { getProductBySlug, getProducts } from '@/lib/api/content';
import ProductCard from '@/components/ProductCard';
import { Image } from '@/components/ui/image';
import Seo from '@/components/Seo';
import LogoLoader from '@/components/LogoLoader';
import PullToRefresh from '@/components/PullToRefresh';
import { SITE_SEO, productJsonLd } from '@/lib/seo';
import { MAIN_PRODUCTS, CERTIFICATES } from '@/lib/corporate-content';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';
import ParallaxMedia from '@/components/story/ParallaxMedia';
import DepthParallax from '@/components/story/DepthParallax';
import Marquee from '@/components/story/Marquee';
import { useScrollZoom } from '@/components/useScrollZoom';

const CATEGORY_NAMES = {
  hazelnut: 'فندق',
  pistachio: 'پسته',
  almond: 'بادام',
};

export default function ProductDetail() {
  const { id } = useParams();
  // const { addToCart, isStoreMode } = useApp(); // retail cart — disabled
  const isFA = true;
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);

  // Scroll-driven zoom on the main product photo — leans into texture detail.
  const { ref: zoomRef, scale: zoomScale } = useScrollZoom(1.12, 1.0);

  // ---------------------------------------------------------------------------
  // RETAIL PURCHASE STATE — disabled. No quantity, weight or cart on a B2B page.
  // const [qty, setQty] = useState(1);
  // const [selectedWeight, setSelectedWeight] = useState(500);
  // const [added, setAdded] = useState(false);
  // const [showAddBar, setShowAddBar] = useState(false);
  // ---------------------------------------------------------------------------

  const loadData = async () => {
    try {
      const prod = await getProductBySlug(id);
      // @ts-ignore
      setProduct(prod);
      if (prod) {
        // setSelectedWeight(prod.weights?.[1] || prod.weights?.[0] || 500); // retail weight picker — disabled
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

  // Sticky add-to-cart bar trigger — disabled with the retail purchase UI.
  // useEffect(() => {
  //   const onScroll = () => setShowAddBar(window.scrollY > 500);
  //   window.addEventListener('scroll', onScroll, { passive: true });
  //   return () => window.removeEventListener('scroll', onScroll);
  // }, []);

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
  // const weights = product.weights || []; // retail weight picker — disabled

  // Retail add-to-cart handler — disabled
  // const handleAdd = () => {
  //   addToCart(product, qty, selectedWeight);
  //   setAdded(true);
  //   setTimeout(() => setAdded(false), 2000);
  // };

  // @ts-ignore
  const gallery = product.gallery?.length > 0 ? product.gallery : [product.image];

  const seoTitle = isFA
    ? `${name} — ${origin} | ${SITE_SEO.siteNameFA}`
    : `${name} — ${origin} | ${SITE_SEO.siteNameEN}`;
  // @ts-ignore
  const seoDesc = isFA ? product.descFA : product.descEN;

  // Retail trust strip (fast shipping / secure payment / returns) — disabled.
  // const trustItems = [
  //   { icon: Truck, label: 'ارسال سریع', sub: '۳-۵ روز کاری' },
  //   { icon: ShieldCheck, label: 'پرداخت امن', sub: 'درگاه معتبر' },
  //   { icon: RotateCcw, label: 'ضمانت بازگشت', sub: '۷ روز مهلت' },
  // ];

  // Technical specification table — business buyers, no retail attributes.
  // @ts-ignore
  const productSpecs = MAIN_PRODUCTS.find(p => p.category === product.category);
  const specs = [
    { icon: Boxes, label: 'دسته‌بندی', value: CATEGORY_NAMES[product.category] || 'محصول' },
    { icon: MapPin, label: 'خاستگاه', value: origin },
    { icon: Award, label: 'گریدها', value: productSpecs?.specs?.[0]?.value || 'مطابق سفارش مشتری' },
    { icon: Package, label: 'بسته‌بندی', value: productSpecs?.specs?.[1]?.value || 'کیسه صنعتی، فله' },
    { icon: Factory, label: 'ظرفیت تأمین', value: productSpecs?.specs?.[2]?.value || 'طبق قرارداد' },
    { icon: Leaf, label: 'کاربرد صنعتی', value: productSpecs?.specs?.[3]?.value || 'صنایع غذایی' },
  ];

  const liquidGlass = {
    background: 'var(--panel-strong)',
    backdropFilter: 'blur(48px) saturate(240%)',
    WebkitBackdropFilter: 'blur(48px) saturate(240%)',
    border: '1px solid var(--hairline)',
    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)',
  };

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

        {/* Breadcrumb — hidden, kept for reference
        <div className="pt-24 px-4 sm:px-8 lg:px-16 pb-2">
          ...
        </div> */}

        {/* Hero — synced with the scroll-story opening frame */}
        <PageHero
          image={product.image}
          title={name}
          subtitle={origin}
          badge={CATEGORY_NAMES[product.category] || 'محصول'}
        />

        {/* Main PDP */}
        <div className="chapter pt-12 md:pt-16">
          <div className="chapter-shell">
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
                          // @ts-ignore
                          boxShadow: (mainImage || product.image) === img ? '0 0 16px rgba(232,197,71,0.2)' : 'inset 0 1px 1px rgba(255,255,255,0.05)',
                        }}
                      >
                        <Image
                          // @ts-ignore
                          src={img} alt={name} className="w-full h-full object-cover" fittingType="fill" />
                      </button>
                    ))}
                  </div>
                )}
                {/* Main image — scroll-driven zoom reveals texture detail */}
                <div
                  ref={zoomRef}
                  className="flex-1 rounded-3xl overflow-hidden aspect-square relative"
                  style={{ ...liquidGlass, transform: `scale(${zoomScale})`, transition: 'transform 0.18s ease-out' }}
                >
                  <Image
                    // @ts-ignore
                    src={mainImage || product.image} alt={name} className="w-full h-full object-cover" fittingType="fill" />
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
            <div className="flex flex-col gap-5">
              {/* Name */}
              <Reveal variant="up">
                <span className="eyebrow block mb-3">
                  {CATEGORY_NAMES[product.category] || 'محصول'} — {origin}
                </span>
                <h1 className="display-lg leading-tight" style={{ color: 'var(--ink)' }}>
                  <span className="gold-text">{name}</span>
                </h1>
              </Reveal>

              {/* Short description */}
              <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{desc}</p>

              {/* ------------------------------------------------------------------
                  RETAIL PURCHASE UI — DISABLED
                  Price block, weight selector, quantity stepper and the
                  "add to cart" button used to live here. 7Golden sells to
                  businesses, so pricing is handled through the trade desk
                  (see the inquiry panel below) instead of an online cart.
                  ------------------------------------------------------------------ */}

              {/* Business inquiry CTA — the single action on this page */}
              <Reveal variant="up" delay={120}>
              <div className="p-5 rounded-2xl flex flex-col gap-3 panel">
                <div className="flex items-center gap-2">
                  <Phone size={16} style={{ color: 'var(--accent)' }} />
                  <span className="font-heading font-extrabold text-sm" style={{ color: 'var(--fg)' }}>
                    {isFA ? 'برای دریافت پیش‌فاکتور و نمونه تماس بگیرید' : 'Contact us for a quotation and samples'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  <a
                    href="tel:+989121823438"
                    className="flex-1 py-3.5 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ background: 'var(--accent)', color: 'hsl(var(--accent-foreground))', boxShadow: '0 8px 32px rgba(232,197,71,0.3), inset 0 1px 1px rgba(255,255,255,0.2)' }}
                  >
                    <Phone size={16} />
                    {isFA ? 'تماس با واحد بازرگانی' : 'Call the trade desk'}
                  </a>
                  <Link
                    to="/contact"
                    className="flex-1 py-3.5 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--fg)', border: '1px solid var(--hairline)' }}
                  >
                    {isFA ? 'ارسال درخواست همکاری' : 'Send an inquiry'}
                  </Link>
                </div>
              </div>
              </Reveal>

              {/* Technical specifications */}
              <Reveal variant="up" delay={160}>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--hairline)' }}>
                <div className="px-4 py-3" style={{ background: 'rgba(227,194,99,0.07)', borderBottom: '1px solid var(--hairline)' }}>
                  <span className="font-heading font-extrabold text-sm" style={{ color: 'var(--gold-2)', fontFamily: headingFont }}>
                    مشخصات فنی
                  </span>
                </div>
                {specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className="flex items-start gap-3 px-4 py-3"
                    style={{ borderTop: i === 0 ? 'none' : '1px solid var(--hairline)' }}
                  >
                    <spec.icon size={15} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                    <span className="font-body text-xs font-semibold flex-shrink-0 w-24" style={{ color: 'var(--fg-muted)' }}>
                      {spec.label}
                    </span>
                    <span className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg)' }}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              </Reveal>

              {/* Standards strip — replaces the retail shipping/payment badges */}
              <div className="grid grid-cols-2 gap-3 py-4" style={{ borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
                {CERTIFICATES.slice(0, 2).map(item => (
                  <div key={item} className="flex items-start gap-2.5 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--hairline)' }}>
                    <BadgeCheck size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                    <span className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Parallax image band — the product in its natural context ===== */}
          <div className="mt-16 mb-4">
            <StoryChapter
              eyebrow="ORIGIN"
              title="خاستگاه و فرآوری"
              align="center"
              className="mb-10"
            />
            <DepthParallax
              src="/gallery/AQ8A1499AQ8A1499.JPG"
              alt="7Golden orchard"
              ratio="aspect-[4/3] md:aspect-[21/9]"
              className="rounded-3xl"
            >
              <div>
                <span className="eyebrow block mb-2">FROM ORCHARD</span>
                <span className="display-md" style={{ color: 'var(--ink)' }}>از باغستان تا صنعت</span>
              </div>
            </DepthParallax>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl md:text-2xl font-black" style={{ color: 'var(--fg)', fontFamily: headingFont }}>
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

        {/* Sticky mobile add-to-cart bar — retail only, disabled
        {isStoreMode && (
          <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">...</div>
        )} */}

        <Marquee items={CERTIFICATES.map(c => c.split('—')[0].trim())} />
      </div>
    </PullToRefresh >
  );
}
