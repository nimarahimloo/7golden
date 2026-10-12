import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const UNVERIFIED_LEGACY_BLOG_SLUGS = [
  "sweets-and-chocolates-1402",
  "our-honors",
  "decrease-in-purchasing-power",
  "difference-walnut-grades",
  "pistachio-health-benefits",
  "hazelnut-processing-industrial",
  "export-standards-dried-fruits",
  "choosing-quality-pistachio-kernel",
  "almond-slices-in-confectionery",
  "moisture-control-dried-nuts-storage",
  "pistachio-export-global-markets",
  "hazelnut-paste-chocolate-artisans"
];
const UNVERIFIED_TESTIMONIAL_NAMES = [
  "بستنی گلستان",
  "قنادی برتر",
  "شکلات‌سازی آریا",
  "هلدینگ خواروبار پارس",
  "گروه صنایع غذایی سرو"
];

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

  // ── Site Settings: initialize defaults once; preserve all later CMS edits ──
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        site_name_fa: 'هفت طلایی',
        site_mode: 'corporate',
        default_seo_title_fa: 'هفت طلایی — فرآوری فندق، پسته و بادام',
        default_seo_desc_fa:
          'شرکت خشکبار و بسته‌بندی هفت طلایی در قزوین، فعال در فرآوری فندق، پسته و بادام برای صنایع شکلات، قنادی و بستنی.',
        contact_phone: '028-33234004',
        contact_mobile: '0912-1823438',
        contact_email: 'info@7golden.co',
        hq_address_fa: 'قزوین، انتهای سعدی جنوبی، نرسیده به چهارراه بازار، پلاک ۲۱۰ — روبروی بانک کشاورزی',
        tehran_address_fa: 'قزوین، شهرک صنعتی کاسپین ۲، نبش کوشش ۲ (کارخانه)',
        working_hours_fa: 'برای اطلاع از ساعات پاسخگویی، با دفتر مجموعه تماس بگیرید.',
      },
    });
  }

  // ── Categories ─────────────────────────────────────────────────
  const catData = [
    {
      slug: 'pistachio',
      name_fa: 'پسته',
      desc_fa:
        'محصولات پسته شامل مغز، مغز پوست‌کنده، خلال و پودر برای استفاده در شکلات، قنادی، بستنی و دیگر فرآورده‌های غذایی است.',
      image: '/product/pistachio-category.webp',
      sort_order: 1,
    },
    {
      slug: 'almond',
      name_fa: 'بادام',
      desc_fa:
        'محصولات بادام شامل مغز، خلال و پرک برای کاربردهایی مانند قنادی، کیک، شکلات و دیگر فرآورده‌های غذایی است.',
      image: '/product/almond-category.webp',
      sort_order: 2,
    },
    {
      slug: 'hazelnut',
      name_fa: 'فندق',
      desc_fa:
        'محصولات فندق شامل مغز خام و برشته، خمیر، گرانول و پودر فندق برای استفاده در شکلات، کرم فندق، کیک و بستنی است.',
      image: '/product/hazelnut-category.webp',
      sort_order: 3,
    },
  ];
  for (const c of catData) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  // ── Products (real 7golden catalog, 20 items) ──────────────────
  // Image paths reference files in /public/product. Where the original
  // WordPress image was available it is used; otherwise a matching local
  // asset from the same product family is used.
  const prodData: ProductSeed[] = [
    // —— پسته (۷) مطابق کاتالوگ PDF / 7golden.co ——
    {
      slug: 'qazvin-peeled-pistachio',
      name_fa: 'مغز پسته پوست‌کنده قزوین',
      category: 'pistachio',
      origin_fa: 'قزوین',
      price: 0,
      image: '/product/qazvini-peeled-pistachio-nuts-7goldenco.webp',
      gallery: ['/product/qazvini-peeled-pistachio-nuts-7goldenco.webp'],
      featured: true,
      sort_order: 1,
      desc_fa:
        'مغز پسته پوست‌کنده قزوین برای استفاده در شکلات، قنادی، بستنی و دیگر فرآورده‌های غذایی عرضه می‌شود.',
    },
    {
      slug: 'qazvin-pistachio-kernels',
      name_fa: 'مغز پسته قزوین',
      category: 'pistachio',
      origin_fa: 'قزوین',
      price: 0,
      image: '/product/Qazvin-pistachio-nuts-7goldenco.webp',
      gallery: ['/product/Qazvin-pistachio-nuts-7goldenco.webp'],
      featured: true,
      sort_order: 2,
      desc_fa:
        'مغز پسته قزوین با رنگ سبز مطلوب در تهیه باقلوا، حلوا ارده، شکلات، بستنی و دیگر محصولات غذایی کاربرد دارد.',
    },
    {
      slug: 'raw-pistachio',
      name_fa: 'پسته خام',
      category: 'pistachio',
      origin_fa: 'قزوین',
      price: 0,
      image: '/product/qazvin-pistachio-nuts.webp',
      gallery: ['/product/qazvin-pistachio-nuts.webp'],
      featured: true,
      sort_order: 3,
      desc_fa:
        'پسته خام از محصولات پایه برای آماده‌سازی مغز، خلال و پودر پسته در فرآوری خشکبار است.',
    },
    {
      slug: 'kerman-pistachio-slices',
      name_fa: 'خلال پسته کرمان',
      category: 'pistachio',
      origin_fa: 'کرمان',
      price: 0,
      image: '/product/pistachio-slices.webp',
      gallery: ['/product/pistachio-slices.webp'],
      featured: true,
      sort_order: 4,
      desc_fa:
        'خلال پسته کرمان با برش یکنواخت؛ مناسب شیرینی‌پزی، شکلات‌سازی، تزئین محصولات و صنایع وابسته.',
    },
    {
      slug: 'pistachio-powder',
      name_fa: 'پودر پسته',
      category: 'pistachio',
      origin_fa: 'ایران',
      price: 0,
      image: '/product/peeled-pistachio.webp',
      gallery: ['/product/peeled-pistachio.webp'],
      featured: true,
      sort_order: 5,
      desc_fa:
        'پودر پسته با رنگ و بافت یکنواخت برای قنادی، بستنی، شکلات‌سازی و فرآورده‌های وابسته.',
    },
    {
      slug: 'qazvin-pistachio-slices',
      name_fa: 'خلال پسته قزوین',
      category: 'pistachio',
      origin_fa: 'قزوین',
      price: 0,
      image: '/product/khelal-qazvin-slice-7golden.webp',
      gallery: ['/product/khelal-qazvin-slice-7golden.webp'],
      featured: true,
      sort_order: 6,
      desc_fa:
        'خلال پسته قزوین برای استفاده در بستنی، شکلات، قنادی و حلوا ارده عرضه می‌شود.',
    },
    {
      slug: 'pistachio-shells',
      name_fa: 'پوست پسته',
      category: 'pistachio',
      origin_fa: 'ایران',
      price: 0,
      image: '/product/pistachio-cat.webp',
      gallery: ['/product/pistachio-cat.webp'],
      featured: false,
      sort_order: 7,
      desc_fa:
        'پوست پسته به‌عنوان محصول جانبی فرآوری هفت‌طلایی؛ قابل استفاده در مصارف صنعتی و کشاورزی.',
    },

    // —— فندق (۷) ——
    {
      slug: 'openshell-hazelnut',
      name_fa: 'فندق خندان',
      category: 'hazelnut',
      origin_fa: 'قزوین',
      price: 0,
      image: '/product/smiling-hazelnut-7golden.webp',
      gallery: ['/product/smiling-hazelnut-7golden.webp'],
      featured: true,
      sort_order: 1,
      desc_fa:
        'فندق خندان یا ترک‌خورده که به‌صورت خام و بو‌داده تولید و فرآوری می‌شود. فندق خندان ایرانی به‌دلیل شرایط اقلیمی از نظر طعم متمایز است؛ مناطق کیفی شامل اشنویه، الموت قزوین و اشکورات.',
    },
    {
      slug: 'roasted-hazelnut-kernels',
      name_fa: 'مغز فندق رست',
      category: 'hazelnut',
      origin_fa: 'قزوین',
      price: 0,
      image: '/product/Roasted-hazelnut-brain-7goldenco.webp',
      gallery: ['/product/Roasted-hazelnut-brain-7goldenco.webp'],
      featured: true,
      sort_order: 2,
      desc_fa:
        'مغز فندق رست‌شده برای صنایع شکلات و قنادی؛ طعم و عطر پایدار و دانه‌بندی یکنواخت برای خطوط تولید صنعتی.',
    },
    {
      slug: 'raw-hazelnut-kernels',
      name_fa: 'مغز فندق خام',
      category: 'hazelnut',
      origin_fa: 'قزوین',
      price: 0,
      image: '/product/brain-hazelnut-7golden.webp',
      gallery: ['/product/brain-hazelnut-7golden.webp'],
      featured: true,
      sort_order: 3,
      desc_fa:
        'مغز فندق خام برای استفاده در شکلات، کرم فندق، قنادی و دیگر فرآورده‌های غذایی عرضه می‌شود.',
    },
    {
      slug: 'hazelnut-paste',
      name_fa: 'خمیر فندق',
      category: 'hazelnut',
      origin_fa: 'ایران',
      price: 0,
      image: '/product/Hazelnut-paste-7golden.webp',
      gallery: ['/product/Hazelnut-paste-7golden.webp'],
      featured: true,
      sort_order: 4,
      desc_fa:
        'خمیر فندق با بافت یکنواخت و درصد مغز بالا؛ مناسب شکلات‌سازی، کرم‌ها و صنایع قنادی.',
    },
    {
      slug: 'hazelnut-powder',
      name_fa: 'پودر فندق',
      category: 'hazelnut',
      origin_fa: 'ایران',
      price: 0,
      image: '/product/roasted-hazelnut.webp',
      gallery: ['/product/roasted-hazelnut.webp'],
      featured: true,
      sort_order: 5,
      desc_fa:
        'پودر فندق آسیاب‌شده برای کیک، شیرینی، شکلات و فرآورده‌های آردی.',
    },
    {
      slug: 'hazelnut-granules',
      name_fa: 'گرانول فندق',
      category: 'hazelnut',
      origin_fa: 'ایران',
      price: 0,
      image: '/product/brain-hazelnut.webp',
      gallery: ['/product/brain-hazelnut.webp'],
      featured: true,
      sort_order: 6,
      desc_fa:
        'گرانول فندق با اندازه ذرات یکنواخت؛ مناسب تزئین و ترکیب در شکلات، بستنی و محصولات قنادی.',
    },
    {
      slug: 'hazelnut-shells',
      name_fa: 'پوست فندق',
      category: 'hazelnut',
      origin_fa: 'ایران',
      price: 0,
      image: '/product/hazelnut-cat.webp',
      gallery: ['/product/hazelnut-cat.webp'],
      featured: false,
      sort_order: 7,
      desc_fa:
        'پوست فندق محصول جانبی فرآوری؛ مناسب مصارف صنعتی.',
    },

    // —— بادام (۶) ——
    {
      slug: 'almond-flakes',
      name_fa: 'پرگ بادام درختی',
      category: 'almond',
      origin_fa: 'ایران',
      price: 0,
      image: '/product/almond-flakes-7golden.webp',
      gallery: ['/product/almond-flakes-7golden.webp'],
      featured: true,
      sort_order: 1,
      desc_fa:
        'پرگ (پرک) بادام درختی با ظاهر شکیل؛ مناسب شکلات‌سازی، حلوا شکری، سوهان، بستنی و قنادی.',
    },
    {
      slug: 'almond-slices',
      name_fa: 'خلال بادام درختی',
      category: 'almond',
      origin_fa: 'ایران',
      price: 0,
      image: '/product/almond-flakes.webp',
      gallery: ['/product/almond-flakes.webp'],
      featured: true,
      sort_order: 2,
      desc_fa:
        'خلال بادام درختی برای تزئین و مصرف صنعتی در شیرینی، کیک و شکلات.',
    },
    {
      slug: 'almond-kernels',
      name_fa: 'مغز بادام درختی',
      category: 'almond',
      origin_fa: 'ایران',
      price: 0,
      image: '/product/almond-flakes-7golden.webp',
      gallery: ['/product/almond-flakes-7golden.webp'],
      featured: true,
      sort_order: 3,
      desc_fa:
        'مغز بادام درختی کامل برای فرآوری خلال، پرگ، پودر و مصرف مستقیم در صنایع غذایی.',
    },
    {
      slug: 'peanut-kernels',
      name_fa: 'مغز بادام زمینی',
      category: 'almond',
      origin_fa: 'ایران',
      price: 0,
      image: '/product/sliced-peanuts.webp',
      gallery: ['/product/sliced-peanuts.webp'],
      featured: true,
      sort_order: 4,
      desc_fa:
        'مغز بادام زمینی بدون پوست؛ مناسب خلال‌سازی، شیرینی، شکلات و تنقلات. ارزش غذایی بالا و منبع پروتئین.',
    },
    {
      slug: 'peanut-slices',
      name_fa: 'خلال بادام زمینی',
      category: 'almond',
      origin_fa: 'ایران',
      price: 0,
      image: '/product/sliced-peanuts-7golden.webp',
      gallery: ['/product/sliced-peanuts-7golden.webp'],
      featured: true,
      sort_order: 5,
      desc_fa:
        'خلال بادام زمینی برای صنایع شیرینی‌پزی، شکلات‌سازی، کیک‌پزی و سوهان.',
    },
    {
      slug: 'almond-powder',
      name_fa: 'پودر بادام',
      category: 'almond',
      origin_fa: 'ایران',
      price: 0,
      image: '/product/almond-flakes.webp',
      gallery: ['/product/almond-flakes.webp'],
      featured: true,
      sort_order: 6,
      desc_fa:
        'پودر بادام با بافت نرم و یکنواخت؛ مناسب شیرینی‌پزی، کیک و شکلات‌سازی.',
    },
  ];

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
      update: {},
      create: data,
    });
  }

  // These bundled legacy articles contain unverified event, customer, export and
  // laboratory claims. Keep their records for editorial review, but never publish them
  // automatically. CMS-authored content with other slugs is not touched.
  await prisma.blogPost.updateMany({
    where: { slug: { in: UNVERIFIED_LEGACY_BLOG_SLUGS } },
    data: { published: false },
  });

  // ── Awards / Certificates ──────────────────────────────────────
  const awardData: AwardSeed[] = [
    {
      key: 'award-01-tabriz-exhibition',
      title_fa: 'حضور در نخستین نمایشگاه شیرینی و شکلات تبریز ۱۴۰۲',
      desc_fa: 'لوح تقدیر از معاونت غذا و داروی دانشگاه علوم پزشکی تبریز به پاس مشارکت در نخستین نمایشگاه صنایع شیرینی، شکلات و بیسکوییت.',
      image: '/awards/award-01-tabriz-exhibition.webp',
      sort_order: 1,
    },
    {
      key: 'award-02-qazvin-appreciation',
      title_fa: 'لوح تقدیر نمایشگاه فروش بهاره و ضیافت رمضان ۱۴۰۳',
      desc_fa: 'تقدیر از شرکت نمایشگاه‌های بین‌المللی استان قزوین به دلیل حضور مؤثر و پررنگ در نمایشگاه فروش بهاره و ضیافت رمضان.',
      image: '/awards/award-02-qazvin-appreciation.webp',
      sort_order: 2,
    },
    {
      key: 'award-03-tabriz-university',
      title_fa: 'دومین نمایشگاه تولیدات شیرینی و شکلات تبریز ۱۴۰۲',
      desc_fa: 'تقدیر از معاونت غذا و داروی دانشگاه علوم پزشکی تبریز برای مشارکت صمیمانه هفت طلایی در دومین نمایشگاه تولیدات شیرینی و شکلات.',
      image: '/awards/award-03-tabriz-university.webp',
      sort_order: 3,
    },
    {
      key: 'award-04-training-ut',
      title_fa: 'کارگاه آموزشی کوچینگ و توسعه فردی مدیران — دانشگاه تهران',
      desc_fa: 'گواهی پایان کارگاه «کوچینگ و توسعه فردی مدیران» برگزار شده در دانشگاه تهران.',
      image: '/awards/award-04-training-ut.webp',
      sort_order: 4,
    },
    {
      key: 'award-05-coaching-ut',
      title_fa: 'کارگاه آموزشی استراتژی‌های نوین بازاریابی — دانشگاه تهران',
      desc_fa: 'گواهی پایان کارگاه «استراتژی‌های نوین بازاریابی» با تدریس استاد ایمان ابهشم‌چی در دانشگاه تهران.',
      image: '/awards/award-05-coaching-ut.webp',
      sort_order: 5,
    },
    {
      key: 'award-06-membership',
      title_fa: 'گواهی عضویت خانه صنعتکاران ایران',
      desc_fa: 'گواهی عضویت شرکت خشکبار هفت طلایی در خانه صنعتکاران ایران با شناسه ملی ۱۴۰۰۹۴۹۱۰۱۳.',
      image: '/awards/award-06-membership.webp',
      sort_order: 6,
    },
    {
      key: 'award-07-talieh-charity',
      title_fa: 'لوح تقدیر موسسه نگهداری کودکان معلول طلیعه',
      desc_fa: 'تقدیر از خیریه و حمایت‌های خیرخواهانه شرکت هفت طلایی از مرکز نگهداری کودکان معلول طلیعه.',
      image: '/awards/award-07-talieh-charity.webp',
      sort_order: 7,
    },
    {
      key: 'award-08-certificate-training',
      title_fa: 'گواهینامه آموزشی الگوهای نوین مدیریت کسب‌وکار — ICB',
      desc_fa: 'گواهی شرکت در کنفرانس ملی و بین‌المللی الگوهای نوین مدیریت کسب‌وکار (دانشکده مدیریت دانشگاه تهران) صادر شده توسط هیئت بین‌المللی گواهینامه ICB.',
      image: '/awards/award-08-certificate-training.webp',
      sort_order: 8,
    },
    {
      key: 'award-09-marketing-ut',
      title_fa: 'کارگاه استراتژی‌های نوین بازاریابی — دانشگاه تهران',
      desc_fa: 'گواهی موفقیت در کارگاه «استراتژی‌های نوین بازاریابی» برگزار شده در دانشگاه تهران.',
      image: '/awards/award-09-marketing-ut.webp',
      sort_order: 9,
    },
    {
      key: 'award-10-tech-ut',
      title_fa: 'کارگاه پایش تأثیر ضربه آرام — دانشگاه تهران',
      desc_fa: 'گواهی پایان کارگاه «پایش تأثیر ضربه آرام و گسسته نیروی اتاق» با تدریس دکتر مهدی باغبان در دانشگاه تهران.',
      image: '/awards/award-10-tech-ut.webp',
      sort_order: 10,
    },
    {
      key: 'award-11-negotiation-ut',
      title_fa: 'کارگاه اصول و فنون مذاکره تجاری — دانشگاه تهران',
      desc_fa: 'گواهی پایان کارگاه «اصول و فنون مذاکره تجاری» برگزار شده در دانشگاه تهران (۴ و ۵ بهمن ۱۴۰۰).',
      image: '/certificates/ut-negotiation.jpg',
      sort_order: 11,
    },
    {
      key: 'award-12-bmc-marketing',
      title_fa: 'ششمین کنفرانس بین‌المللی مدیریت کسب‌وکار — استراتژی بازاریابی',
      desc_fa: 'گواهی شرکت در ششمین کنفرانس بین‌المللی مدیریت کسب‌وکار و کارگاه «مدیریت استراتژی بازاریابی» در تهران.',
      image: '/certificates/bmc-marketing.jpg',
      sort_order: 12,
    },
    {
      key: 'award-13-ghadir-mosque',
      title_fa: 'لوح تقدیر مسجد و مجموعه فرهنگی حضرت امیرالمومنین (ع)',
      desc_fa: 'تقدیر به پاس حمایت از برگزاری جشن‌های دهه امامت و ولایت و عید سعید غدیر خم.',
      image: '/certificates/ghadir-mosque.jpg',
      sort_order: 13,
    },
  ];

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
      update: {},
      create: { id: a.key, ...data },
    });
  }

  // The testimonials previously bundled here were unverified quotations attributed
  // to named businesses. Retain their records for editorial review, but take them offline.
  await prisma.testimonial.updateMany({
    where: { name_fa: { in: UNVERIFIED_TESTIMONIAL_NAMES } },
    data: { published: false },
  });

  console.log('Seed done. Admin: admin@7golden.co / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
