import { useCallback, useEffect, useRef, useState } from 'react';
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
import Marquee from '@/components/story/Marquee';
import { usePageHero } from '@/lib/usePageHero';
import Eyebrow from '@/components/ui/eyebrow';
import EditorialCard from '@/components/EditorialCard';

const BLOG_PAGE_SIZE = 8;
const BLOG_FALLBACK_IMAGE = '/banner/hazelnut-bowl.webp';

export default function Blog() {
  const isFA = true;
  const ArrowIcon = isFA ? ArrowLeft : ArrowRight;
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
    image: BLOG_FALLBACK_IMAGE,
    title: 'مجله هفت طلایی',
    subtitle:
      'راهنماها و نکته‌هایی درباره فندق، پسته و بادام؛ از شکل‌های مختلف فرآوری تا کاربرد آن‌ها در محصولات غذایی.',
    badge: 'دانستنی‌های خشکبار',
  });

  const fetchPage = useCallback(async ({ reset = false } = {}) => {
    if (!reset && loadingMoreRef.current) return;

    const requestId = reset
      ? requestIdRef.current + 1
      : requestIdRef.current;

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

        const knownSlugs = new Set(
          current.map((post) => post.slug).filter(Boolean),
        );

        return [
          ...current,
          ...page.filter((post) => post.slug && !knownSlugs.has(post.slug)),
        ];
      });

      // Offset را بر اساس تعداد ردیف‌های دریافتی از API جلو می‌بریم.
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
        if (reset) {
          setLoading(false);
        } else {
          setLoadingMore(false);
          loadingMoreRef.current = false;
        }
      }
    }
  }, [activeCategory, appliedQuery]);

  const loadData = useCallback(
    () => fetchPage({ reset: true }),
    [fetchPage],
  );

  const loadMore = useCallback(() => {
    if (hasMore && !loading && !loadingMore) {
      void fetchPage();
    }
  }, [fetchPage, hasMore, loading, loadingMore]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    let active = true;

    getBlogMeta()
      .then((meta) => {
        if (active) setBlogMeta(meta);
      })
      .catch(() => {
        if (active) setBlogMeta({ total: 0, categories: [] });
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (
      !sentinel
      || !hasMore
      || loading
      || loadingMore
      || loadError
    ) {
      return undefined;
    }

    if (typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin: '480px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadError, loading, loadingMore, loadMore]);

  const categories = blogMeta.categories.map((item) => item.category);
  // فیلتر موضوع و عبارت جست‌وجو در سمت API اعمال می‌شود.
  const filtered = posts;

  const resetFilters = () => {
    setSearchQuery('');
    setAppliedQuery('');
    setActiveCategory('all');
  };

  return (
    <div
      dir="rtl"
      className="blog-page"
      style={{ background: 'var(--bg)', minHeight: '100vh' }}
    >
      <Seo
        title={isFA
          ? `مجله هفت طلایی | راهنمای فندق، پسته و بادام`
          : `${SITE_SEO.siteNameEN} Magazine | Hazelnut, Pistachio and Almond Guides`}
        description={isFA
          ? 'راهنماهای کاربردی درباره مغز و فرآورده‌های فندق، پسته و بادام؛ آشنایی با انواع محصول و کاربرد آن‌ها در شکلات، بستنی، قنادی و صنایع غذایی.'
          : 'Practical guides to hazelnut, pistachio and almond ingredients, their forms and uses in confectionery and food production.'}
        image={SITE_SEO.ogImage}
        canonical={`${SITE_SEO.baseUrl}/blog`}
      />

      <PullToRefresh onRefresh={loadData}>
        <div className="relative">
          <DynamicHeroSlider
            pageKey="blog"
            fallback={{
              image: hero?.image || BLOG_FALLBACK_IMAGE,
              title: hero?.title || 'مجله هفت طلایی',
              subtitle: hero?.subtitle
                || 'راهنماها و نکته‌هایی درباره فندق، پسته و بادام و کاربرد آن‌ها در محصولات غذایی.',
              badge: hero?.badge || 'دانستنی‌های خشکبار',
            }}
          />
        </div>

        <section className="chapter pt-8">
          <div className="chapter-shell">
            <StoryChapter
              index="۰۱"
              eyebrow="مجله هفت طلایی"
              title="شناخت بهتر مواد اولیه، از فندق تا بادام"
              lead="در اینجا درباره ویژگی محصولات خشکبار، شکل‌های مختلف فرآوری و کاربرد هرکدام در تهیه شیرینی، شکلات، بستنی و دیگر خوراکی‌ها می‌خوانید. هدف، ارائه اطلاعات روشن و کاربردی برای انتخاب آگاهانه‌تر مواد اولیه است."
              className="mb-10 md:mb-14"
            />

            {loading ? (
              <LogoLoader fullScreen={false} />
            ) : (
              <div className="blog-page-layout">
                <main className="blog-page-main" aria-label="فهرست مطالب مجله">
                  {filtered.length === 0 ? (
                    <div className="blog-empty-state">
                      <h2>مطلبی پیدا نشد</h2>
                      <p>
                        {loadError
                          ? 'دریافت مطالب با مشکل روبه‌رو شد. لطفاً دوباره تلاش کنید.'
                          : blogMeta.total === 0
                            ? 'هنوز مطلبی برای نمایش منتشر نشده است.'
                            : 'با این عبارت یا موضوع، مطلبی پیدا نشد. جست‌وجو را تغییر دهید یا همه مطالب را ببینید.'}
                      </p>
                      {loadError ? (
                        <button type="button" onClick={() => void loadData()}>
                          تلاش دوباره
                        </button>
                      ) : (
                        <button type="button" onClick={resetFilters}>
                          نمایش همه مطالب
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                      {filtered.map((post, index) => (
                        <Reveal
                          key={post.id || post.slug}
                          delay={(index % 3) * 75}
                          variant="up"
                        >
                          <EditorialCard
                            to={`/blog/${post.slug}`}
                            image={post?.image || BLOG_FALLBACK_IMAGE}
                            alt={isFA ? post.titleFA : post.titleEN}
                            title={isFA ? post.titleFA : post.titleEN}
                            category={post.category
                              ? categoryLabel(post.category)
                              : (isFA ? 'مجله' : 'Magazine')}
                            date={isFA ? post.date : post.dateEN}
                            excerpt={isFA ? post.excerptFA : post.excerptEN}
                            readMore={t('read_more')}
                          />
                        </Reveal>
                      ))}
                    </div>
                  )}

                  <div
                    ref={sentinelRef}
                    className="blog-load-more-sentinel"
                    aria-hidden="true"
                  />

                  {loadingMore && (
                    <p className="blog-load-more-status" role="status">
                      در حال بارگذاری مطالب بیشتر…
                    </p>
                  )}

                  {loadError && posts.length > 0 && (
                    <p className="blog-load-more-status" role="status">
                      دریافت ادامه مطالب کامل نشد.{' '}
                      <button type="button" onClick={() => void fetchPage()}>
                        تلاش دوباره
                      </button>
                    </p>
                  )}

                  {!hasMore && posts.length > 0 && !loadError && (
                    <p className="blog-load-more-status">
                      همه مطالب منتشرشده نمایش داده شدند.
                    </p>
                  )}
                </main>

                <aside
                  className="blog-sidebar"
                  aria-label="جست‌وجو و دسته‌بندی مطالب مجله"
                >
                  <form
                    className="blog-sidebar-search"
                    onSubmit={(event) => {
                      event.preventDefault();
                      setAppliedQuery(searchQuery.trim());
                    }}
                    role="search"
                  >
                    <label htmlFor="blog-search">جست‌وجو در مطالب</label>
                    <div className="blog-search-control">
                      <input
                        id="blog-search"
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="مثلاً خمیر فندق یا خلال پسته"
                      />
                      <button type="submit" aria-label="جست‌وجو">
                        <Search size={16} />
                      </button>
                    </div>
                  </form>

                  <section className="blog-sidebar-block">
                    <div className="blog-sidebar-heading">
                      <h2>موضوعات مجله</h2>
                      <button type="button" onClick={resetFilters}>
                        پاک‌کردن فیلتر
                      </button>
                    </div>

                    <div className="blog-category-list">
                      <button
                        type="button"
                        className="blog-category-button"
                        data-active={activeCategory === 'all'}
                        onClick={() => setActiveCategory('all')}
                      >
                        <span>همه مطالب</span>
                        <b>{blogMeta.total.toLocaleString('fa-IR')}</b>
                      </button>

                      {categories.map((category) => (
                        <button
                          type="button"
                          key={category}
                          className="blog-category-button"
                          data-active={activeCategory === category}
                          onClick={() => setActiveCategory(category)}
                        >
                          <span>{categoryLabel(category)}</span>
                          <b>
                            {(blogMeta.categories.find(
                              (item) => item.category === category,
                            )?.count || 0).toLocaleString('fa-IR')}
                          </b>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="blog-sidebar-block">
                    <h2>برای مطالعه بیشتر</h2>
                    <ul className="blog-recent-list">
                      {posts.filter((post) => post.slug).slice(0, 4).map((post) => (
                        <li key={post.id || post.slug}>
                          <Link to={`/blog/${post.slug}`}>
                            <span>
                              {categoryLabel(post.category)} · {isFA ? post.date : post.dateEN}
                            </span>
                            <strong
                              className="blog-recent-title"
                              title={isFA ? post.titleFA : post.titleEN}
                            >
                              {isFA ? post.titleFA : post.titleEN}
                            </strong>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="blog-sidebar-cta">
                    <span className="blog-sidebar-kicker">
                      راهنمای انتخاب محصول
                    </span>
                    <h2>کدام شکل از محصول برای کار شما مناسب‌تر است؟</h2>
                    <p>
                      مغز کامل، خلال، پرک، گرانول، خمیر یا پودر هرکدام کاربرد متفاوتی دارند. اگر درباره انتخاب محصول مناسب تردید دارید، با ما در میان بگذارید.
                    </p>
                    <Link to="/shop">
                      آشنایی با محصولات <ArrowIcon size={15} />
                    </Link>
                  </div>

                  <Link to="/news" className="blog-sidebar-crosslink">
                    تازه‌های هفت طلایی <ArrowIcon size={15} />
                  </Link>
                </aside>
              </div>
            )}
          </div>
        </section>

        <section className="closing-band" style={{ minHeight: '40vh' }}>
          <div className="closing-band-bg">
            <img
              src="/banner/tray-pistachio-almond.webp"
              alt="ترکیبی از محصولات پسته و بادام"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="relative z-10 chapter-shell py-20 text-center">
            <Reveal variant="up">
              <Eyebrow className="block mb-5">از نزدیک‌تر بشناسید</Eyebrow>
            </Reveal>

            <Reveal variant="up" delay={80}>
              <h2 className="display-lg" style={{ color: 'var(--ink)' }}>
                <span className="gold-text">دنیای متنوع خشکبار</span>
              </h2>
            </Reveal>

            <Reveal variant="up" delay={160} className="mt-8">
              <Link to="/shop" className="btn-gold inline-flex">
                {isFA ? 'دیدن محصولات' : 'View products'}
              </Link>
            </Reveal>
          </div>
        </section>

        <Marquee
          items={[
            'فندق',
            'خمیر فندق',
            'پسته',
            'خلال پسته',
            'بادام',
            'پرک بادام',
            'فرآوری خشکبار',
            'صنایع غذایی',
          ]}
        />
      </PullToRefresh>
    </div>
  );
}
