import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ORGANIZATION_JSONLD, WEBSITE_JSONLD, SITE_SEO, breadcrumbForPath } from '@/lib/seo';

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.setAttribute('type', 'application/ld+json');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

// SPA head manager: sets document title, meta tags, Open Graph, Twitter cards,
// and JSON-LD structured data per page. Mount <Seo /> at the top of any page
// that should have its own SEO. Organization JSON-LD is always present.
export default function Seo({ title, description, image, type = 'website', canonical, jsonLd }) {
  const location = useLocation();

  useEffect(() => {
    if (title) document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', image || SITE_SEO.ogImage);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image || SITE_SEO.ogImage);
    setMeta('name', 'twitter:site', SITE_SEO.twitterHandle);
    setMeta('name', 'keywords', SITE_SEO.keywordsFA);
    setMeta('property', 'og:site_name', SITE_SEO.siteNameEN);
    setMeta('property', 'og:locale', 'fa_IR');
    setMeta('property', 'og:url', canonical || SITE_SEO.baseUrl);

    if (canonical) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    setJsonLd('jsonld-org', ORGANIZATION_JSONLD);
    setJsonLd('jsonld-website', WEBSITE_JSONLD);
    // Merge the page's own structured data with an auto-derived breadcrumb
    // trail so every crawlable route carries a BreadcrumbList.
    const crumbs = breadcrumbForPath(location.pathname);
    const pageData = jsonLd && crumbs ? [jsonLd, crumbs] : (jsonLd || crumbs);
    setJsonLd('jsonld-page', pageData);

    return () => {
      const pageLd = document.getElementById('jsonld-page');
      if (pageLd) pageLd.remove();
    };
  }, [title, description, image, type, canonical, jsonLd, location.pathname]);

  return null;
}