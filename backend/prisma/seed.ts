import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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
      contact_phone: '021-12345678',
      contact_mobile: '0912-0000000',
      contact_email: 'info@7golden.co',
      hq_address_fa: 'ایران، قزوین',
      working_hours_fa: 'شنبه تا پنج‌شنبه ۹ تا ۱۷',
    },
  });

  // ── Categories ─────────────────────────────────────────────────
  await prisma.category.deleteMany();
  await prisma.category.createMany({
    data: [
      {
        slug: 'hazelnut',
        name_fa: 'فندق',
        desc_fa: 'مغز فندق درجه یک، فندق خندان و خمیر فندق — از باغستان‌های قزوین و اشنویه',
        image: '/product/hazelnut-cat.png',
        sort_order: 1,
      },
      {
        slug: 'pistachio',
        name_fa: 'پسته',
        desc_fa: 'مغز پسته قزوین، مغز پسته پوست کنده و خلال پسته — سبز مطلوب برای صنایع شکلات و بستنی',
        image: '/product/pistachio-cat.png',
        sort_order: 2,
      },
      {
        slug: 'almond',
        name_fa: 'بادام',
        desc_fa: 'پرک بادام درختی و خلال بادام — فرآوری شده برای صنایع قنادی و شکلات',
        image: '/product/almond-cat.png',
        sort_order: 3,
      },
    ],
  });

  // ── Products ──────────────────────────────────────────────────
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      // ── Hazelnut products ──
      {
        slug: 'brain-hazelnut',
        name_fa: 'مغز فندق خام',
        desc_fa: 'مغز فندق درجه یک، تفکیک‌شده با کنترل دقیق سایز و آلودگی. تأمین مستقیم از باغستان‌های قزوین و اشنویه بدون واسطه. مناسب برای صنایع شکلات و تولید کرم فندق.',
        category: 'hazelnut',
        origin_fa: 'قزوین و اشنویه',
        price: 0,
        image: '/product/brain-hazelnut.png',
        gallery: JSON.stringify(['/product/brain-hazelnut.png']),
        badge: 'پرفروش',
        taste: JSON.stringify({ bitter: 5, sweet: 30, earthy: 25, nutty: 90 }),
        weights: JSON.stringify([500, 1000, 5000]),
        featured: true,
        published: true,
        sort_order: 1,
      },
      {
        slug: 'roasted-hazelnut',
        name_fa: 'مغز فندق رست',
        desc_fa: 'مغز فندق بو‌داده با طعم و عطر غنی. فرآوری شده در خطوط رست تخصصی برای صنایع شکلات، قنادی و بستنی.',
        category: 'hazelnut',
        origin_fa: 'قزوین و اشنویه',
        price: 0,
        image: '/product/roasted-hazelnut.png',
        gallery: JSON.stringify(['/product/roasted-hazelnut.png']),
        taste: JSON.stringify({ bitter: 10, sweet: 35, earthy: 30, nutty: 95 }),
        weights: JSON.stringify([500, 1000, 5000]),
        featured: true,
        published: true,
        sort_order: 2,
      },
      {
        slug: 'hazelnut-paste',
        name_fa: 'خمیر فندق',
        desc_fa: 'خمیر فندق آماده و فرآوری شده با دستگاه‌های تخصصی، مناسب برای تولید کرم فندق، شکلات و صنایع قنادی.',
        category: 'hazelnut',
        origin_fa: 'قزوین',
        price: 0,
        image: '/product/hazelnut-paste.png',
        gallery: JSON.stringify(['/product/hazelnut-paste.png']),
        taste: JSON.stringify({ bitter: 5, sweet: 50, earthy: 15, nutty: 95 }),
        weights: JSON.stringify([1000, 5000, 10000]),
        featured: true,
        published: true,
        sort_order: 3,
      },
      {
        slug: 'smiling-hazelnut',
        name_fa: 'فندق خندان',
        desc_fa: 'فندق خندان یا ترک خورده، بصورت خام و بو‌داده تولید و فرآوری می‌شود. فندق خندان ایرانی به دلیل شرایط اقلیمی و خاکی مناسب از نظر طعم و مزه قابل مقایسه با کشورهای دیگر نیست. مناسب‌ترین مناطق: اشنویه، قم، الموت قزوین و منطقه اشکوارات شمال.',
        category: 'hazelnut',
        origin_fa: 'اشنویه، قزوین',
        price: 0,
        image: '/product/smiling-hazelnut.png',
        gallery: JSON.stringify(['/product/smiling-hazelnut.png']),
        taste: JSON.stringify({ bitter: 5, sweet: 40, earthy: 20, nutty: 85 }),
        weights: JSON.stringify([500, 1000, 5000]),
        featured: false,
        published: true,
        sort_order: 4,
      },
      // ── Pistachio products ──
      {
        slug: 'qazvin-pistachio-nuts',
        name_fa: 'مغز پسته قزوین',
        desc_fa: 'مغز پسته قزوین با رنگ سبز مطلوب و دانه‌بندی یکنواخت. کشت شده در استان قزوین و شهر بوئین زهرا. برای مصرف صنعتی و بسته‌بندی صادراتی فرآوری می‌شود. تمام مراحل از برداشت تا بسته‌بندی تحت کنترل کیفی آزمایشگاهی.',
        category: 'pistachio',
        origin_fa: 'قزوین، بوئین زهرا',
        price: 0,
        image: '/product/qazvin-pistachio-nuts.png',
        gallery: JSON.stringify(['/product/qazvin-pistachio-nuts.png']),
        badge: 'صادراتی',
        taste: JSON.stringify({ bitter: 10, sweet: 40, earthy: 20, nutty: 80 }),
        weights: JSON.stringify([500, 1000, 5000]),
        featured: true,
        published: true,
        sort_order: 5,
      },
      {
        slug: 'peeled-pistachio',
        name_fa: 'مغز پسته پوست کنده',
        desc_fa: 'مغز پسته پوست‌کنده با رنگ سبز روشن و ظاهر مطلوب. مناسب برای صنایع شکلات، قنادی، بستنی و تزئینات غذایی.',
        category: 'pistachio',
        origin_fa: 'قزوین',
        price: 0,
        image: '/product/peeled-pistachio.png',
        gallery: JSON.stringify(['/product/peeled-pistachio.png']),
        taste: JSON.stringify({ bitter: 5, sweet: 45, earthy: 15, nutty: 85 }),
        weights: JSON.stringify([500, 1000, 5000]),
        featured: true,
        published: true,
        sort_order: 6,
      },
      {
        slug: 'pistachio-slices',
        name_fa: 'خلال پسته قزوین',
        desc_fa: 'خلال پسته قزوین تولید و فرآوری شده از یکی از معروف‌ترین انواع پسته در ایران. به دلیل طعم و رنگ کیفیت بالای خود مورد توجه بسیاری از مصرف‌کنندگان داخلی و خارجی قرار گرفته است. خلال پسته قزوین به دلیل سبز بودن جذابیت خاصی دارد که در مصارف غذایی و شرکت‌های بستنی و شکلات و حلوا ارده بسیار مورد استفاده قرار گرفته.',
        category: 'pistachio',
        origin_fa: 'قزوین، بوئین زهرا',
        price: 0,
        image: '/product/pistachio-slices.png',
        gallery: JSON.stringify(['/product/pistachio-slices.png']),
        badge: 'صادراتی',
        taste: JSON.stringify({ bitter: 5, sweet: 35, earthy: 15, nutty: 75 }),
        weights: JSON.stringify([500, 1000, 5000]),
        featured: true,
        published: true,
        sort_order: 7,
      },
      // ── Almond products ──
      {
        slug: 'almond-flakes',
        name_fa: 'پرک بادام درختی',
        desc_fa: 'پرک بادام درختی با ضخامت دقیق و یکنواخت، مخصوص تزئین قنادی و صنایع بستنی و شکلات. فرآوری شده با خطوط برش تخصصی.',
        category: 'almond',
        origin_fa: 'ایران',
        price: 0,
        image: '/product/almond-flakes.png',
        gallery: JSON.stringify(['/product/almond-flakes.png']),
        taste: JSON.stringify({ bitter: 5, sweet: 40, earthy: 20, nutty: 80 }),
        weights: JSON.stringify([500, 1000, 5000]),
        featured: true,
        published: true,
        sort_order: 8,
      },
      {
        slug: 'sliced-peanuts',
        name_fa: 'خلال بادام زمینی',
        desc_fa: 'خلال بادام زمینی با برش یکنواخت صنعتی. مناسب برای صنایع قنادی، شکلات و تزئینات غذایی.',
        category: 'almond',
        origin_fa: 'ایران',
        price: 0,
        image: '/product/sliced-peanuts.png',
        gallery: JSON.stringify(['/product/sliced-peanuts.png']),
        taste: JSON.stringify({ bitter: 10, sweet: 30, earthy: 25, nutty: 70 }),
        weights: JSON.stringify([500, 1000, 5000]),
        featured: false,
        published: true,
        sort_order: 9,
      },
    ],
  });

  // ── Blog Posts ─────────────────────────────────────────────────
  await prisma.blogPost.deleteMany();
  await prisma.blogPost.createMany({
    data: [
      {
        slug: 'our-honors',
        title_fa: 'افتخارات هفت طلایی',
        excerpt_fa: 'افتخارات و دستاوردهای مجموعه خشکبار هفت طلایی در طول سال‌های فعالیت',
        content: 'مجموعه خشکبار هفت طلایی در طول سال‌های فعالیت خود توانسته افتخارات متعددی را کسب نماید.',
        date_fa: '۱۴ تیر ۱۴۰۳',
        category: 'news',
        image: '/banner/blog-honors.jpg',
        published: true,
        sort_order: 1,
      },
      {
        slug: 'decrease-in-purchasing-power',
        title_fa: 'کاهش قدرت خرید و افزایش رقابت',
        excerpt_fa: 'بررسی تأثیر کاهش قدرت خرید بر بازار خشکبار و راهکارهای رقابتی',
        content: 'کاهش قدرت خرید و افزایش رقابت در بازار خشکبار یکی از چالش‌های پیش روی تولیدکنندگان و صادرکنندگان است.',
        date_fa: '۱ تیر ۱۴۰۳',
        category: 'news',
        image: '/banner/blog-purchasing-power.jpg',
        published: true,
        sort_order: 2,
      },
      {
        slug: 'sweets-and-chocolates-1402',
        title_fa: 'نمایشگاه شیرینی شکلات ۱۴۰۲',
        excerpt_fa: 'حضور مجموعه بزرگ خشکبار هفت طلایی در نمایشگاه شیرینی و شکلات ۱۴۰۲',
        content: 'مجموعه بزرگ خشکبار هفت طلایی در نمایشگاه شیرینی و شکلات ۱۴۰۲ خوش درخشید و محصولات خود را به نمایش گذاشت.',
        date_fa: '۳ مهر ۱۴۰۲',
        category: 'news',
        image: '/banner/blog-exhibition.jpg',
        published: true,
        sort_order: 3,
      },
    ],
  });

  // ── Testimonials ───────────────────────────────────────────────
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        name_fa: 'شرکت صنایع شکلات پارسیان',
        role_fa: 'خریدار صنعتی',
        text_fa: 'کیفیت مغز فندق هفت طلایی فوق‌العاده است. تأمین پیوسته و بسته‌بندی استاندارد، همکاری با این مجموعه را برای ما ارزشمند کرده.',
        rating: 5,
        sort_order: 1,
      },
      {
        name_fa: 'بستنی گلستان',
        role_fa: 'خریدار صادراتی',
        text_fa: 'خلال پسته قزوین هفت طلایی بهترین کیفیت را در بین تأمین‌کنندگان دارد. رنگ سبز مطلوب و برش یکنواخت.',
        rating: 5,
        sort_order: 2,
      },
      {
        name_fa: 'قنادی برتر',
        role_fa: 'خریدار عمده',
        text_fa: 'پرک بادام درختی با کیفیت عالی و تحویل به‌موقع. همکاری با هفت طلایی را به همه صنعت‌گران توصیه می‌کنیم.',
        rating: 5,
        sort_order: 3,
      },
    ],
  });

  console.log('Seed done. Admin: admin@7golden.co / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
