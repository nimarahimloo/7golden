#!/usr/bin/env python3
"""Apply a focused visual refinement to the 7Golden frontend.

Safe by default: without --apply, this script only prepares and reports a dry run.
No database, seed, generated API, or user content files are touched.
"""
from __future__ import annotations

import argparse
import re
import shutil
import sys
import tempfile
from datetime import datetime
from pathlib import Path

MARKER = "7GOLDEN_LUXURY_VISUAL_REFINEMENT_V1"
LOGO_SYMBOL = "public/logo-symbol.webp"
LOGO_SOURCE_CANDIDATES = (
    "public/logo-white.webp",
    "public/logo.webp",
    "public/migrated/https___7golden.co_wp-content_uploads_2023_08_logo-white.webp",
)

EDITORIAL_CARD = r'''import { Link } from 'react-router-dom';
import { ChevronLeft, Image as ImageIcon, Play } from 'lucide-react';

const FALLBACK_IMAGE = '/banner/banner-four-bowls.webp';

/** Shared editorial card used by both the blog and news grids. */
export default function EditorialCard({
  to,
  image,
  alt,
  title,
  category,
  categoryTone,
  date,
  excerpt,
  readMore = 'ادامه مطلب',
  photoCount = 0,
  videoCount = 0,
  className = '',
}) {
  return (
    <Link to={to} className={`editorial-card group ${className}`}>
      <div className="editorial-card-media">
        <img
          src={image || FALLBACK_IMAGE}
          alt={alt || title || ''}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        {category && (
          <span className="editorial-card-category" style={{ color: categoryTone || 'var(--gold-1)' }}>
            {category}
          </span>
        )}
      </div>
      <div className="editorial-card-copy">
        {date && <span className="editorial-card-date">{date}</span>}
        <h3 className="editorial-card-title" title={title}>{title}</h3>
        {excerpt && <p className="editorial-card-excerpt">{excerpt}</p>}
        <div className="editorial-card-footer">
          <span className="editorial-card-readmore">{readMore}<ChevronLeft size={15} /></span>
          {(photoCount > 0 || videoCount > 0) && (
            <span className="editorial-card-counts">
              {photoCount > 0 && <span><ImageIcon size={13} />{photoCount.toLocaleString('fa-IR')}</span>}
              {videoCount > 0 && <span><Play size={13} />{videoCount.toLocaleString('fa-IR')}</span>}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
'''

NEWS_CARD = r'''import { NEWS_CATEGORIES } from '@/lib/news-content';
import EditorialCard from '@/components/EditorialCard';

export default function NewsCard({ item, className = '' }) {
  const cat = NEWS_CATEGORIES[item.category];
  const categoryLabel = cat?.label || item.categoryLabel || item.category || 'خبر';

  return (
    <EditorialCard
      to={`/news/${item.slug || item.id}`}
      image={item.image || '/banner/banner-four-bowls.webp'}
      alt={item.title}
      title={item.title}
      category={categoryLabel}
      categoryTone={cat?.tone || 'var(--gold-1)'}
      date={item.date}
      excerpt={item.excerpt}
      readMore="خواندن خبر"
      photoCount={item.photos?.length || 0}
      videoCount={item.videos?.length || 0}
      className={className}
    />
  );
}
'''

