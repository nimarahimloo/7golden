#!/usr/bin/env python3
"""Repair mixed HTML/Markdown CMS article content and calm the homepage media grid.

Safe by default: --dry-run is the default. --apply backs up all changed files
outside the repository before writing, and never changes database records.
"""
from __future__ import annotations
import argparse
import datetime as dt
import re
import shutil
import sys
from pathlib import Path

MARKER = "HOME_ARTICLE_CONTENT_AND_MOSAIC_FIX_V1"
COMPONENT_PATH = "src/components/content/RichArticleContent.jsx"

RICH_CONTENT_COMPONENT = r'''import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

const ALLOWED_TAGS = new Set([
  'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
  'strong', 'b', 'em', 'i', 'u', 's', 'blockquote', 'div', 'span', 'a',
  'img', 'hr', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'sup', 'sub',
]);
const DROP_TAGS = new Set([
  'script', 'style', 'iframe', 'object', 'embed', 'svg', 'math', 'form', 'input',
  'button', 'textarea', 'select', 'option', 'meta', 'link', 'video', 'audio',
]);
const HTML_TAG = /<(?:!doctype|\/?(?:p|h[1-6]|ul|ol|li|strong|b|em|i|u|s|blockquote|div|span|br|a|img|hr|pre|code|table|thead|tbody|tr|th|td|sup|sub)\b[^>]*>)/i;
const ENCODED_HTML_TAG = /&lt;\/?(?:p|h[1-6]|ul|ol|li|strong|b|em|i|u|s|blockquote|div|span|br|a|img|hr|pre|code|table|thead|tbody|tr|th|td|sup|sub)\b/i;

function unescapeMarkup(value) {
  let source = String(value || '').trim();
  // Some CMS records contain escaped tags (\<p>, &lt;p&gt;, or &amp;lt;p&amp;gt;) rather than real markup.
  source = source.replace(/\\(?=<\/?(?:p|h[1-6]|ul|ol|li|div|span|strong|b|em|a|br)\b)/gi, '');
  source = source.replace(/&(?:amp;)?nbsp;/gi, ' ');
  for (let pass = 0; pass < 2; pass += 1) {
    source = source.replace(/&amp;lt;/gi, '&lt;').replace(/&amp;gt;/gi, '&gt;');
    if (ENCODED_HTML_TAG.test(source)) {
      source = source.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
    }
  }
  return source.replace(/\\([#*`-])/g, '$1');
}

function normalizeSpaces(value) {
  return String(value || '')
    .replace(/&(?:amp;)?nbsp;/gi, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function textContentWithBreaks(node) {
  if (node.nodeType === 3) return node.nodeValue || '';
  if (node.nodeType !== 1 && node.nodeType !== 9 && node.nodeType !== 11) return '';
  const tag = node.nodeType === 1 ? node.tagName.toLowerCase() : '';
  if (tag === 'br' || tag === 'hr') return '\n';
  const block = /^(p|div|section|article|h[1-6]|ul|ol|li|blockquote|pre|tr)$/.test(tag);
  const contents = [...node.childNodes].map(textContentWithBreaks).join('');
  return block ? `\n${contents}\n` : contents;
}

function splitHeadingAndBody(value) {
  const chunk = normalizeSpaces(value);
  if (!chunk) return { heading: '', body: '' };
  const conclusion = chunk.match(/^نتیجه(?:‌|-)گیری\b/u);
  if (conclusion) {
    return { heading: chunk.slice(0, conclusion[0].length), body: chunk.slice(conclusion[0].length).trim() };
  }
  const cues = [
    /\s+(?=در شرایط\b)/u,
    /\s+(?=هفت طلایی با\b)/u,
    /\s+(?=علاوه بر\b)/u,
    /\s+(?=نتیجه این\b)/u,
    /\s+(?=در حالی که\b)/u,
    /\s+(?=شرکت‌هایی که\b)/u,
    /\s+(?=بازار سنتی\b)/u,
    /\s+(?=این بهینه‌سازی‌ها\b)/u,
    /\s+(?=در زنجیره\b)/u,
    /\s+(?=سه عامل\b)/u,
  ];
  let boundary = -1;
  for (const cue of cues) {
    const match = cue.exec(chunk);
    if (match && match.index > 0 && (boundary < 0 || match.index < boundary)) boundary = match.index;
  }
  if (boundary > 0) return { heading: chunk.slice(0, boundary).trim(), body: chunk.slice(boundary).trim() };

  const punctuation = /[،,؛.!؟]/u.exec(chunk);
  if (punctuation && punctuation.index >= 14 && punctuation.index <= 110) {
    return { heading: chunk.slice(0, punctuation.index).trim(), body: chunk.slice(punctuation.index + 1).trim() };
  }

  const words = chunk.split(/\s+/u);
  if (words.length > 9) return { heading: words.slice(0, 5).join(' '), body: words.slice(5).join(' ') };
  return { heading: chunk, body: '' };
}

function titleComparisonKey(value) {
  return normalizeSpaces(value).replace(/[\\#*`]+/g, '').toLocaleLowerCase();
}

function splitCollapsedMarkdown(value, title = '') {
  let text = normalizeSpaces(value).replace(/\\([#*`-])/g, '$1');
  // Recover headings that were collapsed into one Quill <p> by the original paste.
  const marker = /(^|\s)(#{1,6})\s+/gu;
  const matches = [...text.matchAll(marker)];
  if (matches.length) {
    const positions = matches.map((match) => ({
      markerStart: match.index + (match[1] ? match[1].length : 0),
      contentStart: match.index + match[0].length,
      hashes: match[2],
    }));
    const prefix = text.slice(0, positions[0].markerStart).trim();
    const blocks = [];
    if (prefix && (!title || titleComparisonKey(prefix) !== titleComparisonKey(title))) blocks.push(prefix);
    positions.forEach((entry, index) => {
      const end = index + 1 < positions.length ? positions[index + 1].markerStart : text.length;
      const chunk = text.slice(entry.contentStart, end).trim();
      const { heading, body } = splitHeadingAndBody(chunk);
      if (heading) blocks.push(`${entry.hashes} ${heading}`);
      if (body) blocks.push(body);
    });
    text = blocks.join('\n\n');
  }
  // Recover Markdown bullets inserted inside a single paragraph by the editor.
  text = text.replace(/\s+(-\s+\*\*[^*\n]+\*\*:?)/gu, '\n\n$1');
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

function isMixedMarkdown(text) {
  return /(?:^|\s)#{1,6}\s+/u.test(text)
    || /\*\*[^*\n]+\*\*/u.test(text)
    || /(?:^|\s)-\s+\*\*/u.test(text);
}

function isSafeUrl(value, allowAnchor = false) {
  const raw = String(value || '').trim();
  if (!raw || /[\u0000-\u001f]/u.test(raw)) return false;
  if (allowAnchor && raw.startsWith('#')) return true;
  if (raw.startsWith('/') && !raw.startsWith('//')) return true;
  try {
    const url = new URL(raw, window.location.origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function sanitizeHtml(html) {
  const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
  const clean = (parent) => {
    [...parent.childNodes].forEach((node) => {
      if (node.nodeType === 8) { node.remove(); return; }
      if (node.nodeType !== 1) return;
      const tag = node.tagName.toLowerCase();
      if (DROP_TAGS.has(tag)) { node.remove(); return; }
      clean(node);
      if (!ALLOWED_TAGS.has(tag)) { node.replaceWith(...[...node.childNodes]); return; }
      [...node.attributes].forEach((attribute) => {
        if (!['href', 'src', 'alt', 'title', 'colspan', 'rowspan'].includes(attribute.name.toLowerCase())) {
          node.removeAttribute(attribute.name);
        }
      });
      if (tag === 'a') {
        const href = node.getAttribute('href');
        if (href && !isSafeUrl(href, true)) node.removeAttribute('href');
        node.removeAttribute('target');
        node.removeAttribute('rel');
      }
      if (tag === 'img') {
        const src = node.getAttribute('src');
        if (src && !isSafeUrl(src)) node.removeAttribute('src');
        node.setAttribute('loading', 'lazy');
        node.setAttribute('decoding', 'async');
        if (!node.getAttribute('alt')) node.setAttribute('alt', '');
      }
    });
  };
  clean(doc.body);
  return doc.body.innerHTML;
}

function prepareContent(input, title = '') {
  const source = unescapeMarkup(input);
  if (typeof DOMParser !== 'undefined' && HTML_TAG.test(source)) {
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const rawText = normalizeSpaces(textContentWithBreaks(doc.body) || '');
    if (isMixedMarkdown(rawText)) {
      return { kind: 'markdown', value: splitCollapsedMarkdown(rawText, title) };
    }
    return { kind: 'html', value: sanitizeHtml(source) };
  }
  const decoded = normalizeSpaces(source)
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
  return { kind: 'markdown', value: splitCollapsedMarkdown(decoded, title) };
}

const markdownComponents = {
  h1: ({ node, ...props }) => <h2 {...props} />,
  h2: ({ node, ...props }) => <h2 {...props} />,
  h3: ({ node, ...props }) => <h3 {...props} />,
  p: ({ node, ...props }) => <p {...props} />,
  a: ({ node, ...props }) => <a {...props} />,
  img: ({ node, ...props }) => <img loading="lazy" decoding="async" {...props} />,
};

export default function RichArticleContent({ content, title = '', className = '' }) {
  const prepared = useMemo(() => prepareContent(content, title), [content, title]);
  const classNames = `rich-article-content ${className}`.trim();
  if (prepared.kind === 'html') {
    return <div className={classNames} dangerouslySetInnerHTML={{ __html: prepared.value }} />;
  }
  return <div className={classNames}><ReactMarkdown components={markdownComponents}>{prepared.value}</ReactMarkdown></div>;
}
'''

