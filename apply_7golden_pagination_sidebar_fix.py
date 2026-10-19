#!/usr/bin/env python3
"""Safely fix 7Golden blog pagination, CMS-only articles, and editorial responsiveness.

Usage:
  python3 apply_7golden_pagination_sidebar_fix.py /path/to/7golden --dry-run
  python3 apply_7golden_pagination_sidebar_fix.py /path/to/7golden

This patch does NOT run seeds, alter seed/schema files, delete database records, or
change the static newsroom article archive. It adds server-side pagination/search
for CMS BlogPost records and an IntersectionObserver infinite-scroll loader.
"""
from __future__ import annotations

import argparse
import re
from pathlib import Path


def replace_once(content: str, old: str, new: str, label: str) -> str:
    count = content.count(old)
    if count != 1:
        raise RuntimeError(f"Expected exactly one source anchor for {label}; found {count}.")
    return content.replace(old, new, 1)



def restore_static_newsroom(content: str) -> str:
    """Undo the earlier unsafe BlogPost->News mixing, if that patch was applied locally."""
    if "const cmsNewsItems = useMemo(() => cmsPosts" not in content:
        return content

    content = replace_once(
        content,
        "import { useCallback, useEffect, useMemo, useState } from 'react';",
        "import { useMemo, useState } from 'react';",
        "remove unneeded CMS newsroom hooks",
    )
    content = replace_once(
        content,
        "import { getBlogPosts } from '@/lib/api/content';\n",
        "",
        "remove incorrect CMS blog import from newsroom",
    )
    # The helper was introduced solely to label CMS posts in /news.
    start = content.find("const CMS_CATEGORY_LABELS = {")
    if start >= 0:
        end = content.find("\n}\n", content.find("function getNewsCategoryLabel", start))
        if end < 0:
            raise RuntimeError("Could not find the end of the temporary newsroom CMS label helper.")
        content = content[:start] + content[end + 3:]

    # Remove the temporary CMS state and fetch effect; keep active category/search state.
    content = re.sub(
        r"  const \[cmsPosts, setCmsPosts\] = useState\(\[\]\);\n"
        r"  const \[cmsLoadError, setCmsLoadError\] = useState\(false\);\n\n"
        r"  const refreshCmsPosts = useCallback\(async \(\) => \{[\s\S]*?\n  \}, \[\]\);\n\n"
        r"  useEffect\(\(\) => \{\n    void refreshCmsPosts\(\);\n  \}, \[refreshCmsPosts\]\);\n",
        "",
        content,
        count=1,
    )

    logic_start = content.find("  const cmsNewsItems = useMemo(() => cmsPosts")
    logic_end = content.find("  const resetFilters = () => {", logic_start)
    if logic_start < 0 or logic_end < 0:
        raise RuntimeError("Could not locate the temporary CMS-driven newsroom data block.")
    restored_logic = """  const categories = useMemo(() => Object.entries(NEWS_CATEGORIES)
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

"""
    content = content[:logic_start] + restored_logic + content[logic_end:]

    content = content.replace("<PullToRefresh onRefresh={refreshCmsPosts}>", "<PullToRefresh onRefresh={() => Promise.resolve()}>")
    content = content.replace(
        """            {cmsLoadError && (
              <p className="news-source-status" role="status">
                دریافت مطالب از پایگاه محتوا با مشکل روبه‌رو شد؛ اطلاعیه‌های موجود نمایش داده شده‌اند.
              </p>
            )}
""",
        "",
    )
    content = content.replace("to={featured.href || `/news/${featured.id}`} className=\"news-featured-card group\"", "to={`/news/${featured.id}`} className=\"news-featured-card group\"")
    content = content.replace("{allItems.length.toLocaleString('fa-IR')}", "{NEWS_ITEMS.length.toLocaleString('fa-IR')}")
    content = content.replace("{getNewsCategoryLabel(item.category)} · {item.date}", "{NEWS_CATEGORIES[item.category]?.label || 'خبر'} · {item.date}")
    content = content.replace("<Link to={item.href || `/news/${item.id}`}>", "<Link to={`/news/${item.id}`}>")
    return content



