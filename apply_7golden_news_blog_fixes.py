#!/usr/bin/env python3
"""Apply the news/blog editorial layout fixes to a local 7golden checkout.

Run from any directory:
    python apply_7golden_news_blog_fixes.py /path/to/7golden

The script validates all source anchors before writing any file. It does not
need network access and intentionally touches only the listed frontend files.
"""
from __future__ import annotations

import argparse
from pathlib import Path


NEWS_PAGE = r'''import { useMemo, useState } from 'react';
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
import { NEWS_CATEGORIES, NEWS_ITEMS } from '@/lib/news-content';
import NewsCard from '@/components/news/NewsCard';

const FALLBACK_NEWS_IMAGE = '/banner/banner-four-bowls.webp';

export default function News() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { hero } = usePageHero('news', {
    image: FALLBACK_NEWS_IMAGE,
    title: 'اخبار و اطلاعیه‌ها',
    subtitle: 'خبرهای محصولات، اطلاعیه‌های بازرگانی و تازه‌های مجموعه هفت طلایی',
    badge: 'اخبار',
  });

  const categories = useMemo(() => Object.entries(NEWS_CATEGORIES)
    .map(([key, category]) => ({
      key,
      ...category,
      count: NEWS_ITEMS.filter((item) => item.category === key).length,
    }))
    .filter((category) => category.count > 0), []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return NEWS_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const categoryName = NEWS_CATEGORIES[item.category]?.label || '';
      const searchable = [item.title, item.excerpt, categoryName, ...(item.body || [])]
        .filter(Boolean).join(' ').toLocaleLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [activeCategory, searchQuery]);

  const featured = filteredItems[0] || null;
  const recentItems = NEWS_ITEMS.slice(0, 4);
  const featuredCategory = featured ? NEWS_CATEGORIES[featured.category] : null;

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

      <PullToRefresh onRefresh={() => Promise.resolve()}>
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
                    <Link to={`/news/${featured.id}`} className="news-featured-card group">
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
                      <span>همهٔ خبرها</span><b>{NEWS_ITEMS.length.toLocaleString('fa-IR')}</b>
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
                        <Link to={`/news/${item.id}`}>
                          <span>{NEWS_CATEGORIES[item.category]?.label || 'خبر'} · {item.date}</span>
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
'''

