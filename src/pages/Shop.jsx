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

import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import ParallaxMedia from '@/components/story/ParallaxMedia';
import DepthParallax from '@/components/story/DepthParallax';
import Marquee from '@/components/story/Marquee';
import MaskText from '@/components/story/MaskText';

const BAND_IMAGE = {
  pistachio: '/banner/Hero-Banner-3.jpg',
  almond: '/banner/Hero-banner-2.jpg',
  hazelnut: '/banner/Hero.jpg',
};

/**
 * Products page — the business catalogue, told as a scroll story.
 * Replaces the old retail shop: no prices, no filters, no cart, no sorting.
 * Each flagship product gets its own full-width chapter band.
 */
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFA = true;

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
          image="/banner/Hero-Banner-3.jpg"
          title={t('products_title')}
          subtitle="پسته، بادام و فندق — تأمین صنعتی برای صنایع غذایی"
          badge={isFA ? 'محصولات' : 'Products'}
        />

        {/* ===== FLAGSHIP CHAPTERS — one full band per pillar ===== */}
        {MAIN_PRODUCTS.map((product, i) => {
          const first = firstProductFor(product.category);
          const flipped = i % 2 === 1;
          return (
            <section key={product.category} className="chapter">
              <div className="chapter-shell">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center`}>
                  <Reveal variant={flipped ? 'right' : 'left'} className={flipped ? 'lg:order-2' : ''}>
                    <ParallaxMedia
                      src={BAND_IMAGE[product.category]}
                      alt={product.nameFA}
                      ratio="aspect-[4/3]"
                      className="rounded-3xl"
                    />
                  </Reveal>

                  <div className={flipped ? 'lg:order-1' : ''}>
                    <StoryChapter
                      index={String(i + 1).padStart(2, '0')}
                      eyebrow={product.category.toUpperCase()}
                      title={product.nameFA}
                    />
                    <Reveal delay={140}>
                      <p className="font-body text-sm leading-relaxed mt-6 mb-8" style={{ color: 'var(--fg-muted)' }}>
                        {product.descFA}
                      </p>
                    </Reveal>

                    <Reveal delay={220}>
                      <dl className="flex flex-col gap-0 mb-8" style={{ borderTop: '1px solid var(--hairline)' }}>
                        {product.specs.map(spec => (
                          <div
                            key={spec.label}
                            className="flex items-start gap-4 py-3"
                            style={{ borderBottom: '1px solid var(--hairline)' }}
                          >
                            <dt className="font-body text-xs flex-shrink-0 w-24 pt-0.5" style={{ color: 'var(--fg-muted)' }}>
                              {spec.label}
                            </dt>
                            <dd className="font-body text-sm leading-relaxed" style={{ color: 'var(--fg)' }}>
                              {spec.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </Reveal>

                    <Reveal delay={280}>
                      <Link to={first ? `/product/${first.id}` : '/shop'} className="link-gold">
                        {isFA ? 'مشاهده مشخصات کامل' : 'Full specifications'}
                        <ChevronLeft size={14} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
                      </Link>
                    </Reveal>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* ===== OTHER PRODUCTS ===== */}
        {otherProducts.length > 0 && (
          <section className="chapter" style={{ background: 'rgba(7, 6, 4, 0.5)' }}>
            <div className="chapter-shell">
              <StoryChapter
                eyebrow="RANGE"
                title={isFA ? 'سایر محصولات' : 'Other products'}
                className="mb-10"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                {otherProducts.map((product, i) => (
                  <Reveal key={product.id} delay={(i % 4) * 80} variant="scale">
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== SIGNATURE BAND — image-filled word ===== */}
        <MaskText
          image="/banner/Hero-main.jpg"
          text="EXPORT"
          eyebrow="صادرات · ۱۵+ کشور"
        />

        {/* ===== STANDARDS ===== */}
        <section className="chapter">
          <div className="chapter-shell">
            <StoryChapter
              eyebrow="STANDARDS"
              title={isFA ? 'گواهینامه‌ها و استانداردهای صادراتی' : 'Export standards & certifications'}
              className="mb-10"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {CERTIFICATES.map((item, i) => (
                <Reveal key={item} delay={i * 80}>
                  <div className="gold-frame flex items-start gap-3 px-5 py-5 rounded-2xl h-full panel">
                    <BadgeCheck size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--gold-2)' }} />
                    <span className="font-body text-xs leading-relaxed" style={{ color: 'var(--fg)' }}>{item}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===== DEPTH PARALLAX — the production line speaks ===== */}
        <section className="chapter">
          <div className="chapter-shell">
            <DepthParallax
              src="/gallery/AQ8A1516AQ8A1516.JPG"
              alt="7Golden production"
              ratio="aspect-[4/3] md:aspect-[21/9]"
              className="rounded-3xl"
            >
              <div>
                <span className="eyebrow block mb-2">PRODUCTION</span>
                <span className="display-md" style={{ color: 'var(--ink)' }}>خطوط فرآوری صنعتی</span>
              </div>
            </DepthParallax>
          </div>
        </section>

        {/* ===== B2B INQUIRY CTA ===== */}
        <section className="closing-band" style={{ minHeight: '50vh' }}>
          <div className="closing-band-bg">
            <img src="/banner/Hero-Banner-5.jpg" alt="" />
          </div>
          <div className="relative z-10 chapter-shell py-20 md:py-28">
            <StoryChapter
              eyebrow="TRADE DESK"
              title="درخواست پیش‌فاکتور و نمونه محصول"
              lead="تیم بازرگانی ما آماده ارائه کاتالوگ کامل، نمونه و شرایط صادراتی است."
            />
            <Reveal delay={160} className="mt-10 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-gold">
                {isFA ? 'ارسال درخواست' : 'Send inquiry'}
                <ChevronLeft size={16} style={{ transform: isFA ? 'scaleX(-1)' : 'none' }} />
              </Link>
              <a href="tel:+989121823438" className="btn-ghost">{isFA ? 'تماس مستقیم' : 'Call us'}</a>
            </Reveal>
          </div>
        </section>

        <Marquee items={CERTIFICATES.map(c => c.split('—')[0].trim())} />
      </PullToRefresh>
    </div>
  );
}
