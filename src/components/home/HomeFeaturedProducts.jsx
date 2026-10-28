import { Link } from 'react-router-dom';
import { ChevronLeft, ArrowUpLeft, RefreshCw, PackageSearch } from 'lucide-react';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';

const CATEGORY_LABELS = { pistachio: 'پسته', hazelnut: 'فندق', almond: 'بادام' };

const CATEGORY_IMAGES = {
  pistachio: '/product/pistachio-category.webp',
  hazelnut: '/product/hazelnut-category.webp',
  almond: '/product/almond-category.webp',
};

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const toPersianDigits = (value) =>
  String(value).replace(/[0-9]/g, (digit) => FA_DIGITS[Number(digit)]);

// Product descriptions are sometimes stored as HTML-escaped rich text. Cards need
// short plain-text summaries, not raw markup or an entire article.
function cleanCardDescription(value, maxLength = 150) {
  if (typeof value !== 'string') return '';

  const plainText = value
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) return plainText;
  const clipped = plainText.slice(0, maxLength).replace(/\s+\S*$/, '').trim();
  return `${clipped || plainText.slice(0, maxLength).trim()}…`;
}

function CatalogStatus({ kind, onRetry }) {
  const content = {
    loading: {
      title: 'در حال دریافت اطلاعات محصولات…',
      detail: 'فهرست با اطلاعات منتشرشده در سامانه به‌روز می‌شود.',
    },
    error: {
      title: 'دریافت فهرست محصولات با مشکل روبه‌رو شد.',
      detail: 'برای دیدن اطلاعات دقیق و موجودی روز دوباره تلاش کنید یا با واحد فروش تماس بگیرید.',
    },
    empty: {
      title: 'در حال حاضر محصول منتشرشده‌ای برای نمایش نیست.',
      detail: 'برای بررسی امکان تأمین و دریافت قیمت، درخواست خود را برای واحد فروش بفرستید.',
    },
  }[kind];

  return (
    <div className="home-catalog-status" role={kind === 'error' ? 'alert' : 'status'} aria-live="polite">
      <span className="home-catalog-status-icon" aria-hidden="true">
        <PackageSearch size={23} />
      </span>
      <div className="min-w-0 flex-1">
        <strong>{content.title}</strong>
        <p>{content.detail}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {kind === 'error' && (
          <button type="button" onClick={onRetry} className="home-catalog-retry">
            <RefreshCw size={14} />
            تلاش دوباره
          </button>
        )}
        <Link to="/contact" className="home-catalog-contact">
          استعلام
          <ChevronLeft size={15} />
        </Link>
      </div>
    </div>
  );
}