CSS_APPEND = r'''

/* ===================================================================
   BLOG + NEWS EDITORIAL LAYOUTS
   Separate sidebars, responsive article grids, and single-line titles.
   =================================================================== */
.blog-page-layout,
.news-page-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(15rem, 18.5rem);
  align-items: start;
  gap: clamp(1rem, 2.5vw, 2.25rem);
  direction: rtl;
}

.blog-page-main,
.news-main { min-width: 0; }

.blog-sidebar,
.news-sidebar {
  position: sticky;
  top: 7.25rem;
  min-width: 0;
  padding: 1.15rem;
  border: 1px solid var(--hairline);
  border-radius: 1.25rem;
  background: var(--panel-strong, rgba(20, 17, 12, .94));
  box-shadow: 0 18px 48px rgba(0, 0, 0, .16);
}

.blog-sidebar-block,
.news-sidebar-block {
  margin-top: 1.4rem;
  padding-top: 1.15rem;
  border-top: 1px solid var(--hairline);
}

.blog-sidebar h2,
.news-sidebar h2 {
  margin: 0;
  color: var(--ink);
  font-family: 'Peyda', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.5;
}

.blog-sidebar-search,
.news-sidebar-search { display: block; }
.blog-sidebar-search label,
.news-sidebar-search label {
  display: block;
  margin-bottom: .6rem;
  color: var(--fg-muted);
  font-size: .78rem;
  font-weight: 700;
}

.blog-search-control,
.news-search-control {
  display: flex;
  align-items: center;
  gap: .4rem;
  min-width: 0;
  padding: .3rem;
  border: 1px solid var(--hairline-strong);
  border-radius: .75rem;
  background: rgba(255, 255, 255, .025);
}

.blog-search-control input,
.news-search-control input {
  width: 100%;
  min-width: 0;
  padding: .5rem .45rem;
  outline: none;
  border: 0;
  background: transparent;
  color: var(--fg);
  font: inherit;
  font-size: .78rem;
}

.blog-search-control input::placeholder,
.news-search-control input::placeholder { color: var(--fg-muted); opacity: .8; }

.blog-search-control button,
.news-search-control button {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: .6rem;
  background: rgba(212, 175, 55, .12);
  color: var(--gold-1, var(--accent));
}

.blog-category-list,
.news-category-list { display: grid; gap: .35rem; margin-top: .75rem; }

.blog-category-button,
.news-category-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  width: 100%;
  min-width: 0;
  padding: .65rem .7rem;
  border: 1px solid transparent;
  border-radius: .7rem;
  background: transparent;
  color: var(--fg-muted);
  text-align: right;
  font-size: .8rem;
  transition: background .2s ease, color .2s ease, border-color .2s ease;
}

.blog-category-button span,
.news-category-button span { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.blog-category-button b,
.news-category-button b { flex: 0 0 auto; color: var(--fg-muted); font-size: .72rem; font-weight: 600; }
.blog-category-button:hover,
.news-category-button:hover,
.blog-category-button[data-active='true'],
.news-category-button[data-active='true'] {
  border-color: var(--hairline-strong);
  background: rgba(212, 175, 55, .09);
  color: var(--ink);
}

.blog-sidebar-heading,
.news-sidebar-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
}
.blog-sidebar-heading button,
.news-sidebar-heading button { color: var(--gold-2, var(--accent)); font-size: .7rem; white-space: nowrap; }

.blog-recent-list,
.news-recent-list { display: grid; gap: .85rem; margin: .8rem 0 0; padding: 0; list-style: none; }
.blog-recent-list li + li,
.news-recent-list li + li { padding-top: .85rem; border-top: 1px solid var(--hairline); }
.blog-recent-list a,
.news-recent-list a { display: block; min-width: 0; }
.blog-recent-list span,
.news-recent-list span { display: block; margin-bottom: .3rem; color: var(--fg-muted); font-size: .67rem; }
.blog-recent-title,
.news-recent-title {
  display: block;
  overflow: hidden;
  color: var(--ink);
  font-size: .82rem;
  font-weight: 700;
  line-height: 1.6;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: color .2s ease;
}
.blog-recent-list a:hover .blog-recent-title,
.news-recent-list a:hover .news-recent-title { color: var(--gold-1, var(--accent)); }

.blog-sidebar-cta,
.news-sidebar-cta {
  margin-top: 1.25rem;
  padding: 1rem;
  border: 1px solid rgba(212, 175, 55, .24);
  border-radius: 1rem;
  background: linear-gradient(145deg, rgba(212, 175, 55, .09), rgba(255, 255, 255, .015));
}
.blog-sidebar-kicker,
.news-sidebar-kicker { display: block; margin-bottom: .5rem; color: var(--gold-1, var(--accent)); font-size: .68rem; font-weight: 800; }
.blog-sidebar-cta h2,
.news-sidebar-cta h2 { margin-bottom: .5rem; }
.blog-sidebar-cta p,
.news-sidebar-cta p { margin: 0; color: var(--fg-muted); font-size: .76rem; line-height: 1.9; }
.blog-sidebar-cta a,
.news-sidebar-cta a {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  margin-top: .85rem;
  color: var(--gold-1, var(--accent));
  font-size: .78rem;
  font-weight: 800;
}
.blog-sidebar-crosslink,
.news-sidebar-crosslink {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid var(--hairline);
  color: var(--fg-muted);
  font-size: .78rem;
}
.blog-sidebar-crosslink:hover,
.news-sidebar-crosslink:hover { color: var(--gold-1, var(--accent)); }

.blog-empty-state,
.news-empty-state {
  padding: 2rem 1.25rem;
  border: 1px solid var(--hairline);
  border-radius: 1.25rem;
  background: var(--panel);
  text-align: center;
}
.blog-empty-state h2,
.news-empty-state h2 { color: var(--ink); font-size: 1rem; font-weight: 800; }
.blog-empty-state p,
.news-empty-state p { margin-top: .5rem; color: var(--fg-muted); font-size: .85rem; line-height: 1.9; }
.blog-empty-state button,
.news-empty-state button { margin-top: .85rem; color: var(--gold-1, var(--accent)); font-size: .82rem; font-weight: 800; }

.news-featured-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--hairline);
  border-radius: 1.5rem;
  background: var(--panel-strong, rgba(20, 17, 12, .92));
  box-shadow: 0 18px 50px rgba(0, 0, 0, .22);
  transition: border-color .3s ease, transform .3s ease, box-shadow .3s ease;
}
.news-featured-card:hover { transform: translateY(-4px); border-color: var(--hairline-strong); box-shadow: 0 24px 60px rgba(0, 0, 0, .3); }
.news-featured-media { position: relative; min-height: 23rem; overflow: hidden; background: var(--bg-secondary); }
.news-featured-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .7s cubic-bezier(.16, 1, .3, 1); }
.news-featured-card:hover .news-featured-media img { transform: scale(1.045); }
.news-featured-image-shade { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(6, 5, 3, .72), transparent 55%); pointer-events: none; }
.news-featured-image-label { position: absolute; inset-inline-start: 1rem; bottom: 1rem; padding: .35rem .65rem; border: 1px solid rgba(255,255,255,.28); border-radius: 999px; background: rgba(7,6,4,.55); color: #f5df9b; font-size: .7rem; backdrop-filter: blur(10px); }
.news-featured-copy { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; min-width: 0; padding: clamp(1.15rem, 3vw, 2rem); }
.news-featured-meta { display: inline-flex; align-items: center; gap: .45rem; min-width: 0; color: var(--fg-muted); font-size: .72rem; }
.news-featured-meta i { width: .42rem; height: .42rem; flex: 0 0 auto; border-radius: 50%; }
.news-featured-meta b { opacity: .65; }
.news-featured-title,
.blog-card-title,
.blog-card-heading,
.news-section-heading h2,
.news-article-page .news-article-title,
.blog-article-page .blog-article-title {
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.news-featured-title { margin: .85rem 0 .6rem; color: var(--ink); font-family: 'Peyda', sans-serif; font-size: clamp(1.2rem, 2vw, 1.8rem); font-weight: 900; line-height: 1.5; }
.news-featured-copy p { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 3; color: var(--fg-muted); font-size: .88rem; line-height: 1.95; }
.news-featured-action { display: inline-flex; align-items: center; gap: .4rem; margin-top: 1.15rem; color: var(--gold-1, var(--accent)); font-size: .8rem; font-weight: 800; }
.news-more-section { margin-top: 2rem; }
.news-section-heading { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin-bottom: 1rem; }
.news-section-heading h2 { margin: 0; color: var(--ink); font-family: 'Peyda', sans-serif; font-size: 1.1rem; font-weight: 900; }
.news-section-heading span { flex: 0 0 auto; color: var(--fg-muted); font-size: .75rem; }
.news-one-result { margin-top: 1.25rem; color: var(--fg-muted); font-size: .8rem; }
.news-card-title { display: block; max-width: 100%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

/* Never wrap page or card titles on these editorial routes. Excerpts and article
   body copy remain multiline and readable. */
.blog-page h1,
.blog-page .display-lg,
.blog-page .display-md,
.blog-page .display-sm,
.blog-sidebar h2,
.blog-card-title,
.blog-card-heading,
.news-page h1,
.news-page .display-lg,
.news-page .display-md,
.news-page .display-sm,
.news-sidebar h2,
.news-featured-title,
.news-section-heading h2,
.news-card-title,
.news-article-page .news-article-title,
.blog-article-page .blog-article-title {
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.blog-page .blog-cine-content { min-width: 0; }
.blog-page .blog-cine-content h3 { font-size: clamp(.95rem, 1.7vw, 1.25rem); line-height: 1.5; }
.blog-page .blog-cine-card-image > img { display: block; width: 100%; height: 100%; object-fit: cover; }

.blog-article-page .prose-content h1,
.blog-article-page .prose-content h2,
.blog-article-page .prose-content h3,
.news-article-page article section h2 {
  display: block;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@media (max-width: 1023px) {
  .blog-page-layout,
  .news-page-layout { grid-template-columns: minmax(0, 1fr) 16rem; gap: 1rem; }
  .news-featured-card { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
  .news-featured-media { min-height: 20rem; }
}

@media (max-width: 767px) {
  .blog-page-layout,
  .news-page-layout { grid-template-columns: minmax(0, 1fr); }
  .blog-sidebar,
  .news-sidebar { position: static; order: -1; }
  .news-featured-card { grid-template-columns: minmax(0, 1fr); }
  .news-featured-media { min-height: 15rem; aspect-ratio: 16 / 10; }
  .news-featured-copy { padding: 1.15rem; }
  .news-feed-grid { grid-template-columns: minmax(0, 1fr); }
  .blog-page .blog-cine-card { aspect-ratio: 4 / 3 !important; }
  .blog-page .blog-cine-content { padding: 1rem; }
}
'''