CSS = r'''

/* HOME_ARTICLE_CONTENT_AND_MOSAIC_FIX_V1 */
/* Uniform article styling for sanitized HTML, escaped HTML, and Markdown content. */
.rich-article-content {
  min-width: 0;
  color: var(--fg-muted);
  font-size: 1rem;
  line-height: 2;
  overflow-wrap: anywhere;
  word-break: normal;
}
.rich-article-content > * + * { margin-top: 1rem; }
.blog-article-page .prose-content .rich-article-content h1,
.blog-article-page .prose-content .rich-article-content h2,
.blog-article-page .prose-content .rich-article-content h3,
.blog-article-page .prose-content .rich-article-content h4,
.blog-article-page .prose-content .rich-article-content h5,
.blog-article-page .prose-content .rich-article-content h6,
.news-article-page article .rich-article-content h1,
.news-article-page article .rich-article-content h2,
.news-article-page article .rich-article-content h3,
.news-article-page article .rich-article-content h4,
.news-article-page article .rich-article-content h5,
.news-article-page article .rich-article-content h6 {
  display: block;
  width: 100%; max-width: 100%; min-width: 0;
  margin: 2rem 0 .8rem;
  overflow: visible !important;
  color: var(--fg) !important;
  font-family: 'Peyda', sans-serif;
  font-weight: 850;
  line-height: 1.7;
  white-space: normal !important;
  overflow-wrap: anywhere;
  text-overflow: clip !important;
}
.rich-article-content h1 { font-size: clamp(1.45rem, 2.5vw, 2rem); }
.rich-article-content h2 { font-size: clamp(1.25rem, 2.1vw, 1.65rem); }
.rich-article-content h3, .rich-article-content h4 { font-size: 1.1rem; }
.rich-article-content p { margin: 0 0 1.1rem; white-space: normal !important; }
.rich-article-content ul, .rich-article-content ol { margin: .65rem 0 1.35rem; padding-inline-start: 1.6rem; }
.rich-article-content ul { list-style: disc; }
.rich-article-content ol { list-style: decimal; }
.rich-article-content li { display: list-item; margin: .4rem 0; padding-inline-start: .2rem; }
.rich-article-content strong, .rich-article-content b { color: var(--fg); font-weight: 800; }
.rich-article-content blockquote { margin: 1.5rem 0; padding: .8rem 1rem; border-inline-start: 3px solid var(--accent); background: rgba(214,178,94,.07); border-radius: .6rem; }
.rich-article-content a { color: var(--accent-hover); text-decoration: underline; text-underline-offset: .2em; }
.rich-article-content img { display: block; width: auto; max-width: 100%; height: auto; margin: 1.4rem auto; border-radius: .9rem; }
.rich-article-content pre { max-width: 100%; overflow-x: auto; padding: 1rem; border-radius: .75rem; background: rgba(255,255,255,.06); direction: ltr; text-align: left; }
.rich-article-content hr { margin: 1.5rem 0; border-color: var(--hairline); }

/* The home media wall intentionally shows four hand-picked items, not the archive. */
.home-media-mosaic--curated {
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-rows: clamp(2.7rem, 4vw, 4.15rem);
  grid-auto-flow: dense;
  gap: clamp(.65rem, 1.2vw, 1rem);
}
.home-media-mosaic--curated .home-media-tile:nth-child(1) { grid-column: span 6; grid-row: span 6; }
.home-media-mosaic--curated .home-media-tile:nth-child(2) { grid-column: span 3; grid-row: span 3; }
.home-media-mosaic--curated .home-media-tile:nth-child(3) { grid-column: span 3; grid-row: span 3; }
.home-media-mosaic--curated .home-media-tile:nth-child(4) { grid-column: span 6; grid-row: span 3; }
.home-media-mosaic--curated .home-media-meta strong { white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
@media (max-width: 1023px) and (min-width: 768px) {
  .home-media-mosaic--curated { grid-template-columns: repeat(6, minmax(0, 1fr)); grid-auto-rows: 3.5rem; }
  .home-media-mosaic--curated .home-media-tile:nth-child(1) { grid-column: span 4; grid-row: span 5; }
  .home-media-mosaic--curated .home-media-tile:nth-child(2) { grid-column: span 2; grid-row: span 2; }
  .home-media-mosaic--curated .home-media-tile:nth-child(3) { grid-column: span 2; grid-row: span 3; }
  .home-media-mosaic--curated .home-media-tile:nth-child(4) { grid-column: span 4; grid-row: span 3; }
}
@media (max-width: 767px) {
  .home-media-mosaic--curated { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: clamp(5.3rem, 24vw, 7rem); gap: .65rem; }
  .home-media-mosaic--curated .home-media-tile:nth-child(1) { grid-column: span 2; grid-row: span 3; }
  .home-media-mosaic--curated .home-media-tile:nth-child(2) { grid-column: span 1; grid-row: span 2; }
  .home-media-mosaic--curated .home-media-tile:nth-child(3) { grid-column: span 1; grid-row: span 2; }
  .home-media-mosaic--curated .home-media-tile:nth-child(4) { grid-column: span 2; grid-row: span 2; }
}
'''


