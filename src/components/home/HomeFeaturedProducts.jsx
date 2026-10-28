import { Link } from 'react-router-dom';
import { ChevronLeft, ArrowUpLeft } from 'lucide-react';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import { MAIN_PRODUCTS, SPECIALTY_PRODUCTS } from '@/lib/corporate-content';

const CATEGORY_IMAGES = {
  pistachio: '/product/qazvin-pistachio-nuts.webp',
  almond: '/banner/tray-pistachio-almond.webp',
  hazelnut: '/product/brain-hazelnut.webp',
};

/**
 * Home products block — Maison de Noix:
 * 1) Three flagship categories as large image cards (asymmetric)
 * 2) Specialty grades in a calm grid
 * 3) Clear path to /shop and /contact
 */
export default function HomeFeaturedProducts({ section = {}, products = [] }) {
  const title = section.title_fa || 'محصولات هفت طلایی';
  const lead =
    section.subtitle_fa ||
    'سه گروه اصلی — فندق، پسته و بادام — در شکل‌های مختلف فرآوری برای صنایع غذایی.';
  const badge = section.badge_fa || 'مجموعه محصولات';

  const firstProductId = (slug) => {
    const match = products.find(
      (p) => p.category === slug && p.published !== false,
    );
    return match ? match.slug || match.id : null;
  };

  return (
    <section className="chapter home-featured-products" aria-label="محصولات هفت طلایی">
      <div className="chapter-shell">
        <StoryChapter
          index="04"
          eyebrow={badge}
          title={title}
          lead={lead}
          className="mb-10 md:mb-14"
        />

        {/* Asymmetric category showcase */}
        <div className="home-cat-mosaic">
          {MAIN_PRODUCTS.map((item, index) => {
            const href = firstProductId(item.category)
              ? `/product/${firstProductId(item.category)}`
              : `/shop?category=${item.category}`;
            const image = CATEGORY_IMAGES[item.category] || '/banner/banner-four-bowls.webp';
            const sizeClass =
              index === 0
                ? 'home-cat-card home-cat-card--hero'
                : 'home-cat-card home-cat-card--side';

            return (
              <Reveal key={item.category} delay={index * 80} className={sizeClass}>
                <Link to={href} className="home-cat-link group">
                  <div className="home-cat-media">
                    <img
                      src={image}
                      alt={item.nameFA}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <span className="home-cat-scrim" aria-hidden="true" />
                  </div>
                  <div className="home-cat-copy">
                    <span className="home-cat-eyebrow">{item.category}</span>
                    <h3>{item.nameFA}</h3>
                    <p>{item.tagline}</p>
                    <span className="home-cat-cta">
                      مشاهده
                      <ArrowUpLeft size={15} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Specialty grades */}
        <div className="mt-14 md:mt-16">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span
                className="block text-xs tracking-[0.16em] mb-2"
                style={{
                  color: 'var(--gold-2)',
                  fontFamily: "'Kalameh', system-ui, sans-serif",
                }}
              >
                گریدهای شاخص
              </span>
              <h3
                className="text-xl md:text-2xl font-bold"
                style={{
                  color: 'var(--fg)',
                  fontFamily: "'Peyda', system-ui, sans-serif",
                }}
              >
                انتخاب‌های پرکاربرد تولید
              </h3>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm transition-colors"
              style={{
                color: 'var(--fg-muted)',
                fontFamily: "'Kalameh', system-ui, sans-serif",
              }}
            >
              همه محصولات
              <ChevronLeft size={15} />
            </Link>
          </div>

          <div className="home-specialty-grid">
            {SPECIALTY_PRODUCTS.map((item, index) => (
              <Reveal key={item.key} delay={index * 70}>
                <Link to="/shop" className="home-specialty-card group">
                  <div className="home-specialty-media">
                    <img
                      src={item.image}
                      alt={item.nameFA}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="home-specialty-body">
                    <span>{item.grade}</span>
                    <strong>{item.nameFA}</strong>
                    <p>{item.desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 md:mt-14">
          <Link to="/shop" className="btn-gold">
            ورود به فهرست محصولات
            <ChevronLeft size={16} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border px-6 py-2.5 text-sm transition-colors"
            style={{
              borderColor: 'var(--hairline)',
              color: 'var(--fg)',
              fontFamily: "'Kalameh', system-ui, sans-serif",
            }}
          >
            استعلام قیمت
          </Link>
        </div>
      </div>
    </section>
  );
}
