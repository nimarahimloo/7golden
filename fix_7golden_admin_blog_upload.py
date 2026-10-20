#!/usr/bin/env python3
"""Patch 7Golden admin NewsPost registration, rich text display/editor, scrolling and upload size.

Safe-by-default: runs in --dry-run mode unless --apply is supplied.
It transforms every target in memory before writing any project files and saves a
backup of changed files outside the repository before the first write.
"""
from __future__ import annotations

import argparse
import datetime as _dt
import shutil
import sys
from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str, path: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected exactly one match for {label}, found {count}.")
    return text.replace(old, new, 1)


def patch_base44_client(text: str) -> str:
    old = """const entityNames = [
  'Product', 'Category', 'BlogPost', 'Award', 'GalleryImage',
  'Testimonial', 'ContactMessage', 'Order', 'SiteSettings', 'User',
  'PageSection',
];"""
    new = """const entityNames = [
  'Product', 'Category', 'BlogPost', 'NewsPost', 'Award', 'GalleryImage',
  'Testimonial', 'ContactMessage', 'Order', 'SiteSettings', 'User',
  'PageSection',
];"""
    return replace_once(text, old, new, "register NewsPost in local entity adapter", "src/api/base44Client.js")


def patch_admin(text: str) -> str:
    text = replace_once(
        text,
        "{ key: 'excerpt_fa', label: 'خلاصه', type: 'richtext' },",
        "{ key: 'excerpt_fa', label: 'خلاصه', type: 'textarea', rows: 3 },",
        "use plain text for blog excerpt (avoids HTML tags in listing cards)",
        "src/pages/Admin.jsx",
    )
    text = replace_once(
        text,
        '<div className="flex flex-col lg:flex-row min-h-screen">',
        '<div className="admin-shell flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden">',
        "make desktop admin a viewport-height shell with internal scrolling",
        "src/pages/Admin.jsx",
    )
    text = replace_once(
        text,
        '<aside className="lg:w-64 flex-shrink-0"',
        '<aside className="admin-sidebar lg:w-64 flex-shrink-0 lg:h-screen lg:overflow-y-auto"',
        "allow the admin navigation itself to scroll",
        "src/pages/Admin.jsx",
    )
    text = replace_once(
        text,
        '<main className="flex-1 p-4 lg:p-8 overflow-auto">',
        '<main className="admin-main min-w-0 flex-1 p-4 lg:p-8 lg:h-screen lg:min-h-0 lg:overflow-y-auto overscroll-contain">',
        "constrain admin content and provide a reliable vertical scroll area",
        "src/pages/Admin.jsx",
    )
    return text


def patch_entity_crud(text: str) -> str:
    text = replace_once(
        text,
        "if (file.size > 8 * 1024 * 1024) {\n      setFieldError('حجم فایل حداکثر ۸ مگابایت');",
        "if (file.size > 16 * 1024 * 1024) {\n      setFieldError('حجم فایل حداکثر ۱۶ مگابایت');",
        "raise individual image upload limit from 8 MiB to 16 MiB",
        "src/components/admin/EntityCrud.jsx",
    )
    text = replace_once(
        text,
        "        if (file.size > 12 * 1024 * 1024) continue;",
        "        if (file.size > 16 * 1024 * 1024) {\n          setErr('هر تصویر باید حداکثر ۱۶ مگابایت باشد.');\n          continue;\n        }",
        "raise gallery image upload limit from 12 MiB to 16 MiB and show a helpful message",
        "src/components/admin/EntityCrud.jsx",
    )
    # An invalid persisted JSON string should not crash the whole admin section.
    old = """  const list = Array.isArray(value) ? value : (typeof value === 'string' && value.startsWith('[') ? JSON.parse(value || '[]') : (value ? [value] : []));"""
    new = """  const list = Array.isArray(value) ? value : (() => {
    if (typeof value === 'string' && value.startsWith('[')) {
      try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; }
      catch { return []; }
    }
    return value ? [value] : [];
  })();"""
    text = replace_once(text, old, new, "make malformed gallery JSON resilient", "src/components/admin/EntityCrud.jsx")
    return text


