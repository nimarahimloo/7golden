#!/usr/bin/env python3
"""Apply the 7Golden newsroom/CMS and homepage media mosaic fix.

Run against a local checkout:
  python3 apply_7golden_news_api_home_mosaic.py /path/to/7golden --dry-run
  python3 apply_7golden_news_api_home_mosaic.py /path/to/7golden

The script validates every expected source anchor before writing anything. It never
runs Prisma seed, drops tables, deletes records, or bulk-overwrites editorial data.
Schema changes are additive. Seed additions use create-if-missing/upsert with empty
updates so admin edits are preserved.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path


def replace_once(content: str, old: str, new: str, label: str) -> str:
    count = content.count(old)
    if count != 1:
        raise RuntimeError(f"Expected one anchor for {label}; found {count}.")
    return content.replace(old, new, 1)


def replace_regex_once(content: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, content, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError(f"Expected one regex match for {label}; found {count}.")
    return updated


NEWS_PAGE = r'''import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
'''

HOME_MEDIA_JS = r'''// Complete repository media manifest used by the homepage's editorial mosaic.
// All image/video assets are local files in public/gallery and public/video.
const GALLERY_PHOTOS = [
  '/gallery/AQ8A1495AQ8A1495.webp', '/gallery/AQ8A1498AQ8A1498.webp', '/gallery/AQ8A1499AQ8A1499.webp',
  '/gallery/AQ8A1502AQ8A1502.webp', '/gallery/AQ8A1505AQ8A1505.webp', '/gallery/AQ8A1508AQ8A1508.webp',
  '/gallery/AQ8A1511AQ8A1511.webp', '/gallery/AQ8A1513AQ8A1513.webp', '/gallery/AQ8A1516AQ8A1516.webp',
  '/gallery/AQ8A1517AQ8A1517.webp', '/gallery/AQ8A1520AQ8A1520.webp', '/gallery/AQ8A1524AQ8A1524.webp',
  '/gallery/AQ8A1525AQ8A1525.webp', '/gallery/AQ8A1526AQ8A1526.webp', '/gallery/AQ8A1527AQ8A1527.webp',
  '/gallery/AQ8A1528AQ8A1528.webp', '/gallery/AQ8A1529AQ8A1529.webp', '/gallery/AQ8A1530AQ8A1530.webp',
  '/gallery/AQ8A1531AQ8A1531.webp', '/gallery/AQ8A1534AQ8A1534.webp', '/gallery/AQ8A1537AQ8A1537.webp',
  '/gallery/AQ8A1538AQ8A1538.webp', '/gallery/AQ8A1539AQ8A1539.webp', '/gallery/AQ8A1541AQ8A1541.webp',
  '/gallery/AQ8A1542AQ8A1542.webp', '/gallery/AQ8A1543AQ8A1543.webp', '/gallery/AQ8A1544AQ8A1544.webp',
  '/gallery/AQ8A1545AQ8A1545.webp', '/gallery/AQ8A1547AQ8A1547.webp', '/gallery/AQ8A1550AQ8A1550.webp',
  '/gallery/AQ8A1552AQ8A1552.webp', '/gallery/AQ8A1562AQ8A1562.webp', '/gallery/AQ8A1563AQ8A1563.webp',
  '/gallery/AQ8A1568AQ8A1568.webp', '/gallery/AQ8A1571AQ8A1571.webp', '/gallery/AQ8A1579AQ8A1579.webp',
  '/gallery/AQ8A1581AQ8A1581.webp', '/gallery/AQ8A1584AQ8A1584.webp', '/gallery/AQ8A1589AQ8A1589.webp',
  '/gallery/AQ8A1590AQ8A1590.webp', '/gallery/AQ8A1595AQ8A1595.webp', '/gallery/AQ8A1597AQ8A1597.webp',
  '/gallery/AQ8A1600AQ8A1600.webp', '/gallery/AQ8A1605AQ8A1605.webp', '/gallery/AQ8A1606AQ8A1606.webp',
  '/gallery/AQ8A1612AQ8A1612.webp', '/gallery/AQ8A1614AQ8A1614.webp', '/gallery/AQ8A1618AQ8A1618.webp',
  '/gallery/AQ8A1621AQ8A1621.webp', '/gallery/AQ8A1622AQ8A1622.webp', '/gallery/AQ8A1624AQ8A1624.webp',
  '/gallery/AQ8A1625AQ8A1625.webp', '/gallery/AQ8A1628AQ8A1628.webp', '/gallery/AQ8A1631AQ8A1631.webp',
  '/gallery/AQ8A1640AQ8A1640.webp', '/gallery/AQ8A1641AQ8A1641.webp', '/gallery/AQ8A1650AQ8A1650.webp',
  '/gallery/AQ8A1665AQ8A1665.webp', '/gallery/AQ8A1666AQ8A1666.webp', '/gallery/AQ8A1667AQ8A1667.webp',
  '/gallery/AQ8A1671AQ8A1671.webp', '/gallery/AQ8A1676AQ8A1676.webp', '/gallery/AQ8A1681AQ8A1681.webp',
  '/gallery/AQ8A1682AQ8A1682.webp', '/gallery/AQ8A1683AQ8A1683.webp', '/gallery/AQ8A1688AQ8A1688.webp',
  '/gallery/AQ8A1702AQ8A1702.webp', '/gallery/AQ8A1706AQ8A1706.webp', '/gallery/AQ8A1708AQ8A1708.webp',
  '/gallery/AQ8A1716AQ8A1716.webp', '/gallery/AQ8A1717AQ8A1717.webp', '/gallery/AQ8A1721AQ8A1721.webp',
  '/gallery/AQ8A1729AQ8A1729.webp', '/gallery/AQ8A1732AQ8A1732.webp', '/gallery/AQ8A1734AQ8A1734.webp',
  '/gallery/AQ8A1735AQ8A1735.webp', '/gallery/AQ8A1737AQ8A1737.webp', '/gallery/AQ8A1742AQ8A1742.webp',
  '/gallery/AQ8A1748AQ8A1748.webp', '/gallery/AQ8A1750AQ8A1750.webp', '/gallery/AQ8A1752AQ8A1752.webp',
  '/gallery/AQ8A1768AQ8A1768.webp', '/gallery/AQ8A1770AQ8A1770.webp', '/gallery/AQ8A1771AQ8A1771.webp',
  '/gallery/AQ8A1773AQ8A1773.webp',
];

const FACTORY_VIDEOS = [
  { id: 'video-facility-1', title: 'فضای کارخانه', url: '/video/facility-1.mp4', type: 'video', poster: '/banner/about-real.webp' },
  { id: 'video-processing-1', title: 'فرآوری و آماده‌سازی', url: '/video/processing-1.mp4', type: 'video', poster: '/banner/hero-chopped-scoop.webp' },
  { id: 'video-showroom-1', title: 'محصولات از نزدیک', url: '/video/showroom-1.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },
  { id: 'video-facility-2', title: 'محیط تولید', url: '/video/facility-2.mp4', type: 'video', poster: '/banner/about-real.webp' },
  { id: 'video-processing-2', title: 'خط فرآوری', url: '/video/processing-2.mp4', type: 'video', poster: '/banner/hero-chopped-scoop.webp' },
  { id: 'video-showroom-2', title: 'نمایشگاه محصولات', url: '/video/showroom-2.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },
  { id: 'video-facility-3', title: 'تور کارخانه', url: '/video/facility-3.mp4', type: 'video', poster: '/banner/about-real.webp' },
  { id: 'video-processing-3', title: 'جزئیات فرآوری', url: '/video/processing-3.mp4', type: 'video', poster: '/banner/hero-chopped-scoop.webp' },
  { id: 'video-showroom-3', title: 'محصولات و نمایشگاه', url: '/video/showroom-3.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },
  { id: 'video-showroom-4', title: 'مجموعه محصولات', url: '/video/showroom-4.mp4', type: 'video', poster: '/banner/tray-pistachio-almond.webp' },
  { id: 'video-facility-5384', title: 'روایت تصویری کارخانه', url: '/video/facility-5384.mov', type: 'video', poster: '/banner/about-real.webp' },
  { id: 'video-facility-5387', title: 'جزئیات محیط تولید', url: '/video/facility-5387.mov', type: 'video', poster: '/banner/about-real.webp' },
  { id: 'video-facility-7a8d', title: 'نگاهی به مجموعه', url: '/video/facility-7a8d.mov', type: 'video', poster: '/banner/about-real.webp' },
];

const GALLERY_ITEMS = GALLERY_PHOTOS.map((url, index) => ({
  id: `photo-${url.split('/').pop().replace(/\.webp$/i, '')}`,
  title: `تصویر ${String(index + 1).padStart(2, '0')} از مجموعه هفت طلایی`,
  url,
  type: 'image',
  poster: url,
}));

// Interleave factory clips and the complete gallery so moving images are spread
// through the masonry instead of being isolated in a separate video strip.
export const HOME_MEDIA_ITEMS = (() => {
  const result = [];
  const count = Math.max(GALLERY_ITEMS.length, FACTORY_VIDEOS.length);
  for (let i = 0; i < count; i += 1) {
    if (i < FACTORY_VIDEOS.length && i === 0) result.push(FACTORY_VIDEOS[i]);
    if (i < GALLERY_ITEMS.length) result.push(GALLERY_ITEMS[i]);
    if (i < FACTORY_VIDEOS.length && i > 0) result.push(FACTORY_VIDEOS[i]);
  }
  return result.map((item, index) => ({
    ...item,
    defaultOrder: index + 1,
    shape: index === 0 ? 'feature' : (index % 9 === 4 ? 'portrait' : (index % 5 === 2 ? 'wide' : 'standard')),
  }));
})();
'''

HOME_VIDEO_SHOWCASE = r'''import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import StoryChapter from '@/components/story/StoryChapter';
import { HOME_MEDIA_ITEMS } from '@/lib/home-media';

function LazyLoopVideo({ item, title }) {
  const videoRef = useRef(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === 'undefined') {
      setNearViewport(true);
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) setNearViewport(true);
      else video.pause();
    }, { rootMargin: '220px 0px' });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay={nearViewport}
      muted
      loop
      playsInline
      preload={nearViewport ? 'metadata' : 'none'}
      poster={item.poster}
      aria-label={title}
      className="home-media-video"
    >
      {nearViewport && <source src={item.url} type={/\.mov(?:$|\?)/i.test(item.url) ? 'video/quicktime' : 'video/mp4'} />}
    </video>
  );
}

export default function HomeVideoShowcase({ section = {}, mediaSections = [] }) {
  const [activeId, setActiveId] = useState(null);
  const overrideById = useMemo(() => {
    const map = new Map();
    mediaSections.forEach((record) => {
      const key = String(record.section_key || '');
      if (key.startsWith('media-item-')) map.set(key.slice('media-item-'.length), record);
    });
    return map;
  }, [mediaSections]);

  const media = useMemo(() => {
    const base = HOME_MEDIA_ITEMS.map((item) => {
      const override = overrideById.get(item.id);
      if (override?.published === false) return null;
      return {
        ...item,
        title: override?.title_fa || item.title,
        url: override?.media_url || item.url,
        type: override?.media_type || item.type,
        poster: override?.image || item.poster,
        order: override && Number(override.sort_order) > 0 ? Number(override.sort_order) : item.defaultOrder,
      };
    }).filter(Boolean);

    const defaultIds = new Set(HOME_MEDIA_ITEMS.map((item) => item.id));
    const custom = mediaSections
      .filter((record) => {
        const key = String(record.section_key || '');
        return key.startsWith('media-item-')
          && !defaultIds.has(key.slice('media-item-'.length))
          && record.published !== false
          && typeof record.media_url === 'string'
          && record.media_url.trim();
      })
      .map((record, index) => ({
        id: String(record.section_key).slice('media-item-'.length),
        title: record.title_fa || 'تصویر از مجموعه هفت طلایی',
        url: record.media_url,
        type: record.media_type || 'image',
        poster: record.image || record.media_url,
        shape: 'standard',
        order: Number(record.sort_order) > 0 ? Number(record.sort_order) : HOME_MEDIA_ITEMS.length + index + 1,
      }));

    return [...base, ...custom].sort((a, b) => a.order - b.order);
  }, [mediaSections, overrideById]);

  const activeItem = media.find((item) => item.id === activeId) || null;

  useEffect(() => {
    if (!activeItem) return undefined;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveId(null);
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const index = media.findIndex((item) => item.id === activeItem.id);
        const delta = event.key === 'ArrowLeft' ? 1 : -1;
        const next = media[(index + delta + media.length) % media.length];
        setActiveId(next?.id || null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = priorOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeItem, media]);

  const moveLightbox = (delta) => {
    if (!activeItem || !media.length) return;
    const index = media.findIndex((item) => item.id === activeItem.id);
    setActiveId(media[(index + delta + media.length) % media.length]?.id || null);
  };

  if (!media.length) return null;

  return (
    <section className="chapter relative overflow-hidden home-media-section" aria-label="گالری ویدیو و تصاویر هفت طلایی">
      {section.image && <img src={section.image} alt="" aria-hidden="true" loading="lazy" decoding="async" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.055]" />}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(190,151,62,.10), transparent 70%)' }} />
      <div className="chapter-shell relative">
        <div className="mb-10 md:mb-14">
          <StoryChapter
            index="05"
            eyebrow={section.badge_fa || 'تصاویر واقعی از مجموعه'}
            title={section.title_fa || 'زیبایی در جزئیات است'}
            lead={section.subtitle_fa || 'روایتی موزاییکی از فضای کارخانه، فرآوری و تصاویر ثبت‌شدهٔ محصولات هفت طلایی؛ ویدیوها بی‌صدا و پیوسته مانند تصویر متحرک نمایش داده می‌شوند.'}
            align="center"
          />
        </div>

        <div className="home-media-mosaic">
          {media.map((item, index) => (
            <article key={item.id} className={`home-media-tile home-media-tile--${item.shape || (index % 7 === 0 ? 'wide' : 'standard')}`}>
              <button type="button" className="home-media-trigger group" onClick={() => setActiveId(item.id)} aria-label={`نمایش ${item.title}`}>
                {item.type === 'video' ? (
                  <LazyLoopVideo item={item} title={item.title} />
                ) : (
                  <img src={item.url} alt={item.title} loading="lazy" decoding="async" />
                )}
                <span className="home-media-shade" aria-hidden="true" />
                <span className="home-media-meta">
                  <span className="home-media-kind">{item.type === 'video' ? 'ویدیو · تولید و فرآوری' : 'تصویر · 7GOLDEN'}</span>
                  <strong title={item.title}>{item.title}</strong>
                  <span className="home-media-open"><ArrowUpLeft size={17} /></span>
                </span>
              </button>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t pt-5" style={{ borderColor: 'var(--hairline)' }}>
          <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>هفت طلایی · قزوین</span>
          <span className="text-xs tracking-[.12em]" style={{ color: 'var(--gold-2)' }}>PRODUCT · PROCESS · DETAIL</span>
        </div>
      </div>

      {activeItem && (
        <div className="home-media-lightbox" role="dialog" aria-modal="true" aria-label={activeItem.title} onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveId(null); }}>
          <button type="button" className="home-media-lightbox-close" onClick={() => setActiveId(null)} aria-label="بستن"><X size={22} /></button>
          <button type="button" className="home-media-lightbox-prev" onClick={() => moveLightbox(-1)} aria-label="مورد قبلی"><ChevronRight size={25} /></button>
          <div className="home-media-lightbox-content">
            {activeItem.type === 'video' ? (
              <video src={activeItem.url} poster={activeItem.poster} controls autoPlay muted loop playsInline />
            ) : (
              <img src={activeItem.url} alt={activeItem.title} />
            )}
            <p>{activeItem.title}</p>
          </div>
          <button type="button" className="home-media-lightbox-next" onClick={() => moveLightbox(1)} aria-label="مورد بعدی"><ChevronLeft size={25} /></button>
        </div>
      )}
    </section>
  );
}
'''

HOME_NEWS = r'''import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';
import { getNewsPosts } from '@/lib/api/content';
import { NEWS_CATEGORIES } from '@/lib/news-content';

function NewsTile({ item, featured = false }) {
  const category = NEWS_CATEGORIES[item.category];
  const label = category?.label || item.categoryLabel || item.category || 'خبر';
  return (
    <Link to={`/news/${item.slug || item.id}`} className={'home-news-tile group ' + (featured ? 'home-news-featured' : '')} aria-label={`مشاهده خبر: ${item.title}`}>
      <img src={item.image || '/banner/banner-four-bowls.webp'} alt="" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/banner/banner-four-bowls.webp'; }} />
      <span className="home-news-scrim" aria-hidden="true" />
      <span className="home-news-tile-content">
        <span className="home-news-meta"><i style={{ background: category?.tone || 'var(--gold-2)' }} aria-hidden="true" />{label} <b>·</b> {item.date || ''}</span>
        <strong>{item.title}</strong>
        {featured && <em>{item.excerpt}</em>}
        <span className="home-news-read">مشاهده خبر <ArrowLeft size={15} /></span>
      </span>
    </Link>
  );
}

export default function HomeNews({ section = {} }) {
  const [items, setItems] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getNewsPosts({ limit: 3, skip: 0 })
      .then((rows) => { if (active) { setItems(Array.isArray(rows) ? rows : []); setLoadError(false); } })
      .catch(() => { if (active) { setItems([]); setLoadError(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const [featured, ...rest] = items;
  return (
    <section className="chapter home-news-section" aria-label="اخبار و اطلاعیه‌های هفت طلایی">
      <div className="chapter-shell">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <StoryChapter index="07" eyebrow={section.badge_fa || 'اخبار و اطلاعیه‌ها'} title={section.title_fa || 'از هفت طلایی، نزدیک‌تر'} lead={section.subtitle_fa || 'روایت‌هایی از محصولات و فرآوری، برگرفته از اخبار منتشرشده در پایگاه محتوای مجموعه.'} />
          <Link to="/news" className="home-news-all">همه اخبار <ArrowLeft size={16} /></Link>
        </div>
        {loading ? <p className="home-content-status" role="status">در حال بارگذاری خبرها…</p> : items.length > 0 ? (
          <div className="home-news-grid">
            <Reveal variant="up" className="home-news-feature-wrap"><NewsTile item={featured} featured /></Reveal>
            <div className="home-news-stack">
              {rest.map((item, index) => <Reveal key={item.slug || item.id} delay={index * 100} variant="up"><NewsTile item={item} /></Reveal>)}
            </div>
          </div>
        ) : (
          <p className="home-content-status" role="status">{loadError ? 'خبرها از پایگاه داده دریافت نشدند.' : 'در حال حاضر خبر منتشرشده‌ای برای نمایش نیست.'}</p>
        )}
      </div>
    </section>
  );
}
'''

HOME_MAGAZINE = r'''import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Reveal from '@/components/story/Reveal';
import StoryChapter from '@/components/story/StoryChapter';
import { getBlogPosts } from '@/lib/api/content';

export default function HomeMagazine({ section = {} }) {
  const [posts, setPosts] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getBlogPosts({ limit: 3, skip: 0 })
      .then((rows) => { if (active) { setPosts(Array.isArray(rows) ? rows : []); setLoadError(false); } })
      .catch(() => { if (active) { setPosts([]); setLoadError(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section className="chapter home-magazine-section" aria-label="مجله هفت طلایی">
      <div className="chapter-shell">
        <div className="home-magazine-heading">
          <StoryChapter index="08" eyebrow={section.badge_fa || 'MAGAZINE · مجله'} title={section.title_fa || 'دانش کاربردی برای انتخاب بهتر'} lead={section.subtitle_fa || 'مقاله‌های منتشرشدهٔ وبلاگ هفت طلایی؛ بدون جایگزینی محتوای ثابت در نبود دادهٔ CMS.'} />
          <Link to="/blog" className="home-news-all">ورود به مجله <ArrowLeft size={16} /></Link>
        </div>
        {loading ? <p className="home-content-status" role="status">در حال بارگذاری مقاله‌ها…</p> : posts.length > 0 ? (
          <div className="home-magazine-grid">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 90} variant="up">
                <Link to={`/blog/${post.slug}`} className="home-magazine-card group">
                  <div className="home-magazine-image">
                    <img src={post.image || '/banner/banner-four-bowls.webp'} alt="" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/banner/banner-four-bowls.webp'; }} />
                    <span className="home-magazine-number">۰{index + 1}</span>
                  </div>
                  <div className="home-magazine-copy">
                    <span>{post.category || 'راهنمای محصول'}</span>
                    <h3>{post.titleFA || post.titleEN || post.slug}</h3>
                    <p>{post.excerptFA || post.excerptEN || ''}</p>
                    <strong>مطالعه مقاله <ArrowLeft size={14} /></strong>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="home-content-status" role="status">{loadError ? 'مقاله‌ها از پایگاه داده دریافت نشدند.' : 'در حال حاضر مقالهٔ منتشرشده‌ای برای نمایش نیست.'}</p>
        )}
      </div>
    </section>
  );
}
'''


def patch_schema(content: str) -> str:
    content = replace_once(
        content,
        "model Award {",
        """model NewsPost {
  id         String   @id @default(cuid())
  slug       String   @unique
  title_fa   String
  excerpt_fa String?
  content    String?
  date_fa    String?
  category   String?
  image      String
  photos     String?  // Optional JSON array of gallery paths
  videos     String?  // Optional JSON array of video metadata
  published  Boolean  @default(true)
  sort_order Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Award {""",
        "NewsPost Prisma model",
    )
    return replace_once(
        content,
        "  image       String?\n  published   Boolean  @default(true)\n  sort_order  Int      @default(0)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n}\n\nmodel SiteSettings {",
        "  image       String?\n  media_url   String?  // Local public path, e.g. /video/processing-1.mp4\n  media_type  String   @default(\"image\") // image | video\n  published   Boolean  @default(true)\n  sort_order  Int      @default(0)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n}\n\nmodel SiteSettings {",
        "PageSection media fields",
    )


def patch_serialize(content: str) -> str:
    content = replace_once(
        content,
        "export function serializeGeneric(r: any) {\n  if (!r) return r;\n  return {\n    ...r,\n    created_date: r.createdAt,\n    updated_date: r.updatedAt,\n  };\n}\n",
        """export function serializeGeneric(r: any) {
  if (!r) return r;
  return {
    ...r,
    created_date: r.createdAt,
    updated_date: r.updatedAt,
  };
}

export function serializeNewsPost(r: any) {
  if (!r) return r;
  return {
    ...serializeGeneric(r),
    photos: safeJson(r.photos, []),
    videos: safeJson(r.videos, []),
  };
}
""",
        "NewsPost serializer",
    )
    content = replace_once(
        content,
        "  if (Array.isArray(r.gallery)) r.gallery = r.gallery.map((g: any) => normalizeMediaUrl(g));\n  return r;",
        """  if (Array.isArray(r.gallery)) r.gallery = r.gallery.map((g: any) => normalizeMediaUrl(g));
  if (Array.isArray(r.photos)) r.photos = r.photos.map((src: any) => normalizeMediaUrl(src));
  if (Array.isArray(r.videos)) {
    r.videos = r.videos.map((video: any) => {
      if (typeof video === 'string') return normalizeMediaUrl(video);
      if (!video || typeof video !== 'object') return video;
      return {
        ...video,
        image: normalizeMediaUrl(video.image),
        src: normalizeMediaUrl(video.src),
        url: normalizeMediaUrl(video.url),
      };
    });
  }
  return r;""",
        "news media normalization",
    )
    content = replace_once(
        content,
        "  BlogPost: [\n    'slug','title_fa','excerpt_fa','content','date_fa','category','image','published','sort_order',\n  ],",
        "  BlogPost: [\n    'slug','title_fa','excerpt_fa','content','date_fa','category','image','published','sort_order',\n  ],\n  NewsPost: [\n    'slug','title_fa','excerpt_fa','content','date_fa','category','image','photos','videos','published','sort_order',\n  ],",
        "NewsPost writable fields",
    )
    return replace_once(
        content,
        "  PageSection: ['page_key','section_key','title_fa','subtitle_fa','badge_fa','image','published','sort_order'],",
        "  PageSection: ['page_key','section_key','title_fa','subtitle_fa','badge_fa','image','media_url','media_type','published','sort_order'],",
        "PageSection writable media fields",
    )


def patch_entities(content: str) -> str:
    content = replace_once(
        content,
        "  serializeGeneric,\n  prepareProductData,",
        "  serializeGeneric,\n  serializeNewsPost,\n  prepareProductData,",
        "import NewsPost serializer",
    )
    content = replace_once(content, "  | 'blogPost'\n  | 'award'", "  | 'blogPost'\n  | 'newsPost'\n  | 'award'", "NewsPost entity type")
    content = replace_once(content, "  BlogPost: 'blogPost',\n  Award:", "  BlogPost: 'blogPost',\n  NewsPost: 'newsPost',\n  Award:", "NewsPost entity map")
    content = replace_once(content, "const HAS_PUBLISHED = new Set(['Product', 'BlogPost', 'Award', 'GalleryImage', 'PageSection']);", "const HAS_PUBLISHED = new Set(['Product', 'BlogPost', 'NewsPost', 'Award', 'GalleryImage', 'PageSection']);", "NewsPost publish filter")
    content = replace_once(
        content,
        "  if (entity === 'Product') out = serializeProduct(row);\n  else if (entity === 'Order') out = serializeOrder(row);\n  else out = serializeGeneric(row);",
        "  if (entity === 'Product') out = serializeProduct(row);\n  else if (entity === 'Order') out = serializeOrder(row);\n  else if (entity === 'NewsPost') out = serializeNewsPost(row);\n  else out = serializeGeneric(row);",
        "NewsPost entity serialization",
    )
    return replace_once(
        content,
        "  if (entity === 'Product') data = prepareProductData(data);\n  else if (entity === 'BlogPost') data = prepareBlogPostData(data);\n  else if (entity === 'Order') data = prepareOrderData(data);",
        "  if (entity === 'Product') data = prepareProductData(data);\n  else if (entity === 'BlogPost' || entity === 'NewsPost') data = prepareBlogPostData(data);\n  else if (entity === 'Order') data = prepareOrderData(data);",
        "NewsPost entity preparation",
    )


def patch_content_routes(content: str) -> str:
    content = replace_once(content, "  serializeGeneric,\n  normalizeRowMedia,", "  serializeGeneric,\n  serializeNewsPost,\n  normalizeRowMedia,", "NewsPost routes serializer import")
    content = replace_regex_once(
        content,
        r"const UNVERIFIED_LEGACY_BLOG_SLUGS = \[\s\S]*?\];\n",
        "",
        "remove hard-coded public blog slug exclusion",
    )
    content = content.replace("    if (req.user?.role !== 'admin') where.slug = { notIn: UNVERIFIED_LEGACY_BLOG_SLUGS };\n", "")
    content = replace_once(
        content,
        "    if (req.user?.role !== 'admin' && UNVERIFIED_LEGACY_BLOG_SLUGS.includes(req.params.slug)) {\n      return res.status(404).json({ error: 'Not found' });\n    }\n",
        "",
        "public article detail honors CMS publish status",
    )
    news_routes = r'''// News: published NewsPost records are independent from the blog collection.
router.get('/news', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const requestedLimit = Math.trunc(Number(req.query.limit) || 12);
    const limit = Math.min(Math.max(requestedLimit, 1), 100);
    const skip = Math.max(0, Math.trunc(Number(req.query.skip) || 0));
    const where: any = { published: true };

    const category = String(req.query.category || '').trim();
    if (category) where.category = category;
    const query = String(req.query.q || '').trim().slice(0, 200);
    if (query) {
      where.OR = [
        { title_fa: { contains: query, mode: 'insensitive' } },
        { excerpt_fa: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.newsPost.findMany({
      where,
      orderBy: [{ sort_order: 'asc' }, { createdAt: 'desc' }, { id: 'asc' }],
      skip,
      take: limit,
    });
    res.json(items.map((item) => normalizeRowMedia(serializeNewsPost(item))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/news/meta', async (req, res) => {
  try {
    const where: any = { published: true };
    const [total, grouped] = await Promise.all([
      prisma.newsPost.count({ where }),
      prisma.newsPost.groupBy({
        by: ['category'],
        where,
        _count: { _all: true },
        orderBy: { category: 'asc' },
      }),
    ]);
    res.json({
      total,
      categories: grouped
        .filter((row) => typeof row.category === 'string' && row.category.trim())
        .map((row) => ({ category: row.category, count: row._count._all })),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/news/:slug', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const item = await prisma.newsPost.findFirst({
      where: { slug: req.params.slug, published: true },
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(normalizeRowMedia(serializeNewsPost(item)));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

'''
    content = replace_once(content, "// Testimonials\nrouter.get('/testimonials'", news_routes + "// Testimonials\nrouter.get('/testimonials'", "insert NewsPost public API routes")

    old_sections = '''// Page Sections (public)
router.get('/page-sections', async (req, res) => {
  try {
    const where: any = { published: true };
    if (req.query.page) where.page_key = String(req.query.page);
    const items = await prisma.pageSection.findMany({
      where,
      orderBy: { sort_order: 'asc' },
      take: 200,
    });
    res.json(items.map((x) => normalizeRowMedia(serializeGeneric(x))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});'''
    new_sections = '''// Page Sections (public). Unpublished rows expose only a visibility marker so the
// homepage can honor an admin's hide toggle without leaking hidden copy/media.
router.get('/page-sections', async (req, res) => {
  try {
    const where: any = {};
    if (req.query.page) where.page_key = String(req.query.page);
    const items = await prisma.pageSection.findMany({
      where,
      orderBy: { sort_order: 'asc' },
      take: 200,
    });
    res.json(items.map((row) => row.published === false
      ? { id: row.id, page_key: row.page_key, section_key: row.section_key, published: false, sort_order: row.sort_order }
      : normalizeRowMedia(serializeGeneric(row))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});'''
    content = replace_once(content, old_sections, new_sections, "published section visibility markers")
    return content


def patch_api(content: str) -> str:
    content = replace_once(
        content,
        "function normalizeGalleryImage(r) {",
        """function normalizeNewsPost(r) {
  const photos = Array.isArray(r.photos) ? r.photos : [];
  const videos = Array.isArray(r.videos) ? r.videos : [];
  return {
    id: r.slug || r.id,
    slug: r.slug,
    title: r.title_fa,
    excerpt: r.excerpt_fa || '',
    content: r.content || '',
    date: r.date_fa || '',
    category: r.category || 'announcement',
    categoryLabel: r.category_label || '',
    image: r.image || '/banner/banner-four-bowls.webp',
    photos,
    videos,
    published: r.published !== false,
  };
}

function normalizeGalleryImage(r) {""",
        "NewsPost client normalizer",
    )
    content = replace_once(
        content,
        "export async function getGalleryImages() {",
        """export async function getNewsPosts(opts = {}) {
  const { limit = 8, skip = 0, category, query } = opts;
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) });
  if (category) params.set('category', category);
  if (query) params.set('q', query);
  const items = await get(`/news?${params.toString()}`);
  return items.map(normalizeNewsPost);
}