def restore_news_card_destination(content: str) -> str:
    """Do not let BlogPost CMS rows alter newsroom routes or category presentation."""
    if "to={item.href || `/news/${item.id}`}" not in content:
        return content
    content = replace_once(
        content,
        "to={item.href || `/news/${item.id}`}",
        "to={`/news/${item.id}`}",
        "restore static newsroom card destination",
    )
    content = content.replace(
        "  const categoryLabel = item.categoryLabel || cat?.label || 'خبر';\n",
        "",
    )
    content = content.replace(
        "color: item.categoryTone || cat?.tone || 'var(--gold-1, var(--accent))', backdropFilter: 'blur(8px)'",
        "color: cat?.tone, backdropFilter: 'blur(8px)'",
    )
    content = content.replace("{categoryLabel}", "{cat?.label}")
    return content


def update_content_api(content: str) -> str:
    old = """export async function getBlogPosts(opts = {}) {
  const { limit = 500 } = opts;
  const items = await get(`/blog?limit=${limit}`);
  return items.map(normalizeBlogPost);
}
"""
    new = """export async function getBlogPosts(opts = {}) {
  const { limit = 100, skip = 0, category, query } = opts;
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) });
  if (category) params.set('category', category);
  if (query) params.set('q', query);
  const items = await get(`/blog?${params.toString()}`);
  return items.map(normalizeBlogPost);
}

export async function getBlogMeta() {
  const meta = await get('/blog/meta');
  return {
    total: Number(meta?.total) || 0,
    categories: Array.isArray(meta?.categories)
      ? meta.categories.filter((item) => item && typeof item.category === 'string' && item.category.trim())
      : [],
  };
}
"""
    return replace_once(content, old, new, "CMS blog API pagination and metadata")


def update_backend_blog_route(content: str) -> str:
    old = """// Blog
router.get('/blog', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 500, 500);
    const where: any = { published: true };
    if (req.user?.role !== 'admin') where.slug = { notIn: UNVERIFIED_LEGACY_BLOG_SLUGS };
    const items = await prisma.blogPost.findMany({
      where,
      orderBy: { sort_order: 'asc' },
      take: limit,
    });
    res.json(items.map((x) => normalizeRowMedia(serializeGeneric(x))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/blog/:slug', optionalAuth, async (req: AuthRequest, res) => {
"""
    new = """// Blog: the database/CMS is the source of truth. Pagination is offset-based,
// with stable ordering so records are not duplicated or skipped between requests.
router.get('/blog', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const requestedLimit = Math.trunc(Number(req.query.limit) || 12);
    const limit = Math.min(Math.max(requestedLimit, 1), 100);
    const skip = Math.max(0, Math.trunc(Number(req.query.skip) || 0));
    const where: any = { published: true };
    if (req.user?.role !== 'admin') where.slug = { notIn: UNVERIFIED_LEGACY_BLOG_SLUGS };

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

    const items = await prisma.blogPost.findMany({
      where,
      orderBy: [{ sort_order: 'asc' }, { createdAt: 'desc' }, { id: 'asc' }],
      skip,
      take: limit,
    });
    res.json(items.map((x) => normalizeRowMedia(serializeGeneric(x))));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Sidebar counts come from published database records, not the currently-loaded page.
// Keep this route before /blog/:slug so "meta" is not treated as an article slug.
router.get('/blog/meta', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const where: any = { published: true };
    if (req.user?.role !== 'admin') where.slug = { notIn: UNVERIFIED_LEGACY_BLOG_SLUGS };

    const [total, grouped] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.groupBy({
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

router.get('/blog/:slug', optionalAuth, async (req: AuthRequest, res) => {
"""
    return replace_once(content, old, new, "database blog pagination route and metadata route")