def patch_upload_route(text: str) -> str:
    return replace_once(
        text,
        "limits: { fileSize: 12 * 1024 * 1024 },",
        "limits: { fileSize: 16 * 1024 * 1024 },",
        "raise server-side multer file size limit to 16 MiB",
        "backend/src/routes/upload.ts",
    )



def patch_api_content(text: str) -> str:
    helper = r"""function plainText(value) {
  return String(value || '')
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<\/(?:p|h[1-6]|li|div|section)>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '\"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

"""
    text = replace_once(text, "function normalizeBlogPost(r) {", helper + "function normalizeBlogPost(r) {", "add plain-text normalization for excerpts", "src/lib/api/content.js")
    text = replace_once(text, "    excerptFA: r.excerpt_fa,", "    excerptFA: plainText(r.excerpt_fa),", "strip HTML from Persian blog excerpts", "src/lib/api/content.js")
    text = replace_once(text, "    excerptEN: r.excerpt_en,", "    excerptEN: plainText(r.excerpt_en),", "strip HTML from English blog excerpts", "src/lib/api/content.js")
    return text

def patch_rich_text_editor(text: str) -> str:
    if "import ReactQuill from 'react-quill-new';" not in text or "react-quill-new/dist/quill.snow.css" not in text:
        raise RuntimeError("src/components/admin/RichTextEditor.jsx: expected the current ReactQuill editor; refusing to overwrite an unknown component.")
    # The current file is deliberately rewritten as one small, stable component:
    # Quill's default white paper is retained, but text, toolbar and placeholder
    # colors are explicitly styled in story.css below.
    return """import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <div dir="rtl" className="admin-richtext-editor rounded-xl overflow-hidden">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={(nextValue) => onChange(nextValue)}
        placeholder={placeholder || 'متن را وارد کنید…'}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
          ],
        }}
      />
    </div>
  );
}
"""