LUXURY_CSS = r'''

/* 7GOLDEN_LUXURY_VISUAL_REFINEMENT_V1: calm champagne gold, ivory copy,
   consistent editorial cards, wider title areas, and a restrained home mosaic. */
:root {
  --fg-muted: #F0EBE2;
  --muted-foreground: 40 26% 91%;
  --accent: #CDB273;
  --accent-hover: #E8D9AC;
  --accent-gold: #CDB273;
  --gold-1: #F5E9C8;
  --gold-2: #D2B779;
  --gold-3: #9B7942;
  --gold-4: #5F4824;
  --brass: #D2B779;
  --hairline: rgba(210, 183, 121, .22);
  --hairline-strong: rgba(210, 183, 121, .44);
}

/* Gold emphasis stays elegant and still; no animated yellow sweep. */
.gold-text {
  background: linear-gradient(105deg, #A98B50 0%, #D2B779 32%, #F5E9C8 50%, #D2B779 68%, #A98B50 100%);
  background-size: 100% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: none;
}

/* Shared card pattern: image first, details below, category outside the title row. */
.editorial-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--hairline);
  border-radius: 1.2rem;
  background: linear-gradient(180deg, rgba(255,255,255,.018), rgba(255,255,255,.004)), var(--bg-secondary);
  color: var(--ink);
  box-shadow: 0 16px 42px rgba(0,0,0,.18);
  transition: transform .38s cubic-bezier(.16,1,.3,1), border-color .38s ease, box-shadow .38s ease;
}
.editorial-card:hover {
  transform: translateY(-4px);
  border-color: var(--hairline-strong);
  box-shadow: 0 22px 54px rgba(0,0,0,.28);
}
.editorial-card-media {
  position: relative;
  flex: 0 0 auto;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: var(--bg-secondary);
}
.editorial-card-media::after {
  content: '';
  position: absolute;
  inset: 45% 0 0;
  pointer-events: none;
  background: linear-gradient(180deg, transparent, rgba(7,6,4,.24));
}
.editorial-card-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .7s cubic-bezier(.16,1,.3,1), filter .5s ease;
}
.editorial-card:hover .editorial-card-media img { transform: scale(1.045); filter: saturate(1.04); }
.editorial-card-category {
  position: absolute;
  z-index: 1;
  top: .8rem;
  inset-inline-start: .8rem;
  max-width: calc(100% - 1.6rem);
  overflow: hidden;
  padding: .32rem .68rem;
  border: 1px solid rgba(210,183,121,.42);
  border-radius: 999px;
  background: rgba(8,7,5,.76);
  backdrop-filter: blur(9px);
  font-size: .68rem;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.editorial-card-copy {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
  padding: clamp(.95rem, 1.4vw, 1.3rem);
  text-align: right;
}
.editorial-card-date {
  display: block;
  margin-bottom: .38rem;
  color: rgba(255,252,245,.78);
  font-size: .7rem;
  line-height: 1.7;
}
.editorial-card-title {
  display: -webkit-box;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin: 0 0 .5rem;
  overflow: hidden;
  color: #FFFDF8;
  font-family: 'Peyda', sans-serif;
  font-size: clamp(1rem, 1.35vw, 1.18rem);
  font-weight: 850;
  line-height: 1.65;
  white-space: normal;
  overflow-wrap: break-word;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.editorial-card-excerpt {
  display: -webkit-box;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  color: rgba(255,252,245,.84);
  font-size: .82rem;
  line-height: 1.95;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.editorial-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: .6rem;
  margin-top: auto;
  padding-top: 1rem;
}
.editorial-card-readmore {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: .35rem;
  color: var(--gold-1);
  font-size: .77rem;
  font-weight: 800;
}
.editorial-card-counts,
.editorial-card-counts > span {
  display: inline-flex;
  align-items: center;
  gap: .32rem;
}
.editorial-card-counts { color: rgba(255,252,245,.78); font-size: .7rem; gap: .75rem; }

/* Wider reading column: avoid three cramped news cards and narrow titles. */
.blog-page-layout,
.news-page-layout {
  grid-template-columns: minmax(0, 1fr) minmax(12.5rem, 15rem);
  gap: clamp(1rem, 2vw, 1.75rem);
}
.news-feed-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.15rem; }
.blog-page-main > .grid { gap: 1.15rem; }

/* Remove legacy one-line/ellipsis rules that were clipping meaningful headings. */
.blog-page h1,
.blog-page .display-lg,
.blog-page .display-md,
.blog-page .display-sm,
.blog-page .blog-card-heading,
.blog-page .blog-card-title,
.news-page h1,
.news-page .display-lg,
.news-page .display-md,
.news-page .display-sm,
.news-page .news-featured-title,
.news-page .news-section-heading h2,
.blog-article-page .blog-article-title,
.news-article-page .news-article-title {
  max-width: 100%;
  white-space: normal !important;
  overflow-wrap: break-word;
  text-overflow: clip;
}
.blog-card-title,
.blog-card-heading,
.news-featured-title,
.news-section-heading h2 { overflow: visible; }

/* Use the calm ivory tone for muted UI copy while retaining hierarchy by size. */
.blog-sidebar-search label,
.news-sidebar-search label,
.blog-recent-list span,
.news-recent-list span,
.blog-recent-title,
.news-recent-title,
.blog-sidebar p,
.news-sidebar p,
.news-featured-meta,
.news-section-heading span,
.blog-load-more-status,
.news-load-more-status { color: rgba(255,252,245,.82); }

@media (max-width: 1023px) {
  .blog-page-layout,
  .news-page-layout { grid-template-columns: minmax(0, 1fr); }
  .blog-sidebar,
  .news-sidebar { position: static; order: -1; }
  .news-feed-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 639px) {
  .news-feed-grid,
  .blog-page-main > .grid { grid-template-columns: minmax(0, 1fr); }
  .editorial-card-copy { padding: 1rem; }
  .editorial-card-title { font-size: 1.02rem; }
}
'''

