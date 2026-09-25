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

  await prisma.siteSettings.deleteMany();
  await prisma.siteSettings.create({
    data: {
      site_name_fa: 'هفت طلایی',
      site_name_en: '7Golden',
      site_mode: 'corporate',
      contact_phone: '021-12345678',
      contact_mobile: '0912-0000000',
      contact_email: 'info@7golden.co',
      hq_address_fa: 'ایران، قزوین',
      hq_address_en: 'Qazvin, Iran',
      working_hours_fa: 'شنبه تا پنج‌شنبه ۹ تا ۱۷',
      working_hours_en: 'Sat–Thu 9–17',
    },
  });

  const catCount = await prisma.category.count();
  if (catCount === 0) {
    await prisma.category.createMany({
      data: [
        {
          slug: 'pistachio',
          name_fa: 'پسته',
          name_en: 'Pistachio',
          desc_fa: 'پسته صادراتی درجه یک',
          desc_en: 'Premium export pistachios',
          image: '/product/pistachio.jpg',
          sort_order: 1,
        },
        {
          slug: 'almond',
          name_fa: 'بادام',
          name_en: 'Almond',
          desc_fa: 'بادام با کیفیت صادراتی',
          desc_en: 'Export-grade almonds',
          image: '/product/almond.jpg',
          sort_order: 2,
        },
        {
          slug: 'hazelnut',
          name_fa: 'فندق',
          name_en: 'Hazelnut',
          desc_fa: 'فندق تازه و مرغوب',
          desc_en: 'Fresh quality hazelnuts',
          image: '/product/hazelnut.jpg',
          sort_order: 3,
        },
      ],
    });
  }

  const prodCount = await prisma.product.count();
  if (prodCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          slug: 'pistachio-akbari',
          name_fa: 'پسته اکبری',
          name_en: 'Akbari Pistachio',
          desc_fa: 'پسته اکبری ممتاز برای صادرات',
          desc_en: 'Premium Akbari pistachio for export',
          category: 'pistachio',
          origin_fa: 'کرمان',
          origin_en: 'Kerman',
          price: 8500000,
          price_display: '۸٬۵۰۰٬۰۰۰',
          image: '/product/pistachio.jpg',
          gallery: JSON.stringify(['/product/pistachio.jpg']),
          taste: JSON.stringify({ bitter: 10, sweet: 40, earthy: 20, nutty: 80 }),
          weights: JSON.stringify([500, 1000]),
          featured: true,
          published: true,
          sort_order: 1,
        },
        {
          slug: 'almond-mamra',
          name_fa: 'بادام مامرایی',
          name_en: 'Mamra Almond',
          category: 'almond',
          price: 6200000,
          price_display: '۶٬۲۰۰٬۰۰۰',
          image: '/product/almond.jpg',
          featured: true,
          published: true,
          sort_order: 2,
        },
        {
          slug: 'hazelnut-raw',
          name_fa: 'فندق خام',
          name_en: 'Raw Hazelnut',
          category: 'hazelnut',
          price: 4800000,
          price_display: '۴٬۸۰۰٬۰۰۰',
          image: '/product/hazelnut.jpg',
          featured: true,
          published: true,
          sort_order: 3,
        },
      ],
    });
  }

  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    await prisma.blogPost.create({
      data: {
        slug: 'export-quality',
        title_fa: 'کیفیت صادراتی هفت طلایی',
        title_en: '7Golden Export Quality',
        excerpt_fa: 'استانداردهای صادرات پسته و خشکبار',
        excerpt_en: 'Export standards for nuts',
        content: 'محتوای نمونه...',
        date_fa: '۱۴۰۴/۰۱/۰۱',
        date_en: '2025-03-21',
        category: 'news',
        image: '/banner/hero.jpg',
        published: true,
        sort_order: 1,
      },
    });
  }

  const tCount = await prisma.testimonial.count();
  if (tCount === 0) {
    await prisma.testimonial.create({
      data: {
        name_fa: 'شرکت نمونه',
        name_en: 'Sample Co',
        role_fa: 'خریدار صادراتی',
        role_en: 'Export buyer',
        text_fa: 'کیفیت عالی و تحویل به‌موقع',
        text_en: 'Excellent quality and on-time delivery',
        rating: 5,
        sort_order: 1,
      },
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
