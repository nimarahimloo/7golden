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

  // ── Categories (3 pillars — products are added via admin panel) ──
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

  // ── Clear all demo/sample content so the user enters real data via admin ──
  await prisma.product.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.award.deleteMany();
  await prisma.testimonial.deleteMany();

  console.log('Seed done — DB cleared of demo content. Add products/blog/awards via admin panel.');
  console.log('Admin: admin@7golden.co / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
