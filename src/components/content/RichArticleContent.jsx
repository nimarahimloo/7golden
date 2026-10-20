import React, { useMemo } from 'react';
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
