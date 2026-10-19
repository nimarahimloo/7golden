import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { t, categoryLabel } from '@/lib/i18n';
import { getBlogPosts } from '@/lib/api/content';
import { EDITORIAL_BLOG_POSTS } from '@/lib/editorial-blog-content';
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

export default function Blog() {
  const isFA = true;
  const ArrowIcon = isFA ? ArrowLeft : ArrowRight;
  const headingFont = isFA ? 'Peyda, serif' : 'Georgia, serif';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { hero } = usePageHero('blog', {
    image: '/banner/hazelnut-bowl.webp',
    title: t('blog_title'),
    subtitle: 'مطالب مربوط به محصولات و کاربردهای آن‌ها',
    badge: 'وبلاگ',
  });

  const mergeEditorialPosts = (cmsPosts = []) => {
    const merged = [...(Array.isArray(cmsPosts) ? cmsPosts : [])];
    const knownSlugs = new Set(merged.map((post) => post.slug).filter(Boolean));
    EDITORIAL_BLOG_POSTS.forEach((post) => {
      if (!knownSlugs.has(post.slug)) merged.push(post);
    });
    return merged;
  };

  const loadData = async () => {
    try {
      const items = await getBlogPosts();
      setPosts(mergeEditorialPosts(items));
      setLoadError(false);
    } catch {
      // Keep the magazine useful if the CMS is temporarily unavailable.
      // CMS posts remain authoritative whenever they exist; original editorial
      // posts fill gaps without overwriting entries that editors manage.
      setPosts(mergeEditorialPosts([]));
      setLoadError(true);
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

  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];
  const query = searchQuery.trim().toLocaleLowerCase();
  const filtered = posts.filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const searchable = [post.titleFA, post.titleEN, post.excerptFA, post.excerptEN, post.category, post.content]
      .filter(Boolean).join(' ').toLocaleLowerCase();
    return matchesCategory && (!query || searchable.includes(query));
  });
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

      <PullToRefresh onRefresh={loadData}>
      {/* Hero */}
      <div className="relative">
        <DynamicHeroSlider pageKey="blog" fallback={{ image: hero?.image || '/banner/Hero.webp', title: hero?.title || '', subtitle: hero?.subtitle || '', badge: hero?.badge || '' }} />
      </div>

      {/* ===== Featured post — cinematic depth parallax ===== */}
      {!loading && posts.length > 0 && featured && (
        <section className="chapter">
          <div className="chapter-shell">
            <StoryChapter
              index="01"
              eyebrow="FEATURED"
              title={isFA ? 'مطلب ویژه' : 'Featured'}
              className="mb-10"
            />
            <Reveal variant="up">
            <Link to={`/blog/${featured.slug}`} className="group block">
              <DepthParallax
                src={featured.image}
                alt={isFA ? featured.titleFA : featured.titleEN}
                ratio="aspect-[4/3] md:aspect-[21/9]"
                className="rounded-3xl"
              >
                <div>
                  <Eyebrow className="block mb-3">{isFA ? 'ویژه' : 'Featured'}</Eyebrow>
                  <h2 className="display-md mb-3 blog-card-heading" title={isFA ? featured.titleFA : featured.titleEN} style={{ color: 'var(--ink)' }}>
                    {isFA ? featured.titleFA : featured.titleEN}
                  </h2>
                  <p className="font-body text-sm leading-relaxed max-w-xl" style={{ color: 'var(--fg-muted)' }}>
                    {isFA ? featured.excerptFA : featured.excerptEN}
                  </p>
                  <div className="flex items-center gap-2 mt-5">
                    <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>
                      {isFA ? featured.date : featured.dateEN}
                    </span>
                    <span className="flex items-center gap-1.5 font-body text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                      {t('read_more')}
                      <ArrowIcon size={14} />
                    </span>
                  </div>
                </div>
              </DepthParallax>
            </Link>
            </Reveal>
          </div>
        </section>
      )}

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
                    <p>{posts.length === 0 ? (loadError ? 'دریافت مطالب با مشکل روبه‌رو شد. لطفاً دوباره تلاش کنید.' : 'در حال حاضر مطلب منتشرشده‌ای برای نمایش نیست.') : 'عبارت جست‌وجو یا دسته‌بندی انتخاب‌شده را تغییر دهید.'}</p>
                    <button type="button" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>نمایش همهٔ مطالب</button>
                  </div>
                ) : rest.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rest.map((post, i) => (
                      <Reveal key={post.id || post.slug} delay={(i % 2) * 100} variant="up">
                        <Link to={`/blog/${post.slug}`} className="group block blog-cine-card" style={{ aspectRatio: '3 / 4' }}>
                          <div className="blog-cine-card-image absolute inset-0">
                            <img
                              src={post.image || '/banner/banner-four-bowls.webp'}
                              alt={isFA ? post.titleFA : post.titleEN}
                              loading="lazy"
                              decoding="async"
                              onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = '/banner/banner-four-bowls.webp';
                              }}
                            />
                          </div>
                          <div className="blog-cine-overlay" />
                          <div className="blog-cine-content">
                            <span className="font-body text-xs block mb-2" style={{ color: 'var(--fg-muted)' }}>
                              {isFA ? post.date : post.dateEN}
                            </span>
                            <h3 className="display-sm mb-2 blog-card-title" title={isFA ? post.titleFA : post.titleEN} style={{ color: 'var(--ink)' }}>
                              {isFA ? post.titleFA : post.titleEN}
                            </h3>
                            <p className="font-body text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--fg-muted)' }}>
                              {isFA ? post.excerptFA : post.excerptEN}
                            </p>
                            <span className="flex items-center gap-1.5 font-body text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                              {t('read_more')}
                              <ArrowIcon size={12} />
                            </span>
                          </div>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 font-body text-sm" style={{ color: 'var(--fg-muted)' }}>این مطلب در بخش ویژه نمایش داده شده است؛ برای دیدن مطالب بیشتر، فیلتر را تغییر دهید.</p>
                )}
              </main>

              <aside className="blog-sidebar" aria-label="ابزارها و دسته‌بندی وبلاگ">
                <form className="blog-sidebar-search" onSubmit={(event) => event.preventDefault()} role="search">
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
                    <button type="button" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>پاک‌کردن</button>
                  </div>
                  <div className="blog-category-list">
                    <button type="button" className="blog-category-button" data-active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
                      <span>همهٔ مطالب</span><b>{posts.length.toLocaleString('fa-IR')}</b>
                    </button>
                    {categories.map((category) => (
                      <button type="button" key={category} className="blog-category-button" data-active={activeCategory === category} onClick={() => setActiveCategory(category)}>
                        <span>{categoryLabel(category)}</span><b>{posts.filter((post) => post.category === category).length.toLocaleString('fa-IR')}</b>
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
      {!loading && posts.length > 0 && (
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
      )}

      <Marquee items={['پسته', 'بادام', 'فندق', 'فرآوری', 'کاربرد محصول', 'صنایع غذایی']} />
      </PullToRefresh>
    </div>
  );
}