def update_blog_page(content: str) -> str:
    content = replace_once(
        content,
        "import React, { useState, useEffect } from 'react';",
        "import React, { useState, useEffect, useCallback, useRef } from 'react';",
        "blog React hooks",
    )
    content = replace_once(
        content,
        "export default function Blog() {",
        "const BLOG_PAGE_SIZE = 8;\n\nexport default function Blog() {",
        "stable module-level blog page size",
    )
    content = replace_once(
        content,
        "import { getBlogPosts } from '@/lib/api/content';\nimport { EDITORIAL_BLOG_POSTS } from '@/lib/editorial-blog-content';\n",
        "import { getBlogMeta, getBlogPosts } from '@/lib/api/content';\n",
        "remove local editorial fallback from public CMS listing",
    )
    old_state = """  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
"""
    new_state = """  const [posts, setPosts] = useState([]);
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
"""
    content = replace_once(content, old_state, new_state, "blog pagination/search state")

    old_logic = """  const mergeEditorialPosts = (cmsPosts = []) => {
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
"""
    new_logic = """  const fetchPage = useCallback(async ({ reset = false } = {}) => {
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
"""
    content = replace_once(content, old_logic, new_logic, "remove static fallback and add infinite scroll")

    content = replace_once(
        content,
        "<PullToRefresh onRefresh={loadData}>",
        "<PullToRefresh onRefresh={() => loadData()}>",
        "blog pull to refresh callback",
    )
    content = replace_once(
        content,
        """                    <p>{posts.length === 0 ? (loadError ? 'دریافت مطالب با مشکل روبه‌رو شد. لطفاً دوباره تلاش کنید.' : 'در حال حاضر مطلب منتشرشده‌ای برای نمایش نیست.') : 'عبارت جست‌وجو یا دسته‌بندی انتخاب‌شده را تغییر دهید.'}</p>
                    <button type="button" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>نمایش همهٔ مطالب</button>""",
        """                    <p>{loadError ? 'دریافت مطالب از پایگاه داده با مشکل روبه‌رو شد.' : (blogMeta.total === 0 ? 'در حال حاضر مقالهٔ منتشرشده‌ای برای نمایش نیست.' : 'با این جست‌وجو یا دسته‌بندی مطلبی پیدا نشد.')}</p>
                    {loadError ? (
                      <button type="button" onClick={() => void loadData()}>تلاش دوباره</button>
                    ) : (
                      <button type="button" onClick={() => { setSearchQuery(''); setAppliedQuery(''); setActiveCategory('all'); }}>نمایش همهٔ مطالب</button>
                    )}""",
        "CMS-only empty/error state and retry",
    )
    content = replace_once(
        content,
        """              </main>

              <aside className=\"blog-sidebar\" aria-label=\"ابزارها و دسته‌بندی وبلاگ\">""",
        """                <div ref={sentinelRef} className=\"blog-load-more-sentinel\" aria-hidden=\"true\" />
                {loadingMore && <p className=\"blog-load-more-status\" role=\"status\">در حال بارگذاری مطالب بیشتر…</p>}
                {loadError && posts.length > 0 && (
                  <p className=\"blog-load-more-status\" role=\"status\">
                    دریافت ادامهٔ مطالب ناموفق بود. <button type=\"button\" onClick={() => void fetchPage()}>تلاش دوباره</button>
                  </p>
                )}
                {!hasMore && posts.length > 0 && !loadError && (
                  <p className=\"blog-load-more-status\">همهٔ مطالب منتشرشده نمایش داده شدند.</p>
                )}
              </main>

              <aside className=\"blog-sidebar\" aria-label=\"ابزارها و دسته‌بندی وبلاگ\">""",
        "blog infinite-scroll sentinel and status",
    )
    content = replace_once(
        content,
        "<form className=\"blog-sidebar-search\" onSubmit={(event) => event.preventDefault()} role=\"search\">",
        "<form className=\"blog-sidebar-search\" onSubmit={(event) => { event.preventDefault(); setAppliedQuery(searchQuery.trim()); }} role=\"search\">",
        "blog search submit applies server search",
    )
    content = replace_once(
        content,
        "<button type=\"button\" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>پاک‌کردن</button>",
        "<button type=\"button\" onClick={() => { setSearchQuery(''); setAppliedQuery(''); setActiveCategory('all'); }}>پاک‌کردن</button>",
        "reset all blog filters",
    )
    content = replace_once(
        content,
        "<span>همهٔ مطالب</span><b>{posts.length.toLocaleString('fa-IR')}</b>",
        "<span>همهٔ مطالب</span><b>{blogMeta.total.toLocaleString('fa-IR')}</b>",
        "true total count in blog sidebar",
    )
    content = replace_once(
        content,
        """                    {categories.map((category) => (
                      <button type=\"button\" key={category} className=\"blog-category-button\" data-active={activeCategory === category} onClick={() => setActiveCategory(category)}>
                        <span>{categoryLabel(category)}</span><b>{posts.filter((post) => post.category === category).length.toLocaleString('fa-IR')}</b>
                      </button>
                    ))}""",
        """                    {categories.map((category) => (
                      <button type=\"button\" key={category} className=\"blog-category-button\" data-active={activeCategory === category} onClick={() => setActiveCategory(category)}>
                        <span>{categoryLabel(category)}</span><b>{(blogMeta.categories.find((item) => item.category === category)?.count || 0).toLocaleString('fa-IR')}</b>
                      </button>
                    ))}""",
        "database category counts in sidebar",
    )
    return content


