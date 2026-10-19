#!/usr/bin/env python3
"""Apply a safe follow-up fix for 7Golden news/blog loading and responsiveness.

Usage:
  python3 apply_7golden_news_blog_followup.py /path/to/7golden
  python3 apply_7golden_news_blog_followup.py /path/to/7golden --dry-run

The script validates all expected source anchors before writing anything. It does
not connect to the database, run the seed, change published records, or overwrite
CMS content. It only updates frontend/API limits, the newsroom's data source, and
scoped CSS for the two list pages.
"""
from __future__ import annotations

import argparse
from pathlib import Path


def replace_once(content: str, old: str, new: str, label: str) -> str:
    count = content.count(old)
    if count != 1:
        raise RuntimeError(f"Expected exactly one source anchor for {label}; found {count}.")
    return content.replace(old, new, 1)


def update_news_page(content: str) -> str:
    content = replace_once(
        content,
        "import { useMemo, useState } from 'react';",
        "import { useCallback, useEffect, useMemo, useState } from 'react';",
        "news React hooks",
    )
    content = replace_once(
        content,
        "import { SITE_SEO } from '@/lib/seo';\n",
        "import { SITE_SEO } from '@/lib/seo';\nimport { getBlogPosts } from '@/lib/api/content';\n",
        "news CMS API import",
    )
    content = replace_once(
        content,
        "const FALLBACK_NEWS_IMAGE = '/banner/banner-four-bowls.webp';\n",
        """const FALLBACK_NEWS_IMAGE = '/banner/banner-four-bowls.webp';

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
""",
        "news category labels",
    )
    content = replace_once(
        content,
        "  const [searchQuery, setSearchQuery] = useState('');\n",
        """  const [searchQuery, setSearchQuery] = useState('');
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
""",
        "news CMS loading state",
    )
    start = """  const categories = useMemo(() => Object.entries(NEWS_CATEGORIES)
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
    replacement = """  const cmsNewsItems = useMemo(() => cmsPosts
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
"""
    content = replace_once(content, start, replacement, "news items/categories derived from CMS + authored news")
    content = replace_once(
        content,
        "  <PullToRefresh onRefresh={() => Promise.resolve()}>\n",
        "  <PullToRefresh onRefresh={refreshCmsPosts}>\n",
        "news pull-to-refresh handler",
    )
    content = replace_once(
        content,
        "          <div className=\"chapter-shell\">\n            <StoryChapter",
        """          <div className="chapter-shell">
            {cmsLoadError && (
              <p className="news-source-status" role="status">
                دریافت مطالب از پایگاه محتوا با مشکل روبه‌رو شد؛ اطلاعیه‌های موجود نمایش داده شده‌اند.
              </p>
            )}
            <StoryChapter""",
        "news CMS error status",
    )
    content = replace_once(
        content,
        "to={`/news/${featured.id}`} className=\"news-featured-card group\"",
        "to={featured.href || `/news/${featured.id}`} className=\"news-featured-card group\"",
        "CMS-aware featured news destination",
    )
    content = replace_once(
        content,
        "{NEWS_ITEMS.length.toLocaleString('fa-IR')}",
        "{allItems.length.toLocaleString('fa-IR')}",
        "news total count",
    )
    content = replace_once(
        content,
        "{NEWS_CATEGORIES[item.category]?.label || 'خبر'} · {item.date}",
        "{getNewsCategoryLabel(item.category)} · {item.date}",
        "news recent-item category label",
    )
    content = replace_once(
        content,
        "<Link to={`/news/${item.id}`}>\n                          <span>{getNewsCategoryLabel(item.category)} · {item.date}</span>",
        "<Link to={item.href || `/news/${item.id}`}>\n                          <span>{getNewsCategoryLabel(item.category)} · {item.date}</span>",
        "CMS-aware recent news destination",
    )
    return content


def update_content_api(content: str) -> str:
    return replace_once(
        content,
        "export async function getBlogPosts(opts = {}) {\n  const { limit = 100 } = opts;",
        "export async function getBlogPosts(opts = {}) {\n  const { limit = 500 } = opts;",
        "frontend CMS list limit",
    )


def update_backend_content_route(content: str) -> str:
    # Only the list endpoint's default changes. Published filtering and the
    # project's deliberate exclusions for unverified legacy posts remain intact.
    return replace_once(
        content,
        "router.get('/blog', optionalAuth, async (req: AuthRequest, res) => {\n  try {\n    const limit = Math.min(Number(req.query.limit) || 100, 500);",
        "router.get('/blog', optionalAuth, async (req: AuthRequest, res) => {\n  try {\n    const limit = Math.min(Number(req.query.limit) || 500, 500);",
        "backend CMS list default limit",
    )


def update_news_card(content: str) -> str:
    content = replace_once(
        content,
        "export default function NewsCard({ item, className = '' }) {\n  const cat = NEWS_CATEGORIES[item.category];",
        "export default function NewsCard({ item, className = '' }) {\n  const cat = NEWS_CATEGORIES[item.category];\n  const categoryLabel = item.categoryLabel || cat?.label || 'خبر';",
        "news card dynamic category label",
    )
    content = replace_once(
        content,
        "to={`/news/${item.id}`}\n      className={`group relative rounded-3xl overflow-hidden gold-frame h-full flex flex-col ${className}`} ",
        "to={item.href || `/news/${item.id}`}\n      className={`group relative rounded-3xl overflow-hidden gold-frame h-full flex flex-col ${className}`} ",
        "news card dynamic destination",
    )
    # Use a dynamic category label, while preserving the current label for static cards.
    content = replace_once(
        content,
        "color: cat?.tone, backdropFilter: 'blur(8px)'",
        "color: item.categoryTone || cat?.tone || 'var(--gold-1, var(--accent))', backdropFilter: 'blur(8px)'",
        "news card category color",
    )
    if "{cat?.label}" in content:
        content = replace_once(content, "{cat?.label}", "{categoryLabel}", "news card category text")
    elif "{cat?.label || 'خبر'}" in content:
        content = replace_once(content, "{cat?.label || 'خبر'}", "{categoryLabel}", "news card category text")
    elif "{cat.label}" in content:
        content = replace_once(content, "{cat.label}", "{categoryLabel}", "news card category text")
    else:
        raise RuntimeError("Could not find the news-card category label anchor.")
    return content


CSS_APPEND = r'''

/* NEWS_BLOG_OVERFLOW_AND_WIDTH_V2: scoped fixes for the newsroom and magazine. */
.blog-page .chapter-shell,
.news-page .chapter-shell {
  width: 100%;
  max-width: 86rem;
  box-sizing: border-box;
}

.blog-page-layout,
.news-page-layout {
  grid-template-columns: minmax(0, 1fr) minmax(0, 18rem);
  min-width: 0;
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

.blog-sidebar h2,
.news-sidebar h2,
.blog-sidebar p,
.news-sidebar p,
.blog-sidebar a,
.news-sidebar a,
.blog-sidebar label,
.news-sidebar label {
  max-width: 100%;
  white-space: normal;
  overflow-wrap: anywhere;
}

.blog-sidebar-heading,
.news-sidebar-heading {
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
}

.blog-sidebar-cta h2,
.news-sidebar-cta h2 {
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.blog-sidebar-cta p,
.news-sidebar-cta p {
  overflow-wrap: anywhere;
  word-break: normal;
}

.blog-recent-list a,
.news-recent-list a {
  overflow: hidden;
}

.blog-recent-title,
.news-recent-title {
  display: -webkit-box;
  overflow: hidden;
  white-space: normal;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.news-source-status {
  margin: 0 0 1.25rem;
  padding: .75rem 1rem;
  border: 1px solid var(--hairline);
  border-radius: .75rem;
  color: var(--fg-muted);
  font-size: .82rem;
  line-height: 1.8;
  overflow-wrap: anywhere;
}

@media (min-width: 901px) and (max-width: 1023px) {
  .blog-page-layout,
  .news-page-layout {
    grid-template-columns: minmax(0, 1fr) 16rem;
    gap: 1rem;
  }
}

@media (max-width: 900px) {
  .blog-page-layout,
  .news-page-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .blog-sidebar,
  .news-sidebar {
    position: static;
    order: -1;
  }

  .news-featured-card {
    grid-template-columns: minmax(0, 1fr);
  }

  .news-featured-media {
    min-height: 16rem;
    aspect-ratio: 16 / 10;
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
  }
}
'''


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("repo", nargs="?", default=".", help="path to the local 7golden checkout")
    parser.add_argument("--dry-run", action="store_true", help="validate all anchors without writing")
    args = parser.parse_args()
    root = Path(args.repo).expanduser().resolve()

    tasks = {
        "src/pages/News.jsx": update_news_page,
        "src/lib/api/content.js": update_content_api,
        "backend/src/routes/content.ts": update_backend_content_route,
        "src/components/news/NewsCard.jsx": update_news_card,
    }
    updated: dict[Path, str] = {}
    for relative, transform in tasks.items():
        path = root / relative
        if not path.is_file():
            raise FileNotFoundError(f"Required file not found: {path}")
        updated[path] = transform(path.read_text(encoding="utf-8"))

    css_path = root / "src/styles/story.css"
    if not css_path.is_file():
        raise FileNotFoundError(f"Required file not found: {css_path}")
    css = css_path.read_text(encoding="utf-8")
    if "NEWS_BLOG_OVERFLOW_AND_WIDTH_V2" not in css:
        css = css.rstrip() + CSS_APPEND + "\n"
    updated[css_path] = css

    if args.dry_run:
        for path in updated:
            print(f"validated: {path.relative_to(root)}")
        print(f"Dry run passed: {len(updated)} files are ready to update.")
        return

    for path, content in updated.items():
        path.write_text(content, encoding="utf-8")
    print("Updated files:")
    for path in updated:
        print(f"  - {path.relative_to(root)}")
    print("\nNo database records or seed data were modified.")
    print("Next: run npm run lint && npm run build, then review the diff before deploying.")


if __name__ == "__main__":
    main()