def patch_blog_post(text: str) -> str:
    helper = r'''const HTML_CONTENT_TAG = /<(?:!doctype|\/?(?:p|h[1-6]|ul|ol|li|strong|b|em|i|u|s|blockquote|div|span|br|a|img|hr|pre|code|table|thead|tbody|tr|th|td|sup|sub)\b[^>]*>)/i;
const SAFE_CONTENT_TAGS = new Set([
  'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
  'strong', 'b', 'em', 'i', 'u', 's', 'blockquote', 'div', 'span', 'a',
  'img', 'hr', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'sup', 'sub',
]);
const DROP_CONTENT_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'form', 'input', 'button', 'textarea', 'select', 'option', 'meta', 'link']);

function isHtmlContent(value) {
  return HTML_CONTENT_TAG.test(String(value || ''));
}

function isSafeContentUrl(value, allowAnchor = false) {
  const raw = String(value || '').trim();
  if (!raw || /[\u0000-\u001f]/.test(raw)) return false;
  if (allowAnchor && raw.startsWith('#')) return true;
  try {
    const url = new URL(raw, window.location.origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function sanitizeBlogHtml(input) {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return '';
  const doc = new DOMParser().parseFromString(String(input || ''), 'text/html');

  const cleanChildren = (parent) => {
    [...parent.childNodes].forEach((node) => {
      if (node.nodeType === 8) {
        node.remove();
        return;
      }
      if (node.nodeType !== 1) return;
      const tag = node.tagName.toLowerCase();
      if (DROP_CONTENT_TAGS.has(tag)) {
        node.remove();
        return;
      }
      cleanChildren(node);
      if (!SAFE_CONTENT_TAGS.has(tag)) {
        node.replaceWith(...[...node.childNodes]);
        return;
      }

      [...node.attributes].forEach((attribute) => {
        const name = attribute.name.toLowerCase();
        if (!['href', 'src', 'alt', 'title', 'colspan', 'rowspan'].includes(name)) {
          node.removeAttribute(attribute.name);
        }
      });

      if (tag === 'a') {
        const href = node.getAttribute('href');
        if (href && !isSafeContentUrl(href, true)) node.removeAttribute('href');
        node.removeAttribute('target');
        node.removeAttribute('rel');
      }
      if (tag === 'img') {
        const src = node.getAttribute('src');
        if (src && !isSafeContentUrl(src)) node.removeAttribute('src');
        node.setAttribute('loading', 'lazy');
        node.setAttribute('decoding', 'async');
        if (!node.getAttribute('alt')) node.setAttribute('alt', '');
      }
    });
  };

  cleanChildren(doc.body);
  return doc.body.innerHTML;
}

function SafeBlogHtml({ html }) {
  const safeHtml = sanitizeBlogHtml(html);
  return <div className="prose-content-html" dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}

'''
    text = replace_once(text, "export default function BlogPost() {", helper + "export default function BlogPost() {", "add safe HTML content renderer for Quill-authored articles", "src/pages/BlogPost.jsx")
    text = replace_once(
        text,
        '            <div className="prose-content font-body text-[15px] leading-[2]">\n              <ReactMarkdown',
        '            <div className={`prose-content font-body text-[15px] leading-[2] ${isHtmlContent(post?.content) ? \'prose-content-has-html\' : \'\'}`}>\n              {isHtmlContent(post?.content) ? (\n                <SafeBlogHtml html={post?.content || \'\'} />\n              ) : (\n              <ReactMarkdown',
        "render rich HTML saved by the admin editor instead of displaying tags as text",
        "src/pages/BlogPost.jsx",
    )
    text = replace_once(
        text,
        "              </ReactMarkdown>\n            </div>\n\n            {/* Footer of article */}",
        "              </ReactMarkdown>\n              )}\n            </div>\n\n            {/* Footer of article */}",
        "close the conditional markdown/HTML renderer",
        "src/pages/BlogPost.jsx",
    )
    return text


