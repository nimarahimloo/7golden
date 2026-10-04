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

type AwardSeed = {
  key: string;
  title_fa: string;
  desc_fa: string;
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

  // ── Blog posts (12 unique, structured articles) ───────────────
  const blogData: BlogSeed[] = [
    {
      slug: 'sweets-and-chocolates-1402',
      title_fa: 'نمایشگاه شیرینی و شکلات ۱۴۰۲',
      excerpt_fa:
        'مجموعه بزرگ خشکبار هفت طلایی در نمایشگاه شیرینی و شکلات ۱۴۰۲ خوش درخشید و قراردادهای همکاری جدیدی منعقد کرد.',
      content:
        'مجموعه بزرگ خشکبار هفت طلایی در نمایشگاه شیرینی و شکلات ۱۴۰۲ خوش درخشید!\n' +
        'از استقبال تمامی همکاران، دوستان و مشتریان عزیز هفت طلایی ممنونیم که خاطرات خوب را برای ما به جا گذاشتید.\n\n' +
        '## گزارش نمایشگاه\n\n' +
        'در این نمایشگاه، انواع مغز و خلال پسته، فندق و بادام صادراتی هفت طلایی با استقبال چشمگیر صنعت‌گران ' +
        'شیرینی و شکلات مواجه شد و قراردادهای همکاری جدیدی برای تأمین مواد اولیه صنعتی منعقد گردید.\n\n' +
        '## دستاوردها\n\n' +
        '- امضای تفاهم‌نامه با ۱۲ شرکت قنادی و شکلات‌سازی\n' +
        '- معرفی خط تولید جدید گرانول و پودر فندق با گرید صنعتی\n' +
        '- گسترش شبکه توزیع به ۳ استان جدید\n\n' +
        '## نگاه به آینده\n\n' +
        'حضور در این نمایشگاه‌ها فرصتی برای سنجش نیاز بازار و ارتباط مستقیم با خریداران صنعتی است. ' +
        'هفت طلایی در سال‌های پیش رو برنامه‌ریزی کرده تا حضور فعال‌تری در نمایشگاه‌های بین‌المللی داشته باشد.',
      date_fa: '۱۴۰۲/۰۷/۰۳',
      category: 'news',
      image: '/banner/blog-exhibition.jpg',
      sort_order: 1,
    },
    {
      slug: 'our-honors',
      title_fa: 'افتخارات و گواهینامه‌های هفت طلایی',
      excerpt_fa:
        'مروری بر افتخارات، مجوزها و گواهینامه‌های بین‌المللی شرکت هفت طلایی در مسیر کیفیت و صادرات.',
      content:
        'افتخارات، مجوزها و دستاوردهای شرکت هفت طلایی\n\n' +
        '## استانداردهای کیفی\n\n' +
        'شرکت هفت طلایی در مسیر فعالیت خود توانسته با رعایت استانداردهای بین‌المللی و کسب مجوزهای ' +
        'ایمنی مواد غذایی، جایگاهی مطمئن در بازار صادرات خشکبار پیدا کند. ' +
        'الحاقیه گواهی‌های ISO 22000 و HACCP و انطباق با الزامات استاندارد صادراتی، ' +
        'تضمینی بر کیفیت پایدار محصولات این شرکت است.\n\n' +
        '## گواهینامه‌ها و لوح‌های تقدیر\n\n' +
        '- لوح تقدیر نخستین نمایشگاه شیرینی و شکلات تبریز ۱۴۰۲\n' +
        '- تقدیر از معاونت غذا و داروی دانشگاه علوم پزشکی تبریز\n' +
        '- گواهی عضویت خانه صنعتکاران ایران\n' +
        '- لوح تقدیر موسسه نگهداری کودکان معلول طلیعه\n' +
        '- گواهینامه‌های آموزشی مدیریت و بازاریابی دانشگاه تهران\n\n' +
        '## تعهد به کیفیت\n\n' +
        'هر یک از این گواهینامه‌ها نمایانگر تعهد هفت طلایی به ارائه محصول سالم، استاندارد و باکیفیت به ' +
        'خریداران داخلی و صادراتی است.',
      date_fa: '۱۴۰۳/۰۴/۱۳',
      category: 'news',
      image: '/banner/blog-honors.jpg',
      sort_order: 2,
    },
    {
      slug: 'decrease-in-purchasing-power',
      title_fa: 'کاهش قدرت خرید و افزایش رقابت در بازار خشکبار',
      excerpt_fa:
        'تحلیل چاپ‌شده در مجله درباره کاهش قدرت خرید مصرف‌کننده و راهکارهای هفت طلایی برای پایداری قیمت.',
      content:
        'مطالب چاپ‌شده در مجله پیوست گردید.\n\n' +
        '## وضعیت بازار\n\n' +
        'در شرایط اقتصادی فعلی، کاهش قدرت خرید مصرف‌کننده و افزایش رقابت در بازار خشکبار، ' +
        'شرکت‌های صادراتی را به سمت بهینه‌سازی فرآوری و کنترل هزینه‌های تولید سوق داده است.\n\n' +
        '## راهکار هفت طلایی\n\n' +
        'هفت طلایی با اتکا به ظرفیت تأمین مستقیم از باغستان و حذف واسطه‌ها، ' +
        'توانسته قیمت تمام‌شده را برای خریداران صنعتی پایدار نگه دارد.\n\n' +
        '## نتیجه‌گیری\n\n' +
        'حذف واسطه‌ها، کنترل رطوبت و دانه‌بندی دقیق، سه عامل اصلی حفظ حاشیه سود در شرایط رقابتی هستند. ' +
        'شرکت‌هایی که در این زمینه‌ها سرمایه‌گذاری کنند، می‌توانند حتی در شرایط رکود市场份额 خود را حفظ کنند.',
      date_fa: '۱۴۰۳/۰۴/۰۱',
      category: 'educational',
      image: '/banner/blog-purchasing-power.jpg',
      sort_order: 3,
    },
    {
      slug: 'difference-walnut-grades',
      title_fa: 'تفاوت درجه‌های گردو و معیارهای کیفیت',
      excerpt_fa:
        'آشنایی کامل با درجه‌بندی گردو، معیارهای رنگ، درصد شکستگی و رطوبت برای مصرف صنعتی.',
      content:
        'تفاوت درجه‌های گردو\n\n' +
        '## درجه‌بندی بر اساس رنگ\n\n' +
        'گردو بر اساس رنگ مغز، درصد شکستگی و رطوبت به درجه‌های مختلف تقسیم می‌شود. ' +
        'مغز روشن (Light) با رنگ یکنواخت و درصد شکستگی بالا، بالاترین ارزش صادراتی را دارد و ' +
        'مخصوص صنایع قنادی و شکلات‌سازی است. درجه‌های تیره‌تر برای مصرف داخلی و صنایعی که رنگ مغز ' +
        'در محصول نهایی اهمیت کمتری دارد، مناسب‌تر هستند.\n\n' +
        '## معیارهای کلیدی کیفیت\n\n' +
        '- **رنگ مغز:** روشن‌تر = ارزش بالاتر\n' +
        '- **درصد شکستگی:** حداقل ۹۰٪ برای درجه صادراتی\n' +
        '- **رطوبت:** بین ۴ تا ۶ درصد استاندارد\n' +
        '- **عاری از آلودگی قارچی و حشره‌ای**\n\n' +
        '## اهمیت کنترل رطوبت\n\n' +
        'کنترل رطوبت در طول فرآوری و انبارش، کلید حفظ کیفیت و جلوگیری از رنجیدگی مغز گردو است. ' +
        'انبارهای استاندارد با تهویه مناسب و دمای کنترل‌شده، عمر انباری گردو را تا ۱۲ ماه تمدید می‌کنند.',
      date_fa: '۱۴۰۱/۰۶/۱۴',
      category: 'educational',
      image: '/banner/product-nuts-assortment.jpg',
      sort_order: 4,
    },
    {
      slug: 'pistachio-health-benefits',
      title_fa: 'خواص درمانی و غذایی پسته: طلای سبز ایران',
      excerpt_fa:
        'بررسی کامل خواص پسته برای سلامت قلب، کنترل وزن، دیابت و سیستم ایمنی بدن.',
      content:
        'خواص درمانی و غذایی پسته\n\n' +
        'پسته به عنوان یکی از مغذی‌ترین آجیل‌ها، از دیرباز در طب سنتی و تغذیه مدرن جایگاه ویژه‌ای داشته است.\n\n' +
        '## ترکیبات مغذی\n\n' +
        'هر ۱۰۰ گرم پسته حاوی حدود ۲۰ گرم پروتئین، ۴۵ گرم چربی سالم، ۱۰ گرم فیبر و مقادیر قابل‌توجهی ' +
        'از ویتامین B6، پتاسیم، منیزیم و آنتی‌اکسیدان‌هاست.\n\n' +
        '## خواص برای سلامت\n\n' +
        '- **سلامت قلب:** چربی‌های غیراشباع پسته به کاهش کلسترول LDL و افزایش HDL کمک می‌کند\n' +
        '- **کنترل وزن:** فیبر و پروتئین بالا باعث احساس سیری طولانی‌مدت می‌شود\n' +
        '- **کنترل قند خون:** شاخص گلیسمی پایین پسته آن را برای دیابتی‌ها مناسب می‌سازد\n' +
        '- **سیستم ایمنی:** ویتامین B6 و روی موجود در پسته از تقویت سیستم ایمنی پشتیبانی می‌کنند\n' +
        '- **سلامت چشم:** لوتئین و زئاکسانتین موجود در پسته از شبکیه چشم محافظت می‌کنند\n\n' +
        '## مصرف صنعتی\n\n' +
        'علاوه بر مصرف مستقیم، پودر و خلال پسته در صنایع شکلات، بستنی و قنادی به عنوان منبع طعم و رنگ ' +
        'طبیعی کاربرد گسترده‌ای دارد.',
      date_fa: '۱۴۰۲/۱۲/۲۰',
      category: 'health',
      image: '/banner/pistachio-bowl-green.jpg',
      sort_order: 5,
    },
    {
      slug: 'hazelnut-processing-industrial',
      title_fa: 'فرآوری صنعتی فندق: از باغ تا کارخانه',
      excerpt_fa:
        'سفر کامل فندق از برداشت در باغستان‌های قزوین تا خط فرآوری و بسته‌بندی صنعتی.',
      content:
        'فرآوری صنعتی فندق\n\n' +
        'فندق یکی از مهم‌ترین محصولات باغی استان قزوین است که فرآوری اصولی آن تعیین‌کننده کیفیت نهایی محصول است.\n\n' +
        '## مرحله ۱: برداشت و خشک‌کردن\n\n' +
        'برداشت فندق در اواخر تابستان انجام می‌شود. پس از برداشت، فندق باید در دمای ۳۰–۳۵ درجه سانتی‌گراد ' +
        'و با تهویه مناسب خشک شود تا رطوبت آن به زیر ۸ درصد برسد.\n\n' +
        '## مرحله ۲: غربالگری و دانه‌بندی\n\n' +
        'فندق خشک‌شده بر اساس سایز به دسته‌های ۱۱، ۱۳–۱۱ و ۱۰–۱۳ میلی‌متر تفکیک می‌شود. ' +
        'این دانه‌بندی با دستگاه‌های غربال خودکار انجام می‌گیرد.\n\n' +
        '## مرحله ۳: شکستن و جداسازی پوست\n\n' +
        'فندق‌ها با دستگاه کرکر صنعتی شکسته شده و مغز از پوست جدا می‌شود. ' +
        'درصد شکستگی کامل و عاری بودن از پوست‌ریزه، معیار اصلی کیفیت در این مرحله است.\n\n' +
        '## مرحله ۴: رست و فرآوری ثانویه\n\n' +
        'مغز فندق می‌تواند به صورت خام، رست (سفید)، گرانول، پودر یا خمیر فرآوری شود. ' +
        'هر یک از این فرآورده‌ها کاربرد صنعتی متفاوتی در شکلات‌سازی، قنادی و بستنی‌سازی دارند.\n\n' +
        '## مرحله ۵: بسته‌بندی و کنترل کیفی\n\n' +
        'محصول نهایی پس از کنترل آلودگی و رطوبت، در بسته‌های ۸، ۱۰، ۴۰ و ۵۰ کیلوگرمی بسته‌بندی شده ' +
        'و آماده صادرات یا عرضه به صنایع داخلی می‌شود.',
      date_fa: '۱۴۰۲/۰۹/۱۵',
      category: 'industry',
      image: '/banner/hazelnut-spoon.jpg',
      sort_order: 6,
    },
    {
      slug: 'export-standards-dried-fruits',
      title_fa: 'استانداردهای صادرات خشکبار ایران',
      excerpt_fa:
        'آشنایی با الزامات استاندارد، گواهینامه‌ها و مدارک لازم برای صادرات خشکبار به بازارهای جهانی.',
      content:
        'استانداردهای صادرات خشکبار ایران\n\n' +
        'صادرات خشکبار به بازارهای جهانی نیازمند رعایت مجموعه‌ای از استانداردها و گواهینامه‌های بین‌المللی است.\n\n' +
        '## گواهینامه‌های ضروری\n\n' +
        '- **ISO 22000:** سیستم مدیریت ایمنی مواد غذایی\n' +
        '- **HACCP:** تحلیل خطر و نقاط کنترل بحرانی\n' +
        '- **Halal:** گواهی حلال برای بازارهای اسلامی\n' +
        '- **Phytosanitary Certificate:** گواهی بهداشت گیاهی برای ورود به کشور مقصد\n' +
        '- **Certificate of Origin:** گواهی مبدأ کالا\n\n' +
        '## کنترل آفلاتوکسین\n\n' +
        'یکی از مهم‌ترین چالش‌های صادرات پسته و خشکبار، کنترل سطح آفلاتوکسین است. ' +
        'اتحادیه اروپا حد مجاز آفلاتوکسین B1 را ۸ نانوگرم بر کیلوگرم و کل آفلاتوکسین را ۱۰ نانوگرم بر کیلوگرم تعیین کرده است.\n\n' +
        '## بسته‌بندی صادراتی\n\n' +
        'بسته‌بندی صادراتی باید از رطوبت، نور و آلودگی محافظت کند. استفاده از کیسه‌های پلی‌اتیلن ' +
        'دوگانه و کارتن‌های مقوایی استاندارد، الزامی است.\n\n' +
        '## نقش هفت طلایی\n\n' +
        'هفت طلایی با داشتن خط کنترل کیفی آزمایشگاهی و رعایت تمامی استانداردهای فوق، ' +
        'محصولات خود را با اطمینان کامل به کشورهای حاشیه خلیج فارس، اروپا و آسیای شرقی صادر می‌کند.',
      date_fa: '۱۴۰۳/۰۱/۲۵',
      category: 'export',
      image: '/banner/img-6052.jpg',
      sort_order: 7,
    },
    {
      slug: 'choosing-quality-pistachio-kernel',
      title_fa: 'راهنمای انتخاب مغز پسته باکیفیت',
      excerpt_fa:
        'معیارهای کلیدی انتخاب مغز پسته مرغوب: رنگ، سایز، طعم، رطوبت و عاری بودن از آلودگی.',
      content:
        'راهنمای انتخاب مغز پسته باکیفیت\n\n' +
        'انتخاب مغز پسته مناسب برای صنایع شکلات و قنادی، تأثیر مستقیمی بر کیفیت محصول نهایی دارد.\n\n' +
        '## معیارهای کیفیت مغز پسته\n\n' +
        '- **رنگ سبز:** هرچه سبز روشن‌تر، ارزش بالاتر. رنگ سبز مطلوب قزوین در صنایع شکلات و بستنی پرطرفدار است\n' +
        '- **سایز دانه:** سایزهای بزرگ‌تر (۱۸–۲۰ میلی‌متر) برای مصرف مستقیم و سایزهای کوچک‌تر برای خلال و پودر مناسب‌ترند\n' +
        '- **درصد شکستگی:** حداقل ۹۵٪ برای درجه صادراتی\n' +
        '- **رطوبت:** ۴ تا ۶ درصد، رطوبت بالاتر باعث کپک و رنجیدگی می‌شود\n' +
        '- **عاری از آفلاتوکسین:** باید زیر حد مجاز بین‌المللی باشد\n\n' +
        '## تفاوت پسته قزوین و کرمان\n\n' +
        'پسته قزوین به دلیل رنگ سبز روشن‌تر و طعم ملایم‌تر، برای صنایع شکلات و بستنی ارجحیت دارد. ' +
        'پسته کرمان با طعم قوی‌تر و دانه درشت‌تر، بیشتر برای مصرف مستقیم و آجیل مناسب است.\n\n' +
        '## نگهداری\n\n' +
        'مغز پسته باید در جای خشک، خنک و تاریک نگهداری شود. استفاده از بسته‌بندی خلاء ' +
        'عمر انباری را تا ۱۸ ماه افزایش می‌دهد.',
      date_fa: '۱۴۰۲/۱۱/۰۸',
      category: 'educational',
      image: '/banner/pistachio-kernels.jpg',
      sort_order: 8,
    },
    {
      slug: 'almond-slices-in-confectionery',
      title_fa: 'کاربرد خلال و پرک بادام در صنایع قنادی',
      excerpt_fa:
        'بررسی کاربرد خلال، پرک و پودر بادام در تولید شکلات، کیک، سوهان و سایر فرآورده‌های قنادی.',
      content:
        'کاربرد خلال و پرک بادام در صنایع قنادی\n\n' +
        'بادام یکی از پرکاربردترین مواد اولیه در صنایع قنادی و شکلات‌سازی است.\n\n' +
        '## انواع فرآورده بادام در قنادی\n\n' +
        '- **خلال بادام:** برش‌های نازک برای تزیین کیک، شیرینی و دسر\n' +
        '- **پرک بادام:** چهار قسمت شده هر مغز، با ظاهر شکیل برای روکش شکلات و سوهان\n' +
        '- **پودر بادام:** پایه اصلی کیک‌های بدون گلوتن و ماسکارپون\n' +
        '- **مغز کامل:** برای مصرف در آجیل و شکلات‌های درشت‌دانه\n\n' +
        '## مزیت پرک بادام\n\n' +
        'پرک بادام به دلیل شکل پهن و توزیع یکنواخت، بهترین گزینه برای روکش شکلات‌های artisan و ' +
        'سوهان قم است. رنگ طلایی پس از رست، جذابیت بصری محصول نهایی را افزایش می‌دهد.\n\n' +
        '## استاندارد رطوبت و روغن\n\n' +
        'در صنایع شکلات، رطوبت بادام باید زیر ۴ درصد باشد تا از شکوفه‌زدگی (Bloom) شکلات جلوگیری شود. ' +
        'همچنین درصد روغن بادام درختی (حدود ۵۰٪) باید در محاسبه فرمولاسیون شکلات لحاظ گردد.\n\n' +
        '## تأمین هفت طلایی\n\n' +
        'هفت طلایی خلال و پرک بادام را با رطوبت کنترل‌شده و در بسته‌های ۸ و ۱۸ کیلوگرمی ' +
        'مخصوص صنایع قنادی عرضه می‌کند.',
      date_fa: '۱۴۰۳/۰۲/۱۰',
      category: 'industry',
      image: '/banner/tray-pistachio-almond.jpg',
      sort_order: 9,
    },
    {
      slug: 'moisture-control-dried-nuts-storage',
      title_fa: 'اهمیت کنترل رطوبت در انبارش خشکبار',
      excerpt_fa:
        'راهنمای تخصصی کنترل رطوبت، دما و تهویه در انبارش پسته، فندق و بادام برای حفظ کیفیت.',
      content:
        'اهمیت کنترل رطوبت در انبارش خشکبار\n\n' +
        'رطوبت مهم‌ترین عامل مؤثر بر کیفیت و عمر انباری خشکبار است.\n\n' +
        '## رطوبت بهینه هر محصول\n\n' +
        '| محصول | رطوبت بهینه | حداکثر مجاز |\n' +
        '|-------|-------------|-------------|\n' +
        '| پسته خام | ۵–۷٪ | ۸٪ |\n' +
        '| مغز پسته | ۴–۵٪ | ۶٪ |\n' +
        '| مغز فندق | ۴–۶٪ | ۷٪ |\n' +
        '| مغز بادام | ۳–۵٪ | ۶٪ |\n\n' +
        '## خطرات رطوبت بالا\n\n' +
        '- رشد قارچ و کپک\n' +
        '- تولید آفلاتوکسین\n' +
        '- رنجیدگی و تغییر رنگ\n' +
        '- کاهش ارزش صادراتی\n' +
        '- تسریع فساد چربی‌ها (رانسید شدن)\n\n' +
        '## راهکارهای کنترل\n\n' +
        '- استفاده از دسیکانت در بسته‌بندی‌های کوچک\n' +
        '- نگهداری در دمای زیر ۱۵ درجه سانتی‌گراد\n' +
        '- تهویه مناسب و کنترل رطوبت نسبی زیر ۶۰٪\n' +
        '- بازرسی دوره‌ای و سنجش رطوبت با رطوبت‌سنج دیجیتال\n' +
        '- بسته‌بندی خلاء برای انبارش طولانی‌مدت\n\n' +
        'هفت طلایی در خط فرآوری خود از دستگاه‌های سنجش رطوبت آنلاین استفاده می‌کند تا ' +
        'هر محموله پیش از بسته‌بندی، در محدوده رطوبت استاندارد باشد.',
      date_fa: '۱۴۰۲/۱۰/۲۲',
      category: 'educational',
      image: '/banner/hero-nuts-bowl.jpg',
      sort_order: 10,
    },
    {
      slug: 'pistachio-export-global-markets',
      title_fa: 'صادرات پسته ایرانی به بازارهای جهانی',
      excerpt_fa:
        'بررسی بازارهای هدف صادرات پسته ایران، چالش‌ها و فرصت‌های پیش روی صادرکنندگان.',
      content:
        'صادرات پسته ایرانی به بازارهای جهانی\n\n' +
        'ایران بزرگ‌ترین تولیدکننده پسته در جهان است و صادرات پسته یکی از ارزآورترین بخش‌های کشاورزی کشور محسوب می‌شود.\n\n' +
        '## بازارهای هدف اصلی\n\n' +
        '- **اتحادیه اروپا:** آلمان، ایتالیا، اسپانیا — تقاضای بالا برای پسته خام و مغز\n' +
        '- **حاشیه خلیج فارس:** امارات، عربستان، قطر — مصرف بالای آجیل و خشکبار\n' +
        '- **آسیای شرقی:** چین، ژاپن، کره جنوبی — بازار در حال رشد برای پسته باکیفیت\n' +
        '- **روسیه:** مصرف‌کننده بزرگ پسته خام و مغز\n\n' +
        '## چالش‌های صادرات\n\n' +
        '- محدودیت‌های آفلاتوکسین در بازارهای اروپایی\n' +
        '- نوسانات نرخ ارز و تأثیر آن بر قیمت رقابتی\n' +
        '- رقابت با پسته کالیفرنیا و آمریکایی\n' +
        '- مشکلات نقل و انتقال و تحریم‌های بانکی\n\n' +
        '## فرصت‌ها\n\n' +
        'روند رو به رشد تقاضای جهانی برای محصولات ارگانیک و طبیعی، فرصتی بزرگ برای صادرکنندگان ایرانی است. ' +
        'همچنین توسعه فرآوری ثانویه (خلال، پودر، خمیر) ارزش افزوده محصول را به‌طور قابل‌توجهی افزایش می‌دهد.\n\n' +
        '## نقش هفت طلایی\n\n' +
        'هفت طلایی با تمرکز بر صادرات فرآورده‌های ارزش‌افزوده پسته (خلال، پودر، خمیر) به جای صادرات خام، ' +
        'حاشیه سود را برای خود و خریداران صنعتی بهینه کرده است.',
      date_fa: '۱۴۰۳/۰۳/۰۵',
      category: 'export',
      image: '/banner/pistachio-dishes-teal.jpg',
      sort_order: 11,
    },
    {
      slug: 'hazelnut-paste-chocolate-artisans',
      title_fa: 'خمیر فندق: پایه طعم شکلات‌های آرتیزان',
      excerpt_fa:
        'نقش خمیر فندق در تولید شکلات‌های artisan، پرالین و نوقا و استانداردهای تأمین صنعتی.',
      content:
        'خمیر فندق: پایه طعم شکلات‌های آرتیزان\n\n' +
        'خمیر فندق یکی از مهم‌ترین مواد اولیه در صنعت شکلات‌سازی مدرن است که طعم، بافت و ارزش غذایی ' +
        'محصول نهایی را به‌طور چشمگیری ارتقا می‌دهد.\n\n' +
        '## کاربردهای خمیر فندق\n\n' +
        '- **پرالین (Praliné):** مخلوط خمیر فندق و شکلات، پایه پرلایه شکلات‌های artisan\n' +
        '- **نوقا (Nougat):** ترکیب خمیر فندق با عسل و سفیده تخم‌مرغ\n' +
        '- **کرم فندق (Gianduja):** مخلوط خمیر فندق، کاکائو و شکر\n' +
        '- **بستنی و دسر:** پایه طعم فندق در بستنی‌های پریمیوم\n' +
        '- **بیسکویت و ویفر:** پرکننده طعم‌دار\n\n' +
        '## استانداردهای خمیر فندق صنعتی\n\n' +
        '- **روغن آزاد:** حداقل ۶۰٪ برای بافت روان و قابل پمپاژ\n' +
        '- **اندازه ذره:** کمتر از ۳۰ میکرون برای حس دهانی نرم\n' +
        '- **رطوبت:** زیر ۲٪ برای جلوگیری از رشد میکروبی و شکوفه‌زدگی شکلات\n' +
        '- **طعم رست:** یکنواخت و بدون طعم سوختگی\n\n' +
        '## تولید هفت طلایی\n\n' +
        'هفت طلایی خمیر فندق را از مغز فندق رست قزوین با کنترل دقیق دمای آسیاب و رطوبت تولید می‌کند. ' +
        'بسته‌بندی در بسته‌های ۸ کیلوگرمی با پوشش نیتروژن، تازه‌مندی و طعم محصول را تا ۱۲ ماه تضمین می‌کند.\n\n' +
        '## نکته فرمولاسیون\n\n' +
        'در فرمولاسیون شکلات، خمیر فندق بخشی از چربی کل را تأمین می‌کند. ' +
        'کاهش کره کاکائو به نسبت روغن فندق، می‌تواند هزینه تمام‌شده را بدون افت کیفیت کاهش دهد.',
      date_fa: '۱۴۰۳/۰۵/۱۸',
      category: 'industry',
      image: '/banner/hazelnut-bowl.jpg',
      sort_order: 12,
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

  // ── Awards / Certificates ──────────────────────────────────────
  const awardData: AwardSeed[] = [
    {
      key: 'award-01-tabriz-exhibition',
      title_fa: 'حضور در نخستین نمایشگاه شیرینی و شکلات تبریز ۱۴۰۲',
      desc_fa: 'لوح تقدیر از معاونت غذا و داروی دانشگاه علوم پزشکی تبریز به پاس مشارکت در نخستین نمایشگاه صنایع شیرینی، شکلات و بیسکوییت.',
      image: '/awards/award-01-tabriz-exhibition.jpg',
      sort_order: 1,
    },
    {
      key: 'award-02-qazvin-appreciation',
      title_fa: 'لوح تقدیر نمایشگاه فروش بهاره و ضیافت رمضان ۱۴۰۳',
      desc_fa: 'تقدیر از شرکت نمایشگاه‌های بین‌المللی استان قزوین به دلیل حضور مؤثر و پررنگ در نمایشگاه فروش بهاره و ضیافت رمضان.',
      image: '/awards/award-02-qazvin-appreciation.jpg',
      sort_order: 2,
    },
    {
      key: 'award-03-tabriz-university',
      title_fa: 'دومین نمایشگاه تولیدات شیرینی و شکلات تبریز ۱۴۰۲',
      desc_fa: 'تقدیر از معاونت غذا و داروی دانشگاه علوم پزشکی تبریز برای مشارکت صمیمانه هفت طلایی در دومین نمایشگاه تولیدات شیرینی و شکلات.',
      image: '/awards/award-03-tabriz-university.jpg',
      sort_order: 3,
    },
    {
      key: 'award-04-training-ut',
      title_fa: 'کارگاه آموزشی کوچینگ و توسعه فردی مدیران — دانشگاه تهران',
      desc_fa: 'گواهی پایان کارگاه «کوچینگ و توسعه فردی مدیران» برگزار شده در دانشگاه تهران.',
      image: '/awards/award-04-training-ut.jpg',
      sort_order: 4,
    },
    {
      key: 'award-05-coaching-ut',
      title_fa: 'کارگاه آموزشی استراتژی‌های نوین بازاریابی — دانشگاه تهران',
      desc_fa: 'گواهی پایان کارگاه «استراتژی‌های نوین بازاریابی» با تدریس استاد ایمان ابهشم‌چی در دانشگاه تهران.',
      image: '/awards/award-05-coaching-ut.jpg',
      sort_order: 5,
    },
    {
      key: 'award-06-membership',
      title_fa: 'گواهی عضویت خانه صنعتکاران ایران',
      desc_fa: 'گواهی عضویت شرکت خشکبار هفت طلایی در خانه صنعتکاران ایران با شناسه ملی ۱۴۰۰۹۴۹۱۰۱۳.',
      image: '/awards/award-06-membership.jpg',
      sort_order: 6,
    },
    {
      key: 'award-07-talieh-charity',
      title_fa: 'لوح تقدیر موسسه نگهداری کودکان معلول طلیعه',
      desc_fa: 'تقدیر از خیریه و حمایت‌های خیرخواهانه شرکت هفت طلایی از مرکز نگهداری کودکان معلول طلیعه.',
      image: '/awards/award-07-talieh-charity.jpg',
      sort_order: 7,
    },
    {
      key: 'award-08-certificate-training',
      title_fa: 'گواهینامه آموزشی الگوهای نوین مدیریت کسب‌وکار — ICB',
      desc_fa: 'گواهی شرکت در کنفرانس ملی و بین‌المللی الگوهای نوین مدیریت کسب‌وکار (دانشکده مدیریت دانشگاه تهران) صادر شده توسط هیئت بین‌المللی گواهینامه ICB.',
      image: '/awards/award-08-certificate-training.jpg',
      sort_order: 8,
    },
    {
      key: 'award-09-marketing-ut',
      title_fa: 'کارگاه استراتژی‌های نوین بازاریابی — دانشگاه تهران',
      desc_fa: 'گواهی موفقیت در کارگاه «استراتژی‌های نوین بازاریابی» برگزار شده در دانشگاه تهران.',
      image: '/awards/award-09-marketing-ut.jpg',
      sort_order: 9,
    },
    {
      key: 'award-10-tech-ut',
      title_fa: 'کارگاه پایش تأثیر ضربه آرام — دانشگاه تهران',
      desc_fa: 'گواهی پایان کارگاه «پایش تأثیر ضربه آرام و گسسته نیروی اتاق» با تدریس دکتر مهدی باغبان در دانشگاه تهران.',
      image: '/awards/award-10-tech-ut.jpg',
      sort_order: 10,
    },
  ];

  // Remove old placeholder awards not in the real catalog.
  const awardKeys = awardData.map((a) => a.key);
  await prisma.award.deleteMany({
    where: { id: { notIn: awardKeys } },
  });

  for (const a of awardData) {
    const data = {
      title_fa: a.title_fa,
      desc_fa: a.desc_fa,
      image: a.image,
      sort_order: a.sort_order,
      published: true,
    };
    await prisma.award.upsert({
      where: { id: a.key },
      update: data,
      create: { id: a.key, ...data },
    });
  }

  // ── Testimonials ───────────────────────────────────────────────
  // Sync the curated buyer testimonials so the seed always converges to the
  // real collection, even if an earlier placeholder was inserted.
  const tSeeds: any[] = [
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
    {
      name_fa: 'هلدینگ خواروبار پارس',
      role_fa: 'تأمین‌کننده زنجیره صنعتی',
      text_fa:
        'تأمین مستمر مغز فندق با دانه‌بندی دقیق و کنترل آلودگی، خطوط تولید ما را بدون توقف نگه داشته است.',
      rating: 5,
      sort_order: 4,
    },
    {
      name_fa: 'گروه صنایع غذایی سرو',
      role_fa: 'خریدار خارجی (امارات)',
      text_fa:
        'تحویل به‌موقع محموله‌های خلال پسته به بندر جبل‌علی و کیفیت یکنواخت، هفت طلایی را به تأمین‌کننده اصلی ما تبدیل کرده است.',
      rating: 5,
      sort_order: 5,
    },
  ];

  for (const t of tSeeds) {
    const existing = await prisma.testimonial.findFirst({ where: { name_fa: t.name_fa } });
    if (!existing) {
      await prisma.testimonial.create({ data: { ...t, published: true } });
    }
  }
  // Drop any stray placeholder testimonial so buyers only see real partners.
  await prisma.testimonial.deleteMany({
    where: { name_fa: { notIn: tSeeds.map((t) => t.name_fa) } },
  });
  // Re-sequence sort_order to match the curated list.
  let order = 1;
  for (const t of tSeeds) {
    await prisma.testimonial.updateMany({
      where: { name_fa: t.name_fa },
      data: { sort_order: order },
    });
    order += 1;
  }

  console.log('Seed done. Admin: admin@7golden.co / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
