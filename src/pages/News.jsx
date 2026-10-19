import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { getBlogPosts } from '@/lib/api/content';
import { NEWS_CATEGORIES, NEWS_ITEMS } from '@/lib/news-content';
import NewsCard from '@/components/news/NewsCard';

const FALLBACK_NEWS_IMAGE = '/banner/banner-four-bowls.webp';

const CMS_CATEGORY_LABELS = {
  education: 'آموزشی',
  industry: 'کاربردهای صنعتی',
  announcement: 'اطلاعیه',
  product: 'محصولات',
  company: 'درباره مجموعه',
  ordering: 'راهنمای سفارش',
  media: 'آرشیو تصویری',
};

function getNewsCategoryLabel(category) {
  return NEWS_CATEGORIES[category]?.label
    || CMS_CATEGORY_LABELS[category]
    || (category ? String(category).replace(/[-_]/g, ' ') : 'سایر خبرها');
}

export default function News() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cmsPosts, setCmsPosts] = useState([]);
  const [cmsLoadError, setCmsLoadError] = useState(false);

  const refreshCmsPosts = useCallback(async () => {
    try {
      const items = await getBlogPosts({ limit: 500 });
      setCmsPosts(Array.isArray(items) ? items : []);
      setCmsLoadError(false);
    } catch {
      // Keep the verified newsroom notices visible, but signal a CMS/API failure.
      setCmsLoadError(true);
    }
  }, []);

  useEffect(() => {
    void refreshCmsPosts();
  }, [refreshCmsPosts]);
  const { hero } = usePageHero('news', {
    image: FALLBACK_NEWS_IMAGE,
    title: 'اخبار و اطلاعیه‌ها',
    subtitle: 'خبرهای محصولات، اطلاعیه‌های بازرگانی و تازه‌های مجموعه هفت طلایی',
    badge: 'اخبار',
  });

  const cmsNewsItems = useMemo(() => cmsPosts
    .filter((post) => post?.slug && (post.titleFA || post.titleEN))
    .map((post) => ({
      id: post.slug,
      href: `/blog/${encodeURIComponent(post.slug)}`,
      category: post.category || 'announcement',
      categoryLabel: getNewsCategoryLabel(post.category || 'announcement'),
      categoryTone: NEWS_CATEGORIES[post.category]?.tone || 'var(--gold-1, var(--accent))',
      date: post.date || post.dateEN || '',
      title: post.titleFA || post.titleEN || post.slug,
      excerpt: post.excerptFA || post.excerptEN || '',
      image: post.image || FALLBACK_NEWS_IMAGE,
      body: post.content ? [post.content] : [],
      source: 'cms',
    })), [cmsPosts]);

  // Keep the verified newsroom items already authored for this page, and add all
  // public CMS blog records. A matching slug is shown once, with CMS content first.
  const allItems = useMemo(() => {
    const cmsSlugs = new Set(cmsNewsItems.map((item) => item.id));
    return [...cmsNewsItems, ...NEWS_ITEMS.filter((item) => !cmsSlugs.has(item.id))];
  }, [cmsNewsItems]);

  const categories = useMemo(() => {
    const counts = new Map();
    allItems.forEach((item) => {
      if (item.category) counts.set(item.category, (counts.get(item.category) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([key, count]) => ({
      key,
      label: getNewsCategoryLabel(key),
      tone: NEWS_CATEGORIES[key]?.tone || 'var(--accent)',
      count,
    }));
  }, [allItems]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return allItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const categoryName = getNewsCategoryLabel(item.category);
      const searchable = [item.title, item.excerpt, categoryName, ...(item.body || [])]
        .filter(Boolean).join(' ').toLocaleLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [activeCategory, allItems, searchQuery]);

  const featured = filteredItems[0] || null;
  const recentItems = allItems.slice(0, 4);
  const featuredCategory = featured ? {
    label: getNewsCategoryLabel(featured.category),
    tone: NEWS_CATEGORIES[featured.category]?.tone || 'var(--accent)',
  } : null;

  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
  };

  return (
    <div dir="rtl" className="news-page" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Seo
        title={`اخبار و اطلاعیه‌های ${SITE_SEO.siteNameFA}`}
        description="تازه‌های محصولات، اطلاعیه‌های سفارش و خبرهای مجموعه هفت طلایی؛ همراه با محتوای مستقل و قابل مطالعه برای هر خبر."
        image={featured?.image || SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/news`}
      />

      <PullToRefresh onRefresh={refreshCmsPosts}>
        <DynamicHeroSlider
          pageKey="news"
          fallback={{
            image: hero?.image || FALLBACK_NEWS_IMAGE,
            title: hero?.title || 'اخبار و اطلاعیه‌ها',
            subtitle: hero?.subtitle || 'خبرهای محصولات و اطلاعیه‌های هفت طلایی',
            badge: hero?.badge || 'اخبار',
          }}
        />

        <section className="chapter news-feed-section">
          <div className="chapter-shell">
            {cmsLoadError && (
              <p className="news-source-status" role="status">
                دریافت مطالب از پایگاه محتوا با مشکل روبه‌رو شد؛ اطلاعیه‌های موجود نمایش داده شده‌اند.
              </p>
            )}
            <StoryChapter
              index="01"
              eyebrow="NEWSROOM"
              title="تازه‌های هفت طلایی"
              lead="اطلاعیه‌های مجموعه، خبرهای محصول و راهنماهای کاربردی برای خریداران عمده؛ هر خبر با صفحه و محتوای مستقل."
              className="mb-10 md:mb-14"
            />

            <div className="news-page-layout">
              <main className="news-main" aria-label="فهرست اخبار">
                {featured ? (
                  <Reveal variant="up">
                    <Link to={featured.href || `/news/${featured.id}`} className="news-featured-card group">
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
                          <i style={{ background: featuredCategory?.tone || 'var(--accent)' }} />
                          {featuredCategory?.label || 'خبر'}
                          <b aria-hidden="true">·</b>
                          <CalendarDays size={14} />
                          {featured.date}
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

                {filteredItems.length > 1 && (
                  <section className="news-more-section" aria-labelledby="news-more-heading">
                    <div className="news-section-heading">
                      <h2 id="news-more-heading">سایر خبرها</h2>
                      <span>{filteredItems.length.toLocaleString('fa-IR')} مطلب</span>
                    </div>
                    <div className="news-feed-grid">
                      {filteredItems.slice(1).map((item, index) => (
                        <Reveal key={item.id} delay={(index % 3) * 75} variant="up">
                          <NewsCard item={item} />
                        </Reveal>
                      ))}
                    </div>
                  </section>
                )}
                {filteredItems.length === 1 && (
                  <p className="news-one-result">این تنها خبر منطبق با فیلتر فعلی است.</p>
                )}
              </main>

              <aside className="news-sidebar" aria-label="ابزارها و دسته‌بندی اخبار">
                <form className="news-sidebar-search" onSubmit={(event) => event.preventDefault()} role="search">
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
                    <button
                      type="button"
                      className="news-category-button"
                      data-active={activeCategory === 'all'}
                      onClick={() => setActiveCategory('all')}
                    >
                      <span>همهٔ خبرها</span><b>{allItems.length.toLocaleString('fa-IR')}</b>
                    </button>
                    {categories.map((category) => (
                      <button
                        type="button"
                        key={category.key}
                        className="news-category-button"
                        data-active={activeCategory === category.key}
                        onClick={() => setActiveCategory(category.key)}
                      >
                        <span>{category.label}</span><b>{category.count.toLocaleString('fa-IR')}</b>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="news-sidebar-block">
                  <h2>خبرهای تازه</h2>
                  <ul className="news-recent-list">
                    {recentItems.map((item) => (
                      <li key={item.id}>
                        <Link to={item.href || `/news/${item.id}`}>
                          <span>{getNewsCategoryLabel(item.category)} · {item.date}</span>
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
        <Marquee items={['اطلاعیه', 'محصولات', 'راهنمای سفارش', 'تازه‌های هفت طلایی', 'فندق', 'پسته', 'بادام']} />
      </PullToRefresh>
    </div>
  );
}
