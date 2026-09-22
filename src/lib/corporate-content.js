// Central content for the corporate / export positioning of 7Golden.
// Edit the numbers and copy here — the home page, products page and about page
// all read from this single file.

// The three flagship products. `category` matches the Category/Product slug in
// the Base44 entities so images and links stay in sync with the CMS.
export const MAIN_PRODUCTS = [
  {
    category: 'pistachio',
    nameFA: 'پسته',
    tagline: 'مغز پسته و خلال پسته قزوین',
    descFA:
      'پسته قزوین با دانه‌بندی یکنواخت و رنگ سبز مطلوب، برای مصرف صنعتی و بسته‌بندی صادراتی فرآوری می‌شود. تمام مراحل از برداشت تا بسته‌بندی تحت کنترل کیفی آزمایشگاهی انجام می‌گیرد.',
    specs: [
      { label: 'گریدها', value: 'مغز پسته سبز، خلال پسته، پسته اکبری' },
      { label: 'بسته‌بندی', value: 'کیسه ۱۰ و ۲۰ کیلوگرمی، کارتن صادراتی' },
      { label: 'ظرفیت تأمین', value: 'تا ۱۲۰ تن در ماه' },
      { label: 'کاربرد صنعتی', value: 'شکلات و قنادی، بستنی، اسنک' },
    ],
  },
  {
    category: 'almond',
    nameFA: 'بادام',
    tagline: 'مغز بادام درختی و خلال بادام',
    descFA:
      'بادام درختی با درصد شکستگی کنترل‌شده و رطوبت استاندارد عرضه می‌شود. خط فرآوری ما امکان تولید خلال بادام با ضخامت مشخص و یکنواخت را برای صنایع قنادی فراهم می‌کند.',
    specs: [
      { label: 'گریدها', value: 'خلال بادام، مغز بادام درختی، بادام مامرا' },
      { label: 'بسته‌بندی', value: 'کیسه ۱۰ کیلوگرمی، فله صنعتی' },
      { label: 'ظرفیت تأمین', value: 'تا ۹۰ تن در ماه' },
      { label: 'کاربرد صنعتی', value: 'صنایع قنادی، روغن‌کشی، اسنک' },
    ],
  },
  {
    category: 'hazelnut',
    nameFA: 'فندق',
    tagline: 'مغز فندق درجه یک و خمیر فندق',
    descFA:
      'مغز فندق با تفکیک دقیق سایز و کنترل آلودگی، برای صنایع شکلات و تولید کرم فندق آماده‌سازی می‌شود. تأمین مستقیم از باغستان‌های قزوین و اشنویه، بدون واسطه.',
    specs: [
      { label: 'گریدها', value: 'مغز فندق درجه یک، فندق خام، خمیر فندق' },
      { label: 'بسته‌بندی', value: 'کیسه ۱۰ و ۲۵ کیلوگرمی، بشکه صنعتی' },
      { label: 'ظرفیت تأمین', value: 'تا ۱۵۰ تن در ماه' },
      { label: 'کاربرد صنعتی', value: 'شکلات، کرم فندق، بستنی' },
    ],
  },
];

// Fallback product data — used when the Base44 backend has no products yet,
// so the home page's product strip and links always render. Each item maps
// to the same shape as normalizeProduct() in lib/api/content.js.
export const FALLBACK_PRODUCTS = [
  {
    id: 'pistachio-kernel',
    slug: 'pistachio-kernel',
    nameFA: 'مغز پسته سبز',
    nameEN: 'Green Pistachio Kernel',
    category: 'pistachio',
    image: '/banner/Hero-Banner-3.jpg',
    featured: true,
    published: true,
  },
  {
    id: 'pistachio-slice',
    slug: 'pistachio-slice',
    nameFA: 'خلال پسته',
    nameEN: 'Pistachio Slice',
    category: 'pistachio',
    image: '/banner/HeroBanner-1.jpg',
    featured: true,
    published: true,
  },
  {
    id: 'hazelnut-kernel',
    slug: 'hazelnut-kernel',
    nameFA: 'مغز فندق درجه یک',
    nameEN: 'Premium Hazelnut Kernel',
    category: 'hazelnut',
    image: '/banner/Hero.jpg',
    featured: true,
    published: true,
  },
  {
    id: 'hazelnut-paste',
    slug: 'hazelnut-paste',
    nameFA: 'خمیر فندق',
    nameEN: 'Hazelnut Paste',
    category: 'hazelnut',
    image: '/banner/Hero-Banner-5.jpg',
    featured: true,
    published: true,
  },
  {
    id: 'almond-kernel',
    slug: 'almond-kernel',
    nameFA: 'مغز بادام درختی',
    nameEN: 'Almond Kernel',
    category: 'almond',
    image: '/banner/Hero-banner-2.jpg',
    featured: true,
    published: true,
  },
  {
    id: 'almond-slice',
    slug: 'almond-slice',
    nameFA: 'خلال بادام',
    nameEN: 'Almond Slice',
    category: 'almond',
    image: '/banner/HeroBanner.jpg',
    featured: true,
    published: true,
  },
  {
    id: 'pistachio-akbari',
    slug: 'pistachio-akbari',
    nameFA: 'پسته اکبری',
    nameEN: 'Akbari Pistachio',
    category: 'pistachio',
    image: '/banner/grok-image-9e104bfc-8f1e-414e-8aa8-2731b8e28c8c.jpg',
    featured: true,
    published: true,
  },
  {
    id: 'hazelnut-raw',
    slug: 'hazelnut-raw',
    nameFA: 'فندق خام',
    nameEN: 'Raw Hazelnut',
    category: 'hazelnut',
    image: '/banner/Hero-Banner-6.jpg',
    featured: true,
    published: true,
  },
];

