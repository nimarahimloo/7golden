import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

  // Do not rewrite BlogPost.published during seed. The admin's CMS publish state is authoritative.

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

  // Seed the existing newsroom archive into its own NewsPost collection.
  // Empty updates are deliberate: the seed initializes missing rows but never overwrites
  // later title/body/publish edits made in the admin panel.
  const newsPostData = [
    {
      slug: 'product-catalog-update', category: 'product', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 1,
      title_fa: 'معرفی سبد محصولات هفت طلایی برای صنایع غذایی',
      excerpt_fa: 'سبد محصولات هفت طلایی بر سه خانواده فندق، پسته و بادام و شکل‌های مختلف فرآوری آن‌ها تمرکز دارد؛ انتخاب فرم مناسب از کاربرد نهایی شروع می‌شود.',
      image: '/gallery/AQ8A1499AQ8A1499.webp',
      content: 'هفت طلایی سبد محصولات خود را برای نیازهای متنوع صنایع غذایی معرفی می‌کند: محصولات فندق، پسته و بادام در فرم‌هایی مانند مغز، خلال، پرک، خمیر، گرانول و پودر. همهٔ فرم‌ها برای همهٔ کاربردها یکسان نیستند؛ بنابراین مشخص‌کردن کاربرد نهایی، نخستین قدم در انتخاب محصول.\n\nبرای شکلات، بستنی، قنادی، بیسکویت و فرآورده‌های مشابه، شکل ماده اولیه می‌تواند بر بافت و ظاهر محصول نهایی اثر بگذارد. هنگام استعلام، نوع محصول و فرم موردنیاز را دقیق اعلام کنید تا مشخصات موجود و شرایط سفارش بررسی شود.\n\nاین معرفی جایگزین مشخصات فنی یک سفارش نیست. موجودی، گرید، بسته‌بندی و زمان تحویل باید برای هر درخواست به‌صورت جداگانه تأیید شوند.',
    },
    {
      slug: 'quote-request-details', category: 'ordering', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 2,
      title_fa: 'اطلاعیه برای خریداران عمده: درخواست قیمت دقیق‌تر ثبت کنید',
      excerpt_fa: 'برای بررسی سریع‌تر درخواست خرید، نام محصول، فرم موردنیاز، کاربرد نهایی، حجم تقریبی و مقصد تحویل را در پیام خود بنویسید.',
      image: '/gallery/AQ8A1505AQ8A1505.webp',
      content: 'برای آنکه درخواست قیمت قابل بررسی باشد، تنها نوشتن نام کلی «پسته»، «فندق» یا «بادام» کافی نیست. لطفاً مشخص کنید محصول را به چه شکلی می‌خواهید؛ برای مثال مغز، خلال، پرک، خمیر، گرانول یا پودر.\n\nکاربرد محصول، مقدار تقریبی سفارش، مقصد تحویل و نوع بسته‌بندی موردنظر نیز به روشن‌شدن درخواست کمک می‌کند. اگر اندازه برش یا ویژگی ظاهری مشخصی برای فرمول تولید شما اهمیت دارد، آن را در پیام ذکر کنید.\n\nقیمت، موجودی و جزئیات تحویل پس از دریافت اطلاعات سفارش بررسی می‌شود. هیچ وزن بسته‌بندی یا زمان تحویلی بدون هماهنگی نهایی فرض نمی‌شود.',
    },
    {
      slug: 'sample-request-guidance', category: 'ordering', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 3,
      title_fa: 'راهنمای درخواست نمونه برای ارزیابی در خط تولید',
      excerpt_fa: 'اگر پیش از خرید عمده نیاز به بررسی نمونه دارید، محصول و کاربرد آن را مشخص کنید تا امکان ارائه نمونه و شرایط آن هماهنگ شود.',
      image: '/gallery/AQ8A1520AQ8A1520.webp',
      content: 'آزمودن ماده اولیه در شرایط واقعی تولید می‌تواند به تصمیم‌گیری دقیق‌تر کمک کند. ظاهر یک محصول به‌تنهایی نشان نمی‌دهد که در فرمول شما چه رفتاری خواهد داشت؛ به همین دلیل بهتر است ارزیابی نمونه با همان دستور تولید و شرایطی انجام شود که قرار است در عمل استفاده شوند.\n\nبرای شروع، نوع محصول، شکل موردنیاز، کاربرد نهایی و مقدار تقریبی مصرف را آماده کنید. اگر معیار مشخصی مانند اندازه ذرات، رنگ یا بافت برای شما اهمیت دارد، آن را هم توضیح دهید.\n\nامکان ارائه نمونه، موجودی و نحوه هماهنگی باید هنگام تماس تأیید شود. این اطلاعیه وعدهٔ ارسال خودکار نمونه یا زمان تحویل مشخصی ایجاد نمی‌کند.',
    },
    {
      slug: 'company-history-note', category: 'company', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 4,
      title_fa: 'مروری بر مسیر فعالیت هفت طلایی در قزوین',
      excerpt_fa: 'ریشهٔ خانوادگی کسب‌وکار به خشکبار محمدی در بازار قزوین در سال ۱۳۳۵ بازمی‌گردد؛ کارگاه فرآوری در ۱۳۷۷ آغاز شد و شرکت در ۱۳۹۶ ثبت شد.',
      image: '/gallery/AQ8A1640AQ8A1640.webp',
      content: 'داستان هفت طلایی بخشی از یک مسیر خانوادگی در بازار خشکبار قزوین است. فعالیت خشکبار محمدی از سال ۱۳۳۵ آغاز شده و این سابقه، زمینهٔ ورود نسل بعدی به فرآوری را فراهم کرده است.\n\nکارگاه کوچک فرآوری در سال ۱۳۷۷ شروع به کار کرد. در سال ۱۳۹۶ نیز شرکت «خشکبار و بسته‌بندی هفت طلایی» به ثبت رسید. این تاریخ‌ها سه نقطهٔ متمایز در مسیر کسب‌وکارند: ریشهٔ بنکداری خانوادگی، آغاز فرآوری و ثبت شرکت.\n\nامروز تمرکز سبد محصولات معرفی‌شده در وب‌سایت بر فندق، پسته و بادام و فرم‌های گوناگون آن‌هاست. جزئیات سفارش و موجودی هر محصول از طریق ارتباط با مجموعه قابل پیگیری است.',
    },
    {
      slug: 'media-archive-update', category: 'media', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 5,
      title_fa: 'گسترش آرشیو تصویری محصولات و فضای مجموعه',
      excerpt_fa: 'آرشیو تصویری وب‌سایت، مجموعه‌ای از عکس‌ها و ویدئوهای موجود درباره محصولات و فضای کار را در یک مسیر قابل مرور گرد هم می‌آورد.',
      image: '/gallery/AQ8A1579AQ8A1579.webp',
      content: 'بخش تصویری وب‌سایت برای مشاهدهٔ عکس‌ها و ویدئوهای موجود از محصولات و فضای مجموعه توسعه یافته است. هدف آرشیو این است که مخاطب بتواند پیش از تماس، تصویری روشن‌تر از خانواده‌های محصول و محتوای بصری منتشرشده در سایت به دست آورد.\n\nاین تصاویر برای معرفی بصری به کار می‌روند و به‌تنهایی جایگزین مشخصات فنی، تأیید موجودی یا ارزیابی نمونه نیستند. اگر دربارهٔ یک محصول خاص پرسشی دارید، نام و فرم دقیق آن را در درخواست خود ذکر کنید.\n\nمحتواهای تازه در صورت آماده‌شدن و تأیید مجموعه می‌توانند به این آرشیو اضافه شوند.',
    },
    {
      slug: 'product-forms-announcement', category: 'product', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 6,
      title_fa: 'آشنایی با شکل‌های مختلف فرآورده‌های خشکبار',
      excerpt_fa: 'مغز، خلال، پرک، خمیر، گرانول و پودر نقش‌های متفاوتی در فرمولاسیون دارند؛ شکل محصول باید بر اساس نیاز خط تولید انتخاب شود.',
      image: '/banner/hazelnut-spoon.webp',
      content: 'فرآوری، یک ماده اولیه را به شکل‌هایی تبدیل می‌کند که برای کاربردهای مختلف مناسب‌اند. مغز کامل ظاهر مشخصی دارد؛ خلال و پرک برای نمایش قطعات یا پوشش سطح استفاده می‌شوند؛ گرانول بافت ذره‌ای ایجاد می‌کند و پودر در فرمول‌هایی به کار می‌رود که شکل ریزتر لازم است.\n\nدر خانواده فندق، هفت طلایی فندق خندان، مغز خام و رست، خمیر، گرانول و پودر را معرفی می‌کند. در خانواده پسته، مغز، مغز پوست‌کنده، خلال و پودر مطرح‌اند. در خانواده بادام نیز مغز بادام درختی، خلال، پرک و پودر از شکل‌های شناخته‌شده‌اند.\n\nانتخاب نهایی باید با فرمول تولید، ویژگی ظاهری موردنظر و مشخصات قابل عرضه هماهنگ باشد. برای اطلاع از موجودی و گریدها، درخواست خود را با جزئیات ارسال کنید.',
    },
    {
      slug: 'contact-details-reminder', category: 'announcement', date_fa: '۱۴۰۵/۰۷/۲۱', sort_order: 7,
      title_fa: 'اطلاعیه ارتباط با واحد بازرگانی',
      excerpt_fa: 'برای درخواست قیمت یا اطلاعات محصول، فرم تماس وب‌سایت یا اطلاعات تماس درج‌شده در پایین صفحه را به کار ببرید و نوع محصول را مشخص کنید.',
      image: '/gallery/AQ8A1742AQ8A1742.webp',
      content: 'واحد بازرگانی نقطهٔ شروع گفت‌وگو دربارهٔ محصولات و سفارش‌های عمده است. برای دریافت پاسخ مرتبط‌تر، نام محصول، شکل موردنیاز، کاربرد نهایی و حجم تقریبی سفارش را از ابتدا ذکر کنید.\n\nاگر دربارهٔ بسته‌بندی، مقصد تحویل یا زمان‌بندی خاصی پرسش دارید، آن را در همان پیام اضافه کنید. جزئیات نهایی هر سفارش پس از بررسی و هماهنگی تأیید می‌شود.\n\nراه‌های ارتباطی به‌روز در صفحهٔ تماس و فوتر وب‌سایت درج شده‌اند. برای جلوگیری از اطلاعات نادرست، ساعت کاری یا کانال اجتماعی تأییدنشده‌ای در این اطلاعیه اعلام نمی‌شود.',
    },
  ];

  for (const item of newsPostData) {
    await prisma.newsPost.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, published: true },
    });
  }

  // Create the homepage's editable section records once. Existing admin edits,
  // including published=false, are never overwritten by this seed.
  const homeSectionDefaults = [
    { section_key: 'hero', title_fa: 'خشکبار هفت طلایی', subtitle_fa: 'فرآوری فندق، پسته و بادام برای صنایع غذایی؛ با سابقه فعالیت کارگاهی از سال ۱۳۷۷.', badge_fa: 'هفت طلایی · قزوین', image: '/banner/hero-nuts-bowl.webp', sort_order: 10 },
    { section_key: 'capacity', title_fa: 'فرآوری خشکبار در قزوین', subtitle_fa: 'فعالیت فرآوری هفت طلایی از سال ۱۳۷۷ آغاز شده است. فهرست محصولات مجموعه شامل مغز فندق، خمیر و گرانول فندق، مغز و خلال پسته و شکل‌های مختلف بادام است.', badge_fa: 'توانمندی‌های ۷ گلدن', image: '/banner/img-6052-split.webp', sort_order: 20 },
    { section_key: 'origin', title_fa: 'سه گروه محصول؛ کاربردهای متنوع', subtitle_fa: 'فهرست محصولات هفت طلایی بر فندق، پسته و بادام متمرکز است. هر گروه در شکل‌های مختلف فرآوری عرضه می‌شود تا برای کاربردهای متفاوت در صنایع غذایی قابل انتخاب باشد.', badge_fa: 'محصولات هفت طلایی', image: '/banner/banner-spoons-set.webp', sort_order: 30 },
    { section_key: 'products', title_fa: 'محصولات هفت طلایی', subtitle_fa: 'در فهرست محصولات، پسته، بادام و فندق در شکل‌های مختلف آماده‌سازی عرضه می‌شوند؛ از مغز و خلال تا پرک، خمیر، گرانول و پودر.', badge_fa: 'مجموعه محصولات', image: '/gallery/AQ8A1505AQ8A1505.webp', sort_order: 40 },
    { section_key: 'visual-gallery', title_fa: 'زیبایی در جزئیات است', subtitle_fa: 'روایتی موزاییکی از فضای کارخانه، فرآوری و تصاویر ثبت‌شدهٔ محصولات هفت طلایی؛ ویدیوها بی‌صدا و پیوسته مانند تصویر متحرک نمایش داده می‌شوند.', badge_fa: 'تصاویر واقعی از مجموعه', sort_order: 50 },
    { section_key: 'news', title_fa: 'از هفت طلایی، نزدیک‌تر', subtitle_fa: 'روایت‌هایی از محصولات و فرآوری، برگرفته از اخبار منتشرشده در پایگاه محتوای مجموعه.', badge_fa: 'اخبار و اطلاعیه‌ها', sort_order: 60 },
    { section_key: 'magazine', title_fa: 'دانش کاربردی برای انتخاب بهتر', subtitle_fa: 'مقاله‌های منتشرشدهٔ وبلاگ هفت طلایی؛ بدون جایگزینی محتوای ثابت در نبود دادهٔ CMS.', badge_fa: 'MAGAZINE · مجله', sort_order: 70 },
    { section_key: 'order', title_fa: 'از انتخاب محصول تا آماده‌سازی سفارش', subtitle_fa: 'هر سفارش با شناخت نیاز مجموعه شما آغاز می‌شود. مشخصات محصول، مقدار و نوع بسته‌بندی در کنار هم بررسی می‌شوند تا مسیر سفارش بر مبنای نیاز واقعی شما شکل بگیرد.', badge_fa: 'فرایند همکاری', sort_order: 80 },
    { section_key: 'awards', title_fa: 'مروری بر سوابق هفت طلایی', subtitle_fa: '', badge_fa: 'افتخارات و مدارک', sort_order: 90 },
    { section_key: 'clients', title_fa: 'کاربرد محصولات در صنایع غذایی', subtitle_fa: 'این موارد، نمونه‌هایی از کاربرد رایج فرآورده‌های فندق، پسته و بادام هستند؛ استفاده دقیق هر محصول به مشخصات آن و فرمول تولیدکننده بستگی دارد.', badge_fa: 'نمونه کاربردها', sort_order: 100 },
    { section_key: 'contact', title_fa: 'استعلام قیمت محصولات', subtitle_fa: 'برای اطلاع از قیمت مغز فندق، خمیر فندق، مغز و خلال پسته یا فرآورده‌های بادام، درخواست خود را ثبت کنید یا با دفتر هفت طلایی تماس بگیرید.', badge_fa: 'ارتباط با هفت طلایی', sort_order: 110 },
  ];
  for (const section of homeSectionDefaults) {
    const existing = await prisma.pageSection.findFirst({
      where: { page_key: 'home', section_key: section.section_key },
    });
    if (!existing) {
      await prisma.pageSection.create({ data: { page_key: 'home', ...section, published: true } });
    }
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