CSS_REPLACEMENT = r'''/* BLOG_NEWS_FINAL_RESPONSIVE_FIX: wider content, safe sidebar wrapping, tablet stack. */
.blog-page .chapter-shell,
.news-page .chapter-shell {
  width: 100%;
  max-width: 90rem;
  margin-inline: auto;
  padding-inline: clamp(1rem, 2vw, 2rem);
  box-sizing: border-box;
}

.blog-page-layout,
.news-page-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(14rem, 17rem);
  align-items: start;
  gap: clamp(.9rem, 1.6vw, 1.5rem);
  min-width: 0;
  direction: rtl;
}

.blog-page-main,
.news-main,
.blog-sidebar,
.news-sidebar {
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.blog-sidebar,
.news-sidebar {
  width: 100%;
  overflow: hidden;
}

.blog-sidebar *,
.news-sidebar * {
  min-width: 0;
  box-sizing: border-box;
}

/* Override legacy one-line title rules specifically inside the sidebar. */
.blog-page .blog-sidebar h2,
.news-page .news-sidebar h2,
.blog-page .blog-sidebar p,
.news-page .news-sidebar p,
.blog-page .blog-sidebar a,
.news-page .news-sidebar a,
.blog-page .blog-sidebar label,
.news-page .news-sidebar label,
.blog-page .blog-sidebar strong,
.news-page .news-sidebar strong {
  max-width: 100%;
  white-space: normal !important;
  overflow-wrap: anywhere;
  word-break: normal;
  text-overflow: clip;
}

.blog-page .blog-sidebar h2,
.news-page .news-sidebar h2 {
  overflow: visible;
  line-height: 1.7;
}

.blog-sidebar-heading,
.news-sidebar-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: .55rem;
  min-width: 0;
}

.blog-sidebar-heading h2,
.news-sidebar-heading h2 {
  flex: 1 1 auto;
  min-width: 0;
}

.blog-sidebar-heading button,
.news-sidebar-heading button {
  flex: 0 0 auto;
  max-width: 42%;
  white-space: normal;
  overflow-wrap: anywhere;
  text-align: left;
}

.blog-search-control,
.news-search-control {
  display: flex;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.blog-search-control input,
.news-search-control input {
  flex: 1 1 auto;
  width: 1%;
  min-width: 0;
  overflow: hidden;
}

.blog-search-control button,
.news-search-control button {
  flex: 0 0 2.25rem;
}

.blog-category-button,
.news-category-button {
  display: flex;
  width: 100%;
  min-width: 0;
  gap: .5rem;
}

.blog-category-button span,
.news-category-button span {
  flex: 1 1 auto;
  min-width: 0;
  white-space: normal;
  overflow-wrap: anywhere;
  text-overflow: clip;
}

.blog-recent-list a,
.news-recent-list a {
  display: block;
  width: 100%;
  min-width: 0;
  overflow: hidden;
}

.blog-recent-title,
.news-recent-title {
  display: -webkit-box;
  max-width: 100%;
  overflow: hidden;
  white-space: normal !important;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-height: 1.75;
  text-overflow: clip;
}

.blog-sidebar-cta h2,
.news-sidebar-cta h2,
.blog-sidebar-cta p,
.news-sidebar-cta p,
.blog-sidebar-crosslink,
.news-sidebar-crosslink {
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
}

.blog-sidebar-crosslink,
.news-sidebar-crosslink {
  align-items: flex-start;
}

.blog-load-more-sentinel {
  display: block;
  width: 100%;
  height: 1px;
  pointer-events: none;
}

.blog-load-more-status {
  margin: 1rem 0;
  color: var(--fg-muted);
  text-align: center;
  font-size: .82rem;
  line-height: 1.9;
  overflow-wrap: anywhere;
}

.blog-load-more-status button {
  color: var(--gold-1, var(--accent));
  font-weight: 800;
}

@media (max-width: 1023px) {
  .blog-page-layout,
  .news-page-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.25rem;
  }

  .blog-sidebar,
  .news-sidebar {
    position: static;
    order: -1;
  }
}

@media (max-width: 767px) {
  .blog-page .chapter-shell,
  .news-page .chapter-shell {
    padding-inline: 1rem;
  }

  .blog-sidebar,
  .news-sidebar {
    padding: 1rem;
    border-radius: 1rem;
  }

  .news-featured-card {
    grid-template-columns: minmax(0, 1fr);
  }

  .news-featured-media {
    min-height: 15rem;
    aspect-ratio: 16 / 10;
  }

  .news-featured-copy {
    min-width: 0;
    padding: 1rem;
  }
}
'''


