// Central product and brand facts used across the 7Golden site.
// Edit the numbers and copy here — the home page, products page and about page
// all read from this single file.
//
// Brand history: family dry-nut trading in Qazvin began in ۱۳۳۵;
// processing started in a small Qazvin workshop in ۱۳۷۷, and the company
// "شرکت خشکبار و بسته‌بندی هفت طلایی" was registered in ۱۳۹۶.
// The catalog below describes the company's main product groups and forms.

// The three flagship products. `category` matches the Category/Product slug in
// the Base44 entities so images and links stay in sync with the CMS.
export const MAIN_PRODUCTS = [
  {
    category: 'pistachio',
    nameFA: 'پسته',
    tagline: 'مغز و خلال پسته قزوین — سبز مطلوب، برش یکنواخت',
    descFA:
      'محصولات پسته شامل مغز پسته، مغز پوست‌کنده، خلال و پودر است؛ برای استفاده در شکلات، بستنی، قنادی و فرآورده‌هایی مانند حلوا ارده.',
    specs: [
      { label: 'مناطق تأمین', value: 'بوئین‌زهرا (قزوین) و کرمان' },
      { label: 'گریدها', value: 'مغز پسته، مغز پسته پوست‌کنده، خلال پسته، پودر پسته' },
      { label: 'بسته‌بندی', value: 'کیسه ۱۰ و ۲۰ کیلوگرمی؛ جزئیات بر اساس سفارش' },
      { label: 'کاربرد صنعتی', value: 'شکلات و بستنی، قنادی، حلوا ارده' },
    ],
  },
  {
    category: 'almond',
    nameFA: 'بادام',
    tagline: 'خلال و پرک بادام درختی — برش و شکستگی کنترل‌شده',
    descFA:
      'محصولات بادام شامل مغز، خلال و پرک است؛ شکل‌هایی که در تهیه کیک، شیرینی، شکلات و دیگر فرآورده‌های غذایی استفاده می‌شوند.',
    specs: [
      { label: 'گریدها', value: 'خلال بادام درختی، خلال بادام زمینی، پرک بادام، مغز بادام درختی' },
      { label: 'بسته‌بندی', value: 'کیسه ۱۰ کیلوگرمی، فله صنعتی' },
      { label: 'کاربرد صنعتی', value: 'قنادی و کیک، اسنک، روغن‌کشی' },
      { label: 'کاربرد', value: 'کیک، شیرینی و صنایع غذایی' },
    ],
  },
  {
    category: 'hazelnut',
    nameFA: 'فندق',
    tagline: 'مغز فندق، خمیر، گرانول و پودر فندق',
    descFA:
      'محصولات فندق شامل مغز خام و برشته، خمیر، گرانول و پودر فندق است؛ برای استفاده در شکلات، کرم فندق، کیک و بستنی.',
    specs: [
      { label: 'مناطق تأمین', value: 'اشنویه، الموت قزوین، اشکوارات شمال' },
      { label: 'گریدها', value: 'مغز فندق خام و رست، فندق خندان، خمیر، گرانول و پودر فندق' },
      { label: 'بسته‌بندی', value: 'کیسه ۱۰ و ۲۵ کیلوگرمی، بشکه صنعتی' },
      { label: 'کاربرد صنعتی', value: 'شکلات و کرم فندق، کیک و بیسکوییت، بستنی' },
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
    grade: 'رنگ سبز مطلوب',
    image: '/product/qazvin-pistachio-nuts.webp',
    desc: 'مغز پسته قزوین با رنگ سبز و پوست بنفش؛ مناسب استفاده در شکلات، بستنی و قنادی. شکل عرضه بر اساس نوع محصول و کاربرد آن مشخص می‌شود.',
    specs: [
      { label: 'رنگ', value: 'سبز مطلوب' },
      { label: 'مناطق', value: 'بوئین‌زهرا و کرمان' },
      { label: 'کاربرد', value: 'شکلات و بستنی' },
      { label: 'بسته‌بندی', value: 'کیسه ۱۰/۲۰ کیلو' },
    ],
  },
  {
    key: 'pistachio-slice',
    nameFA: 'خلال پسته',
    grade: 'برش یکنواخت صنعتی',
    image: '/product/pistachio-slices.webp',
    desc: 'خلال پسته قزوین با برش یکنواخت — مخصوص تزئین قنادی، بستنی و حلوا ارده. هر بچ را از نظر ضخامت و رنگ کنترل می‌کنیم.',
    specs: [
      { label: 'برش', value: 'یکنواخت' },
      { label: 'منطقه', value: 'قزوین' },
      { label: 'کاربرد', value: 'قنادی، بستنی، حلوا ارده' },
      { label: 'بسته‌بندی', value: 'کیسه ۵/۱۰ کیلو' },
    ],
  },
  {
    key: 'hazelnut-kernel',
    nameFA: 'مغز فندق',
    grade: 'درجه یک — اشنویه و قزوین',
    image: '/product/brain-hazelnut.webp',
    desc: 'مغز فندق در شکل‌های خام و برشته، برای استفاده در شکلات و کرم فندق عرضه می‌شود. خمیر، گرانول و پودر فندق نیز در فهرست فرآورده‌های این گروه قرار دارند.',
    specs: [
      { label: 'مناطق', value: 'اشنویه، الموت قزوین' },
      { label: 'فرآورده‌ها', value: 'مغز خام و رست، خمیر، گرانول' },
      { label: 'کاربرد', value: 'شکلات و کرم فندق' },
      { label: 'بسته‌بندی', value: 'کیسه ۱۰/۲۵ کیلو' },
    ],
  },
];

// Export destinations and standards shown in the "Export & Global Markets" section.
// Neighbouring markets are direct; European sales move through traders.
export const EXPORT_MARKETS = ['امارات', 'قطر', 'عمان', 'عراق', 'افغانستان', 'اروپا (واسطه‌ای)'];

export const CERTIFICATES = [
  'پروانه بهره‌برداری و مجوزهای بهداشتی واحد تولید',
  'فاکتور رسمی و مدارک مربوط به سفارش',
  'مشخصات محصول و جزئیات بسته‌بندی سفارش',
  'اطلاعات قابل ارائه درباره محصول و شکل فرآوری آن',
];

// Brand milestones and current product groups used throughout the site.
export const CAPACITY_STATS = [
  { value: 'از ۱۳۳۵', unit: '', label: 'پیشینه خانوادگی خشکبار محمدی در بازار قزوین' },
  { value: 'از ۱۳۷۷', unit: '', label: 'آغاز فرآوری خشکبار در قزوین' },
  { value: 'ثبت در ۱۳۹۶', unit: '', label: 'شرکت خشکبار و بسته‌بندی هفت طلایی' },
  { value: '۳', unit: 'گروه محصول', label: 'فندق، پسته و بادام' },
];

export const CAPACITY_NOTES = [
  'فندق: مغز خام و برشته، خمیر، گرانول و پودر فندق',
  'پسته: مغز پسته، مغز پوست‌کنده، خلال و پودر پسته',
  'بادام: مغز، خلال و پرک بادام در شکل‌های مختلف عرضه',
  'کاربرد محصولات در شکلات، بستنی، قنادی، کیک و فرآورده‌های غذایی',
];