def replace_once(content: str, old: str, new: str, label: str) -> str:
    count = content.count(old)
    if count != 1:
        raise RuntimeError(f"Expected exactly one anchor for {label}, found {count}.")
    return content.replace(old, new, 1)


def update_app(content: str) -> str:
    content = replace_once(
        content,
        "const News = lazy(() => import('@/pages/News'));\n",
        "const News = lazy(() => import('@/pages/News'));\nconst NewsArticle = lazy(() => import('@/pages/NewsArticle'));\n",
        "NewsArticle lazy import",
    )
    return replace_once(
        content,
        '<Route path="/news/:slug" element={<BlogPost />} />',
        '<Route path="/news/:slug" element={<NewsArticle />} />',
        "separate news detail route",
    )


def update_blog(content: str) -> str:
    content = replace_once(content, "import { Image } from '@/components/ui/image';\n", "", "remove layout-dependent image wrapper")
    content = replace_once(
        content,
        "import { ArrowLeft, ArrowRight } from 'lucide-react';",
        "import { ArrowLeft, ArrowRight, Search } from 'lucide-react';",
        "blog search icon",
    )
    content = replace_once(
        content,
        "  const [activeCategory, setActiveCategory] = useState('all');\n",
        "  const [activeCategory, setActiveCategory] = useState('all');\n  const [searchQuery, setSearchQuery] = useState('');\n",
        "blog search state",
    )
    content = replace_once(
        content,
        "  const filtered = activeCategory === 'all' ? posts : posts.filter(p => p.category === activeCategory);\n",
        """  const query = searchQuery.trim().toLocaleLowerCase();
  const filtered = posts.filter((post) => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const searchable = [post.titleFA, post.titleEN, post.excerptFA, post.excerptEN, post.category, post.content]
      .filter(Boolean).join(' ').toLocaleLowerCase();
    return matchesCategory && (!query || searchable.includes(query));
  });
""",
        "blog search + category filter",
    )
    content = replace_once(
        content,
        '<div dir="rtl" style={{ background: \'var(--bg)\', minHeight: \'100vh\' }}>',
        '<div dir="rtl" className="blog-page" style={{ background: \'var(--bg)\', minHeight: \'100vh\' }}>',
        "blog page scope class",
    )
    content = replace_once(
        content,
        "<h2 className=\"display-md mb-3\" style={{ color: 'var(--ink)' }}>\n                    {isFA ? featured.titleFA : featured.titleEN}\n                  </h2>",
        "<h2 className=\"display-md mb-3 blog-card-heading\" title={isFA ? featured.titleFA : featured.titleEN} style={{ color: 'var(--ink)' }}>\n                    {isFA ? featured.titleFA : featured.titleEN}\n                  </h2>",
        "featured blog title",
    )
    # The sidebar replaces the old standalone filter chips and the plain grid wrapper.
    filter_start = "      {/* ===== Category filter ===== */}"
    grid_start = "      {/* ===== Grid — cinematic cards ===== */}"
    if content.count(filter_start) != 1 or content.count(grid_start) != 1:
        raise RuntimeError("Could not find the expected blog category/filter section.")
    start = content.index(filter_start)
    end = content.index(grid_start)
    if end <= start:
        raise RuntimeError("Unexpected order of the blog filter and grid sections.")
    content = content[:start] + content[end:]

    card_image_old = '''                      <Image
                        src={post.image}
                        alt={isFA ? post.titleFA : post.titleEN}
                        className="w-full h-full"
                        fittingType="fill"
                      />'''
    card_image_new = '''                      <img
                        src={post.image || '/banner/banner-four-bowls.webp'}
                        alt={isFA ? post.titleFA : post.titleEN}
                        loading="lazy"
                        decoding="async"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = '/banner/banner-four-bowls.webp';
                        }}
                      />'''
    content = replace_once(content, card_image_old, card_image_new, "native blog card image with fallback")
    content = replace_once(
        content,
        "<h3 className=\"display-sm mb-2\" style={{ color: 'var(--ink)' }}>\n                        {isFA ? post.titleFA : post.titleEN}\n                      </h3>",
        "<h3 className=\"display-sm mb-2 blog-card-title\" title={isFA ? post.titleFA : post.titleEN} style={{ color: 'var(--ink)' }}>\n                        {isFA ? post.titleFA : post.titleEN}\n                      </h3>",
        "blog card single-line title",
    )
    old_grid = '''      {/* ===== Grid — cinematic cards ===== */}
      <div className="chapter pt-8">
        <div className="chapter-shell">
          {loading ? (
            <LogoLoader fullScreen={false} />
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-sm" style={{ color: 'var(--fg-muted)' }}>
                {loadError ? 'دریافت مطالب با مشکل روبه‌رو شد. لطفاً دوباره تلاش کنید.' : (isFA ? 'در حال حاضر مطلب منتشرشده‌ای برای نمایش نیست.' : 'No published articles are currently available.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post, i) => (
                <Reveal key={post.id} delay={(i % 3) * 100} variant="up">
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
          )}
        </div>
      </div>
'''
    new_grid = '''      {/* ===== Blog grid with its own magazine sidebar ===== */}
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
'''
    content = replace_once(content, old_grid, new_grid, "blog listing grid to sidebar layout")
    return content


