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

// Export destinations and standards shown in the "Export & Global Markets" section.
export const EXPORT_MARKETS = ['امارات', 'قطر', 'عمان', 'عراق', 'افغانستان', 'ترکیه', 'آلمان', 'هلند'];

export const CERTIFICATES = [
  'ISO 22000 — مدیریت ایمنی مواد غذایی',
  'HACCP — تحلیل خطر و نقاط کنترل بحرانی',
  'گواهی بهداشت صادرات',
  'انطباق با الزامات اتحادیه اروپا',
];

// Production capacity figures shown on the home page and the about page.
export const CAPACITY_STATS = [
  { value: '۳٬۵۰۰', unit: 'تن', label: 'ظرفیت فرآوری سالانه' },
  { value: '۴', unit: 'خط', label: 'خطوط فرآوری و بسته‌بندی' },
  { value: '۲٬۰۰۰', unit: 'تن', label: 'ظرفیت انبار سرد و خشک' },
  { value: '۱۵+', unit: 'کشور', label: 'بازار صادراتی فعال' },
];

export const CAPACITY_NOTES = [
  'خطوط تفکیک سایز، بوجاری و بسته‌بندی صنعتی با ظرفیت عملیاتی پیوسته',
  'انبار خشک و سرد برای نگهداری طولانی‌مدت و تحویل زمان‌بندی‌شده',
  'آزمایشگاه کنترل کیفیت برای پایش رطوبت، آفلاتوکسین و سلامت محصول',
  'امکان تولید و بسته‌بندی مطابق مشخصات سفارش مشتری (OEM)',
];