def replace_once(text: str, old: str, new: str, label: str, path: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected one match for {label}; found {count}.")
    return text.replace(old, new, 1)


def patch_api_content(text: str) -> str:
    helper = r'''function plainText(value) {
  let source = String(value || '');
  source = source.replace(/\\(?=<\/?(?:p|div|h[1-6]|ul|ol|li|strong|br)\b)/gi, '');
  for (let pass = 0; pass < 2; pass += 1) {
    source = source.replace(/&amp;lt;/gi, '&lt;').replace(/&amp;gt;/gi, '&gt;');
    if (/&lt;\/?(?:p|div|h[1-6]|ul|ol|li|strong|br)\b/i.test(source)) {
      source = source.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
    }
  }
  return source
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<\/(?:p|h[1-6]|li|div|section)>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:amp;)?nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\\([#*`-])/g, '$1')
    .replace(/(^|\s)#{1,6}\s+/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|\s)-\s+(?=\S)/g, '$1')
    .replace(/[\u00a0\s]+/g, ' ')
    .trim();
}

'''
    if "function plainText(value)" in text:
        text, count = re.subn(r"function plainText\(value\) \{.*?\n\}\n\n(?=function normalizeBlogPost\()", lambda _match: helper, text, count=1, flags=re.S)
        if count != 1:
            raise RuntimeError("src/lib/api/content.js: found plainText but could not replace its body safely.")
    else:
        text = replace_once(text, "function normalizeBlogPost(r) {", helper + "function normalizeBlogPost(r) {", "insert plain-text normalizer", "src/lib/api/content.js")
    updated, count = re.subn(
        r"^(\s*)excerpt: r\.excerpt_fa \|\| '',$",
        lambda match: f"{match.group(1)}excerpt: plainText(r.excerpt_fa || ''),",
        text,
        count=1,
        flags=re.M,
    )
    if count == 1:
        text = updated
    elif "excerpt: plainText(r.excerpt_fa || '')" not in text:
        raise RuntimeError("src/lib/api/content.js: couldn't identify the NewsPost excerpt field.")
    return text


def patch_blog_post(text: str) -> str:
    import_line = "import RichArticleContent from '@/components/content/RichArticleContent';"
    if import_line not in text:
        if "import ReactMarkdown from 'react-markdown';" in text:
            text = replace_once(text, "import ReactMarkdown from 'react-markdown';", "import ReactMarkdown from 'react-markdown';\n" + import_line, "import shared rich article renderer", "src/pages/BlogPost.jsx")
        else:
            first_import = re.search(r"^(?:import .*?;\n)+", text, re.M)
            if not first_import:
                raise RuntimeError("src/pages/BlogPost.jsx: unable to locate imports.")
            text = text[:first_import.end()] + import_line + "\n" + text[first_import.end():]

    if "const HTML_CONTENT_TAG =" in text:
        pattern = re.compile(r"const HTML_CONTENT_TAG = .*?(?=export default function BlogPost\(\) \{)", re.S)
        replacement = r'''const HTML_CONTENT_TAG = /<(?:!doctype|\/?(?:p|h[1-6]|ul|ol|li|strong|b|em|i|u|blockquote|div|span|br|a|img|hr|pre|code)\b[^>]*>)/i;
function isHtmlContent(value) {
  const source = String(value || '');
  return HTML_CONTENT_TAG.test(source)
    || /&(?:amp;)?lt;\/?(?:p|h[1-6]|ul|ol|li|strong|div|span|br)\b/i.test(source)
    || /\\<\/?(?:p|h[1-6]|ul|ol|li|strong|div|span|br)\b/i.test(source);
}
function SafeBlogHtml({ html, title }) {
  return <RichArticleContent content={html} title={title} />;
}

'''
        text, count = pattern.subn(lambda _match: replacement, text, count=1)
        if count != 1:
            raise RuntimeError("src/pages/BlogPost.jsx: could not replace the existing content helper block safely.")
    else:
        # If running against a pre-HTML-fix checkout, insert a small detector before the page component.
        if "function isHtmlContent(value)" not in text:
            helper = r'''function isHtmlContent(value) {
  const source = String(value || '');
  return /<(?:\/?(?:p|h[1-6]|ul|ol|li|strong|div|span|br)\b[^>]*>)|&(?:amp;)?lt;\/?(?:p|h[1-6]|ul|ol|li|strong|div|span|br)\b|\\<\/?(?:p|h[1-6]|ul|ol|li|strong|div|span|br)\b/i.test(source);
}
function SafeBlogHtml({ html, title }) { return <RichArticleContent content={html} title={title} />; }

'''
            text = replace_once(text, "export default function BlogPost() {", helper + "export default function BlogPost() {", "add escaped HTML detector", "src/pages/BlogPost.jsx")
        if "<RichArticleContent content={post?.content || ''} />" not in text:
            text, count = re.subn(r"<ReactMarkdown\s+components=\{\{.*?</ReactMarkdown>", "<RichArticleContent content={post?.content || ''} />", text, count=1, flags=re.S)
            if count != 1:
                raise RuntimeError("src/pages/BlogPost.jsx: could not find the Markdown content block safely.")
            text = text.replace("import ReactMarkdown from 'react-markdown';\n", '')
    old_call = "<SafeBlogHtml html={post?.content || ''} />"
    new_call = "<SafeBlogHtml html={post?.content || ''} title={title} />"
    if old_call in text:
        text = replace_once(text, old_call, new_call, "pass article title to mixed-content normalizer", "src/pages/BlogPost.jsx")
    elif new_call not in text:
        raise RuntimeError("src/pages/BlogPost.jsx: couldn't locate SafeBlogHtml call.")
    text = text.replace("<RichArticleContent content={post?.content || ''} />", "<RichArticleContent content={post?.content || ''} title={title} />")
    return text


def patch_news_article(text: str) -> str:
    import_line = "import RichArticleContent from '@/components/content/RichArticleContent';"
    if import_line not in text:
        text = replace_once(text, "import NewsCard from '@/components/news/NewsCard';", "import NewsCard from '@/components/news/NewsCard';\n" + import_line, "import shared rich article renderer", "src/pages/NewsArticle.jsx")

    # CMS-authored content should remain rich, rather than being flattened into plain paragraphs.
    old = """    if (cmsItem) {
      const paragraphs = contentToParagraphs(cmsItem.content);
      if (paragraphs.length) setSections([{ p: paragraphs }]);
      else setSections(staticItem?.body?.length ? [{ p: staticItem.body }] : []);
      return () => { active = false; };
    }"""
    new = """    if (cmsItem) {
      if (String(cmsItem.content || '').trim()) setSections([{ richContent: cmsItem.content }]);
      else setSections(staticItem?.body?.length ? [{ p: staticItem.body }] : []);
      return () => { active = false; };
    }"""
    if old in text:
        text = replace_once(text, old, new, "preserve CMS news rich text", "src/pages/NewsArticle.jsx")
    elif "setSections([{ richContent: cmsItem.content }])" not in text:
        raise RuntimeError("src/pages/NewsArticle.jsx: CMS content loader is in an unknown form; no files have been written.")

    # Remove the old tag-stripper once the shared renderer owns CMS article content.
    if "function contentToParagraphs(value)" in text:
        text, count = re.subn(r"function contentToParagraphs\(value\) \{.*?\n\}\n\n(?=const wordsOf =)", "", text, count=1, flags=re.S)
        if count != 1:
            raise RuntimeError("src/pages/NewsArticle.jsx: could not remove old content flattener safely.")

    # Include rich-text content in reading-time calculation without counting HTML tags/entities.
    old_words = re.search(r"const wordsOf = \(sections\) =>.*?\n\s*\);", text, re.S)
    if old_words:
        new_words = r'''const wordsOf = (sections) => sections.reduce((sum, section) => {
  const source = [section.h, ...(section.p || []), ...(section.ul || []), section.richContent || ''].filter(Boolean).join(' ');
  const plain = source
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:amp;)?nbsp;/gi, ' ')
    .replace(/\\([#*`-])/g, '$1')
    .replace(/[#*`]/g, ' ');
  return sum + plain.split(/\s+/).filter(Boolean).length;
}, 0);'''
        text = text[:old_words.start()] + new_words + text[old_words.end():]

    # Render rich CMS content but keep the legacy article sections/photos/videos exactly as before.
    old_open = """        {(sections || []).map((s, i) => (
          <section key={s.h} className={i ? 'mt-10 md:mt-12' : ''}>
            {s.h && ("""
    new_open = """        {(sections || []).map((s, i) => (
          <section key={s.h || `section-${i}`} className={i ? 'mt-10 md:mt-12' : ''}>
            {s.richContent ? <RichArticleContent content={s.richContent} title={item.title} /> : <>
            {s.h && ("""
    if old_open in text:
        text = replace_once(text, old_open, new_open, "render rich news body", "src/pages/NewsArticle.jsx")
        close_anchor = """            {s.media?.photos && <PhotoGroup srcs={s.media.photos.map((k) => photos[k]).filter(Boolean)} onOpen={openPhoto} />}"""
        text = replace_once(text, close_anchor, "            </>}\n" + close_anchor, "close rich news body branch", "src/pages/NewsArticle.jsx")
    elif "<RichArticleContent content={s.richContent} title={item.title} />" not in text:
        raise RuntimeError("src/pages/NewsArticle.jsx: could not find the article section renderer safely.")
    return text


def patch_home_media(text: str) -> str:
    if MARKER in text:
        return text
    # Replace either the original full archive or the prior five-item preview with a curated four-item set.
    import_anchor = "import { HOME_MEDIA_ITEMS } from '@/lib/home-media';"
    if 'const HOME_FEATURED_MEDIA_IDS = [' not in text:
        text = replace_once(text, import_anchor, import_anchor + "\n\nconst HOME_FEATURED_MEDIA_IDS = [\n  'video-facility-1',\n  'photo-AQ8A1640AQ8A1640',\n  'video-processing-1',\n  'photo-AQ8A1665AQ8A1665',\n];", "add curated homepage media IDs", "src/components/home/HomeVideoShowcase.jsx")
    original_active = "  const activeItem = media.find((item) => item.id === activeId) || null;"
    current_active = "  const activeItem = visibleMedia.find((item) => item.id === activeId) || null;"
    selected_block = r'''  // HOME_ARTICLE_CONTENT_AND_MOSAIC_FIX_V1: four deliberate editorial picks, not the full archive.
  const visibleMedia = useMemo(() => {
    const byId = new Map(media.map((item) => [item.id, item]));
    const selected = HOME_FEATURED_MEDIA_IDS.map((id) => byId.get(id)).filter(Boolean);
    const seen = new Set(selected.map((item) => item.id));
    for (const item of media) {
      if (selected.length >= 4) break;
      if (!seen.has(item.id)) { selected.push(item); seen.add(item.id); }
    }
    return selected.slice(0, 4).map((item, index) => ({
      ...item,
      shape: index === 0 ? 'feature' : (index === 1 ? 'wide' : (index === 2 ? 'standard' : 'wide')),
    }));
  }, [media]);
  const activeItem = visibleMedia.find((item) => item.id === activeId) || null;'''

    # Remove the earlier simple slice (if the visual-refinement patch was already applied).
    text = re.sub(r"(?m)^\s*const visibleMedia = media\.slice\(0,\s*5\);\s*\n", "", text, count=1)
    if current_active in text:
        text = replace_once(text, current_active, selected_block, "upgrade earlier five-item preview to curated media set", "src/components/home/HomeVideoShowcase.jsx")
    elif original_active in text:
        text = replace_once(text, original_active, selected_block, "limit media wall to four curated items", "src/components/home/HomeVideoShowcase.jsx")
    elif "const HOME_FEATURED_MEDIA_IDS = [" not in text:
        raise RuntimeError("src/components/home/HomeVideoShowcase.jsx: could not identify active media declaration safely.")

    mosaic_anchor = '<div className="home-media-mosaic">'
    if mosaic_anchor in text:
        text = replace_once(text, mosaic_anchor, '<div className="home-media-mosaic home-media-mosaic--curated">', "apply the curated gallery layout class", "src/components/home/HomeVideoShowcase.jsx")
    elif '<div className="home-media-mosaic home-media-mosaic--curated">' not in text:
        raise RuntimeError("src/components/home/HomeVideoShowcase.jsx: could not find the media grid container.")

    # Keyboard navigation and lightbox must stay within the visible selection.
    mosaic_pos = text.find('<div className="home-media-mosaic home-media-mosaic--curated">')
    active_pos = text.find('const activeItem = visibleMedia.find')
    if active_pos < 0 or mosaic_pos < 0 or mosaic_pos <= active_pos:
        raise RuntimeError("src/components/home/HomeVideoShowcase.jsx: media navigation/grid boundary was not found.")
    before, region = text[:active_pos], text[active_pos:mosaic_pos]
    tail = text[mosaic_pos:]
    region = region.replace('media.findIndex(', 'visibleMedia.findIndex(')
    region = region.replace('media.length', 'visibleMedia.length')
    # Every indexed access in this region is keyboard/lightbox navigation, not the full archive.
    region = region.replace('media[', 'visibleMedia[')
    region = re.sub(r'const next = media\[', 'const next = visibleMedia[', region)
    region = region.replace('[activeItem, media]', '[activeItem, visibleMedia]')
    map_pattern = re.compile(r'(<div className="home-media-mosaic home-media-mosaic--curated">\s*)\{(?:media|visibleMedia)\.map\(')
    tail, count = map_pattern.subn(r'\1{visibleMedia.map(', tail, count=1)
    if count != 1:
        raise RuntimeError("src/components/home/HomeVideoShowcase.jsx: couldn't scope the tile rendering to the four selected items.")
    text = before + region + tail
    text = text.replace(
        'روایتی موزاییکی از فضای کارخانه، فرآوری و تصاویر ثبت‌شدهٔ محصولات هفت طلایی؛ ویدیوها بی‌صدا و پیوسته مانند تصویر متحرک نمایش داده می‌شوند.',
        'گزیده‌ای خلوت از تصاویر منتخب کارخانه، فرآوری و محصولات هفت طلایی؛ ویدیوهای منتخب بی‌صدا و پیوسته نمایش داده می‌شوند.'
    )
    return text


def patch_story_css(text: str) -> str:
    if MARKER in text:
        return text
    return text.rstrip() + "\n" + CSS.strip() + "\n"


def read_required(root: Path, rel: str) -> str:
    path = root / rel
    if not path.is_file():
        raise FileNotFoundError(f"Required file not found: {path}")
    return path.read_text(encoding='utf-8')


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', nargs='?', default='.', help='Path to the local 7Golden repository')
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--dry-run', action='store_true', help='Preview the changes only (default)')
    mode.add_argument('--apply', action='store_true', help='Apply changes after validating all targets')
    args = parser.parse_args()
    root = Path(args.root).expanduser().resolve()
    if not (root / 'src/pages/BlogPost.jsx').is_file() or not (root / 'src/components/home/HomeVideoShowcase.jsx').is_file():
        print(f'Error: {root} does not look like the expected 7Golden frontend repository.', file=sys.stderr)
        return 2

    tasks = [
      ('src/lib/api/content.js', patch_api_content),
      ('src/pages/BlogPost.jsx', patch_blog_post),
      ('src/pages/NewsArticle.jsx', patch_news_article),
      ('src/components/home/HomeVideoShowcase.jsx', patch_home_media),
      ('src/styles/story.css', patch_story_css),
    ]
    originals: dict[str, str] = {}
    updated: dict[str, str] = {}
    try:
        for rel, transform in tasks:
            originals[rel] = read_required(root, rel)
            updated[rel] = transform(originals[rel])
        component_path = root / COMPONENT_PATH
        if component_path.exists():
            existing = component_path.read_text(encoding='utf-8')
            if existing != RICH_CONTENT_COMPONENT:
                raise RuntimeError(f'{COMPONENT_PATH} already exists with different content; inspect it before replacing.')
            originals[COMPONENT_PATH] = existing
            updated[COMPONENT_PATH] = existing
        else:
            updated[COMPONENT_PATH] = RICH_CONTENT_COMPONENT
    except Exception as exc:
        print(f'Preflight failed; no project files were written.\n{exc}', file=sys.stderr)
        return 1

    changed = {rel: value for rel, value in updated.items() if originals.get(rel) != value}
    print(f'Repository: {root}')
    print('Changes prepared:')
    for rel in changed:
        print(f'  - {rel}' + (' [new]' if not (root / rel).exists() else ''))
    print('\nThis patch:')
    print('  - Decodes escaped/double-escaped HTML entities and converts collapsed Markdown headings, bold text, and bullets in CMS article content.')
    print('  - Uses one safe rich-content renderer for blog and CMS news articles.')
    print('  - Normalizes HTML/Markdown out of article-card excerpts.')
    print('  - Restricts the homepage “زیبایی در جزئیات است” mosaic to four curated media items and arranges them responsively.')
    print('  - Does not modify database records, seed content, or delete media assets.')
    if not args.apply:
        print('\nDry run only: no files were written. Rerun with --apply to apply this patch.')
        return 0

    stamp = dt.datetime.now().strftime('%Y%m%d-%H%M%S')
    backup = root.parent / f'{root.name}-rich-content-home-media-backup-{stamp}'
    try:
        backup.mkdir(parents=True, exist_ok=False)
        for rel, content in originals.items():
            dst = backup / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_text(content, encoding='utf-8')
        # The new component doesn't have an original file; write it only after all backups succeed.
        for rel, content in changed.items():
            dst = root / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_text(content, encoding='utf-8')
    except Exception as exc:
        print(f'Write failed: {exc}\nBackup directory: {backup}', file=sys.stderr)
        return 1

    print(f'\nApplied successfully. Original files backed up to:\n  {backup}')
    print('Next run: git diff --check && npm run build')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