def update_news_card(content: str) -> str:
    content = replace_once(
        content,
        "className=\"group relative rounded-3xl overflow-hidden gold-frame h-full flex flex-col\"",
        "className={`group relative rounded-3xl overflow-hidden gold-frame h-full flex flex-col ${className}`} ",
        "news card optional className",
    )
    content = replace_once(content, "export default function NewsCard({ item }) {", "export default function NewsCard({ item, className = '' }) {", "news card props")
    content = replace_once(
        content,
        '''          src={item.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"''',
        '''          src={item.image || '/banner/banner-four-bowls.webp'}
          alt={item.title}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/banner/banner-four-bowls.webp';
          }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"''',
        "news card image fallback",
    )
    content = replace_once(
        content,
        '<h3 className="font-heading font-bold text-base md:text-lg leading-snug" style={{ color: \'var(--ink)\' }}>\n          {item.title}\n        </h3>',
        '<h3 className="font-heading font-bold text-base md:text-lg leading-snug news-card-title" title={item.title} style={{ color: \'var(--ink)\' }}>\n          {item.title}\n        </h3>',
        "single-line news card title",
    )
    return content


def update_news_article(content: str) -> str:
    content = replace_once(
        content,
        '''    if (!item || !load) {
      setSections([]);
      return undefined;
    }
    let active = true;
    load().then((m) => active && setSections(m.default));
    return () => { active = false; };''',
        '''    if (!item || !load) {
      // The published newsroom entries own their copy in news-content.js.
      // Use it when there is no dedicated long-form module instead of rendering
      // an empty article page.
      setSections(item?.body?.length ? [{ p: item.body }] : []);
      return undefined;
    }
    let active = true;
    load()
      .then((m) => { if (active) setSections(m.default); })
      .catch(() => { if (active) setSections(item?.body?.length ? [{ p: item.body }] : []); });
    return () => { active = false; };''',
        "news detail body fallback",
    )
    content = replace_once(
        content,
        '<div dir="rtl" style={{ background: \'var(--bg)\', minHeight: \'100vh\' }}>',
        '<div dir="rtl" className="news-article-page" style={{ background: \'var(--bg)\', minHeight: \'100vh\' }}>',
        "news article page class",
    )
    content = replace_once(
        content,
        '<h1 className="display-lg" style={{ color: \'var(--ink)\' }}>{item.title}</h1>',
        '<h1 className="display-lg news-article-title" title={item.title} style={{ color: \'var(--ink)\' }}>{item.title}</h1>',
        "news article single-line title",
    )
    content = replace_once(
        content,
        '''            <h2 className="font-heading font-extrabold text-xl md:text-2xl leading-snug mb-4" style={{ color: 'var(--ink)' }}>
              {s.h}
            </h2>''',
        '''            {s.h && (
              <h2 className="font-heading font-extrabold text-xl md:text-2xl leading-snug mb-4" style={{ color: 'var(--ink)' }}>
                {s.h}
              </h2>
            )}''',
        "optional news section headings",
    )
    return content


