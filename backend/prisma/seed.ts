import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ── Helpers ────────────────────────────────────────────────────
// Persian price formatter: 1234567 -> "۱٬۲۳۴٬۵۶۷"
function faPrice(n: number): string {
  const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n
    .toLocaleString('en-US')
    .replace(/[0-9]/g, (d) => faDigits[+d]);
}

type ProductSeed = {
  slug: string;
  name_fa: string;
  desc_fa: string;
  category: string;
  origin_fa?: string;
  price: number;
  image: string;
  gallery?: string[];
  badge?: string;
  taste?: Record<string, number>;
  weights?: number[];
  featured?: boolean;
  published?: boolean;
  sort_order: number;
};

type BlogSeed = {
  slug: string;
  title_fa: string;
  excerpt_fa: string;
  content: string;
  date_fa: string;
  category: string;
  image: string;
  sort_order: number;
};

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@7golden.co' },
    update: {},
    create: {
      email: 'admin@7golden.co',
      passwordHash,
      name: 'Admin',
      role: 'admin',
    },
  });

  // ── Site Settings ──────────────────────────────────────────────
  await prisma.siteSettings.deleteMany();
  await prisma.siteSettings.create({
    data: {
      site_name_fa: 'هفت طلایی',
      site_mode: 'corporate',
      default_seo_title_fa: 'هفت‌طلایی — تولید، فرآوری و صادرات فندق، پسته و بادام',
      default_seo_desc_fa:
        'شرکت هفت طلایی قزوین، تأمین‌کننده و صادرکننده خشکبار صنعتی (مغز و خلال پسته، فندق و بادام) برای صنایع شکلات، قنادی و بستنی.',
      contact_phone: '021-12345678',
      contact_mobile: '0912-0000000',
      contact_email: 'info@7golden.co',
      hq_address_fa: 'ایران، قزوین',
      working_hours_fa: 'شنبه تا پنج‌شنبه ۹ تا ۱۷',
    },
  });

  // ── Categories ─────────────────────────────────────────────────
  const catData = [
    {
      slug: 'pistachio',
      name_fa: 'پسته',
      desc_fa:
        'مغز و خلال پسته قزوین و کرمان با رنگ سبز مطلوب و دانه‌بندی یکنواخت، فرآوری‌شده برای صنایع شکلات، قنادی و بسته‌بندی صادراتی.',
      image: '/product/pistachio-category.png',
      sort_order: 1,
    },
    {
      slug: 'almond',
      name_fa: 'بادام',
      desc_fa:
        'مغز، خلال و پرک بادام درختی و بادام زمینی با درصد شکستگی کنترل‌شده و رطوبت استاندارد، مناسب صنایع قنادی، کیک و شکلات.',
      image: '/product/almond-category.png',
      sort_order: 2,
    },
    {
      slug: 'hazelnut',
      name_fa: 'فندق',
      desc_fa:
        'مغز فندق خام و رست، گرانول، پودر و خمیر فندق با تفکیک دقیق سایز و کنترل آلودگی، تأمین‌شده از باغستان‌های قزوین و اشنویه.',
      image: '/product/hazelnut-category.png',
      sort_order: 3,
    },
  ];
  for (const c of catData) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { image: c.image, name_fa: c.name_fa, desc_fa: c.desc_fa, sort_order: c.sort_order },
      create: c,
    });
  }

  // ── Products (real 7golden catalog, 20 items) ──────────────────
  // Image paths reference files in /public/product. Where the original
  // WordPress image was available it is used; otherwise a matching local
  // asset from the same product family is used.
  const prodData: ProductSeed[] = [
    {
      slug: 'qazvin-pistachio-nuts',
      name_fa: 'مغز پسته قزوین',
      category: 'pistachio',
      origin_fa: 'قزوین',
      price: 8500000,
      image: '/product/Qazvin-pistachio-nuts-7goldenco.png',
      gallery: ['/product/Qazvin-pistachio-nuts-7goldenco.png'],
      badge: 'پرفروش',
      taste: { bitter: 5, sweet: 35, earthy: 20, nutty: 90 },
      weights: [10000, 40000],
      featured: true,
      sort_order: 1,
      desc_fa:
        'مغز پسته قزوین یکی از معروف‌ترین مغزهای پسته دنیاست که به دلیل طعم و رنگ سبز بی‌نظیرش درخشش خاصی دارد. ' +
        'مناسب برای صادرات، صنایع بسته‌بندی، شرکت‌های تولید باقلوا، حلوا ارده و آجیل‌فروشان. ' +
        'بسته‌بندی در بسته‌های ۱۰ و ۴۰ کیلوگرم. تمام مراحل از برداشت تا بسته‌بندی تحت کنترل کیفی آزمایشگاهی انجام می‌گیرد.',
    },
    {
      slug: 'qazvini-peeled-pistachio-nuts',
      name_fa: 'مغز پسته پوست‌کنده قزوینی',
      category: 'pistachio',
      origin_fa: 'قزوین',
      price: 9200000,
      image: '/product/qazvini-peeled-pistachio-nuts-7goldenco.png',
      gallery: ['/product/qazvini-peeled-pistachio-nuts-7goldenco.png'],
      badge: 'صادراتی',
      taste: { bitter: 3, sweet: 40, earthy: 15, nutty: 92 },
      weights: [10000, 40000],
      featured: true,
      sort_order: 2,
      desc_fa:
        'مغز پسته پوست‌کنده قزوینی با رنگ سبز روشن و مطلوب، یکی از خاص‌ترین محصولات پسته ایران است. ' +
        'پوست‌کنده و آماده برای مصرف مستقیم در صنایع شکلات، قنادی و بسته‌بندی صادراتی. ' +
        'بسته‌بندی در بسته‌های ۱۰ و ۴۰ کیلوگرمی.',
    },
    {
      slug: 'qazvin-pistachio-slices',
      name_fa: 'خلال پسته قزوین',
      category: 'pistachio',
      origin_fa: 'قزوین',
      price: 12000000,
      image: '/product/khelal-qazvin-slice-7golden.png',
      gallery: ['/product/khelal-qazvin-slice-7golden.png'],
      badge: 'ویژه',
      taste: { bitter: 4, sweet: 38, earthy: 18, nutty: 88 },
      weights: [10000, 22000],
      featured: true,
      sort_order: 3,
      desc_fa:
        'خلال پسته قزوین به دلیل رنگ سبز بی‌نظیرش از منحصربه‌فردترین خلال‌های پسته دنیا به شمار می‌رود. ' +
        'مناسب برای صادرات، صنایع بسته‌بندی، شرکت‌های باقلوا، حلوا ارده، آجیل‌فروشان و رستوران‌ها. ' +
        'بسته‌بندی در بسته‌های ۱۰ و ۲۲ کیلوگرمی.',
    },
    {
      slug: 'kermani-pistachio-slices',
      name_fa: 'خلال پسته کرمانی',
      category: 'pistachio',
      origin_fa: 'کرمان',
      price: 11500000,
      image: '/product/pistachio-slices.png',
      gallery: ['/product/pistachio-slices.png'],
      taste: { bitter: 4, sweet: 36, earthy: 18, nutty: 85 },
      weights: [10000, 22000],
      sort_order: 4,
      desc_fa:
        'خلال پسته کرمانی با برش یکنواخت صنعتی، مناسب صادرات، صنایع بسته‌بندی، شرکت‌های تولید کنده باقلوا، ' +
        'حلوا ارده، آجیل‌فروشان و رستوران‌ها. بسته‌بندی در وزن‌های ۱۰ و ۲۲ کیلوگرمی.',
    },
    {
      slug: 'pistachio-powder',
      name_fa: 'پودر پسته',
      category: 'pistachio',
      origin_fa: 'قزوین',
      price: 7800000,
      image: '/product/peeled-pistachio.png',
      gallery: ['/product/peeled-pistachio.png'],
      taste: { bitter: 3, sweet: 42, earthy: 15, nutty: 90 },
      weights: [8000, 15000],
      sort_order: 5,
      desc_fa:
        'پودر مغز پسته یکی از فرآورده‌های مهم پسته است که کاربردهای فراوانی در صنایع شیرینی‌پزی و تهیه و تزیین انواع کیک، ' +
        'شکلات، بستنی و خمیر پسته دارد. بسته‌بندی در وزن‌های ۸ و ۱۵ کیلوگرمی.',
    },
    {
      slug: 'raw-pistachios',
      name_fa: 'پسته خام قزوین',
      category: 'pistachio',
      origin_fa: 'قزوین',
      price: 5600000,
      image: '/product/qazvin-pistachio-nuts.png',
      gallery: ['/product/qazvin-pistachio-nuts.png'],
      taste: { bitter: 6, sweet: 30, earthy: 25, nutty: 80 },
      weights: [40000, 50000],
      sort_order: 6,
      desc_fa:
        'پسته خام قزوین به دلیل ارزش غذایی بالا و خواص درمانی مفید، یکی از محصولات صادراتی مهم ایران به شمار می‌رود. ' +
        'بیشترین کاربرد آن به دلیل سبز بودن مغز، برای تولید خلال پسته است. بسته‌بندی در کیسه‌های ۴۰ و ۵۰ کیلویی.',
    },
    {
      slug: 'pistachio-skin',
      name_fa: 'پوست پسته',
      category: 'pistachio',
      price: 1200000,
      image: '/product/pistachio-cat.png',
      gallery: ['/product/pistachio-cat.png'],
      weights: [50000],
      sort_order: 7,
      desc_fa:
        'پوست پسته فرآورده‌ای جانبی از خط فرآوری پسته است که در صنعت ذغال و چوب و صنایع وابسته کاربرد دارد. ' +
        'عرضه به صورت فله و کیسه‌ای.',
    },
    // ── Hazelnut products ────────────────────────────────────────
    {
      slug: 'brain-hazelnut',
      name_fa: 'مغز فندق',
      category: 'hazelnut',
      origin_fa: 'قزوین',
      price: 4800000,
      image: '/product/brain-hazelnut-7golden.png',
      gallery: ['/product/brain-hazelnut-7golden.png'],
      badge: 'پرفروش',
      taste: { bitter: 5, sweet: 30, earthy: 25, nutty: 85 },
      weights: [10000, 40000, 50000],
      featured: true,
      sort_order: 8,
      desc_fa:
        'مغز فندق با روکش قهوه‌ای خود در سایزهای ۱۰–۱۳، ۱۳–۱۱ و ۱۱ (دراژه) عرضه می‌شود. ' +
        'مغز فندق ایرانی به دلیل شرایط اقلیمی و خاکی مناسب منطقه، کیفیت بالا و طعم شیرین و خامه‌ای دارد و ' +
        'به عنوان یکی از بهترین مغزهای فندق جهان شناخته می‌شود. مناسب مصرف بازار خشکبار، صنایع بسته‌بندی، ' +
        'شکلات‌سازی، بستنی و آجیل‌فروشان. بسته‌بندی در وزن‌های ۱۰، ۴۰ و ۵۰ کیلویی.',
    },
    {
      slug: 'roasted-hazelnut-brain',
      name_fa: 'مغز فندق رست',
      category: 'hazelnut',
      origin_fa: 'قزوین',
      price: 5200000,
      image: '/product/Roasted-hazelnut-brain-7goldenco.png',
      gallery: ['/product/Roasted-hazelnut-brain-7goldenco.png'],
      badge: 'صادراتی',
      taste: { bitter: 4, sweet: 35, earthy: 20, nutty: 88 },
      weights: [10000, 40000, 50000],
      featured: true,
      sort_order: 9,
      desc_fa:
        'مغز فندق رست (سفید) در سایزهای ۱۰–۱۳، ۱۳–۱۱ و ۱۱ (دراژه). فندق به دلیل خواص و فواید منحصربه‌فردش ' +
        'طرفداران زیادی در سراسر دنیا دارد و مغز فندق سفید در چند سال گذشته به یکی از مهم‌ترین سبد مصرفی ' +
        'آجیل‌فروشان تبدیل شده است. مناسب مصرف بازار خشکبار، صنایع بسته‌بندی و آجیل‌فروشان. ' +
        'بسته‌بندی در وزن‌های ۱۰، ۴۰ و ۵۰ کیلویی.',
    },
    {
      slug: 'smiling-hazelnut',
      name_fa: 'فندق خندان',
      category: 'hazelnut',
      origin_fa: 'قزوین',
      price: 3900000,
      image: '/product/smiling-hazelnut-7golden.png',
      gallery: ['/product/smiling-hazelnut-7golden.png'],
      taste: { bitter: 6, sweet: 28, earthy: 28, nutty: 80 },
      weights: [10000, 40000, 50000],
      sort_order: 10,
      desc_fa:
        'فندق خندان یا ترک‌خورده، محصولی کشاورزی استان قزوین است که به صورت دستی و دستگاهی عرضه می‌شود. ' +
        'این فندق از نظر اندازه بزرگ و پربار است و طعم شیرین و خامه‌ای دارد. به دلیل کیفیت بالا و طعم خوب، ' +
        'در بازارهای داخلی و خارجی (صادرات) بسیار مورد تقاضاست. مناسب مصرف بازار خشکبار، صنایع بسته‌بندی و آجیل‌فروشان. ' +
        'بسته‌بندی در وزن‌های ۱۰، ۴۰ و ۵۰ کیلوگرمی.',
    },
    {
      slug: 'hazelnut-granules',
      name_fa: 'گرانول فندق',
      category: 'hazelnut',
      origin_fa: 'قزوین',
      price: 6400000,
      image: '/product/brain-hazelnut.png',
      gallery: ['/product/brain-hazelnut.png'],
      taste: { bitter: 4, sweet: 38, earthy: 18, nutty: 86 },
      weights: [8000],
      sort_order: 11,
      desc_fa:
        'گرانول فندق فرآورده خردشده مغز فندق است که به عنوان تنقلات و میان‌وعده مغذی مصرف می‌شود. ' +
        'به دلیل فیبر فراوان، سیری طولانی‌مدت ایجاد می‌کند و برای رژیم‌های سالم و تأمین انرژی مناسب است. ' +
        'مناسب برای مصرف در کارخانجات شیرینی و شکلات، بستنی و صنایع وابسته. بسته‌بندی در وزن‌های ۸ کیلوگرمی.',
    },
    {
      slug: 'hazelnut-powder',
      name_fa: 'پودر فندق',
      category: 'hazelnut',
      origin_fa: 'قزوین',
      price: 7000000,
      image: '/product/roasted-hazelnut.png',
      gallery: ['/product/roasted-hazelnut.png'],
      taste: { bitter: 3, sweet: 40, earthy: 15, nutty: 90 },
      weights: [10000],
      sort_order: 12,
      desc_fa:
        'پودر مغز فندق رست، محصولی خشک با طعم و بوی مطبوع است که به عنوان منبع پروتئین و انرژی در صنایع غذایی کاربرد دارد. ' +
        'حاوی پروتئین، فیبر، ویتامین E، منیزیم، فسفر و روی و چربی‌های سالم غیراشباع. ' +
        'مصرف آن در تهیه خلال فندق، شیرینی، کیک و دسر رایج است و به حفظ سلامت قلب، سیستم ایمنی و استخوان‌ها کمک می‌کند. ' +
        'بسته‌بندی در وزن‌های ۱۰ کیلوگرمی.',
    },
    {
      slug: 'hazelnut-paste',
      name_fa: 'خمیر فندق',
      category: 'hazelnut',
      origin_fa: 'قزوین',
      price: 8800000,
      image: '/product/Hazelnut-paste-7golden.png',
      gallery: ['/product/Hazelnut-paste-7golden.png'],
      badge: 'ویژه',
      taste: { bitter: 3, sweet: 50, earthy: 12, nutty: 95 },
      weights: [8000],
      featured: true,
      sort_order: 13,
      desc_fa:
        'خمیر فندق یکی از فرآورده‌های مهم فندق در تهیه انواع غذاها و چاشنی‌هاست که از مغز فندق تهیه می‌شود. ' +
        'معمولاً از مغزهای ریز برای تهیه خمیر استفاده می‌شود و رعایت پروتکل‌های بهداشتی در سالن تولید ضروری است. ' +
        'مناسب برای مصرف در کارخانجات شیرینی و شکلات، بستنی و صنایع وابسته. بسته‌بندی در وزن‌های ۸ کیلوگرمی.',
    },
    {
      slug: 'hazelnut-skin',
      name_fa: 'پوست فندق',
      category: 'hazelnut',
      price: 900000,
      image: '/product/hazelnut-cat.png',
      gallery: ['/product/hazelnut-cat.png'],
      weights: [50000],
      sort_order: 14,
      desc_fa:
        'پوست فندق فرآورده‌ای جانبی از خط فرآوری فندق است که در صنعت ذغال و چوب و صنایع وابسته کاربرد دارد. ' +
        'عرضه به صورت فله.',
    },
    // ── Almond products ──────────────────────────────────────────
    {
      slug: 'nuts-of-tree-almonds',
      name_fa: 'مغز بادام درختی',
      category: 'almond',
      origin_fa: 'ایران',
      price: 6200000,
      image: '/product/almond-flakes-7golden.png',
      gallery: ['/product/almond-flakes-7golden.png'],
      badge: 'صادراتی',
      taste: { bitter: 8, sweet: 32, earthy: 18, nutty: 78 },
      weights: [45000],
      featured: true,
      sort_order: 15,
      desc_fa:
        'مغز بادام درختی با روکش قهوه‌ای خاص خود در سایزهای مختلف عرضه می‌شود. ' +
        'مناسب مصرف در بازار، شرکت‌های کیک و شکلات و صنایع وابسته. ' +
        'بسته‌بندی در وزن‌های ۴۵ کیلوگرمی.',
    },
    {
      slug: 'sliced-almonds',
      name_fa: 'خلال بادام درختی',
      category: 'almond',
      origin_fa: 'ایران',
      price: 7400000,
      image: '/product/almond-flakes.png',
      gallery: ['/product/almond-flakes.png'],
      taste: { bitter: 6, sweet: 35, earthy: 16, nutty: 80 },
      weights: [8000, 18000],
      sort_order: 16,
      desc_fa:
        'خلال بادام درختی در تهیه و تزیین انواع غذاها، شیرینی‌جات، شکلات‌ها و دسرها به کار برده می‌شود. ' +
        'بسته‌بندی در وزن‌های ۸ و ۱۸ کیلوگرمی.',
    },
    {
      slug: 'almond-flakes',
      name_fa: 'پرک بادام',
      category: 'almond',
      origin_fa: 'ایران',
      price: 8100000,
      image: '/product/almond-flakes-7golden.png',
      gallery: ['/product/almond-flakes-7golden.png'],
      badge: 'پرفروش',
      taste: { bitter: 5, sweet: 38, earthy: 15, nutty: 82 },
      weights: [8000],
      featured: true,
      sort_order: 17,
      desc_fa:
        'پرک بادام درختی به دلیل چهار قسمت شدن هر مغز، از نظر توزیع فراوان و ظاهری بسیار شکیل است. ' +
        'مناسب مصرف در صنایع شکلات‌سازی، حلوا شکری، سوهان، تولید بستنی، قنادی و… ' +
        'بسته‌بندی در وزن‌های ۸ کیلوگرمی.',
    },
    {
      slug: 'almond-powder',
      name_fa: 'پودر بادام',
      category: 'almond',
      origin_fa: 'ایران',
      price: 6900000,
      image: '/product/almond-flakes.png',
      gallery: ['/product/almond-flakes.png'],
      taste: { bitter: 4, sweet: 40, earthy: 14, nutty: 85 },
      weights: [10000, 15000],
      sort_order: 18,
      desc_fa:
        'پودر مغز بادام یکی از فرآورده‌های بادام است که در صنایع شیرینی‌پزی، کیک‌پزی و شکلات‌سازی بسیار پرکاربرد است. ' +
        'بسته‌بندی در وزن‌های ۱۰ و ۱۵ کیلوگرمی.',
    },
    {
      slug: 'sliced-peanuts',
      name_fa: 'خلال بادام زمینی',
      category: 'almond',
      origin_fa: 'ایران',
      price: 2400000,
      image: '/product/sliced-peanuts-7golden.png',
      gallery: ['/product/sliced-peanuts-7golden.png'],
      taste: { bitter: 5, sweet: 30, earthy: 22, nutty: 75 },
      weights: [10000, 20000],
      sort_order: 19,
      desc_fa:
        'خلال بادام زمینی از نظر ارزش غذایی برابر با مغز گردو و بادام است و منبعی غنی از پروتئین محسوب می‌شود. ' +
        'مناسب مصرف صنایع شیرینی‌پزی، شکلات‌سازی، کیک‌پزی، سوهان و صنایع وابسته. ' +
        'بسته‌بندی در وزن‌های ۱۰ و ۲۰ کیلوگرمی.',
    },
    {
      slug: 'peanuts-without-skin',
      name_fa: 'مغز بادام زمینی بدون پوست',
      category: 'almond',
      origin_fa: 'ایران',
      price: 2100000,
      image: '/product/sliced-peanuts.png',
      gallery: ['/product/sliced-peanuts.png'],
      taste: { bitter: 4, sweet: 32, earthy: 20, nutty: 72 },
      weights: [25000],
      sort_order: 20,
      desc_fa:
        'مغز بادام زمینی سفید در تهیه محصولات نظیر خلال بادام زمینی، شیرینی‌ها، کیک‌ها و دسرها بسیار رایج است. ' +
        'همچنین می‌تواند به عنوان تنقلات سالم و پرانرژی در هنگام صبحانه یا پس از ورزش مصرف شود. ' +
        'بسته‌بندی در کارتن‌های ۲۵ کیلویی.',
    },
  ];

  // Remove old placeholder products that no longer exist in the real catalog.
  const realSlugs = prodData.map((p) => p.slug);
  await prisma.product.deleteMany({
    where: { slug: { notIn: realSlugs } },
  });

  for (const p of prodData) {
    const data = {
      slug: p.slug,
      name_fa: p.name_fa,
      desc_fa: p.desc_fa,
      category: p.category,
      origin_fa: p.origin_fa ?? null,
      price: p.price,
      price_display: faPrice(p.price),
      image: p.image,
      gallery: p.gallery ? JSON.stringify(p.gallery) : null,
      badge: p.badge ?? null,
      taste: p.taste ? JSON.stringify(p.taste) : null,
      weights: p.weights ? JSON.stringify(p.weights) : null,
      in_stock: true,
      featured: p.featured ?? false,
      published: p.published ?? true,
      sort_order: p.sort_order,
    };
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: data,
    });
  }

  // ── Blog posts (real 7golden articles) ─────────────────────────
  const blogData: BlogSeed[] = [
    {
      slug: 'sweets-and-chocolates-1402',
      title_fa: 'نمایشگاه شیرینی و شکلات ۱۴۰۲',
      excerpt_fa:
        'مجموعه بزرگ خشکبار هفت طلایی در نمایشگاه شیرینی و شکلات ۱۴۰۲ خوش درخشید.',
      content:
        'مجموعه بزرگ خشکبار هفت طلایی در نمایشگاه شیرینی و شکلات ۱۴۰۲ خوش درخشید!\n' +
        'از استقبال تمامی همکاران، دوستان و مشتریان عزیز هفت طلایی ممنونیم که خاطرات خوب را برای ما به جا گذاشتید.\n\n' +
        'در این نمایشگاه، انواع مغز و خلال پسته، فندق و بادام صادراتی هفت طلایی با استقبال چشمگیر صنعت‌گران ' +
        'شیرینی و شکلات مواجه شد و قراردادهای همکاری جدیدی برای تأمین مواد اولیه صنعتی منعقد گردید.',
      date_fa: '۱۴۰۲/۰۷/۰۳',
      category: 'news',
      image: '/banner/blog-exhibition.jpg',
      sort_order: 1,
    },
    {
      slug: 'our-honors',
      title_fa: 'افتخارات هفت طلایی',
      excerpt_fa: 'افتخارات، مجوزها و دستاوردهای شرکت هفت طلایی.',
      content:
        'افتخارات، مجوزها و دستاوردهای شرکت هفت طلایی\n\n' +
        'شرکت هفت طلایی در مسیر فعالیت خود توانسته با رعایت استانداردهای بین‌المللی و کسب مجوزهای ' +
        'ایمنی مواد غذایی، جایگاهی مطمئن در بازار صادرات خشکبار پیدا کند. ' +
        'الحاقیه گواهی‌های ISO 22000 و HACCP و انطباق با الزامات استاندارد صادراتی، ' +
        'تضمینی بر کیفیت پایدار محصولات این شرکت است.',
      date_fa: '۱۴۰۳/۰۴/۱۳',
      category: 'news',
      image: '/banner/blog-honors.jpg',
      sort_order: 2,
    },
    {
      slug: 'decrease-in-purchasing-power',
      title_fa: 'کاهش قدرت خرید و افزایش رقابت',
      excerpt_fa: 'تحلیل چاپ‌شده در مجله درباره کاهش قدرت خرید و افزایش رقابت در بازار خشکبار.',
      content:
        'مطالب چاپ‌شده در مجله پیوست گردید.\n\n' +
        'در شرایط اقتصادی فعلی، کاهش قدرت خرید مصرف‌کننده و افزایش رقابت در بازار خشکبار، ' +
        'شرکت‌های صادراتی را به سمت بهینه‌سازی فرآوری و کنترل هزینه‌های تولید سوق داده است. ' +
        'هفت طلایی با اتکا به ظرفیت تأمین مستقیم از باغستان و حذف واسطه‌ها، ' +
        'توانسته قیمت تمام‌شده را برای خریداران صنعتی پایدار نگه دارد.',
      date_fa: '۱۴۰۳/۰۴/۰۱',
      category: 'educational',
      image: '/banner/blog-purchasing-power.jpg',
      sort_order: 3,
    },
    {
      slug: 'difference-walnut-grades',
      title_fa: 'تفاوت درجه‌های گردو',
      excerpt_fa: 'آشنایی با درجه‌بندی گردو و معیارهای کیفیت آن برای مصرف صنعتی.',
      content:
        'تفاوت درجه‌های گردو\n\n' +
        'گردو بر اساس رنگ مغز، درصد شکستگی و رطوبت به درجه‌های مختلف تقسیم می‌شود. ' +
        'مغز روشن (Light) با رنگ یکنواخت و درصد شکستگی بالا، بالاترین ارزش صادراتی را دارد و ' +
        'مخصوص صنایع قنادی و شکلات‌سازی است. درجه‌های تیره‌تر برای مصرف داخلی و صنایعی که رنگ مغز ' +
        'در محصول نهایی اهمیت کمتری دارد، مناسب‌تر هستند.\n\n' +
        'کنترل رطوبت در طول فرآوری و انبارش، کلید حفظ کیفیت و جلوگیری از رنجیدگی مغز گردو است.',
      date_fa: '۱۴۰۱/۰۶/۱۴',
      category: 'educational',
      image: '/product/blog-3.jpg',
      sort_order: 4,
    },
  ];

  // Remove old placeholder blog posts not in the real catalog.
  const realBlogSlugs = blogData.map((b) => b.slug);
  await prisma.blogPost.deleteMany({
    where: { slug: { notIn: realBlogSlugs } },
  });

  for (const b of blogData) {
    const data = {
      slug: b.slug,
      title_fa: b.title_fa,
      excerpt_fa: b.excerpt_fa,
      content: b.content,
      date_fa: b.date_fa,
      category: b.category,
      image: b.image,
      published: true,
      sort_order: b.sort_order,
    };
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: data,
      create: data,
    });
  }

  // ── Testimonials ───────────────────────────────────────────────
  const tCount = await prisma.testimonial.count();
  if (tCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          name_fa: 'بستنی گلستان',
          role_fa: 'خریدار صادراتی',
          text_fa:
            'خلال پسته قزوین هفت طلایی بهترین کیفیت را در بین تأمین‌کنندگان دارد. رنگ سبز مطلوب و برش یکنواخت.',
          rating: 5,
          sort_order: 1,
        },
        {
          name_fa: 'قنادی برتر',
          role_fa: 'خریدار عمده',
          text_fa:
            'پرک بادام درختی با کیفیت عالی و تحویل به‌موقع. همکاری با هفت طلایی را به همه صنعت‌گران توصیه می‌کنیم.',
          rating: 5,
          sort_order: 2,
        },
        {
          name_fa: 'شکلات‌سازی آریا',
          role_fa: 'مدیر تأمین',
          text_fa:
            'خمیر و پودر فندق هفت طلایی پایه محصول نهایی ماست. ثبات کیفیت و انطباق با استانداردهای بهداشتی، ' +
            'همکاری طولانی‌مدت را ممکن کرده است.',
          rating: 5,
          sort_order: 3,
        },
      ],
    });
  }

  console.log('Seed done. Admin: admin@7golden.co / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