def patch_story_css(text: str) -> str:
    marker = "/* ADMIN_RICHTEXT_UPLOAD_SCROLL_AND_BLOG_HTML_FIX_V1 */"
    if marker in text:
        raise RuntimeError("src/styles/story.css: fix marker already exists; refusing to append a duplicate patch.")
    css = r'''

/* ADMIN_RICHTEXT_UPLOAD_SCROLL_AND_BLOG_HTML_FIX_V1 */
/* The desktop admin has its own dependable vertical scroll regions; mobile stays document-scrollable. */
@media (min-width: 1024px) {
  .admin-shell { height: 100vh; min-height: 0; overflow: hidden; }
  .admin-sidebar, .admin-main { min-height: 0; overscroll-behavior: contain; }
  .admin-sidebar { scrollbar-gutter: stable; }
  .admin-main { overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable; }
}
.admin-sidebar::-webkit-scrollbar, .admin-main::-webkit-scrollbar { width: 9px; }
.admin-sidebar::-webkit-scrollbar-thumb, .admin-main::-webkit-scrollbar-thumb {
  background: rgba(214, 178, 94, .55); border: 2px solid transparent; background-clip: padding-box; border-radius: 999px;
}
.admin-sidebar, .admin-main { scrollbar-color: rgba(214, 178, 94, .55) transparent; scrollbar-width: thin; }

/* Quill is used as the admin rich-text editor. Explicit colors avoid the light toolbar/editor inheriting white text. */
.admin-richtext-editor { border: 1px solid #c9c0b1; background: #fff; color: #24211c; }
.admin-richtext-editor .ql-toolbar.ql-snow { border: 0; border-bottom: 1px solid #d7d0c5; background: #f3f0e9; }
.admin-richtext-editor .ql-container.ql-snow { border: 0; background: #fff; color: #24211c; font-family: 'Peyda', sans-serif; }
.admin-richtext-editor .ql-editor { min-height: 220px; padding: 14px 16px; color: #24211c !important; background: #fff; direction: rtl; text-align: right; font-size: .9rem; line-height: 1.95; }
.admin-richtext-editor .ql-editor p, .admin-richtext-editor .ql-editor li,
.admin-richtext-editor .ql-editor h1, .admin-richtext-editor .ql-editor h2,
.admin-richtext-editor .ql-editor h3 { color: #24211c !important; }
.admin-richtext-editor .ql-editor.ql-blank::before { right: 16px; left: 16px; color: #777067; font-style: normal; text-align: right; }
.admin-richtext-editor .ql-snow .ql-stroke { stroke: #51483c; }
.admin-richtext-editor .ql-snow .ql-fill { fill: #51483c; }
.admin-richtext-editor .ql-snow .ql-picker { color: #51483c; }
.admin-richtext-editor .ql-snow .ql-picker-options { background: #fff; color: #24211c; }
.admin-richtext-editor .ql-snow button:hover .ql-stroke,
.admin-richtext-editor .ql-snow button.ql-active .ql-stroke { stroke: #9b741e; }

/* Rich-text HTML from Quill is sanitized before rendering and styled like editorial article copy. */
.blog-article-page .prose-content-has-html h1,
.blog-article-page .prose-content-has-html h2,
.blog-article-page .prose-content-has-html h3,
.blog-article-page .prose-content-has-html h4,
.blog-article-page .prose-content-has-html h5,
.blog-article-page .prose-content-has-html h6 {
  display: block; max-width: 100%; min-width: 0; overflow: visible; white-space: normal; text-overflow: clip;
  margin: 2rem 0 .85rem; color: var(--fg); font-family: 'Peyda', sans-serif; font-weight: 800; line-height: 1.7;
}
.blog-article-page .prose-content-has-html h1 { font-size: clamp(1.45rem, 2.4vw, 2rem); }
.blog-article-page .prose-content-has-html h2 { font-size: clamp(1.25rem, 2vw, 1.65rem); }
.blog-article-page .prose-content-has-html h3,
.blog-article-page .prose-content-has-html h4 { font-size: 1.12rem; }
.blog-article-page .prose-content-has-html p,
.blog-article-page .prose-content-has-html div,
.blog-article-page .prose-content-has-html span { white-space: normal; overflow-wrap: anywhere; color: var(--fg-muted); }
.blog-article-page .prose-content-has-html p { margin: 0 0 1.2rem; }
.blog-article-page .prose-content-has-html ul,
.blog-article-page .prose-content-has-html ol { margin: 0 0 1.25rem; padding-inline-start: 1.5rem; }
.blog-article-page .prose-content-has-html ul { list-style: disc; }
.blog-article-page .prose-content-has-html ol { list-style: decimal; }
.blog-article-page .prose-content-has-html li { display: list-item; margin: .35rem 0; }
.blog-article-page .prose-content-has-html strong,
.blog-article-page .prose-content-has-html b { color: var(--fg); font-weight: 800; }
.blog-article-page .prose-content-has-html blockquote { margin: 1.5rem 0; padding: .75rem 1rem; border-inline-start: 3px solid var(--accent); background: rgba(214,178,94,.07); border-radius: .5rem; }
.blog-article-page .prose-content-has-html a { color: var(--accent-hover); text-decoration: underline; text-underline-offset: .2em; }
.blog-article-page .prose-content-has-html img { display: block; width: auto; max-width: 100%; height: auto; margin: 1.5rem auto; border-radius: .85rem; }
.blog-article-page .prose-content-has-html hr { margin: 1.5rem 0; border-color: var(--hairline); }
.blog-article-page .prose-content-has-html pre { max-width: 100%; overflow-x: auto; padding: 1rem; border-radius: .75rem; background: rgba(255,255,255,.06); direction: ltr; text-align: left; }
'''
    return text.rstrip() + "\n" + css + "\n"


