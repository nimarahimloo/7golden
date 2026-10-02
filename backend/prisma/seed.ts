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
      site_mode: 'corporate',
      contact_phone: '021-12345678',
      contact_mobile: '0912-0000000',
      contact_email: 'info@7golden.co',
      hq_address_fa: 'ایران، قزوین',
      working_hours_fa: 'شنبه تا پنج‌شنبه ۹ تا ۱۷',
    },
  });

  const catCount = await prisma.category.count();
  if (catCount === 0) {
    await prisma.category.createMany({
      data: [
        {
          slug: 'pistachio',
          name_fa: 'پسته',
          desc_fa: 'پسته صادراتی درجه یک',
          image: '/product/pistachio.jpg',
          sort_order: 1,
        },
        {
          slug: 'almond',
          name_fa: 'بادام',
          desc_fa: 'بادام با کیفیت صادراتی',
          image: '/product/almond.jpg',
          sort_order: 2,
        },
        {
          slug: 'hazelnut',
          name_fa: 'فندق',
          desc_fa: 'فندق تازه و مرغوب',
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
          desc_fa: 'پسته اکبری ممتاز برای صادرات',
          category: 'pistachio',
          origin_fa: 'کرمان',
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
        excerpt_fa: 'استانداردهای صادرات پسته و خشکبار',
        content: 'محتوای نمونه...',
        date_fa: '۱۴۰۴/۰۱/۰۱',
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
        role_fa: 'خریدار صادراتی',
        text_fa: 'کیفیت عالی و تحویل به‌موقع',
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
