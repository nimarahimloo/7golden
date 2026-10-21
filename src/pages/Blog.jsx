import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { t, categoryLabel } from '@/lib/i18n';
import { getBlogMeta, getBlogPosts } from '@/lib/api/content';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import LogoLoader from '@/components/LogoLoader';
import DynamicHeroSlider from '@/components/DynamicHeroSlider';
import PullToRefresh from '@/components/PullToRefresh';
import Seo from '@/components/Seo';
import { SITE_SEO } from '@/lib/seo';

import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';
import DepthParallax from '@/components/story/DepthParallax';
import Marquee from '@/components/story/Marquee';
import { usePageHero } from '@/lib/usePageHero';
import Eyebrow from '@/components/ui/eyebrow';
import EditorialCard from '@/components/EditorialCard';

const BLOG_PAGE_SIZE = 8;

export default function Blog() {
  const isFA = true;
  const ArrowIcon = isFA ? ArrowLeft : ArrowRight;
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [blogMeta, setBlogMeta] = useState({ total: 0, categories: [] });
  const sentinelRef = useRef(null);
  const skipRef = useRef(0);
  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);

  const { hero } = usePageHero('blog', {
    image: '/banner/hazelnut-bowl.webp',
    title: t('blog_title'),
    subtitle: 'مطالب مربوط به محصولات و کاربردهای آن‌ها',
    badge: 'وبلاگ',
  });

  const fetchPage = useCallback(async ({ reset = false } = {}) => {
    if (!reset && loadingMoreRef.current) return;

    const requestId = reset ? requestIdRef.current + 1 : requestIdRef.current;
    if (reset) {
      requestIdRef.current = requestId;
      skipRef.current = 0;
      setPosts([]);
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
      const items = await getBlogPosts({
        limit: BLOG_PAGE_SIZE,
        skip,
        category: activeCategory === 'all' ? undefined : activeCategory,
        query: appliedQuery || undefined,
      });
      if (requestId !== requestIdRef.current) return;

      const page = Array.isArray(items) ? items : [];
      setPosts((current) => {
        if (reset) return page;
        const knownSlugs = new Set(current.map((post) => post.slug).filter(Boolean));
        return [...current, ...page.filter((post) => post.slug && !knownSlugs.has(post.slug))];
      });
      // Advance by server rows, not deduplicated UI rows, so offset pagination stays correct.
      skipRef.current = skip + page.length;
      setHasMore(page.length === BLOG_PAGE_SIZE);
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
    getBlogMeta()
      .then((meta) => { if (active) setBlogMeta(meta); })
      .catch(() => { if (active) setBlogMeta({ total: 0, categories: [] }); });
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

  const categories = blogMeta.categories.map((item) => item.category);
  const filtered = posts; // Search and category filtering are applied across the complete CMS dataset by the API.
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div dir="rtl" className="blog-page" style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <Seo
        title={isFA ? `مجله ${SITE_SEO.siteNameFA} — راهنمای تخصصی صنایع غذایی` : `${SITE_SEO.siteNameEN} Magazine — Ingredient Guides`}
        description={isFA ? 'راهنماهای کاربردی برای انتخاب مغز و فرآورده‌های فندق، پسته و بادام در تولید شکلات، بستنی، قنادی و صنایع غذایی.' : 'Practical guides to choosing hazelnut, pistachio and almond ingredients for confectionery and food production.'}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/blog`}
      />

      <PullToRefresh onRefresh={() => loadData()}>
        {/* Hero */}
        <div className="relative">
          <DynamicHeroSlider pageKey="blog" fallback={{ image: hero?.image, title: hero?.title || '', subtitle: hero?.subtitle || '', badge: hero?.badge || '' }} />
        </div>

        {/* ===== Blog grid with its own magazine sidebar ===== */}
        <div className="chapter pt-8">
          <div className="chapter-shell">
            {loading ? (
              <LogoLoader fullScreen={false} />
            ) : (
              <div className="blog-page-layout">
                <main className="blog-page-main" aria-label="فهرست مطالب وبلاگ">
                  {filtered.length === 0 ? (
                    <div className="blog-empty-state">
                      <h2>مطلبی پیدا نشد</h2>
                      <p>{loadError ? 'دریافت مطالب از پایگاه داده با مشکل روبه‌رو شد.' : (blogMeta.total === 0 ? 'در حال حاضر مقالهٔ منتشرشده‌ای برای نمایش نیست.' : 'با این جست‌وجو یا دسته‌بندی مطلبی پیدا نشد.')}</p>
                      {loadError ? (
                        <button type="button" onClick={() => void loadData()}>تلاش دوباره</button>
                      ) : (
                        <button type="button" onClick={() => { setSearchQuery(''); setAppliedQuery(''); setActiveCategory('all'); }}>نمایش همهٔ مطالب</button>
                      )}
                    </div>
                  ) : rest.length > 0 ? (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-6">
                      {rest.map((post, i) => (
                        <Reveal key={post.id || post.slug} delay={(i % 2) * 100} variant="up">
                          <EditorialCard
                            to={`/blog/${post.slug}`}
                            image={post?.image}
                            alt={isFA ? post.titleFA : post.titleEN}
                            title={isFA ? post.titleFA : post.titleEN}
                            category={post.category ? categoryLabel(post.category) : (isFA ? 'وبلاگ' : 'Blog')}
                            date={isFA ? post.date : post.dateEN}
                            excerpt={isFA ? post.excerptFA : post.excerptEN}
                            readMore={t('read_more')}
                          />
                        </Reveal>
                      ))}
                    </div>
                  ) : (
                    <p className="py-8 font-body text-sm" style={{ color: 'var(--fg-muted)' }}>این مطلب در بخش ویژه نمایش داده شده است؛ برای دیدن مطالب بیشتر، فیلتر را تغییر دهید.</p>
                  )}
                  <div ref={sentinelRef} className="blog-load-more-sentinel" aria-hidden="true" />
                  {loadingMore && <p className="blog-load-more-status" role="status">در حال بارگذاری مطالب بیشتر…</p>}
                  {loadError && posts.length > 0 && (
                    <p className="blog-load-more-status" role="status">
                      دریافت ادامهٔ مطالب ناموفق بود. <button type="button" onClick={() => void fetchPage()}>تلاش دوباره</button>
                    </p>
                  )}
                  {!hasMore && posts.length > 0 && !loadError && (
                    <p className="blog-load-more-status">همهٔ مطالب منتشرشده نمایش داده شدند.</p>
                  )}
                </main>

                <aside className="blog-sidebar" aria-label="ابزارها و دسته‌بندی وبلاگ">
                  <form className="blog-sidebar-search" onSubmit={(event) => { event.preventDefault(); setAppliedQuery(searchQuery.trim()); }} role="search">
                    <label htmlFor="blog-search">جست‌وجو در وبلاگ</label>
                    <div className="blog-search-control">
                      <input
                        id="blog-search"
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="عنوان یا موضوع مطلب"
                      />
                      <button type="submit" aria-label="جست‌وجو"><Search size={16} /></button>
                    </div>
                  </form>

                  <section className="blog-sidebar-block">
                    <div className="blog-sidebar-heading">
                      <h2>موضوعات وبلاگ</h2>
                      <button type="button" onClick={() => { setSearchQuery(''); setAppliedQuery(''); setActiveCategory('all'); }}>پاک‌کردن</button>
                    </div>
                    <div className="blog-category-list">
                      <button type="button" className="blog-category-button" data-active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
                        <span>همهٔ مطالب</span><b>{blogMeta.total.toLocaleString('fa-IR')}</b>
                      </button>
                      {categories.map((category) => (
                        <button type="button" key={category} className="blog-category-button" data-active={activeCategory === category} onClick={() => setActiveCategory(category)}>
                          <span>{categoryLabel(category)}</span><b>{(blogMeta.categories.find((item) => item.category === category)?.count || 0).toLocaleString('fa-IR')}</b>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="blog-sidebar-block">
                    <h2>مطالب پیشنهادی</h2>
                    <ul className="blog-recent-list">
                      {posts.filter((post) => post.slug).slice(0, 4).map((post) => (
                        <li key={post.id || post.slug}>
                          <Link to={`/blog/${post.slug}`}>
                            <span>{categoryLabel(post.category)} · {isFA ? post.date : post.dateEN}</span>
                            <strong className="blog-recent-title" title={isFA ? post.titleFA : post.titleEN}>{isFA ? post.titleFA : post.titleEN}</strong>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="blog-sidebar-cta">
                    <span className="blog-sidebar-kicker">راهنمای انتخاب مواد اولیه</span>
                    <h2>دنبال محصول مناسب خط تولید هستید؟</h2>
                    <p>فرم محصول و کاربرد نهایی را مشخص کنید تا انتخاب و استعلام دقیق‌تری داشته باشید.</p>
                    <Link to="/shop">بررسی محصولات <ArrowIcon size={15} /></Link>
                  </div>
                  <Link to="/news" className="blog-sidebar-crosslink">خبرها و اطلاعیه‌های مجموعه <ArrowIcon size={15} /></Link>
                </aside>
              </div>
            )}
          </div>
        </div>

        {/* ===== Closing parallax band ===== */}
          <section className="closing-band" style={{ minHeight: '40vh' }}>
            <div className="closing-band-bg">
              <img src="/gallery/AQ8A1547AQ8A1547.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="relative z-10 chapter-shell py-20 text-center">
              <Reveal variant="up">
                <Eyebrow className="block mb-5">EXPLORE</Eyebrow>
              </Reveal>
              <Reveal variant="up" delay={80}>
                <h2 className="display-lg" style={{ color: 'var(--ink)' }}>
                  <span className="gold-text">دنیای خشکبار</span>
                </h2>
              </Reveal>
              <Reveal variant="up" delay={160} className="mt-8">
                <Link to="/shop" className="btn-gold inline-flex">
                  {isFA ? 'مشاهده محصولات' : 'View products'}
                </Link>
              </Reveal>
            </div>
          </section>
  
        <Marquee items={['پسته', 'بادام', 'فندق', 'فرآوری', 'کاربرد محصول', 'صنایع غذایی']} />
      </PullToRefresh>
    </div>
  );
}