export default function HomeFeaturedProducts({
  section = {},
  categories = [],
  products = [],
  categoryStatus = 'loading',
  productStatus = 'loading',
  onRetry,
}) {
  const title = section.title_fa || 'محصولات هفت طلایی';
  const lead =
    section.subtitle_fa ||
    'گروه‌های محصول و کالاهای منتشرشده را ببینید؛ برای مشخصات سفارش، بسته‌بندی و قیمت روز با واحد فروش هماهنگ کنید.';
  const badge = section.badge_fa || 'فهرست محصولات';

  const publishedProducts = products.filter((product) => product && product.published !== false);
  const highlightedProducts = [
    ...publishedProducts.filter((product) => product.featured),
    ...publishedProducts.filter((product) => !product.featured),
  ].slice(0, 3);

  return (
    <section className="chapter home-featured-products" aria-label="محصولات هفت طلایی">
      <div className="chapter-shell">
        <StoryChapter
          index="۰۱"
          eyebrow={badge}
          title={title}
          lead={lead}
          className="mb-10 md:mb-14"
        />

        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <span className="home-products-kicker">گروه‌های محصول</span>
            <h3 className="home-products-heading">انتخاب گروه موردنیاز</h3>
          </div>
          <Link to="/shop" className="home-products-all">
            همه محصولات
            <ChevronLeft size={16} />
          </Link>
        </div>

        {categoryStatus === 'loading' ? (
          <div className="home-catalog-status" role="status" aria-live="polite">
            <span className="home-catalog-status-icon" aria-hidden="true"><PackageSearch size={23} /></span>
            <div className="min-w-0 flex-1">
              <strong>در حال دریافت گروه‌های محصول…</strong>
              <p>اطلاعات دسته‌بندی از سامانه خوانده می‌شود.</p>
            </div>
          </div>
        ) : categoryStatus === 'error' ? (
          <CatalogStatus kind="error" onRetry={onRetry} />
        ) : categories.length === 0 ? (
          <CatalogStatus kind="empty" onRetry={onRetry} />
        ) : (
          <div className="home-cat-mosaic">
            {categories.map((category, index) => {
              const slug = category.slug || category.id;
              const image = category.image || CATEGORY_IMAGES[slug];
              const count = publishedProducts.filter((product) => product.category === slug).length;
              const href = `/shop?line=${encodeURIComponent(slug)}`;
              const sizeClass =
                index === 0
                  ? 'home-cat-card home-cat-card--hero'
                  : 'home-cat-card home-cat-card--side';

              return (
                <Reveal key={slug} delay={index * 70} className={sizeClass}>
                  <Link to={href} className="home-cat-link group">
                    <div className="home-cat-media">
                      {image ? (
                        <img
                          src={image}
                          alt={category.nameFA || ''}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      ) : (
                        <div className="home-cat-media-fallback" aria-hidden="true">
                          <PackageSearch size={34} />
                        </div>
                      )}
                      <span className="home-cat-scrim" aria-hidden="true" />
                    </div>
                    <div className="home-cat-copy">
                      <span className="home-cat-eyebrow">گروه محصول</span>
                      <h3>{category.nameFA || 'محصولات'}</h3>
                      <p>{cleanCardDescription(category.descFA) || 'برای مشاهده کالاهای منتشرشده و بررسی مشخصات سفارش وارد این گروه شوید.'}</p>
                      <span className="home-cat-cta">
                        مشاهده گروه
                        <ArrowUpLeft size={15} />
                      </span>
                      {count > 0 && (
                        <span className="home-cat-count">{toPersianDigits(count)} کالا</span>
                      )}
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

        <div className="mt-14 md:mt-16">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="home-products-kicker">کاتالوگ منتشرشده</span>
              <h3 className="home-products-heading">محصولات قابل بررسی</h3>
            </div>
            <Link to="/shop" className="home-products-all">
              ورود به کاتالوگ
              <ChevronLeft size={16} />
            </Link>
          </div>

          {productStatus === 'loading' ? (
            <CatalogStatus kind="loading" onRetry={onRetry} />
          ) : productStatus === 'error' ? (
            <CatalogStatus kind="error" onRetry={onRetry} />
          ) : highlightedProducts.length === 0 ? (
            <CatalogStatus kind="empty" onRetry={onRetry} />
          ) : (
            <div className="home-specialty-grid">
              {highlightedProducts.map((product, index) => (
                <Reveal key={product.id || product.slug} delay={index * 70}>
                  <Link
                    to={`/product/${encodeURIComponent(product.slug || product.id)}`}
                    className="home-specialty-card group"
                    aria-label={`مشاهده جزئیات ${product.nameFA || 'محصول'}`}
                  >
                    <div className="home-specialty-media">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.nameFA || ''}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="home-cat-media-fallback" aria-hidden="true">
                          <PackageSearch size={30} />
                        </div>
                      )}
                    </div>
                    <div className="home-specialty-body">
                      <span>{product.badge || CATEGORY_LABELS[product.category] || 'محصول منتشرشده'}</span>
                      <strong>{product.nameFA || 'مشاهده محصول'}</strong>
                      <p>{cleanCardDescription(product.descFA) || 'برای بررسی مشخصات و دریافت قیمت، جزئیات این محصول را مشاهده کنید.'}</p>
                      <span className="home-product-link-label">
                        جزئیات محصول
                        <ChevronLeft size={14} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 md:mt-14">
          <Link to="/shop" className="btn-gold">
            مشاهده کاتالوگ کامل
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
