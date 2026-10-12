// Central SEO configuration + structured-data helpers.
// Default values live here so every page gets a baseline; pages override
// via the <Seo /> component props. Site-wide editable values can later be
// loaded from the SiteSettings entity.

export const SITE_SEO = {
  siteNameFA: 'هفت‌طلایی',
  siteNameEN: '7Golden',
  defaultTitleFA: 'هفت طلایی | فرآوری مغز فندق، پسته و بادام',
  defaultTitleEN: '7Golden | Hazelnut, Pistachio & Almond Processing',
  defaultDescriptionFA: 'هفت طلایی در قزوین از سال ۱۳۷۷ در زمینه فرآوری خشکبار فعالیت می‌کند. محصولات مجموعه شامل مغز فندق و فرآورده‌های آن، مغز و خلال پسته و شکل‌های مختلف بادام برای صنایع غذایی است.',
  defaultDescriptionEN: 'Based in Qazvin, 7Golden has processed hazelnut, pistachio and almond products since 1998 for use in chocolate, confectionery, ice cream and other food products.',
  ogImage: 'https://7golden.co/banner/Hero-main.webp',
  baseUrl: 'https://7golden.co',
  baseUrlIr: 'https://7golden.ir',
  keywordsFA: 'هفت طلایی, 7golden, فرآوری خشکبار قزوین, مغز فندق, خمیر فندق, گرانول فندق, مغز پسته, خلال پسته, مغز بادام, خلال بادام, پرک بادام, صنایع غذایی',
  keywordsEN: '7Golden, Qazvin nut processing, hazelnut kernels, pistachio kernels, pistachio slices, almond flakes, hazelnut paste, hazelnut granules, food industry ingredients',
};

export const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '7Golden',
  alternateName: 'هفت‌طلایی',
  url: 'https://7golden.co',
  logo: 'https://7golden.co/logo.webp',
  description: 'هفت طلایی در قزوین از سال ۱۳۷۷ در زمینه فرآوری خشکبار فعالیت می‌کند؛ محصولات اصلی مجموعه شامل فندق، پسته و بادام در شکل‌های مختلف برای صنایع غذایی است.',
  foundingDate: '2017',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+98-912-182-3438',
    contactType: 'sales',
    areaServed: ['IR'],
    availableLanguage: ['fa'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'انتهای سعدی جنوبی، نرسیده به چهارراه بازار، پلاک ۲۱۰',
    addressLocality: 'قزوین',
    postalCode: '3419617948',
    addressCountry: 'IR',
  },
};

export const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '7Golden',
  alternateName: 'هفت‌طلایی',
  url: 'https://7golden.co',
  inLanguage: 'fa-IR',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://7golden.co/shop?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export function productJsonLd(product) {
  if (!product) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameFA,
    description: product.descFA,
    image: `https://7golden.co${product.image}`,
    sku: product.slug,
    brand: { '@type': 'Brand', name: '7Golden' },
    category: product.category,
    origin: product.originFA || 'قزوین، ایران',
    manufacturer: {
      '@type': 'Organization',
      name: '7Golden',
      url: 'https://7golden.co',
    },
  };
}

export function articleJsonLd(post) {
  if (!post) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titleFA,
    description: post.excerptFA,
    image: `https://7golden.co${post.image}`,
    datePublished: post.dateEN,
    inLanguage: 'fa-IR',
    author: { '@type': 'Organization', name: '7Golden', url: 'https://7golden.co' },
    publisher: {
      '@type': 'Organization',
      name: '7Golden',
      logo: { '@type': 'ImageObject', url: 'https://7golden.co/logo.webp' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://7golden.co/blog/${post.slug}`,
    },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: (items || []).map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Human labels for the crawlable static routes. Dynamic routes (product /
// blog slugs) return null so no misleading breadcrumb is emitted for them.
const BREADCRUMB_LABELS = {
  shop: 'محصولات',
  about: 'درباره ما',
  news: 'اخبار و اطلاعیه‌ها',
  blog: 'مجله',
  contact: 'تماس با ما',
};

// Builds a BreadcrumbList for a pathname so Google can render the trail in
// the SERP. Returns null for the home page or any route without a known label.
export function breadcrumbForPath(pathname) {
  const clean = String(pathname || '/').split('?')[0].split('#')[0];
  const segs = clean.split('/').filter(Boolean);
  if (segs.length === 0) return null;

  const items = [{ name: 'خانه', url: `${SITE_SEO.baseUrl}/` }];
  let acc = '';
  for (const seg of segs) {
    acc += `/${seg}`;
    const label = BREADCRUMB_LABELS[seg];
    if (!label) return null;
    items.push({ name: label, url: `${SITE_SEO.baseUrl}${acc}` });
  }
  return breadcrumbJsonLd(items);
} 