def update_css(content: str) -> str:
    old_markers = [
        "/* NEWS_BLOG_OVERFLOW_AND_WIDTH_V2: scoped fixes for the newsroom and magazine. */",
        "/* NEWS_BLOG_OVERFLOW_AND_WIDTH_V2: scoped fixes for the newsroom and magazine. */\n",
    ]
    marker = old_markers[0]
    if marker in content:
        content = content[:content.index(marker)].rstrip() + "\n\n" + CSS_REPLACEMENT + "\n"
    elif "BLOG_NEWS_FINAL_RESPONSIVE_FIX" not in content:
        content = content.rstrip() + "\n\n" + CSS_REPLACEMENT + "\n"
    return content


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("repo", nargs="?", default=".", help="path to local 7golden checkout")
    parser.add_argument("--dry-run", action="store_true", help="validate anchors without writing")
    args = parser.parse_args()
    root = Path(args.repo).expanduser().resolve()

    transforms = {
        "src/pages/News.jsx": restore_static_newsroom,
        "src/components/news/NewsCard.jsx": restore_news_card_destination,
        "src/pages/Blog.jsx": update_blog_page,
        "src/lib/api/content.js": update_content_api,
        "backend/src/routes/content.ts": update_backend_blog_route,
    }
    updated: dict[Path, str] = {}
    for relative, transform in transforms.items():
        path = root / relative
        if not path.is_file():
            raise FileNotFoundError(f"Required file not found: {path}")
        updated[path] = transform(path.read_text(encoding="utf-8"))

    css_path = root / "src/styles/story.css"
    if not css_path.is_file():
        raise FileNotFoundError(f"Required file not found: {css_path}")
    updated[css_path] = update_css(css_path.read_text(encoding="utf-8"))

    # Validate that this remains a frontend + API patch: seed and schema files are deliberately untouched.
    forbidden = [p for p in updated if p.name == "seed.ts" or p.name == "schema.prisma"]
    if forbidden:
        raise RuntimeError(f"Safety check failed; seed/schema files cannot be changed: {forbidden}")

    if args.dry_run:
        for path in updated:
            print(f"validated: {path.relative_to(root)}")
        print(f"Dry run passed: {len(updated)} files would change. Seed and schema are untouched.")
        return

    # Write only after every transform and anchor validation has succeeded.
    for path, value in updated.items():
        path.write_text(value, encoding="utf-8")
    print("Updated files:")
    for path in updated:
        print(f"  - {path.relative_to(root)}")
    print("Seed, Prisma schema, and existing database records were not modified.")
    print("Run: npm run lint && npm run build")
    print("Then rebuild/restart the backend service so /api/blog applies skip/category/q filters.")


if __name__ == "__main__":
    main()