export async function getNewsMeta() {
  const meta = await get('/news/meta');
  return {
    total: Number(meta?.total) || 0,
    categories: Array.isArray(meta?.categories)
      ? meta.categories.filter((item) => item && typeof item.category === 'string' && item.category.trim())
      : [],
  };
}

export async function getNewsPostBySlug(slug) {
  try {
    return normalizeNewsPost(await get(`/news/${encodeURIComponent(slug)}`));
  } catch {
    return null;
  }
}

export async function getGalleryImages() {""",
        "NewsPost API helpers",
    )
    return replace_once(
        content,
        "    return sections\n      .filter(s => String(s.section_key || '').trim().toLowerCase().startsWith('hero'))",
        "    return sections\n      .filter(s => s.published !== false && String(s.section_key || '').trim().toLowerCase().startsWith('hero'))",
        "ignore unpublished hero markers",
    )


def patch_admin(content: str) -> str:
    content = replace_once(content, "{ id: 'gallery', label: 'اخبار', icon: ImageIcon },", "{ id: 'gallery', label: 'گالری تصاویر', icon: ImageIcon },\n  { id: 'news', label: 'اخبار و اطلاعیه‌ها', icon: FileText },", "separate gallery and news menus")
    content = replace_once(content, "{active === 'gallery' && <MediaSection />}\n", "{active === 'gallery' && <MediaSection />}\n      {active === 'news' && <NewsAdminSection />}\n", "News admin route")
    news_admin = r'''function NewsAdminSection() {
  return (
    <EntityCrud
      entityName="NewsPost"
      title="خبر و اطلاعیه"
      defaultSort="sort_order"
      columns={[
        { key: 'image', label: 'کاور', render: (row) => row.image ? <img src={row.image} alt="" className="w-12 h-10 rounded object-cover" /> : '—' },
        { key: 'title_fa', label: 'عنوان' },
        { key: 'slug', label: 'شناسه URL' },
        { key: 'category', label: 'دسته‌بندی' },
        { key: 'published', label: 'منتشر', toggleBool: true },
      ]}
      fields={[
        { key: 'slug', label: 'شناسه URL', placeholder: 'product-catalog-update', required: true },
        { key: 'title_fa', label: 'عنوان خبر', required: true },
        { key: 'excerpt_fa', label: 'خلاصه', type: 'textarea' },
        { key: 'content', label: 'متن کامل', type: 'richtext' },
        { key: 'category', label: 'دسته‌بندی', type: 'select', default: 'announcement', options: [
          { value: 'announcement', label: 'اطلاعیه' },
          { value: 'product', label: 'محصولات' },
          { value: 'company', label: 'درباره مجموعه' },
          { value: 'ordering', label: 'راهنمای سفارش' },
          { value: 'media', label: 'آرشیو تصویری' },
        ] },
        { key: 'date_fa', label: 'تاریخ نمایش', placeholder: '۱۴۰۵/۰۷/۲۱' },
        { key: 'image', label: 'تصویر کاور', type: 'image', required: true },
        { key: 'published', label: 'منتشر شده', type: 'boolean', default: true },
        { key: 'sort_order', label: 'ترتیب', type: 'number', default: 0 },
      ]}
    />
  );
}

'''
    content = replace_once(content, "function BlogSection() {", news_admin + "function BlogSection() {", "insert News admin form")
    content = replace_once(
        content,
        "        { key: 'image', label: 'تصویر هیرو / پس‌زمینه', type: 'image' },\n        { key: 'published', label: 'منتشر شده', type: 'boolean', default: true },",
        "        { key: 'image', label: 'تصویر هیرو / پس‌زمینه یا پوستر ویدیو', type: 'image' },\n        { key: 'media_type', label: 'نوع رسانه (برای آیتم‌های موزاییک)', type: 'select', default: 'image', options: [{ value: 'image', label: 'تصویر' }, { value: 'video', label: 'ویدیو' }] },\n        { key: 'media_url', label: 'مسیر رسانه (مثلاً /video/processing-1.mp4)', placeholder: 'برای آیتم‌های گالری: media-item-video-processing-1' },\n        { key: 'published', label: 'منتشر شده', type: 'boolean', default: true },",
        "page section admin media fields",
    )
    return content


def patch_seed(content: str) -> str:
    content = replace_regex_once(
        content,
        r"const UNVERIFIED_LEGACY_BLOG_SLUGS = \[[\s\S]*?\];\n",
        "",
        "remove legacy slug array from seed",
    )
    content = replace_once(
        content,
        "  // These bundled legacy articles contain unverified event, customer, export and\n  // laboratory claims. Keep their records for editorial review, but never publish them\n  // automatically. CMS-authored content with other slugs is not touched.\n  await prisma.blogPost.updateMany({\n    where: { slug: { in: UNVERIFIED_LEGACY_BLOG_SLUGS } },\n    data: { published: false },\n  });\n",
        "  // Do not rewrite BlogPost.published during seed. The admin's CMS publish state is authoritative.\n",
        "stop seed from undoing manual blog publication",
    )
    seed_insert = r'''  // Seed the existing newsroom archive into its own NewsPost collection.
  // Empty updates are deliberate: the seed initializes missing rows but never overwrites
  // later title/body/publish edits made in the admin panel.
  const newsPostData = [
    {
      slug: 'product-catalog-update', category: 'product', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 1,
      title_fa: 'معرفی سبد محصولات هفت طلایی برای صنایع غذایی',
      excerpt_fa: 'سبد محصولات هفت طلایی بر سه خانواده فندق، پسته و بادام و شکل‌های مختلف فرآوری آن‌ها تمرکز دارد؛ انتخاب فرم مناسب از کاربرد نهایی شروع می‌شود.',
      image: '/gallery/AQ8A1499AQ8A1499.webp',
      content: 'هفت طلایی سبد محصولات خود را برای نیازهای متنوع صنایع غذایی معرفی می‌کند: محصولات فندق، پسته و بادام در فرم‌هایی مانند مغز، خلال، پرک، خمیر، گرانول و پودر. همهٔ فرم‌ها برای همهٔ کاربردها یکسان نیستند؛ بنابراین مشخص‌کردن کاربرد نهایی، نخستین قدم در انتخاب محصول.\n\nبرای شکلات، بستنی، قنادی، بیسکویت و فرآورده‌های مشابه، شکل ماده اولیه می‌تواند بر بافت و ظاهر محصول نهایی اثر بگذارد. هنگام استعلام، نوع محصول و فرم موردنیاز را دقیق اعلام کنید تا مشخصات موجود و شرایط سفارش بررسی شود.\n\nاین معرفی جایگزین مشخصات فنی یک سفارش نیست. موجودی، گرید، بسته‌بندی و زمان تحویل باید برای هر درخواست به‌صورت جداگانه تأیید شوند.',
    },
    {
      slug: 'quote-request-details', category: 'ordering', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 2,
      title_fa: 'اطلاعیه برای خریداران عمده: درخواست قیمت دقیق‌تر ثبت کنید',
      excerpt_fa: 'برای بررسی سریع‌تر درخواست خرید، نام محصول، فرم موردنیاز، کاربرد نهایی، حجم تقریبی و مقصد تحویل را در پیام خود بنویسید.',
      image: '/gallery/AQ8A1505AQ8A1505.webp',
      content: 'برای آنکه درخواست قیمت قابل بررسی باشد، تنها نوشتن نام کلی «پسته»، «فندق» یا «بادام» کافی نیست. لطفاً مشخص کنید محصول را به چه شکلی می‌خواهید؛ برای مثال مغز، خلال، پرک، خمیر، گرانول یا پودر.\n\nکاربرد محصول، مقدار تقریبی سفارش، مقصد تحویل و نوع بسته‌بندی موردنظر نیز به روشن‌شدن درخواست کمک می‌کند. اگر اندازه برش یا ویژگی ظاهری مشخصی برای فرمول تولید شما اهمیت دارد، آن را در پیام ذکر کنید.\n\nقیمت، موجودی و جزئیات تحویل پس از دریافت اطلاعات سفارش بررسی می‌شود. هیچ وزن بسته‌بندی یا زمان تحویلی بدون هماهنگی نهایی فرض نمی‌شود.',
    },
    {
      slug: 'sample-request-guidance', category: 'ordering', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 3,
      title_fa: 'راهنمای درخواست نمونه برای ارزیابی در خط تولید',
      excerpt_fa: 'اگر پیش از خرید عمده نیاز به بررسی نمونه دارید، محصول و کاربرد آن را مشخص کنید تا امکان ارائه نمونه و شرایط آن هماهنگ شود.',
      image: '/gallery/AQ8A1520AQ8A1520.webp',
      content: 'آزمودن ماده اولیه در شرایط واقعی تولید می‌تواند به تصمیم‌گیری دقیق‌تر کمک کند. ظاهر یک محصول به‌تنهایی نشان نمی‌دهد که در فرمول شما چه رفتاری خواهد داشت؛ به همین دلیل بهتر است ارزیابی نمونه با همان دستور تولید و شرایطی انجام شود که قرار است در عمل استفاده شوند.\n\nبرای شروع، نوع محصول، شکل موردنیاز، کاربرد نهایی و مقدار تقریبی مصرف را آماده کنید. اگر معیار مشخصی مانند اندازه ذرات، رنگ یا بافت برای شما اهمیت دارد، آن را هم توضیح دهید.\n\nامکان ارائه نمونه، موجودی و نحوه هماهنگی باید هنگام تماس تأیید شود. این اطلاعیه وعدهٔ ارسال خودکار نمونه یا زمان تحویل مشخصی ایجاد نمی‌کند.',
    },
    {
      slug: 'company-history-note', category: 'company', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 4,
      title_fa: 'مروری بر مسیر فعالیت هفت طلایی در قزوین',
      excerpt_fa: 'ریشهٔ خانوادگی کسب‌وکار به خشکبار محمدی در بازار قزوین در سال ۱۳۳۵ بازمی‌گردد؛ کارگاه فرآوری در ۱۳۷۷ آغاز شد و شرکت در ۱۳۹۶ ثبت شد.',
      image: '/gallery/AQ8A1640AQ8A1640.webp',
      content: 'داستان هفت طلایی بخشی از یک مسیر خانوادگی در بازار خشکبار قزوین است. فعالیت خشکبار محمدی از سال ۱۳۳۵ آغاز شده و این سابقه، زمینهٔ ورود نسل بعدی به فرآوری را فراهم کرده است.\n\nکارگاه کوچک فرآوری در سال ۱۳۷۷ شروع به کار کرد. در سال ۱۳۹۶ نیز شرکت «خشکبار و بسته‌بندی هفت طلایی» به ثبت رسید. این تاریخ‌ها سه نقطهٔ متمایز در مسیر کسب‌وکارند: ریشهٔ بنکداری خانوادگی، آغاز فرآوری و ثبت شرکت.\n\nامروز تمرکز سبد محصولات معرفی‌شده در وب‌سایت بر فندق، پسته و بادام و فرم‌های گوناگون آن‌هاست. جزئیات سفارش و موجودی هر محصول از طریق ارتباط با مجموعه قابل پیگیری است.',
    },
    {
      slug: 'media-archive-update', category: 'media', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 5,
      title_fa: 'گسترش آرشیو تصویری محصولات و فضای مجموعه',
      excerpt_fa: 'آرشیو تصویری وب‌سایت، مجموعه‌ای از عکس‌ها و ویدئوهای موجود درباره محصولات و فضای کار را در یک مسیر قابل مرور گرد هم می‌آورد.',
      image: '/gallery/AQ8A1579AQ8A1579.webp',
      content: 'بخش تصویری وب‌سایت برای مشاهدهٔ عکس‌ها و ویدئوهای موجود از محصولات و فضای مجموعه توسعه یافته است. هدف آرشیو این است که مخاطب بتواند پیش از تماس، تصویری روشن‌تر از خانواده‌های محصول و محتوای بصری منتشرشده در سایت به دست آورد.\n\nاین تصاویر برای معرفی بصری به کار می‌روند و به‌تنهایی جایگزین مشخصات فنی، تأیید موجودی یا ارزیابی نمونه نیستند. اگر دربارهٔ یک محصول خاص پرسشی دارید، نام و فرم دقیق آن را در درخواست خود ذکر کنید.\n\nمحتواهای تازه در صورت آماده‌شدن و تأیید مجموعه می‌توانند به این آرشیو اضافه شوند.',
    },
    {
      slug: 'product-forms-announcement', category: 'product', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 6,
      title_fa: 'آشنایی با شکل‌های مختلف فرآورده‌های خشکبار',
      excerpt_fa: 'مغز، خلال، پرک، خمیر، گرانول و پودر نقش‌های متفاوتی در فرمولاسیون دارند؛ شکل محصول باید بر اساس نیاز خط تولید انتخاب شود.',
      image: '/banner/hazelnut-spoon.webp',
      content: 'فرآوری، یک ماده اولیه را به شکل‌هایی تبدیل می‌کند که برای کاربردهای مختلف مناسب‌اند. مغز کامل ظاهر مشخصی دارد؛ خلال و پرک برای نمایش قطعات یا پوشش سطح استفاده می‌شوند؛ گرانول بافت ذره‌ای ایجاد می‌کند و پودر در فرمول‌هایی به کار می‌رود که شکل ریزتر لازم است.\n\nدر خانواده فندق، هفت طلایی فندق خندان، مغز خام و رست، خمیر، گرانول و پودر را معرفی می‌کند. در خانواده پسته، مغز، مغز پوست‌کنده، خلال و پودر مطرح‌اند. در خانواده بادام نیز مغز بادام درختی، خلال، پرک و پودر از شکل‌های شناخته‌شده‌اند.\n\nانتخاب نهایی باید با فرمول تولید، ویژگی ظاهری موردنظر و مشخصات قابل عرضه هماهنگ باشد. برای اطلاع از موجودی و گریدها، درخواست خود را با جزئیات ارسال کنید.',
    },
    {
      slug: 'contact-details-reminder', category: 'announcement', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 7,
      title_fa: 'اطلاعیه ارتباط با واحد بازرگانی',
      excerpt_fa: 'برای درخواست قیمت یا اطلاعات محصول، فرم تماس وب‌سایت یا اطلاعات تماس درج‌شده در پایین صفحه را به کار ببرید و نوع محصول را مشخص کنید.',
      image: '/gallery/AQ8A1742AQ8A1742.webp',
      content: 'واحد بازرگانی نقطهٔ شروع گفت‌وگو دربارهٔ محصولات و سفارش‌های عمده است. برای دریافت پاسخ مرتبط‌تر، نام محصول، شکل موردنیاز، کاربرد نهایی و حجم تقریبی سفارش را از ابتدا ذکر کنید.\n\nاگر دربارهٔ بسته‌بندی، مقصد تحویل یا زمان‌بندی خاصی پرسش دارید، آن را در همان پیام اضافه کنید. جزئیات نهایی هر سفارش پس از بررسی و هماهنگی تأیید می‌شود.\n\nراه‌های ارتباطی به‌روز در صفحهٔ تماس و فوتر وب‌سایت درج شده‌اند. برای جلوگیری از اطلاعات نادرست، ساعت کاری یا کانال اجتماعی تأییدنشده‌ای در این اطلاعیه اعلام نمی‌شود.',
    },
  ];

  for (const item of newsPostData) {
    await prisma.newsPost.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, published: true },
    });
  }

  // Create the homepage's editable section records once. Existing admin edits,
  // including published=false, are never overwritten by this seed.
  const homeSectionDefaults = [
    { section_key: 'hero', title_fa: 'خشکبار هفت طلایی', subtitle_fa: 'فرآوری فندق، پسته و بادام برای صنایع غذایی؛ با سابقه فعالیت کارگاهی از سال ۱۳۷۷.', badge_fa: 'هفت طلایی · قزوین', image: '/banner/hero-nuts-bowl.webp', sort_order: 10 },
    { section_key: 'capacity', title_fa: 'فرآوری خشکبار در قزوین', subtitle_fa: 'فعالیت فرآوری هفت طلایی از سال ۱۳۷۷ آغاز شده است. فهرست محصولات مجموعه شامل مغز فندق، خمیر و گرانول فندق، مغز و خلال پسته و شکل‌های مختلف بادام است.', badge_fa: 'توانمندی‌های ۷ گلدن', image: '/banner/img-6052.webp', sort_order: 20 },
    { section_key: 'origin', title_fa: 'سه گروه محصول؛ کاربردهای متنوع', subtitle_fa: 'فهرست محصولات هفت طلایی بر فندق، پسته و بادام متمرکز است. هر گروه در شکل‌های مختلف فرآوری عرضه می‌شود تا برای کاربردهای متفاوت در صنایع غذایی قابل انتخاب باشد.', badge_fa: 'محصولات هفت طلایی', image: '/banner/banner-spoons-set.webp', sort_order: 30 },
    { section_key: 'products', title_fa: 'محصولات هفت طلایی', subtitle_fa: 'در فهرست محصولات، پسته، بادام و فندق در شکل‌های مختلف آماده‌سازی عرضه می‌شوند؛ از مغز و خلال تا پرک، خمیر، گرانول و پودر.', badge_fa: 'مجموعه محصولات', image: '/gallery/AQ8A1505AQ8A1505.webp', sort_order: 40 },
    { section_key: 'visual-gallery', title_fa: 'زیبایی در جزئیات است', subtitle_fa: 'روایتی موزاییکی از فضای کارخانه، فرآوری و تصاویر ثبت‌شدهٔ محصولات هفت طلایی؛ ویدیوها بی‌صدا و پیوسته مانند تصویر متحرک نمایش داده می‌شوند.', badge_fa: 'تصاویر واقعی از مجموعه', sort_order: 50 },
    { section_key: 'news', title_fa: 'از هفت طلایی، نزدیک‌تر', subtitle_fa: 'روایت‌هایی از محصولات و فرآوری، برگرفته از اخبار منتشرشده در پایگاه محتوای مجموعه.', badge_fa: 'اخبار و اطلاعیه‌ها', sort_order: 60 },
    { section_key: 'magazine', title_fa: 'دانش کاربردی برای انتخاب بهتر', subtitle_fa: 'مقاله‌های منتشرشدهٔ وبلاگ هفت طلایی؛ بدون جایگزینی محتوای ثابت در نبود دادهٔ CMS.', badge_fa: 'MAGAZINE · مجله', sort_order: 70 },
    { section_key: 'order', title_fa: 'از انتخاب محصول تا آماده‌سازی سفارش', subtitle_fa: 'هر سفارش با شناخت نیاز مجموعه شما آغاز می‌شود. مشخصات محصول، مقدار و نوع بسته‌بندی در کنار هم بررسی می‌شوند تا مسیر سفارش بر مبنای نیاز واقعی شما شکل بگیرد.', badge_fa: 'فرایند همکاری', sort_order: 80 },
    { section_key: 'awards', title_fa: 'مروری بر سوابق هفت طلایی', subtitle_fa: '', badge_fa: 'افتخارات و مدارک', sort_order: 90 },
    { section_key: 'clients', title_fa: 'کاربرد محصولات در صنایع غذایی', subtitle_fa: 'این موارد، نمونه‌هایی از کاربرد رایج فرآورده‌های فندق، پسته و بادام هستند؛ استفاده دقیق هر محصول به مشخصات آن و فرمول تولیدکننده بستگی دارد.', badge_fa: 'نمونه کاربردها', sort_order: 100 },
    { section_key: 'contact', title_fa: 'استعلام قیمت محصولات', subtitle_fa: 'برای اطلاع از قیمت مغز فندق، خمیر فندق، مغز و خلال پسته یا فرآورده‌های بادام، درخواست خود را ثبت کنید یا با دفتر هفت طلایی تماس بگیرید.', badge_fa: 'ارتباط با هفت طلایی', sort_order: 110 },
  ];
  for (const section of homeSectionDefaults) {
    const existing = await prisma.pageSection.findFirst({
      where: { page_key: 'home', section_key: section.section_key },
    });
    if (!existing) {
      await prisma.pageSection.create({ data: { page_key: 'home', ...section, published: true } });
    }
  }

'''
    content = replace_once(
        content,
        "  // The testimonials previously bundled here were unverified quotations attributed\n",
        seed_insert + "  // The testimonials previously bundled here were unverified quotations attributed\n",
        "seed NewsPost archive and homepage defaults",
    )
    return content


def patch_news_card(content: str) -> str:
    content = replace_once(
        content,
        "  const cat = NEWS_CATEGORIES[item.category];\n  const photoCount = item.photos?.length || 0;",
        "  const cat = NEWS_CATEGORIES[item.category];\n  const categoryLabel = cat?.label || item.categoryLabel || item.category || 'خبر';\n  const photoCount = item.photos?.length || 0;",
        "NewsCard dynamic category label",
    )
    content = replace_once(content, "to={`/news/${item.id}`}\n", "to={`/news/${item.slug || item.id}`}\n", "NewsCard CMS slug route")
    return replace_once(content, "          {cat?.label}\n", "          {categoryLabel}\n", "NewsCard unknown CMS category")


def patch_news_article(content: str) -> str:
    content = replace_once(
        content,
        "import { NEWS_ITEMS, NEWS_CATEGORIES } from '@/lib/news-content';\n",
        "import { NEWS_ITEMS, NEWS_CATEGORIES } from '@/lib/news-content';\nimport { getNewsPostBySlug } from '@/lib/api/content';\n",
        "NewsArticle CMS API import",
    )
    content = replace_once(
        content,
        "const wordsOf = (sections) =>\n",
        """function contentToParagraphs(value) {
  const text = String(value || '')
    .replace(/<br\\s*\\/?\\s*>/gi, '\\n')
    .replace(/<\\/(?:p|h[1-6]|li|div|section)>/gi, '\\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '\\"')
    .replace(/&#39;/gi, "'");
  return text.split(/\\n+/).map((part) => part.trim()).filter(Boolean);
}

const wordsOf = (sections) =>
""",
        "CMS news content paragraph converter",
    )
    old_setup = """export default function NewsArticle() {
  const { slug } = useParams();
  const item = NEWS_ITEMS.find((n) => n.id === slug);
  const [sections, setSections] = useState(null);
  const [lightbox, setLightbox] = useState(null); // index into item.photos

  useEffect(() => {
    setSections(null);
    setLightbox(null);
    const load = LOADERS[`../lib/news-articles/${slug}.js`];
    if (!item || !load) {
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
    return () => { active = false; };
  }, [slug, item]);
"""
    new_setup = """export default function NewsArticle() {
  const { slug } = useParams();
  const staticItem = NEWS_ITEMS.find((n) => n.id === slug);
  const [cmsItem, setCmsItem] = useState(null);
  const [cmsChecked, setCmsChecked] = useState(false);
  const [sections, setSections] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const item = cmsItem ? {
    ...(staticItem || {}),
    ...cmsItem,
    photos: cmsItem.photos?.length ? cmsItem.photos : (staticItem?.photos || []),
    videos: cmsItem.videos?.length ? cmsItem.videos : (staticItem?.videos || []),
    body: staticItem?.body || [],
  } : staticItem;

  useEffect(() => {
    let active = true;
    setCmsChecked(false);
    setCmsItem(null);
    getNewsPostBySlug(slug)
      .then((row) => { if (active) setCmsItem(row); })
      .catch(() => { if (active) setCmsItem(null); })
      .finally(() => { if (active) setCmsChecked(true); });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    let active = true;
    setSections(null);
    setLightbox(null);
    if (cmsItem) {
      const paragraphs = contentToParagraphs(cmsItem.content);
      if (paragraphs.length) setSections([{ p: paragraphs }]);
      else setSections(staticItem?.body?.length ? [{ p: staticItem.body }] : []);
      return () => { active = false; };
    }

    const load = LOADERS[`../lib/news-articles/${slug}.js`];
    if (!staticItem || !load) {
      setSections(staticItem?.body?.length ? [{ p: staticItem.body }] : []);
      return () => { active = false; };
    }
    load()
      .then((module) => { if (active) setSections(module.default); })
      .catch(() => { if (active) setSections(staticItem?.body?.length ? [{ p: staticItem.body }] : []); });
    return () => { active = false; };
  }, [slug, cmsItem, staticItem]);
"""
    content = replace_once(content, old_setup, new_setup, "NewsArticle data lifecycle")
    content = replace_once(
        content,
        "  const openPhoto = useCallback((src) => setLightbox(Math.max(0, item.photos.indexOf(src))), [item]);",
        "  const openPhoto = useCallback((src) => setLightbox(Math.max(0, (item?.photos || []).indexOf(src))), [item]);",
        "NewsArticle handles CMS posts without photo array",
    )
    content = replace_once(
        content,
        "  if (!item) {\n    return (",
        "  if (!item && !cmsChecked) return <div className=\"min-h-[70vh] flex items-center justify-center\" style={{ background: 'var(--bg)', color: 'var(--fg-muted)' }}>در حال بارگذاری خبر…</div>;\n\n  if (!item) {\n    return (",
        "NewsArticle async not-found state",
    )
    content = replace_once(
        content,
        "  const cat = NEWS_CATEGORIES[item.category];\n  const usedPhotos = new Set();\n  (sections || []).forEach((s) => (s.media?.photos || []).forEach((i) => usedPhotos.add(item.photos[i])));\n  const restPhotos = item.photos.filter((p) => !usedPhotos.has(p));\n  const related = NEWS_ITEMS.filter((n) => n.id !== item.id).slice(0, 3);",
        "  const cat = NEWS_CATEGORIES[item.category] || { label: item.categoryLabel || item.category || 'خبر', tone: 'var(--gold-2)' };\n  const photos = item.photos || [];\n  const usedPhotos = new Set();\n  (sections || []).forEach((s) => (s.media?.photos || []).forEach((i) => usedPhotos.add(photos[i])));\n  const restPhotos = photos.filter((p) => !usedPhotos.has(p));\n  const related = NEWS_ITEMS.filter((n) => n.id !== item.id).slice(0, 3);",
        "NewsArticle dynamic category and optional media",
    )
    content = replace_once(content, "image: `${SITE_SEO.baseUrl}${item.image}`,", "image: `${SITE_SEO.baseUrl}${item.image || '/banner/banner-four-bowls.webp'}`,", "NewsArticle JSON-LD fallback image")
    content = replace_once(content, "<img src={item.image} alt=\"\" className=\"absolute inset-0 w-full h-full object-cover\"", "<img src={item.image || '/banner/banner-four-bowls.webp'} alt=\"\" className=\"absolute inset-0 w-full h-full object-cover\"", "NewsArticle hero fallback image")
    content = replace_once(content, "{s.media?.photos && <PhotoGroup srcs={s.media.photos.map((k) => item.photos[k]).filter(Boolean)} onOpen={openPhoto} />}", "{s.media?.photos && <PhotoGroup srcs={s.media.photos.map((k) => photos[k]).filter(Boolean)} onOpen={openPhoto} />}", "NewsArticle gallery references merged photos")
    content = replace_once(content, "<MediaLightbox photos={item.photos} index={lightbox}", "<MediaLightbox photos={photos} index={lightbox}", "NewsArticle lightbox merged photos")
    return content


def patch_home_news(content: str) -> str:
    return HOME_NEWS


def patch_home_magazine(content: str) -> str:
    return HOME_MAGAZINE


def patch_home_origin(content: str) -> str:
    content = replace_once(content, "export default function HomeOrigin() {", "export default function HomeOrigin({ section = {} }) {", "HomeOrigin section settings prop")
    content = replace_once(content, "          eyebrow=\"محصولات هفت طلایی\"\n          title=\"سه گروه محصول؛ کاربردهای متنوع\"\n          lead=\"فهرست محصولات هفت طلایی بر فندق، پسته و بادام متمرکز است. هر گروه در شکل‌های مختلف فرآوری عرضه می‌شود تا برای کاربردهای متفاوت در صنایع غذایی قابل انتخاب باشد.\"",
        "          eyebrow={section.badge_fa || 'محصولات هفت طلایی'}\n          title={section.title_fa || 'سه گروه محصول؛ کاربردهای متنوع'}\n          lead={section.subtitle_fa || 'فهرست محصولات هفت طلایی بر فندق، پسته و بادام متمرکز است. هر گروه در شکل‌های مختلف فرآوری عرضه می‌شود تا برای کاربردهای متفاوت در صنایع غذایی قابل انتخاب باشد.'}",
        "HomeOrigin dynamic heading")
    return replace_once(content, "src=\"/banner/banner-spoons-set.webp\"", "src={section.image || '/banner/banner-spoons-set.webp'}", "HomeOrigin configurable media")


def patch_home_awards(content: str) -> str:
    content = replace_once(content, "export default function HomeAwardsSlider() {", "export default function HomeAwardsSlider({ section = {} }) {", "HomeAwards section prop")
    return replace_once(
        content,
        "          eyebrow=\"افتخارات و مدارک\"\n          title=\"مروری بر سوابق هفت طلایی\"",
        "          eyebrow={section.badge_fa || 'افتخارات و مدارک'}\n          title={section.title_fa || 'مروری بر سوابق هفت طلایی'}\n          lead={section.subtitle_fa || undefined}",
        "HomeAwards dynamic heading",
    )


def patch_home_clients(content: str) -> str:
    content = replace_once(content, "export default function HomeClients() {", "export default function HomeClients({ section = {} }) {", "HomeClients section prop")
    content = replace_once(content, "          src=\"/gallery/AQ8A1683AQ8A1683.webp\"", "          src={section.image || '/gallery/AQ8A1683AQ8A1683.webp'}", "HomeClients background image")
    return replace_once(
        content,
        "            eyebrow=\"نمونه کاربردها\"\n            title=\"کاربرد محصولات در صنایع غذایی\"\n            lead=\"این موارد، نمونه‌هایی از کاربرد رایج فرآورده‌های فندق، پسته و بادام هستند؛ استفاده دقیق هر محصول به مشخصات آن و فرمول تولیدکننده بستگی دارد.\"",
        "            eyebrow={section.badge_fa || 'نمونه کاربردها'}\n            title={section.title_fa || 'کاربرد محصولات در صنایع غذایی'}\n            lead={section.subtitle_fa || 'این موارد، نمونه‌هایی از کاربرد رایج فرآورده‌های فندق، پسته و بادام هستند؛ استفاده دقیق هر محصول به مشخصات آن و فرمول تولیدکننده بستگی دارد.'}",
        "HomeClients dynamic heading",
    )


def patch_home_contact(content: str) -> str:
    content = replace_once(content, "export default function HomeContactForm() {", "export default function HomeContactForm({ section = {} }) {", "HomeContactForm section prop")
    return replace_once(
        content,
        "          eyebrow=\"ارتباط با هفت طلایی\"\n          title=\"استعلام قیمت محصولات\"\n          lead=\"برای اطلاع از قیمت مغز فندق، خمیر فندق، مغز و خلال پسته یا فرآورده‌های بادام، درخواست خود را ثبت کنید یا با دفتر هفت طلایی تماس بگیرید.\"",
        "          eyebrow={section.badge_fa || 'ارتباط با هفت طلایی'}\n          title={section.title_fa || 'استعلام قیمت محصولات'}\n          lead={section.subtitle_fa || 'برای اطلاع از قیمت مغز فندق، خمیر فندق، مغز و خلال پسته یا فرآورده‌های بادام، درخواست خود را ثبت کنید یا با دفتر هفت طلایی تماس بگیرید.'}",
        "HomeContact dynamic heading",
    )


def patch_home(content: str) -> str:
    content = replace_once(content, "import { useCallback, useEffect, useState } from 'react';", "import { Fragment, useCallback, useEffect, useState } from 'react';", "React Fragment for sortable home sections")
    content = replace_once(content, "import HomeVisualGallery from '@/components/home/HomeVisualGallery';\n", "", "remove duplicated standalone static gallery")
    content = replace_once(
        content,
        "  const sectionImages = {\n    capacity:\n      sec('capacity').image ||\n      DEFAULT_SECTION_IMAGES.capacity,\n\n    products:\n      sec('products').image ||\n      DEFAULT_SECTION_IMAGES.products,\n  };\n\n  if (loading) {\n    return <LogoLoader />;\n  }\n",
        """  const sectionImages = {
    capacity: sec('capacity').image || DEFAULT_SECTION_IMAGES.capacity,
    products: sec('products').image || DEFAULT_SECTION_IMAGES.products,
  };
  const sectionVisible = (key) => sec(key).published !== false;
  const homeMediaSections = Object.values(sectionMap).filter((section) =>
    String(section.section_key || '').startsWith('media-item-'),
  );

  if (loading) {
    return <LogoLoader />;
  }

  const homepageSections = [
    {
      key: 'capacity', defaultOrder: 20,
      content: (
        <section className="chapter">
          <div className="chapter-shell">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <ParallaxMedia src={sectionImages.capacity} alt="محصولات و توانمندی‌های ۷ گلدن" ratio="aspect-[4/3]" className="rounded-3xl" />
              <div>
                <StoryChapter index="02" eyebrow={sec('capacity').badge_fa || 'توانمندی‌های ۷ گلدن'} title={sec('capacity').title_fa || 'فرآوری خشکبار در قزوین'} lead={sec('capacity').subtitle_fa || 'فعالیت فرآوری هفت طلایی از سال ۱۳۷۷ آغاز شده است. فهرست محصولات مجموعه شامل مغز فندق، خمیر و گرانول فندق، مغز و خلال پسته و شکل‌های مختلف بادام است.'} />
                <div className="grid grid-cols-2 gap-x-6 gap-y-8 mt-10">
                  {CAPACITY_STATS.map((stat, index) => (
                    <Reveal key={stat.label} delay={index * 90}>
                      <div className="flex items-baseline gap-1.5">
                        <CountUp value={stat.value} className="display-md" style={{ color: 'var(--gold-2)' }} />
                        <span className="font-body text-xs" style={{ color: 'var(--fg-muted)' }}>{stat.unit}</span>
                      </div>
                      <span className="font-body text-xs block mt-1.5" style={{ color: 'var(--fg-muted)' }}>{stat.label}</span>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ),
    },
    { key: 'origin', defaultOrder: 30, content: <HomeOrigin section={sec('origin')} /> },
    {
      key: 'products', defaultOrder: 40,
      content: (
        <>
          <MaskText image={sectionImages.products} text="7GOLDEN" eyebrow="از ۱۳۷۷ · قزوین" />
          {products.length > 0 && (
            <section className="chapter pt-4 pb-2">
              <div className="chapter-shell mb-6">
                <StoryChapter index="04" eyebrow={sec('products').badge_fa || 'مجموعه محصولات'} title={sec('products').title_fa || 'محصولات هفت طلایی'} lead={sec('products').subtitle_fa || 'در فهرست محصولات، پسته، بادام و فندق در شکل‌های مختلف آماده‌سازی عرضه می‌شوند؛ از مغز و خلال تا پرک، خمیر، گرانول و پودر.'} />
              </div>
              {pistachioProducts.length > 0 && <ProductLineRow title="محصولات پسته" products={pistachioProducts} duration={90} />}
              {almondProducts.length > 0 && <ProductLineRow title="محصولات بادام" products={almondProducts} duration={85} />}
              {hazelnutProducts.length > 0 && <ProductLineRow title="محصولات فندق" products={hazelnutProducts} duration={100} reverse />}
            </section>
          )}
        </>
      ),
    },
    { key: 'visual-gallery', defaultOrder: 50, content: <HomeVideoShowcase section={sec('visual-gallery')} mediaSections={homeMediaSections} /> },
    { key: 'news', defaultOrder: 60, content: <HomeNews section={sec('news')} /> },
    { key: 'magazine', defaultOrder: 70, content: <HomeMagazine section={sec('magazine')} /> },
    {
      key: 'order', defaultOrder: 80,
      content: (
        <section className="chapter">
          <div className="chapter-shell">
            <StoryChapter index="09" eyebrow={sec('order').badge_fa || 'فرایند همکاری'} title={sec('order').title_fa || 'از انتخاب محصول تا آماده‌سازی سفارش'} lead={sec('order').subtitle_fa || 'هر سفارش با شناخت نیاز مجموعه شما آغاز می‌شود. مشخصات محصول، مقدار و نوع بسته‌بندی در کنار هم بررسی می‌شوند تا مسیر سفارش بر مبنای نیاز واقعی شما شکل بگیرد.'} align="center" className="mb-12 md:mb-16" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {ORDER_STEPS.map((step, index) => (
                <Reveal key={step.number} delay={index * 90}>
                  <article className="fact-card h-full">
                    <span className="block font-body text-sm mb-6" style={{ color: 'var(--gold-2)' }}>{step.number}</span>
                    <h3 className="display-sm mb-4" style={{ color: '#fff' }}>{step.title}</h3>
                    <p className="font-body text-sm leading-relaxed" style={{ color: '#fff' }}>{step.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ),
    },
    { key: 'awards', defaultOrder: 90, content: <HomeAwardsSlider section={sec('awards')} /> },
    { key: 'clients', defaultOrder: 100, content: <HomeClients section={sec('clients')} /> },
    { key: 'contact', defaultOrder: 110, content: <HomeContactForm section={sec('contact')} /> },
  ].filter((section) => sectionVisible(section.key)).sort((a, b) => {
    const aOrder = Number(sec(a.key).sort_order) || a.defaultOrder;
    const bOrder = Number(sec(b.key).sort_order) || b.defaultOrder;
    return aOrder - bOrder;
  });
""",
        "editable and sortable homepage sections",
    )
    old = """        {/* 02 — توانمندی‌ها */}

        <section className="chapter">
          <div className="chapter-shell">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <ParallaxMedia
                src={sectionImages.capacity}
                alt="محصولات و توانمندی‌های ۷ گلدن"
                ratio="aspect-[4/3]"
                className="rounded-3xl"
              />

              <div>
                <StoryChapter
                  index="02"
                  eyebrow="توانمندی‌های ۷ گلدن"
                  title="فرآوری خشکبار در قزوین"
                  lead="فعالیت فرآوری هفت طلایی از سال ۱۳۷۷ آغاز شده است. فهرست محصولات مجموعه شامل مغز فندق، خمیر و گرانول فندق، مغز و خلال پسته و شکل‌های مختلف بادام است."
                />

                <div className="grid grid-cols-2 gap-x-6 gap-y-8 mt-10">
                  {CAPACITY_STATS.map((stat, index) => (
                    <Reveal
                      key={stat.label}
                      delay={index * 90}
                    >
                      <div className="flex items-baseline gap-1.5">
                        <CountUp
                          value={stat.value}
                          className="display-md"
                          style={{
                            color: 'var(--gold-2)',
                          }}
                        />

                        <span
                          className="font-body text-xs"
                          style={{
                            color: 'var(--fg-muted)',
                          }}
                        >
                          {stat.unit}
                        </span>
                      </div>

                      <span
                        className="font-body text-xs block mt-1.5"
                        style={{
                          color: 'var(--fg-muted)',
                        }}
                      >
                        {stat.label}
                      </span>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — نگاه برند */}

        <HomeOrigin />

        {/* امضای بصری برند */}

        <MaskText
          image={sectionImages.products}
          text="7GOLDEN"
          eyebrow="از ۱۳۷۷ · قزوین"
        />

        {products.length > 0 && (
          <section className="chapter pt-4 pb-2">
            <div className="chapter-shell mb-6">
              <StoryChapter
                index="04"
                eyebrow="مجموعه محصولات"
                title="محصولات هفت طلایی"
                lead="در فهرست محصولات، پسته، بادام و فندق در شکل‌های مختلف آماده‌سازی عرضه می‌شوند؛ از مغز و خلال تا پرک، خمیر، گرانول و پودر."
              />
            </div>

            {pistachioProducts.length > 0 && (
              <ProductLineRow title="محصولات پسته" products={pistachioProducts} duration={90} />
            )}
            {almondProducts.length > 0 && (
              <ProductLineRow title="محصولات بادام" products={almondProducts} duration={85} />
            )}
            {hazelnutProducts.length > 0 && (
              <ProductLineRow title="محصولات فندق" products={hazelnutProducts} duration={100} reverse />
            )}
          </section>
        )}

        <HomeVideoShowcase />

        <HomeVisualGallery />

        {/* 07 — اخبار و اطلاعیه‌ها */}

        <HomeNews />

        <HomeMagazine />

        {/* 09 — فرایند همکاری */}

        <section className="chapter">
          <div className="chapter-shell">
            <StoryChapter
              index="09"
              eyebrow="فرایند همکاری"
              title="از انتخاب محصول تا آماده‌سازی سفارش"
              lead="هر سفارش با شناخت نیاز مجموعه شما آغاز می‌شود. مشخصات محصول، مقدار و نوع بسته‌بندی در کنار هم بررسی می‌شوند تا مسیر سفارش بر مبنای نیاز واقعی شما شکل بگیرد."
              align="center"
              className="mb-12 md:mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {ORDER_STEPS.map((step, index) => (
                <Reveal
                  key={step.number}
                  delay={index * 90}
                >
                  <article className="fact-card h-full">
                    <span
                      className="block font-body text-sm mb-6"
                      style={{
                        color: 'var(--gold-2)',
                      }}
                    >
                      {step.number}
                    </span>

                    <h3
                      className="display-sm mb-4"
                      style={{
                        color: '#fff',
                      }}
                    >
                      {step.title}
                    </h3>

                    <p
                      className="font-body text-sm leading-relaxed"
                      style={{
                        color: '#fff',
                      }}
                    >
                      {step.text}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* افتخارات و دستاوردها */}

        <HomeAwardsSlider />

        {/* مجموعه‌های همکار */}

        <HomeClients />

        {/* ارتباط با ۷ گلدن */}

        <HomeContactForm />
"""
    new = """        {homepageSections.map((section) => (
          <Fragment key={section.key}>{section.content}</Fragment>
        ))}
"""
    content = replace_once(content, old, new, "replace fixed homepage order with editable sections")
    content = replace_once(content, "        <HeroSlider cmsHero={heroConfig} />", "        {sectionVisible('hero') && <HeroSlider cmsHero={heroConfig} />}", "hideable homepage hero section")
    return content


def patch_story_css(content: str) -> str:
    if "HOME_MEDIA_MOSAIC_AND_SIDEBAR_WRAP_FIX" in content:
        raise RuntimeError("Homepage mosaic CSS patch already exists; refusing to append it twice.")
    return content.rstrip() + r'''

/* HOME_MEDIA_MOSAIC_AND_SIDEBAR_WRAP_FIX */
.blog-page .chapter-shell,
.news-page .chapter-shell {
  width: 100%;
  max-width: 94rem;
  margin-inline: auto;
  padding-inline: clamp(1rem, 2vw, 2.25rem);
  box-sizing: border-box;
}

.blog-page-layout,
.news-page-layout {
  grid-template-columns: minmax(0, 1fr) minmax(13rem, 16rem);
  gap: clamp(.85rem, 1.8vw, 1.5rem);
  min-width: 0;
}

.blog-sidebar,
.news-sidebar,
.blog-sidebar *,
.news-sidebar * {
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.blog-sidebar h2,
.news-sidebar h2,
.blog-sidebar-cta h2,
.news-sidebar-cta h2,
.blog-sidebar-heading h2,
.news-sidebar-heading h2 {
  white-space: normal !important;
  overflow: visible;
  text-overflow: clip;
  line-height: 1.75;
}

.blog-recent-title,
.news-recent-title {
  white-space: normal !important;
  overflow: visible;
  text-overflow: clip;
  overflow-wrap: anywhere;
  word-break: break-word;
  line-height: 1.8;
}

.blog-category-button span,
.news-category-button span,
.blog-sidebar-crosslink,
.news-sidebar-crosslink,
.blog-sidebar-cta a,
.news-sidebar-cta a {
  white-space: normal;
  overflow-wrap: anywhere;
}

.blog-search-control,
.news-search-control,
.blog-search-control input,
.news-search-control input { min-width: 0; max-width: 100%; }

.home-media-mosaic {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-rows: 4.1rem;
  grid-auto-flow: dense;
  gap: clamp(.5rem, 1vw, .9rem);
  align-items: stretch;
}
.home-media-tile { min-width: 0; min-height: 0; grid-column: span 3; grid-row: span 2; }
.home-media-tile--feature { grid-column: span 6; grid-row: span 5; }
.home-media-tile--wide { grid-column: span 4; grid-row: span 3; }
.home-media-tile--portrait { grid-column: span 3; grid-row: span 4; }
.home-media-trigger {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--hairline);
  border-radius: clamp(.75rem, 1.4vw, 1.25rem);
  background: #11100d;
  text-align: right;
  isolation: isolate;
}
.home-media-trigger > img,
.home-media-video {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .65s cubic-bezier(.16,1,.3,1), filter .65s ease;
}
.home-media-trigger:hover > img,
.home-media-trigger:hover .home-media-video { transform: scale(1.045); filter: saturate(1.08); }
.home-media-shade {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(6,5,3,.02) 12%, rgba(6,5,3,.15) 42%, rgba(6,5,3,.86) 100%);
}
.home-media-meta {
  position: absolute;
  inset-inline: .85rem;
  bottom: .8rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: .3rem;
  min-width: 0;
  color: #fff;
}
.home-media-kind { color: rgba(255,255,255,.72); font-size: .62rem; letter-spacing: .06em; }
.home-media-meta strong { display: block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: clamp(.72rem, 1vw, .9rem); line-height: 1.6; }
.home-media-open {
  position: absolute;
  inset-inline-end: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid rgba(255,255,255,.25);
  border-radius: 50%;
  background: rgba(6,5,3,.45);
  backdrop-filter: blur(8px);
}
.home-media-lightbox {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 3rem);
  background: rgba(4,4,3,.94);
  backdrop-filter: blur(18px);
}
.home-media-lightbox-content { width: min(100%, 74rem); max-height: 90vh; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.home-media-lightbox-content img,
.home-media-lightbox-content video { display: block; max-width: 100%; max-height: 80vh; border-radius: 1rem; object-fit: contain; }
.home-media-lightbox-content p { color: var(--fg); text-align: center; font-size: .9rem; }
.home-media-lightbox-close,
.home-media-lightbox-prev,
.home-media-lightbox-next {
  position: absolute;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid rgba(255,255,255,.25);
  border-radius: 50%;
  background: rgba(20,18,13,.8);
  color: #fff;
}
.home-media-lightbox-close { top: 1rem; inset-inline-end: 1rem; }
.home-media-lightbox-prev { left: 1rem; top: 50%; transform: translateY(-50%); }
.home-media-lightbox-next { right: 1rem; top: 50%; transform: translateY(-50%); }
.home-content-status,
.news-source-status,
.news-load-more-status {
  margin: 1rem 0;
  color: var(--fg-muted);
  font-size: .82rem;
  line-height: 1.9;
}
.news-load-more-sentinel { width: 100%; height: 1px; }

@media (max-width: 1023px) {
  .blog-page-layout, .news-page-layout { grid-template-columns: minmax(0, 1fr) minmax(12rem, 14rem); }
  .home-media-mosaic { grid-template-columns: repeat(6, minmax(0, 1fr)); grid-auto-rows: 4rem; }
  .home-media-tile { grid-column: span 2; }
  .home-media-tile--feature { grid-column: span 4; grid-row: span 4; }
  .home-media-tile--wide { grid-column: span 3; }
  .home-media-tile--portrait { grid-column: span 2; grid-row: span 3; }
}

@media (max-width: 767px) {
  .blog-page-layout, .news-page-layout { grid-template-columns: minmax(0, 1fr); }
  .blog-sidebar, .news-sidebar { position: static; order: -1; }
  .home-media-mosaic { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 6.2rem; gap: .55rem; }
  .home-media-tile, .home-media-tile--wide, .home-media-tile--portrait { grid-column: span 1; grid-row: span 2; }
  .home-media-tile--feature { grid-column: span 2; grid-row: span 3; }
  .home-media-meta { inset-inline: .65rem; bottom: .6rem; }
  .home-media-kind { font-size: .56rem; }
  .home-media-meta strong { font-size: .72rem; }
  .home-media-lightbox-prev { left: .4rem; }
  .home-media-lightbox-next { right: .4rem; }
}
@media (prefers-reduced-motion: reduce) {
  .home-media-trigger > img, .home-media-video { transition: none; }
}
'''


def patch_all(root: Path) -> dict[Path, str]:
    # This repository keeps its Prisma schema at backend/prisma/schema.prisma.
    # Some older checkouts used backend/schema.prisma, so resolve exactly one
    # existing schema path instead of requiring both paths to exist.
    schema_candidates = (
        "backend/prisma/schema.prisma",
        "backend/schema.prisma",
    )
    schema_relative = next((candidate for candidate in schema_candidates if (root / candidate).is_file()), None)
    if schema_relative is None:
        expected = " or ".join(str(root / candidate) for candidate in schema_candidates)
        raise FileNotFoundError(f"Prisma schema not found. Expected one of: {expected}")

    tasks = {
        schema_relative: patch_schema,
        "backend/src/lib/serialize.ts": patch_serialize,
        "backend/src/routes/entities.ts": patch_entities,
        "backend/src/routes/content.ts": patch_content_routes,
        "backend/prisma/seed.ts": patch_seed,
        "src/lib/api/content.js": patch_api,
        "src/pages/Admin.jsx": patch_admin,
        "src/pages/News.jsx": lambda _content: NEWS_PAGE,
        "src/components/news/NewsCard.jsx": patch_news_card,
        "src/pages/NewsArticle.jsx": patch_news_article,
        "src/pages/Home.jsx": patch_home,
        "src/components/home/HomeVideoShowcase.jsx": lambda _content: HOME_VIDEO_SHOWCASE,
        "src/components/home/HomeNews.jsx": patch_home_news,
        "src/components/home/HomeMagazine.jsx": patch_home_magazine,
        "src/components/home/HomeOrigin.jsx": patch_home_origin,
        "src/components/home/HomeAwardsSlider.jsx": patch_home_awards,
        "src/components/home/HomeClients.jsx": patch_home_clients,
        "src/components/home/HomeContactForm.jsx": patch_home_contact,
        "src/styles/story.css": patch_story_css,
    }
    updated: dict[Path, str] = {}
    for relative, transform in tasks.items():
        path = root / relative
        if not path.is_file():
            raise FileNotFoundError(f"Required file not found: {path}")
        original = path.read_text(encoding="utf-8")
        if relative == "src/pages/News.jsx" and "getNewsPosts" in original and "IntersectionObserver" in original and "NEWS_ITEMS.filter" not in original:
            raise RuntimeError("News page already appears to be API-driven; review the existing implementation before reapplying.")
        if relative == "src/components/home/HomeVideoShowcase.jsx" and "HOME_MEDIA_MOSAIC_AND_SIDEBAR_WRAP_FIX" in (root / "src/styles/story.css").read_text(encoding="utf-8"):
            # Still allow replacing the three-card video section once; the marker only guards CSS below.
            pass
        updated[path] = transform(original)

    # New manifest file is additive; preserve any existing user-created version.
    manifest = root / "src/lib/home-media.js"
    if manifest.exists():
        existing = manifest.read_text(encoding="utf-8")
        if "export const HOME_MEDIA_ITEMS" in existing and "facility-5384.mov" in existing:
            raise RuntimeError("A complete homepage media manifest already exists; review instead of overwriting it.")
        raise RuntimeError(f"Refusing to overwrite existing manifest: {manifest}")
    updated[manifest] = HOME_MEDIA_JS
    return updated


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("repo", nargs="?", default=".", help="path to local 7golden checkout")
    parser.add_argument("--dry-run", action="store_true", help="validate every source anchor without writing")
    args = parser.parse_args()
    root = Path(args.repo).expanduser().resolve()

    updated = patch_all(root)
    if args.dry_run:
        for path in updated:
            print(f"validated: {path.relative_to(root)}")
        print(f"Dry run passed: {len(updated)} files would change or be added.")
        return

    for path, content in updated.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
    print("Applied newsroom API, published-state, editable homepage sections, and media-mosaic updates:")
    for path in updated:
        print(f"  - {path.relative_to(root)}")
    print("\nNext: run backend generation/db push/seed, then lint and production builds. Do not delete or truncate the database.")


if __name__ == '__main__':
    main()