SLIDES = [
    r'''  {
    image: '/banner/Hero-Banner-main.webp',
    imagePosition: 'center 52%',
    badge: 'پسته و خشکبار ممتاز',
    title: 'کیفیت در هر دانه',
    accent: 'از انتخاب تا فرآوری',
    description: 'تصویری از کیفیت مواد اولیه و دقت در آماده‌سازی محصولات هفت طلایی برای کاربردهای صنایع غذایی.',
  },''',
    r'''  {
    image: '/banner/HeroBanner-1.webp',
    imagePosition: 'center 52%',
    badge: 'فندق، پسته و بادام',
    title: 'طبیعت، با دقت انتخاب‌شده',
    accent: 'برای تولید حرفه‌ای',
    description: 'محصولات خشکبار با شکل‌های متنوع فرآوری، متناسب با نیاز قنادی، شکلات‌سازی و صنایع غذایی.',
  },''',
    r'''  {
    image: '/banner/Hero-banner-2.webp',
    imagePosition: 'center 54%',
    badge: 'از سال ۱۳۷۷',
    title: 'تجربه در کنار کیفیت',
    accent: 'همراه خط تولید شما',
    description: 'هفت طلایی با تمرکز بر فندق، پسته و بادام، مسیر انتخاب مواد اولیه مناسب را برای کسب‌وکارها ساده‌تر می‌کند.',
  },''',
]


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def patch_blog(content: str) -> tuple[str, bool]:
    original = content
    if "EditorialCard" not in content:
        pattern = re.compile(
            r'<Link\s+to=\{`/blog/\$\{post\.slug\}`\}\s+className="[^"]*blog-cine-card[^"]*"\s+style=\{\{\s*aspectRatio:\s*[\'\"]3\s*/\s*4[\'\"]\s*\}\}>.*?</Link>',
            re.S,
        )
        replacement = '''<EditorialCard
                          to={`/blog/${post.slug}`}
                          image={post.image || '/banner/banner-four-bowls.webp'}
                          alt={isFA ? post.titleFA : post.titleEN}
                          title={isFA ? post.titleFA : post.titleEN}
                          category={post.category ? categoryLabel(post.category) : (isFA ? 'وبلاگ' : 'Blog')}
                          date={isFA ? post.date : post.dateEN}
                          excerpt={isFA ? post.excerptFA : post.excerptEN}
                          readMore={t('read_more')}
                        />'''
        content, count = pattern.subn(replacement, content, count=1)
        if count != 1:
            # Older variants may format the inline card differently; don't silently leave cards inconsistent.
            if "blog-cine-card" in content:
                raise RuntimeError("Could not safely replace the current blog-card JSX. No files have been written.")
            if "<EditorialCard" not in content:
                raise RuntimeError("Could not find a blog-card block to unify with news cards. No files have been written.")
    if "import EditorialCard from '@/components/EditorialCard';" not in content:
        anchor = "import Eyebrow from '@/components/ui/eyebrow';"
        if anchor in content:
            content = content.replace(anchor, anchor + "\nimport EditorialCard from '@/components/EditorialCard';", 1)
        else:
            # Fallback: insert after React imports, avoiding arbitrary position in JSX.
            match = re.search(r"^(?:import .*?;\n)+", content, re.M)
            if not match:
                raise RuntimeError("Could not find the import section in src/pages/Blog.jsx.")
            content = content[:match.end()] + "import EditorialCard from '@/components/EditorialCard';\n" + content[match.end():]
    return content, content != original


