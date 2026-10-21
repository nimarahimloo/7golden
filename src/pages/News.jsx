import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Search } from 'lucide-react';
import DynamicHeroSlider from '@/components/DynamicHeroSlider';
import PullToRefresh from '@/components/PullToRefresh';
import Seo from '@/components/Seo';
import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import Marquee from '@/components/story/Marquee';
import { usePageHero } from '@/lib/usePageHero';
import { SITE_SEO } from '@/lib/seo';
import { getNewsMeta, getNewsPosts } from '@/lib/api/content';
import { NEWS_CATEGORIES, NEWS_ITEMS } from '@/lib/news-content';
import NewsCard from '@/components/news/NewsCard';

const PAGE_SIZE = 8;
const FALLBACK_NEWS_IMAGE = '/banner/banner-four-bowls.webp';
const CMS_CATEGORY_LABELS = {
  announcement: 'اطلاعیه',
  product: 'محصولات',
  company: 'درباره مجموعه',
  ordering: 'راهنمای سفارش',
  media: 'آرشیو تصویری',
  education: 'آموزشی',
  industry: 'کاربردهای صنعتی',
};

function categoryLabel(category) {
  return NEWS_CATEGORIES[category]?.label
    || CMS_CATEGORY_LABELS[category]
    || (category ? String(category).replace(/[-_]/g, ' ') : 'خبر');
}

function categoryTone(category) {
  return NEWS_CATEGORIES[category]?.tone || 'var(--gold-2, var(--accent))';
}