def update_blog_post(content: str) -> str:
    content = replace_once(
        content,
        '<div dir="rtl" style={{ background: \'var(--bg)\', minHeight: \'100vh\' }}>',
        '<div dir="rtl" className="blog-article-page" style={{ background: \'var(--bg)\', minHeight: \'100vh\' }}>',
        "blog article page class",
    )
    content = replace_once(
        content,
        '<h1 className="display-lg leading-tight" style={{ color: \'var(--ink)\' }}>',
        '<h1 className="display-lg leading-tight blog-article-title" title={title} style={{ color: \'var(--ink)\' }}>',
        "blog article one-line title",
    )
    content = replace_once(
        content,
        '''          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: 'kenBurns 20s ease-out forwards', filter: 'brightness(0.6)' }}''',
        '''          className="absolute inset-0 w-full h-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/banner/banner-four-bowls.webp';
          }}
          style={{ animation: 'kenBurns 20s ease-out forwards', filter: 'brightness(0.6)' }}''',
        "blog article hero image fallback",
    )
    return content


def update_depth_parallax(content: str) -> str:
    content = replace_once(
        content,
        '''        {src && <img src={src} alt="" loading="lazy" />}''',
        '''        {src && <img src={src} alt="" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/banner/banner-four-bowls.webp'; }} />}''',
        "blog featured atmosphere image fallback",
    )
    return replace_once(
        content,
        '''        {src && <img src={src} alt={alt} loading="lazy" />}''',
        '''        {src && <img src={src} alt={alt} loading="eager" fetchpriority="high" decoding="async" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/banner/banner-four-bowls.webp'; }} />}''',
        "blog featured main image fallback",
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("repo", nargs="?", default=".", help="path to the local 7golden repository")
    parser.add_argument("--dry-run", action="store_true", help="validate all expected files/anchors without writing")
    args = parser.parse_args()
    root = Path(args.repo).expanduser().resolve()

    tasks = {
        "src/App.jsx": update_app,
        "src/pages/Blog.jsx": update_blog,
        "src/components/news/NewsCard.jsx": update_news_card,
        "src/pages/NewsArticle.jsx": update_news_article,
        "src/pages/BlogPost.jsx": update_blog_post,
        "src/components/story/DepthParallax.jsx": update_depth_parallax,
    }
    updated: dict[Path, str] = {}
    for relative, transform in tasks.items():
        path = root / relative
        if not path.is_file():
            raise FileNotFoundError(f"Required file not found: {path}")
        original = path.read_text(encoding="utf-8")
        updated[path] = transform(original)

    news_path = root / "src/pages/News.jsx"
    story_path = root / "src/styles/story.css"
    if not news_path.is_file() or not story_path.is_file():
        raise FileNotFoundError("Expected src/pages/News.jsx and src/styles/story.css in the repository.")
    updated[news_path] = NEWS_PAGE
    existing_css = story_path.read_text(encoding="utf-8")
    marker = "BLOG + NEWS EDITORIAL LAYOUTS"
    if marker in existing_css:
        raise RuntimeError("The blog/news editorial CSS patch already appears to be applied; refusing to duplicate it.")
    updated[story_path] = existing_css.rstrip() + CSS_APPEND + "\n"

    if args.dry_run:
        for path in updated:
            print(f"validated: {path.relative_to(root)}")
        print(f"Dry run passed: {len(updated)} files would change.")
        return

    for path, new_content in updated.items():
        path.write_text(new_content, encoding="utf-8")
    print("Applied fixes to:")
    for path in updated:
        print(f"  - {path.relative_to(root)}")
    print("\nNext: run the project's lint/build checks and review the diff before committing.")


if __name__ == "__main__":
    main()