def patch_news_card(content: str) -> str:
    if "EditorialCard" in content and "categoryTone={cat?.tone" in content:
        return content
    return NEWS_CARD


def patch_footer(content: str) -> str:
    # Current source uses a one-line entry; this expression also handles a multi-line object.
    updated, count = re.subn(r"\{\s*id\s*:\s*['\"]bale['\"].*?\}\s*,?\s*", "", content, count=1, flags=re.S)
    # Don't require a match if the Bale option was already removed.
    return updated if count else content


def patch_slider(content: str) -> str:
    if "const BASE_SLIDES" not in content:
        raise RuntimeError("Could not find BASE_SLIDES in src/components/HeroSlider.jsx.")
    match = re.search(r"const\s+BASE_SLIDES\s*=\s*\[(.*?)\n\];", content, flags=re.S)
    if not match:
        raise RuntimeError("Could not identify the BASE_SLIDES array boundary safely.")
    body = match.group(1)
    additions = [slide for slide in SLIDES if slide.split("image: '", 1)[1].split("'", 1)[0] not in body]
    if not additions:
        return content
    body = body.rstrip()
    sep = "\n" if body.endswith(",") else ",\n"
    new_body = body + sep + "\n".join(additions)
    return content[:match.start(1)] + new_body + content[match.end(1):]


def patch_home_media(content: str) -> str:
    if "const visibleMedia = media.slice(0, 5);" not in content:
        active_pattern = re.compile(r"^(?P<indent>[ \t]*)const activeItem = media\.find\(\(item\) => item\.id === activeId\) \|\| null;", re.M)
        found = active_pattern.search(content)
        if not found:
            raise RuntimeError("Could not find the active media selector in HomeVideoShowcase.jsx.")
        indent = found.group("indent")
        replacement = (
            f"{indent}// Show a deliberately small five-item selection on the homepage; the admin ordering decides which items lead.\n"
            f"{indent}const visibleMedia = media.slice(0, 5);\n"
            f"{indent}const activeItem = visibleMedia.find((item) => item.id === activeId) || null;"
        )
        content = content[:found.start()] + replacement + content[found.end():]
    # Navigation and lightbox should only cycle the actually shown selection; other archive assets remain in CMS.
    active_pos = content.find("const activeItem = visibleMedia.find")
    start = content.rfind("\n", 0, active_pos) + 1 if active_pos >= 0 else -1
    end = content.find("<div className=\"home-media-mosaic\">", active_pos)
    if start < 0 or end < 0:
        raise RuntimeError("Could not safely identify the home-media interaction and tile-rendering blocks.")
    head, region = content[:start], content[start:end]
    tail = content[end:]
    region = region.replace("media.findIndex(", "visibleMedia.findIndex(")
    region = region.replace("media.length", "visibleMedia.length")
    region = region.replace("media[(index + delta + visibleMedia.length) % visibleMedia.length]", "visibleMedia[(index + delta + visibleMedia.length) % visibleMedia.length]")
    region = region.replace("media[(index + delta + media.length) % media.length]", "visibleMedia[(index + delta + visibleMedia.length) % visibleMedia.length]")
    region = region.replace("media[(index + 1 + media.length) % media.length]", "visibleMedia[(index + 1 + visibleMedia.length) % visibleMedia.length]")
    region = region.replace("media[(index - 1 + media.length) % media.length]", "visibleMedia[(index - 1 + visibleMedia.length) % visibleMedia.length]")
    region = region.replace("if (!media.length)", "if (!visibleMedia.length)")
    # Be explicit about the array indexed by keyboard navigation.
    region = re.sub(r"const next = media\[", "const next = visibleMedia[", region)
    # JSX map for the tile grid only. This is idempotent on a second run.
    if "{visibleMedia.map(" not in tail:
        tail, count = re.subn(r'(<div className="home-media-mosaic">\s*)\{media\.map\(', r'\1{visibleMedia.map(', tail, count=1)
        if count != 1:
            raise RuntimeError("Could not safely limit home mosaic rendering to the selected five items.")
    # Keep section copy truthful and calmer when no CMS subtitle has been provided.
    tail = tail.replace(
        'روایتی موزاییکی از فضای کارخانه، فرآوری و تصاویر ثبت‌شدهٔ محصولات هفت طلایی؛ ویدیوها بی‌صدا و پیوسته مانند تصویر متحرک نمایش داده می‌شوند.',
        'گزیده‌ای کنترل‌شده از تصاویر باکیفیت کارخانه، فرآوری و محصولات هفت طلایی؛ ویدیوهای منتخب به‌صورت بی‌صدا و پیوسته نمایش داده می‌شوند.'
    )
    return head + region + tail