export default function News() {
  const [cmsItems, setCmsItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, categories: [] });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const sentinelRef = useRef(null);
  const skipRef = useRef(0);
  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);

  const { hero } = usePageHero('news', {
    image: FALLBACK_NEWS_IMAGE,
    title: 'اخبار و اطلاعیه‌ها',
    subtitle: 'خبرهای محصولات، اطلاعیه‌های بازرگانی و تازه‌های مجموعه هفت طلایی',
    badge: 'اخبار',
  });

  const fetchPage = useCallback(async ({ reset = false } = {}) => {
    if (!reset && loadingMoreRef.current) return;

    const requestId = reset ? requestIdRef.current + 1 : requestIdRef.current;
    if (reset) {
      requestIdRef.current = requestId;
      skipRef.current = 0;
      setCmsItems([]);
      setLoading(true);
      setLoadingMore(false);
      loadingMoreRef.current = false;
      setLoadError(false);
      setHasMore(true);
    } else {
      loadingMoreRef.current = true;
      setLoadingMore(true);
    }

    const skip = reset ? 0 : skipRef.current;
    try {
      const items = await getNewsPosts({
        limit: PAGE_SIZE,
        skip,
        category: activeCategory === 'all' ? undefined : activeCategory,
        query: appliedQuery || undefined,
      });
      if (requestId !== requestIdRef.current) return;

      const page = Array.isArray(items) ? items : [];
      setCmsItems((current) => {
        if (reset) return page;
        const known = new Set(current.map((item) => item.slug).filter(Boolean));
        return [...current, ...page.filter((item) => item.slug && !known.has(item.slug))];
      });
      skipRef.current = skip + page.length;
      setHasMore(page.length === PAGE_SIZE);
      setLoadError(false);
    } catch {
      if (requestId === requestIdRef.current) {
        setLoadError(true);
        setHasMore(false);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        if (reset) setLoading(false);
        else {
          setLoadingMore(false);
          loadingMoreRef.current = false;
        }
      }
    }
  }, [activeCategory, appliedQuery]);

  const loadData = useCallback(() => fetchPage({ reset: true }), [fetchPage]);
  const loadMore = useCallback(() => {
    if (hasMore && !loading && !loadingMore) void fetchPage();
  }, [fetchPage, hasMore, loading, loadingMore]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    let active = true;
    getNewsMeta()
      .then((value) => { if (active) setMeta(value); })
      .catch(() => { if (active) setMeta({ total: 0, categories: [] }); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading || loadingMore || loadError) return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadMore();
    }, { rootMargin: '480px 0px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadError, loading, loadingMore, loadMore]);

  // Preserve the seven existing editorial news items until the first database seed
  // has run; once the NewsPost API has records, the CMS is the public source of truth.
  const usingCms = meta.total > 0 || cmsItems.length > 0;
  const sourceItems = usingCms ? cmsItems : NEWS_ITEMS;
  const filteredItems = useMemo(() => {
    const query = appliedQuery.trim().toLocaleLowerCase();
    return sourceItems.filter((item) => {
      const label = categoryLabel(item.category);
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const haystack = [item.title, item.excerpt, label, ...(item.body || [])]
        .filter(Boolean).join(' ').toLocaleLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [activeCategory, appliedQuery, sourceItems]);

  const categories = usingCms
    ? meta.categories.map((entry) => ({ key: entry.category, label: categoryLabel(entry.category), count: entry.count }))
    : Object.entries(NEWS_CATEGORIES).map(([key, value]) => ({
      key,
      label: value.label,
      count: NEWS_ITEMS.filter((item) => item.category === key).length,
    })).filter((entry) => entry.count > 0);

  const featured = filteredItems[0] || null;
  const recentItems = sourceItems.slice(0, 4);
  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setAppliedQuery('');
  };

  return (
    <div dir="rtl" className="news-page" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Seo
        title={`اخبار و اطلاعیه‌های ${SITE_SEO.siteNameFA}`}
        description="خبرها و اطلاعیه‌های منتشرشدهٔ هفت طلایی از پایگاه محتوای مجموعه."
        image={featured?.image || SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/news`}
      />

      <PullToRefresh onRefresh={loadData}>
        <DynamicHeroSlider
          pageKey="news"
          fallback={{
            image: hero?.image,
            title: hero?.title || 'اخبار و اطلاعیه‌ها',
            subtitle: hero?.subtitle || 'خبرهای محصولات و اطلاعیه‌های هفت طلایی',
            badge: hero?.badge || 'اخبار',
          }}
        />

        <section className="chapter news-feed-section">
          <div className="chapter-shell">
            <StoryChapter
              index="01"
              eyebrow="NEWSROOM"
              title="تازه‌های هفت طلایی"
              lead="اطلاعیه‌ها و خبرهای منتشرشده از پایگاه محتوای هفت طلایی؛ هر مطلب صفحهٔ مستقل خود را دارد."
              className="mb-10 md:mb-14"
            />

            {loadError && (
              <p className="news-source-status" role="status">
                دریافت اخبار از پایگاه داده با مشکل روبه‌رو شد؛ محتوای آرشیوی موجود حفظ شده است.
              </p>
            )}

            <div className="news-page-layout">
              <main className="news-main" aria-label="فهرست اخبار">
                {loading ? (
                  <div className="news-empty-state" role="status">در حال بارگذاری اخبار…</div>
                ) : featured ? (
                  <Reveal variant="up">
                    <Link to={`/news/${featured.slug || featured.id}`} className="news-featured-card group">
                      <div className="news-featured-media">
                        <img
                          src={featured.image || FALLBACK_NEWS_IMAGE}
                          alt={featured.title}
                          loading="eager"
                          decoding="async"
                          fetchpriority="high"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = FALLBACK_NEWS_IMAGE;
                          }}
                        />
                        <span className="news-featured-image-shade" aria-hidden="true" />
                        <span className="news-featured-image-label">خبر منتخب</span>
                      </div>
                      <div className="news-featured-copy">
                        <span className="news-featured-meta">
                          <i style={{ background: categoryTone(featured.category) }} />
                          {categoryLabel(featured.category)}
                          <b aria-hidden="true">·</b>
                          <CalendarDays size={14} />
                          {featured.date || ''}
                        </span>
                        <h2 className="news-featured-title" title={featured.title}>{featured.title}</h2>
                        <p>{featured.excerpt}</p>
                        <span className="news-featured-action">ادامهٔ خبر <ArrowLeft size={16} /></span>
                      </div>
                    </Link>
                  </Reveal>
                ) : (
                  <div className="news-empty-state">
                    <h2>خبری با این مشخصات پیدا نشد</h2>
                    <p>عبارت جست‌وجو یا دسته‌بندی انتخاب‌شده را تغییر دهید.</p>
                    <button type="button" onClick={resetFilters}>نمایش همهٔ خبرها</button>
                  </div>
                )}

                {!loading && filteredItems.length > 1 && (
                  <section className="news-more-section" aria-labelledby="news-more-heading">
                    <div className="news-section-heading">
                      <h2 id="news-more-heading">سایر خبرها</h2>
                      <span>{(usingCms ? meta.total : filteredItems.length).toLocaleString('fa-IR')} مطلب</span>
                    </div>
                    <div className="news-feed-grid">
                      {filteredItems.slice(1).map((item, index) => (
                        <Reveal key={item.id || item.slug} delay={(index % 3) * 75} variant="up">
                          <NewsCard item={item} />
                        </Reveal>
                      ))}
                    </div>
                  </section>
                )}

                {usingCms && !loading && hasMore && !loadError && (
                  <div ref={sentinelRef} className="news-load-more-sentinel" aria-hidden="true" />
                )}
                {loadingMore && <p className="news-load-more-status" role="status">در حال دریافت خبرهای بیشتر…</p>}
                {usingCms && !loading && !hasMore && filteredItems.length > 0 && (
                  <p className="news-load-more-status">همهٔ خبرهای منتشرشده نمایش داده شدند.</p>
                )}
              </main>

              <aside className="news-sidebar" aria-label="ابزارها و دسته‌بندی اخبار">
                <form className="news-sidebar-search" onSubmit={(event) => { event.preventDefault(); setAppliedQuery(searchQuery.trim()); }} role="search">
                  <label htmlFor="news-search">جست‌وجو در اخبار</label>
                  <div className="news-search-control">
                    <input
                      id="news-search"
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="مثلاً محصولات یا سفارش"
                    />
                    <button type="submit" aria-label="جست‌وجو"><Search size={17} /></button>
                  </div>
                </form>

                <section className="news-sidebar-block">
                  <div className="news-sidebar-heading">
                    <h2>دسته‌بندی خبرها</h2>
                    <button type="button" onClick={resetFilters}>پاک‌کردن فیلتر</button>
                  </div>
                  <div className="news-category-list">
                    <button type="button" className="news-category-button" data-active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
                      <span>همهٔ خبرها</span><b>{(usingCms ? meta.total : NEWS_ITEMS.length).toLocaleString('fa-IR')}</b>
                    </button>
                    {categories.map((category) => (
                      <button type="button" key={category.key} className="news-category-button" data-active={activeCategory === category.key} onClick={() => setActiveCategory(category.key)}>
                        <span>{category.label}</span><b>{category.count.toLocaleString('fa-IR')}</b>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="news-sidebar-block">
                  <h2>خبرهای تازه</h2>
                  <ul className="news-recent-list">
                    {recentItems.map((item) => (
                      <li key={item.id || item.slug}>
                        <Link to={`/news/${item.slug || item.id}`}>
                          <span>{categoryLabel(item.category)} · {item.date || ''}</span>
                          <strong className="news-recent-title" title={item.title}>{item.title}</strong>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="news-sidebar-cta">
                  <span className="news-sidebar-kicker">واحد بازرگانی</span>
                  <h2>دربارهٔ محصول یا سفارش سؤال دارید؟</h2>
                  <p>نوع محصول، فرم موردنیاز و حجم تقریبی سفارش را بفرستید تا درخواست شما دقیق‌تر بررسی شود.</p>
                  <Link to="/contact">ارتباط با هفت طلایی <ArrowLeft size={15} /></Link>
                </div>

                <Link to="/blog" className="news-sidebar-crosslink">
                  راهنمای تخصصی و مطالب وبلاگ <ArrowLeft size={15} />
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <section className="chapter news-video-section">
          <div className="chapter-shell">
            <StoryChapter index="02" eyebrow="تصاویر واقعی از مجموعه" title="هفت طلایی، از نزدیک" lead="بخش تصویری صفحهٔ اصلی، شامل ویدیوهای کارخانه و گالری کامل تصاویر، در ادامه قابل مشاهده است." align="center" className="mb-8" />
            <div className="news-video-grid">
              {[
                { src: '/video/processing-1.mp4', label: 'فرآوری و تولید' },
                { src: '/video/facility-1.mp4', label: 'فضای کارخانه' },
                { src: '/video/showroom-1.mp4', label: 'محصولات از نزدیک' },
              ].map((video) => (
                <div key={video.src} className="news-media-card">
                  <video src={video.src} muted autoPlay loop playsInline preload="metadata" aria-label={video.label} />
                  <span>{video.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PullToRefresh>
    </div>
  );
}