// Specialty products — the flagship grades the user wants emphasized.
export const SPECIALTY_PRODUCTS = [
  {
    key: 'pistachio-kernel',
    nameFA: 'مغز پسته',
    grade: 'گرید A — سبز مطلوب',
    image: '/banner/Hero-Banner-3.jpg',
    desc: 'مغز پسته قزوین با رنگ سبز مطلوب و دانه‌بندی یکنواخت، فرآوری شده برای صنایع شکلات، قنادی و بستنی.',
    specs: [
      { label: 'رنگ', value: 'سبز مطلوب' },
      { label: 'سایز', value: '۲۶–۳۰ میلی‌متر' },
      { label: 'رطوبت', value: 'حداکثر ۵٪' },
      { label: 'بسته‌بندی', value: 'کیسه ۱۰/۲۰ کیلو' },
    ],
  },
  {
    key: 'pistachio-slice',
    nameFA: 'خلال پسته',
    grade: 'برش یکنواخت صنعتی',
    image: '/banner/HeroBanner-1.jpg',
    desc: 'خلال پسته با ضخامت دقیق و یکنواخت، مخصوص تزئین قنادی و صنایع بستنی و شکلات.',
    specs: [
      { label: 'ضخامت', value: '۰.۸–۱.۲ میلی‌متر' },
      { label: 'رنگ', value: 'سبز روشن' },
      { label: 'کاربرد', value: 'قنادی و بستنی' },
      { label: 'بسته‌بندی', value: 'کیسه ۵/۱۰ کیلو' },
    ],
  },
  {
    key: 'hazelnut-kernel',
    nameFA: 'مغز فندق',
    grade: 'درجه یک — قزوین و اشنویه',
    image: '/banner/Hero.jpg',
    desc: 'مغز فندق با تفکیک دقیق سایز و کنترل آلودگی، آماده‌سازی شده برای صنایع شکلات و تولید کرم فندق.',
    specs: [
      { label: 'سایز', value: '۱۱–۱۳ میلی‌متر' },
      { label: 'رطوبت', value: 'حداکثر ۶٪' },
      { label: 'کاربرد', value: 'شکلات و کرم' },
      { label: 'بسته‌بندی', value: 'کیسه ۱۰/۲۵ کیلو' },
    ],
  },
];

// Export destinations and standards shown in the "Export & Global Markets" section.
export const EXPORT_MARKETS = ['امارات', 'قطر', 'عمان', 'عراق', 'افغانستان', 'ترکیه', 'آلمان', 'هلند'];

export const CERTIFICATES = [
  'ISO 22000 — مدیریت ایمنی مواد غذایی',
  'HACCP — تحلیل خطر و نقاط کنترل بحرانی',
  'گواهی بهداشت صادرات',
  'انطباق با الزامات استاندارد صادراتی',
];

// Production capacity figures shown on the home page and the about page.
export const CAPACITY_STATS = [
  { value: '۳٬۵۰۰', unit: 'تن', label: 'ظرفیت فرآوری سالانه' },
  { value: '۴', unit: 'خط', label: 'خطوط فرآوری و بسته‌بندی' },
  { value: '۲٬۰۰۰', unit: 'تن', label: 'ظرفیت انبار سرد و خشک' },
  { value: '۲۴', unit: 'ساعت', label: 'پاسخگویی به سفارش' },
];

export const CAPACITY_NOTES = [
  'خطوط تفکیک سایز، بوجاری و بسته‌بندی صنعتی با ظرفیت عملیاتی پیوسته',
  'انبار خشک و سرد برای نگهداری طولانی‌مدت و تحویل زمان‌بندی‌شده',
  'آزمایشگاه کنترل کیفیت برای پایش رطوبت، آفلاتوکسین و سلامت محصول',
  'امکان تولید و بسته‌بندی مطابق مشخصات سفارش مشتری (OEM)',
];