def patch_logo_references(root: Path, original_files: dict[str, str]) -> dict[str, str]:
    updated: dict[str, str] = {}
    valid_suffixes = {".jsx", ".tsx", ".js", ".ts", ".html", ".css", ".json", ".webmanifest"}
    excluded = {".git", "node_modules", "dist", "build", ".next", ".venv", "venv", "__pycache__"}
    for relative, original in original_files.items():
        path = Path(relative)
        if path.suffix.lower() not in valid_suffixes:
            continue
        if any(part in excluded for part in path.parts):
            continue
        content = original
        # Only rewrite direct root logo paths; do not touch /banner/logo.webp or archived paths.
        content = re.sub(r"(?P<q>['\"])/logo(?:-white)?\.webp(?P=q)", lambda m: f"{m.group('q')}/logo-symbol.webp{m.group('q')}", content)
        content = content.replace("https://7golden.co/logo.webp", "https://7golden.co/logo-symbol.webp")
        content = content.replace("https://7golden.co/logo-white.webp", "https://7golden.co/logo-symbol.webp")
        if content != original:
            updated[relative] = content
    return updated


def build_changes(root: Path) -> tuple[dict[str, str], list[str], Path]:
    required = [
        "src/pages/Blog.jsx",
        "src/components/news/NewsCard.jsx",
        "src/components/Footer.jsx",
        "src/components/HeroSlider.jsx",
        "src/components/home/HomeVideoShowcase.jsx",
        "src/styles/story.css",
    ]
    missing = [str(root / rel) for rel in required if not (root / rel).is_file()]
    if missing:
        raise FileNotFoundError("Required frontend file(s) not found:\n  " + "\n  ".join(missing))

    # Prepare logo generation before any write; user data and the database are never touched.
    logo_source = next((root / rel for rel in LOGO_SOURCE_CANDIDATES if (root / rel).is_file()), None)
    if not logo_source:
        raise FileNotFoundError("Could not find the existing 7Golden logo source to create a mark-only version.")
    try:
        from PIL import Image
    except ImportError:
        Image = None

    originals: dict[str, str] = {}
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if any(part in {".git", "node_modules", "dist", "build", ".next", ".venv", "venv", "__pycache__"} for part in path.relative_to(root).parts):
            continue
        if path.suffix.lower() not in {".jsx", ".tsx", ".js", ".ts", ".html", ".css", ".json"}:
            continue
        try:
            originals[path.relative_to(root).as_posix()] = read_text(path)
        except (UnicodeDecodeError, OSError):
            continue

    changes = patch_logo_references(root, originals)

    def current(rel: str) -> str:
        return changes.get(rel, originals[rel])

    blog_path = "src/pages/Blog.jsx"
    blog_new, _ = patch_blog(current(blog_path))
    changes[blog_path] = blog_new
    news_card_path = "src/components/news/NewsCard.jsx"
    changes[news_card_path] = patch_news_card(current(news_card_path))
    footer_path = "src/components/Footer.jsx"
    changes[footer_path] = patch_footer(current(footer_path))
    hero_path = "src/components/HeroSlider.jsx"
    changes[hero_path] = patch_slider(current(hero_path))
    mosaic_path = "src/components/home/HomeVideoShowcase.jsx"
    changes[mosaic_path] = patch_home_media(current(mosaic_path))
    css_path = "src/styles/story.css"
    css = current(css_path)
    if MARKER not in css:
        css += LUXURY_CSS
    changes[css_path] = css
    changes["src/components/EditorialCard.jsx"] = EDITORIAL_CARD

    # Ensure logo crop can be prepared in a temporary location before committing changes.
    temp_dir = Path(tempfile.mkdtemp(prefix="7golden-luxury-preview-"))
    out_logo = temp_dir / "logo-symbol.webp"
    try:
        if Image is None:
            # This existing migrated asset contains the emblem only (no wordmark).
            mark_only = root / "public/migrated/https___7golden.co_wp-content_uploads_2023_08_logo.webp"
            if not mark_only.is_file():
                raise RuntimeError("Pillow is unavailable and no existing mark-only logo asset was found.")
            shutil.copy2(mark_only, out_logo)
        else:
            with Image.open(logo_source) as opened:
                image = opened.convert("RGBA")
                # The original vertical logo places the emblem in its upper half and the wordmark below.
                crop_h = max(1, min(image.height, int(image.height * 0.53)))
                cropped = image.crop((0, 0, image.width, crop_h))
                alpha = cropped.getchannel("A")
                bbox = alpha.getbbox()
                if bbox:
                    cropped = cropped.crop(bbox)
                # Pad to a square so it works consistently in the header, footer, loader and touch icon.
                cropped.thumbnail((448, 448), Image.Resampling.LANCZOS)
                square = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
                square.alpha_composite(cropped, ((512 - cropped.width) // 2, (512 - cropped.height) // 2))
                square.save(out_logo, "WEBP", quality=95, method=6)
    except Exception as exc:
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise RuntimeError(f"Could not prepare the text-free logo from {logo_source}: {exc}") from exc

    changes = {k: v for k, v in changes.items() if k not in originals or v != originals[k]}
    # If output already exists, still refresh it only when the user explicitly applies the patch.
    return changes, required, out_logo


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", default=".", help="Path to the local 7Golden repository (defaults to current directory)")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing files (default behavior)")
    parser.add_argument("--apply", action="store_true", help="Apply changes after preparing the complete patch in memory")
    args = parser.parse_args()
    if args.dry_run and args.apply:
        parser.error("Choose either --dry-run or --apply, not both.")

    root = Path(args.root).expanduser().resolve()
    if not root.is_dir():
        print(f"Repository directory does not exist: {root}", file=sys.stderr)
        return 2

    try:
        changes, required, prepared_logo = build_changes(root)
    except Exception as exc:
        print(f"PRECHECK FAILED — no project files were written.\n{exc}", file=sys.stderr)
        return 1

    logo_dest = root / LOGO_SYMBOL
    changed = sorted(set(changes) | {LOGO_SYMBOL})
    print("7Golden luxury visual refinement — prepared changes:")
    for rel in changed:
        if rel == LOGO_SYMBOL:
            label = "[new]" if not logo_dest.exists() else "[refresh]"
        else:
            label = "[new]" if not (root / rel).exists() else "[edit]"
        print(f"  {label} {rel}")
    print("\nScope: shared blog/news cards, footer Bale icon/link removal, mark-only logo, homepage mosaic limited to five items, three additional high-resolution local hero slides, and warm ivory/champagne styling.")
    print("No database or editorial content records are changed.")

    if not args.apply:
        print("\nDRY RUN ONLY — nothing was written. Review the list above, then rerun with --apply to apply the patch.")
        shutil.rmtree(prepared_logo.parent, ignore_errors=True)
        return 0

    # Save a full backup outside the repository before writing any source files.
    backup_root = Path(tempfile.mkdtemp(prefix=f"7golden-visual-backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}-"))
    try:
        for rel in changes:
            target = root / rel
            if target.exists():
                backup = backup_root / rel
                backup.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(target, backup)
        if logo_dest.exists():
            backup = backup_root / LOGO_SYMBOL
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(logo_dest, backup)

        for rel, content in changes.items():
            target = root / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding="utf-8")
        logo_dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(prepared_logo, logo_dest)
    except Exception as exc:
        print(f"WRITE FAILED: {exc}\nBackup location: {backup_root}", file=sys.stderr)
        print("Some writes may have completed; restore the listed backup before retrying.", file=sys.stderr)
        return 1
    finally:
        shutil.rmtree(prepared_logo.parent, ignore_errors=True)

    print(f"\nAPPLIED SUCCESSFULLY. Backup created at: {backup_root}")
    print("Next checks:")
    print("  git diff --check")
    print("  pnpm build  # or the frontend build command used by this repo")
    print("  git status --short")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
