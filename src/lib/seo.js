// Central SEO configuration + structured-data helpers.
// Default values live here so every page gets a baseline; pages override
// via the <Seo /> component props. Site-wide editable values can later be
// loaded from the SiteSettings entity.

export const SITE_SEO = {
  siteNameFA: 'هفت‌طلایی',
  siteNameEN: '7Golden',
  defaultTitleFA: 'هفت‌طلایی — خشکبار برتر ایران | 7Golden Premium Dried Fruits',
  defaultTitleEN: "7Golden — Iran's Finest Dried Fruits & Nuts",
  defaultDescriptionFA: 'فروشگاه اینترنتی خشکبار هفت‌طلایی — مغز فندق، پسته قزوین، بادام و محصولات خشکبار با بالاترین کیفیت. ارسال سراسری ایران.',
  defaultDescriptionEN: 'Premium Iranian dried fruits and nuts — hazelnuts, Qazvin pistachios, almonds. Direct from orchards. Nationwide delivery.',
  ogImage: 'https://7golden.co/wp-content/uploads/2022/09/about-p-3.png',
  baseUrl: 'https://7golden.co',
  baseUrlIr: 'https://7golden.ir',
  twitterHandle: '@7golden',
  keywordsFA: 'خشکبار, فندق, پسته, بادام, خشکبار هفت طلایی, 7golden, آجیل, مغز فندق, پسته قزوین, خرید خشکبار',
  keywordsEN: 'dried fruits, hazelnuts, pistachios, almonds, 7golden, Iranian nuts, Qazvin pistachio, buy dried fruits, premium nuts',
};

export const ORGANIZATION_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '7Golden',
  alternateName: 'هفت‌طلایی',
  url: 'https://7golden.co',
  logo: 'https://7golden.co/wp-content/uploads/2023/08/logo-white.png',
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

export function productJsonLd(product, lang) {
  if (!product) return null;
  const isFA = lang === 'fa';
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isFA ? product.nameFA : product.nameEN,
    description: isFA ? product.descFA : product.descEN,
    image: product.image,
    sku: product.slug,
    brand: { '@type': 'Brand', name: '7Golden' },
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'IRR',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
}

export function articleJsonLd(post, lang) {
  if (!post) return null;
  const isFA = lang === 'fa';
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isFA ? post.titleFA : post.titleEN,
    description: isFA ? post.excerptFA : post.excerptEN,
    image: post.image,
    datePublished: post.dateEN,
    author: { '@type': 'Organization', name: '7Golden' },
    publisher: {
      '@type': 'Organization',
      name: '7Golden',
      logo: { '@type': 'ImageObject', url: 'https://7golden.co/wp-content/uploads/2023/08/logo-white.png' },
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