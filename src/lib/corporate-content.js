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
    tagline: 'مغز و خلال پسته برای کاربرد در صنایع غذایی',
    descFA:
      'محصولات پسته شامل مغز پسته، مغز پوست‌کنده، خلال و پودر است؛ برای استفاده در شکلات، بستنی، قنادی و فرآورده‌هایی مانند حلوا ارده.',
    specs: [
      { label: 'گریدها', value: 'مغز پسته، مغز پسته پوست‌کنده، خلال پسته، پودر پسته' },
      { label: 'بسته‌بندی', value: 'نوع و وزن بسته‌بندی هنگام استعلام تأیید می‌شود' },
      { label: 'کاربرد صنعتی', value: 'شکلات و بستنی، قنادی، حلوا ارده' },
    ],
  },
  {
    category: 'almond',
    nameFA: 'بادام',
    tagline: 'مغز، خلال و پرک بادام درختی برای کاربردهای غذایی',
    descFA:
      'محصولات بادام شامل مغز، خلال و پرک است؛ شکل‌هایی که در تهیه کیک، شیرینی، شکلات و دیگر فرآورده‌های غذایی استفاده می‌شوند.',
    specs: [
      { label: 'گریدها', value: 'خلال بادام درختی، خلال بادام زمینی، پرک بادام، مغز بادام درختی' },
      { label: 'بسته‌بندی', value: 'نوع و وزن بسته‌بندی هنگام استعلام تأیید می‌شود' },
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
      { label: 'گریدها', value: 'مغز فندق خام و رست، فندق خندان، خمیر، گرانول و پودر فندق' },
      { label: 'بسته‌بندی', value: 'نوع و وزن بسته‌بندی هنگام استعلام تأیید می‌شود' },
      { label: 'کاربرد صنعتی', value: 'شکلات و کرم فندق، کیک و بیسکوییت، بستنی' },
    ],
  },
];

// Specialty products — the flagship grades the user wants emphasized.
export const SPECIALTY_PRODUCTS = [
  {
    key: 'pistachio-kernel',
    nameFA: 'مغز پسته',
    grade: 'مغز پسته',
    image: '/product/qazvin-pistachio-nuts.webp',
    desc: 'مغز پسته برای استفاده در شکلات، بستنی و قنادی کاربرد دارد. مبدأ، مشخصات و شکل عرضه باید هنگام سفارش تأیید شود.',
    specs: [
      { label: 'مشخصات', value: 'بر اساس گرید و سفارش تأیید می‌شود' },
      { label: 'کاربرد', value: 'شکلات و بستنی' },
      { label: 'بسته‌بندی', value: 'وزن و نوع بسته‌بندی هنگام استعلام تأیید می‌شود' },
    ],
  },
  {
    key: 'pistachio-slice',
    nameFA: 'خلال پسته',
    grade: 'خلال پسته',
    image: '/product/pistachio-slices.webp',
    desc: 'خلال پسته می‌تواند برای تزئین قنادی، بستنی و فرآورده‌هایی مانند حلوا ارده استفاده شود. مشخصات برش و امکان تأمین باید هنگام سفارش تأیید شود.',
    specs: [
      { label: 'مشخصات', value: 'بر اساس گرید و سفارش تأیید می‌شود' },
      { label: 'کاربرد', value: 'قنادی، بستنی، حلوا ارده' },
      { label: 'بسته‌بندی', value: 'وزن و نوع بسته‌بندی هنگام استعلام تأیید می‌شود' },
    ],
  },
  {
    key: 'hazelnut-kernel',
    nameFA: 'مغز فندق',
    grade: 'مغز فندق خام و برشته',
    image: '/product/brain-hazelnut.webp',
    desc: 'مغز فندق در شکل‌های خام و برشته، برای استفاده در شکلات و کرم فندق عرضه می‌شود. خمیر، گرانول و پودر فندق نیز در فهرست فرآورده‌های این گروه قرار دارند.',
    specs: [
      { label: 'فرآورده‌ها', value: 'مغز خام و رست، خمیر، گرانول' },
      { label: 'کاربرد', value: 'شکلات و کرم فندق' },
      { label: 'بسته‌بندی', value: 'وزن و نوع بسته‌بندی هنگام استعلام تأیید می‌شود' },
    ],
  },
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
