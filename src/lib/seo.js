// Central SEO configuration + structured-data helpers.
// Default values live here so every page gets a baseline; pages override
// via the <Seo /> component props. Site-wide editable values can later be
// loaded from the SiteSettings entity.

export const SITE_SEO = {
  siteNameFA: 'هفت‌طلایی',
  siteNameEN: '7Golden',
  defaultTitleFA: 'هفت‌طلایی — تولید، فرآوری و صادرات فندق، پسته و بادام',
  defaultTitleEN: '7Golden — Producer & Exporter of Hazelnut, Pistachio and Almond',
  defaultDescriptionFA: 'بازرگانی هفت‌طلایی — تولیدکننده و صادرکننده مغز فندق، خلال پسته و مغز بادام برای صنایع شکلات، قنادی و بستنی. تأمین عمده و قرارداد بلندمدت.',
  defaultDescriptionEN: 'Producer and exporter of hazelnut kernels, pistachio slices and almond kernels for the chocolate, confectionery and ice-cream industry. Bulk supply and long-term contracts.',
  ogImage: '/banner/Hero-main.jpg',
  baseUrl: 'https://7golden.co',
  baseUrlIr: 'https://7golden.ir',
  twitterHandle: '@7golden',
  keywordsFA: 'بازرگانی, صادرات فندق, صادرات پسته, صادرات بادام, مغز فندق, خلال پسته, مغز بادام, تأمین عمده, هفت طلایی, 7golden',
  keywordsEN: 'hazelnut exporter, pistachio exporter, almond exporter, bulk nuts supplier, hazelnut kernels, pistachio slices, Iranian nuts, 7golden, B2B nuts',
};

export const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '7Golden',
  alternateName: 'هفت‌طلایی',
  url: 'https://7golden.co',
  logo: '/logo.png',
  description: "Iran's leading producer of premium dried fruits and nuts since 1998.",
  foundingDate: '1998',
  sameAs: [
    'https://7golden.co',
    'https://7golden.ir',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+98-912-182-3438',
    contactType: 'customer service',
    areaServed: 'IR',
    availableLanguage: ['fa', 'en'],
  },
};

export function productJsonLd(product) {
  if (!product) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameFA,
    description: product.descFA,
    image: product.image,
    sku: product.slug,
    brand: { '@type': 'Brand', name: '7Golden' },
    category: product.category,
    // Retail price offers removed — 7Golden is B2B only and does not publish prices.
    // offers: {
    //   '@type': 'Offer',
    //   price: product.price,
    //   priceCurrency: 'IRR',
    //   availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    // },
  };
}

export function articleJsonLd(post) {
  if (!post) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titleFA,
    description: post.excerptFA,
    image: post.image,
    datePublished: post.dateEN,
    author: { '@type': 'Organization', name: '7Golden' },
    publisher: {
      '@type': 'Organization',
      name: '7Golden',
      logo: { '@type': 'ImageObject', url: '/logo.png' },
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