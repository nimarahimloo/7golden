// Central content for the corporate / export positioning of 7Golden.
// Edit the numbers and copy here — the home page, products page and about page
// all read from this single file.

// The three flagship products. `category` matches the Category/Product slug in
// the Base44 entities so images and links stay in sync with the CMS.
export const MAIN_PRODUCTS = [
  {
    category: 'pistachio',
    nameFA: 'پسته',
    tagline: 'مغز و خلال پسته قزوین — سبز مطلوب، دانه‌بندی یکنواخت',
    descFA:
      'پسته قزوین را خودمان از باغ‌های بوئین‌زهرا تأمین می‌کنیم. رنگ سبزش مطلوب است، دانه‌بندی‌اش یکنواخت و برای خط تولید شکلات، قنادی و بستنی دقیقاً همان چیزی است که می‌خواهید. از برداشت تا بسته‌بندی، هر مرحله را در آزمایشگاه کنترل می‌کنیم.',
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
    tagline: 'مغز، خلال و پرک بادام درختی — شکستگی کنترل‌شده',
    descFA:
      'بادام درختی را با درصد شکستگی کنترل‌شده و رطوبت استاندارد عرضه می‌کنیم. خط فرآوری ما خلال بادام را با ضخامت دقیق و یکنواخت برش می‌دهد — همان چیزی که قنادی‌ها و کیک‌سازان برای فرمولاسیون یکنواخت نیاز دارند.',
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
    tagline: 'مغز فندق درجه یک، خمیر و گرانول فندق — مستقیم از باغ',
    descFA:
      'مغز فندق را با تفکیک دقیق سایز و کنترل آلودگی آماده می‌کنیم تا برای خط تولید شکلات و کرم فندق آماده باشد. مستقیم از باغستان‌های قزوین و اشنویه می‌خریم — بدون واسطه، بدون غافلگیری.',
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
    nameFA: 'مغز پسته قزوین',
    nameEN: 'Qazvin Pistachio Kernel',
    category: 'pistachio',
    image: '/product/qazvin-pistachio-nuts.webp',
    featured: true,
    published: true,
  },
  {
    id: 'pistachio-slice',
    slug: 'pistachio-slice',
    nameFA: 'خلال پسته قزوین',
    nameEN: 'Pistachio Slice',
    category: 'pistachio',
    image: '/product/khelal-qazvin-slice.webp',
    featured: true,
    published: true,
  },
  {
    id: 'hazelnut-kernel',
    slug: 'hazelnut-kernel',
    nameFA: 'مغز فندق خام',
    nameEN: 'Raw Hazelnut Kernel',
    category: 'hazelnut',
    image: '/product/brain-hazelnut.webp',
    featured: true,
    published: true,
  },
  {
    id: 'hazelnut-paste',
    slug: 'hazelnut-paste',
    nameFA: 'خمیر فندق',
    nameEN: 'Hazelnut Paste',
    category: 'hazelnut',
    image: '/product/hazelnut-paste.webp',
    featured: true,
    published: true,
  },
  {
    id: 'almond-kernel',
    slug: 'almond-kernel',
    nameFA: 'پرک بادام درختی',
    nameEN: 'Almond Flakes',
    category: 'almond',
    image: '/product/almond-flakes.webp',
    featured: true,
    published: true,
  },
  {
    id: 'almond-slice',
    slug: 'almond-slice',
    nameFA: 'خلال بادام زمینی',
    nameEN: 'Sliced Peanuts',
    category: 'almond',
    image: '/product/sliced-peanuts.webp',
    featured: true,
    published: true,
  },
  {
    id: 'pistachio-akbari',
    slug: 'pistachio-akbari',
    nameFA: 'مغز پسته پوست کنده',
    nameEN: 'Peeled Pistachio',
    category: 'pistachio',
    image: '/product/peeled-pistachio.webp',
    featured: true,
    published: true,
  },
  {
    id: 'hazelnut-raw',
    slug: 'hazelnut-raw',
    nameFA: 'فندق خندان',
    nameEN: 'Smiling Hazelnut',
    category: 'hazelnut',
    image: '/product/smiling-hazelnut.webp',
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
    image: '/product/qazvin-pistachio-nuts.webp',
    desc: 'مغز پسته قزوین با رنگ سبز مطلوب و دانه‌بندی یکنواخت. برای شکلات‌سازی، قنادی و بستنی فرآوری شده — هر محموله را در آزمایشگاه می‌سنجیم.',
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
    image: '/product/pistachio-slices.webp',
    desc: 'خلال پسته با ضخامت دقیق و یکنواخت — مخصوص تزئین قنادی، بستنی و شکلات. هر بچ را از نظر ضخامت و رنگ کنترل می‌کنیم.',
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
    image: '/product/brain-hazelnut.webp',
    desc: 'مغز فندق با تفکیک دقیق سایز و کنترل آلودگی. برای خط تولید شکلات و کرم فندق آماده شده — مستقیم از باغستان‌های قزوین و اشنویه.',
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
  'ISO 22000 — سیستم مدیریت ایمنی مواد غذایی، از مزرعه تا بسته‌بندی',
  'HACCP — تحلیل خطر و کنترل نقاط بحرانی در خط تولید',
  'گواهی بهداشت صادرات — تأیید سلامت محصول برای بازارهای بین‌المللی',
  'انطباق با الزامات استاندارد صادراتی — ردیابی کامل زنجیره تأمین',
];

// Production capacity figures shown on the home page and the about page.
export const CAPACITY_STATS = [
  { value: '۳٬۵۰۰', unit: 'تن', label: 'ظرفیت فرآوری سالانه' },
  { value: '۴', unit: 'خط', label: 'خطوط فرآوری و بسته‌بندی' },
  { value: '۲٬۰۰۰', unit: 'تن', label: 'ظرفیت انبار سرد و خشک' },
  { value: '۲۴', unit: 'ساعت', label: 'پاسخگویی به سفارش' },
];

export const CAPACITY_NOTES = [
  'خطوط تفکیک سایز، بوجاری و بسته‌بندی صنعتی — ظرفیت پیوسته و بدون توقف',
  'انبار خشک و سرد برای نگهداری طولانی‌مدت و تحویل طبق برنامه قرارداد',
  'آزمایشگاه کنترل کیفیت — پایش روزانه رطوبت، آفلاتوکسین و سلامت هر محموله',
  'تولید و بسته‌بندی مطابق مشخصات سفارش شما (OEM) — سایز، گرید و بسته‌بندی دلخواه',
];