def patch_file(root: Path, relative: str, transform) -> str:
    path = root / relative
    if not path.is_file():
        raise FileNotFoundError(f"Required file not found: {path}")
    original = path.read_text(encoding="utf-8")
    updated = transform(original)
    if not isinstance(updated, str) or not updated:
        raise RuntimeError(f"Patch for {relative} returned invalid content")
    return updated


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", default=".", help="Path to the 7Golden repository (default: current directory)")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--dry-run", action="store_true", help="List the planned changes without writing files (default)")
    mode.add_argument("--apply", action="store_true", help="Apply all changes after validating every target")
    args = parser.parse_args()

    root = Path(args.root).expanduser().resolve()
    if not (root / "src/pages/Admin.jsx").is_file() or not (root / "backend/src/routes/upload.ts").is_file():
        print(f"Error: {root} does not look like the expected 7Golden repository.", file=sys.stderr)
        return 2

    tasks = [
        ("src/api/base44Client.js", patch_base44_client),
        ("src/pages/Admin.jsx", patch_admin),
        ("src/components/admin/EntityCrud.jsx", patch_entity_crud),
        ("src/lib/api/content.js", patch_api_content),
        ("backend/src/routes/upload.ts", patch_upload_route),
        ("src/components/admin/RichTextEditor.jsx", patch_rich_text_editor),
        ("src/pages/BlogPost.jsx", patch_blog_post),
        ("src/styles/story.css", patch_story_css),
    ]
    updated: dict[str, str] = {}
    originals: dict[str, str] = {}
    try:
        for relative, transform in tasks:
            p = root / relative
            originals[relative] = p.read_text(encoding="utf-8") if p.is_file() else ""
            updated[relative] = patch_file(root, relative, transform)
    except Exception as exc:
        print(f"Preflight failed; no project files were written.\n{exc}", file=sys.stderr)
        return 1

    print(f"Repository: {root}")
    print("Changes prepared:")
    for relative in updated:
        print(f"  - {relative}")
    print("\nWhat this patch addresses:")
    print("  - Registers NewsPost in the frontend adapter so the Admin news section has .list/.create/.update/.delete methods.")
    print("  - Renders sanitized HTML saved by the rich-text editor while keeping Markdown articles working.")
    print("  - Gives Quill's toolbar, paper, text, and placeholder explicit high-contrast colors.")
    print("  - Gives desktop admin navigation and content separate vertical scrolling regions; mobile remains page-scrollable.")
    print("  - Raises frontend and backend single-image/gallery upload limit to 16 MiB.")
    print("  - Strips existing HTML from blog excerpts and handles malformed gallery JSON without crashing.")
    if not args.apply:
        print("\nDry run only: no files were written. Run again with --apply to apply these changes.")
        return 0

    stamp = _dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_root = root.parent / f"{root.name}-admin-fix-backup-{stamp}"
    try:
        backup_root.mkdir(parents=True, exist_ok=False)
        for relative, content in originals.items():
            backup = backup_root / relative
            backup.parent.mkdir(parents=True, exist_ok=True)
            backup.write_text(content, encoding="utf-8")
        # All patches and backups are ready before the first repository file is changed.
        for relative, content in updated.items():
            target = root / relative
            target.write_text(content, encoding="utf-8")
    except Exception as exc:
        print(f"Write failed: {exc}\nBackup location: {backup_root}", file=sys.stderr)
        return 1

    print(f"\nApplied successfully. Original files backed up to:\n  {backup_root}")
    print("Next: run `git diff --check`, then `npm run build`.")
    print("If uploads still fail with HTTP 413 / Request Entity Too Large, set the external reverse proxy's request-body limit to at least 20M too.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
