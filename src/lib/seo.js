// Central SEO configuration + structured-data helpers.
// Default values live here so every page gets a baseline; pages override
// via the <Seo /> component props. Site-wide editable values can later be
// loaded from the SiteSettings entity.

export const SITE_SEO = {
  siteNameFA: 'هفت‌طلایی',
  siteNameEN: '7Golden',
  defaultTitleFA: 'هفت‌طلایی | تولید و صادرات مغز فندق، خلال پسته و بادام صنعتی',
  defaultTitleEN: '7Golden | Hazelnut, Pistachio & Almond Producer and Exporter',
  defaultDescriptionFA: 'هفت‌طلایی از سال ۱۳۷۷ در قزوین، مغز و خلال فندق، پسته و بادام را مستقیم از باغستان تأمین و برای کارخانه‌های شکلات، قنادی و بستنی فرآوری می‌کند. تأمین عمده، کنترل کیفی آزمایشگاهی و تحویل زمان‌بندی‌شده.',
  defaultDescriptionEN: 'Since 1998, 7Golden in Qazvin has sourced hazelnut kernels, pistachio slices and almond kernels straight from orchards and processed them for chocolate, confectionery and ice-cream factories. Bulk supply, lab-tested quality, scheduled delivery.',
  ogImage: '/banner/Hero-main.webp',
  baseUrl: 'https://7golden.co',
  baseUrlIr: 'https://7golden.ir',
  twitterHandle: '@7golden',
  keywordsFA: 'صادرات فندق, صادرات پسته, صادرات بادام, مغز فندق, خلال پسته, مغز بادام, تأمین عمده خشکبار, خمیر فندق, گرانول فندق, پرک بادام, هفت طلایی, 7golden, بازرگانی خشکبار قزوین',
  keywordsEN: 'hazelnut exporter, pistachio exporter, almond exporter, bulk nuts supplier, hazelnut kernels, pistachio slices, almond flakes, hazelnut paste, hazelnut granules, Iranian nuts, 7golden, B2B nuts, Qazvin nuts',
};

export const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '7Golden',
  alternateName: 'هفت‌طلایی',
  url: 'https://7golden.co',
  logo: 'https://7golden.co/logo.webp',
  description: 'تولیدکننده و صادرکننده مغز و خلال فندق، پسته و بادام صنعتی از سال ۱۳۷۷ در قزوین — تأمین مستقیم از باغستان، کنترل کیفی آزمایشگاهی و تحویل زمان‌بندی‌شده برای صنایع شکلات، قنادی و بستنی.',
  foundingDate: '1998',
  sameAs: [
    'https://7golden.co',
    'https://7golden.ir',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+98-912-182-3438',
    contactType: 'sales',
    areaServed: ['IR', 'AE', 'QA', 'OM', 'IQ', 'AF', 'TR', 'DE', 'NL'],
    availableLanguage: ['fa', 'en'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'خیابان سعدی جنوبی، نرسیده به بازار، پلاک ۲۱۰',
    addressLocality: 'قزوین',
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