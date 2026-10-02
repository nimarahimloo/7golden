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

  // Categories — always update images from 7golden.co
  const catData = [
    {
      slug: 'pistachio',
      name_fa: 'پسته',
      desc_fa: 'پسته صادراتی درجه یک',
      image: '/product/pistachio-category.png',
      sort_order: 1,
    },
    {
      slug: 'almond',
      name_fa: 'بادام',
      desc_fa: 'بادام با کیفیت صادراتی',
      image: '/product/almond-category.png',
      sort_order: 2,
    },
    {
      slug: 'hazelnut',
      name_fa: 'فندق',
      desc_fa: 'فندق تازه و مرغوب',
      image: '/product/hazelnut-category.png',
      sort_order: 3,
    },
  ];
  for (const c of catData) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { image: c.image, name_fa: c.name_fa, desc_fa: c.desc_fa },
      create: c,
    });
  }

  // Products — always update images from 7golden.co
  const prodData = [
    {
      slug: 'pistachio-akbari',
      name_fa: 'پسته اکبری',
      desc_fa: 'پسته اکبری ممتاز برای صادرات',
      category: 'pistachio',
      origin_fa: 'کرمان',
      price: 8500000,
      price_display: '۸٬۵۰۰٬۰۰۰',
      image: '/product/qazvin-pistachio-nuts.png',
      gallery: JSON.stringify(['/product/qazvin-pistachio-nuts.png']),
      taste: JSON.stringify({ bitter: 10, sweet: 40, earthy: 20, nutty: 80 }),
      weights: JSON.stringify([500, 1000]),
      featured: true,
      published: true,
      sort_order: 1,
    },
    {
      slug: 'almond-mamra',
      name_fa: 'بادام مامرایی',
      desc_fa: 'بادام مامرایی درجه یک صادراتی',
      category: 'almond',
      price: 6200000,
      price_display: '۶٬۲۰۰٬۰۰۰',
      image: '/product/almond-flakes.png',
      gallery: JSON.stringify(['/product/almond-flakes.png']),
      featured: true,
      published: true,
      sort_order: 2,
    },
    {
      slug: 'hazelnut-raw',
      name_fa: 'فندق خام',
      desc_fa: 'مغز فندق درجه یک قزوین',
      category: 'hazelnut',
      price: 4800000,
      price_display: '۴٬۸۰۰٬۰۰۰',
      image: '/product/brain-hazelnut.png',
      gallery: JSON.stringify(['/product/brain-hazelnut.png']),
      featured: true,
      published: true,
      sort_order: 3,
    },
  ];
  for (const p of prodData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        image: p.image,
        gallery: p.gallery,
        name_fa: p.name_fa,
        desc_fa: p.desc_fa,
      },
      create: p,
    });
  }

  // Blog post — always update image
  await prisma.blogPost.upsert({
    where: { slug: 'export-quality' },
    update: { image: '/product/blog-3.jpg' },
    create: {
      slug: 'export-quality',
      title_fa: 'کیفیت صادراتی هفت طلایی',
      excerpt_fa: 'استانداردهای صادرات پسته و خشکبار',
      content: 'محتوای نمونه...',
      date_fa: '۱۴۰۴/۰۱/۰۱',
      category: 'news',
      image: '/product/blog-3.jpg',
      published: true,
      sort_order: 1,
    },
  });

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
