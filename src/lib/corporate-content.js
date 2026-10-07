// Central content for the corporate / export positioning of 7Golden.
// Edit the numbers and copy here — the home page, products page and about page
// all read from this single file.
//
// All facts below are taken from the brand's own public sources (7golden.co and
// its producer profile): serious work began in ۱۳۷۷ in a small Qazvin workshop;
// the company "شرکت خشکبار و بسته‌بندی هفت طلایی" was registered in ۱۳۹۶; raw
// material is bought straight from growers via the family بنکداری (خشکبار
// محمدی, 100+ years); pistachio comes from Buin-Zahra (Qazvin) and Kerman,
// hazelnut from Oshnavieh, Alamut (Qazvin) and northern Ashkvarat; exports go
// to the UAE, Qatar, Oman, Iraq and Afghanistan (plus Europe via traders).

// The three flagship products. `category` matches the Category/Product slug in
// the Base44 entities so images and links stay in sync with the CMS.
export const MAIN_PRODUCTS = [
  {
    category: 'pistachio',
    nameFA: 'پسته',
    tagline: 'مغز و خلال پسته قزوین — سبز مطلوب، برش یکنواخت',
    descFA:
      'پسته را از باغ‌های بوئین‌زهرا و کرمان تأمین می‌کنیم. مغز پسته سبز برای شکلات و بستنی، و خلال پسته با برش یکنواخت برای قنادی و تزئین. از برداشت تا بسته‌بندی، هر محموله را پیش از ارسال می‌سنجیم.',
    specs: [
      { label: 'مناطق تأمین', value: 'بوئین‌زهرا (قزوین) و کرمان' },
      { label: 'گریدها', value: 'مغز پسته، مغز پسته پوست‌کنده، خلال پسته، پودر پسته' },
      { label: 'بسته‌بندی', value: 'کیسه ۱۰ و ۲۰ کیلوگرمی، کارتن صادراتی' },
      { label: 'کاربرد صنعتی', value: 'شکلات و بستنی، قنادی، حلوا ارده' },
    ],
  },
  {
    category: 'almond',
    nameFA: 'بادام',
    tagline: 'خلال و پرک بادام درختی — برش و شکستگی کنترل‌شده',
    descFA:
      'خلال بادام درختی و خلال بادام زمینی را با ضخامت یکنواخت برش می‌دهیم؛ همان چیزی که قنادی‌ها و کیک‌سازان برای فرمولاسیون یکدست لازم دارند. پرک و مغز بادام درختی هم با شکستگی کنترل‌شده و رطوبت استاندارد عرضه می‌شود.',
    specs: [
      { label: 'گریدها', value: 'خلال بادام درختی، خلال بادام زمینی، پرک بادام، مغز بادام درختی' },
      { label: 'بسته‌بندی', value: 'کیسه ۱۰ کیلوگرمی، فله صنعتی' },
      { label: 'کاربرد صنعتی', value: 'قنادی و کیک، اسنک، روغن‌کشی' },
      { label: 'بازار', value: 'عرضه داخلی و سفارشی برای صادرات' },
    ],
  },
  {
    category: 'hazelnut',
    nameFA: 'فندق',
    tagline: 'مغز فندق، خمیر و گرانول — مستقیم از باغ، بدون واسطه',
    descFA:
      'خط فندق ما به فرآوری مغز فندق، فندق خندان و مشتقاتش اختصاص دارد؛ از مغز خام و رست تا خمیر، گرانول و پودر فندق برای صنایع شکلات، کیک و بستنی. فندق را از اشنویه، الموت قزوین و اشکوارات شمال می‌خریم و از سال ۱۳۹۶ مستقیم از کشاورز تأمین می‌کنیم.',
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
    grade: 'گرید صادراتی — سبز مطلوب',
    image: '/product/qazvin-pistachio-nuts.webp',
    desc: 'مغز پسته قزوین با رنگ سبز و پوست بنفش؛ همان گریدی که برای شکلات، بستنی و صادرات خواسته می‌شود. مغز پسته را بدون پوست و با دانه‌بندی یکنواخت عرضه می‌کنیم.',
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
    desc: 'مغز فندق با تفکیک دقیق سایز، آماده برای خط تولید شکلات و کرم فندق. فندق را از اشنویه و الموت قزوین می‌خریم و از سال ۱۳۹۶ مستقیم از کشاورز تأمین می‌کنیم.',
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
  'اسناد آزمایشگاهی و فاکتور رسمی همراه هر محموله',
  'مجوز صادرات و اسناد گمرکی برای محموله‌های بین‌المللی',
  'امکان ردیابی محموله از تأمین مواد اولیه تا بسته‌بندی',
];

// Production capacity figures shown on the home page and the about page.
// These are the brand's verifiable figures — years in the trade, the number of
// grades it processes, the family بنکداری's pedigree and its export reach.
export const CAPACITY_STATS = [
  { value: '۲۷', unit: 'سال', label: 'سابقه در فرآوری خشکبار' },
  { value: '۱۴+', unit: 'گرید', label: 'محصول فرآوری‌شده فندق، پسته و بادام' },
  { value: '۱۰۰+', unit: 'سال', label: 'پشتوانه بنکداری خانوادگی' },
  { value: '۶', unit: 'بازار', label: 'بازار صادراتی فعال' },
];

export const CAPACITY_NOTES = [
  'دو خط تولید جداگانه: یکی مخصوص فندق و مشتقاتش، دیگری برای پسته قزوین و کرمان',
  'خمیر، گرانول و پودر فندق برای صنایع شکلات، کیک و بستنی',
  'خلال پسته و پودر پسته برای کارخانه‌های بستنی و حلوا ارده',
  'خلال بادام درختی و زمینی با برش یکنواخت — عرضه داخلی و سفارشی',
];
