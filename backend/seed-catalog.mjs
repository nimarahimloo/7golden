
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const products = [
  { slug: 'qazvin-peeled-pistachio', name_fa: 'مغز پسته پوست‌کنده قزوین', category: 'pistachio', image: '/product/pdf/qazvin-peeled-pistachio.webp', sort_order: 1, featured: true },
  { slug: 'qazvin-pistachio-kernels', name_fa: 'مغز پسته قزوین', category: 'pistachio', image: '/product/pdf/qazvin-pistachio-kernels.webp', sort_order: 2, featured: true },
  { slug: 'raw-pistachio', name_fa: 'پسته خام', category: 'pistachio', image: '/product/pdf/raw-pistachio.webp', sort_order: 3, featured: true },
  { slug: 'kerman-pistachio-slices', name_fa: 'خلال پسته کرمان', category: 'pistachio', image: '/product/pdf/kerman-pistachio-slices.webp', sort_order: 4, featured: true },
  { slug: 'pistachio-powder', name_fa: 'پودر پسته', category: 'pistachio', image: '/product/pdf/pistachio-powder.webp', sort_order: 5, featured: true },
  { slug: 'qazvin-pistachio-slices', name_fa: 'خلال پسته قزوین', category: 'pistachio', image: '/product/pdf/qazvin-pistachio-slices.webp', sort_order: 6, featured: true },
  { slug: 'pistachio-shells', name_fa: 'پوست پسته', category: 'pistachio', image: '/product/pdf/pistachio-shells.webp', sort_order: 7, featured: false },
  { slug: 'openshell-hazelnut', name_fa: 'فندق خندان', category: 'hazelnut', image: '/product/pdf/openshell-hazelnut.webp', sort_order: 1, featured: true },
  { slug: 'roasted-hazelnut-kernels', name_fa: 'مغز فندق رست', category: 'hazelnut', image: '/product/pdf/roasted-hazelnut-kernels.webp', sort_order: 2, featured: true },
  { slug: 'raw-hazelnut-kernels', name_fa: 'مغز فندق خام', category: 'hazelnut', image: '/product/pdf/raw-hazelnut-kernels.webp', sort_order: 3, featured: true },
  { slug: 'hazelnut-paste', name_fa: 'خمیر فندق', category: 'hazelnut', image: '/product/pdf/hazelnut-paste.webp', sort_order: 4, featured: true },
  { slug: 'hazelnut-powder', name_fa: 'پودر فندق', category: 'hazelnut', image: '/product/pdf/hazelnut-powder.webp', sort_order: 5, featured: true },
  { slug: 'hazelnut-granules', name_fa: 'گرانول فندق', category: 'hazelnut', image: '/product/pdf/hazelnut-granules.webp', sort_order: 6, featured: true },
  { slug: 'hazelnut-shells', name_fa: 'پوست فندق', category: 'hazelnut', image: '/product/pdf/hazelnut-shells.webp', sort_order: 7, featured: false },
  { slug: 'almond-flakes', name_fa: 'پرک بادام درختی', category: 'almond', image: '/product/pdf/almond-flakes.webp', sort_order: 1, featured: true },
  { slug: 'almond-slices', name_fa: 'خلال بادام درختی', category: 'almond', image: '/product/pdf/almond-slices.webp', sort_order: 2, featured: true },
  { slug: 'almond-kernels', name_fa: 'مغز بادام درختی', category: 'almond', image: '/product/pdf/almond-kernels.webp', sort_order: 3, featured: true },
  { slug: 'peanut-kernels', name_fa: 'مغز بادام زمینی', category: 'almond', image: '/product/pdf/peanut-kernels.webp', sort_order: 4, featured: true },
  { slug: 'peanut-slices', name_fa: 'خلال بادام زمینی', category: 'almond', image: '/product/pdf/peanut-slices.webp', sort_order: 5, featured: true },
  { slug: 'almond-powder', name_fa: 'پودر بادام', category: 'almond', image: '/product/pdf/almond-powder.webp', sort_order: 6, featured: true },
];

async function main() {
  await prisma.product.deleteMany({});
  for (const row of products) {
    await prisma.product.create({
      data: {
        slug: row.slug,
        name_fa: row.name_fa,
        category: row.category,
        image: row.image,
        gallery: JSON.stringify([row.image]),
        taste: JSON.stringify({}),
        weights: JSON.stringify([]),
        sort_order: row.sort_order,
        featured: row.featured,
        published: true,
        desc_fa: null,
        origin_fa: row.category === 'pistachio' ? 'قزوین' : 'ایران',
        price: 0,
        price_display: null,
        badge: null,
        in_stock: true,
      },
    });
    console.log('OK', row.category, row.name_fa);
  }
  for (const c of [
    { slug: 'pistachio', name_fa: 'پسته', desc_fa: 'در ۷ دسته‌بندی متنوع', image: '/product/pistachio-category.webp', sort_order: 1 },
    { slug: 'hazelnut', name_fa: 'فندق', desc_fa: 'در ۷ دسته‌بندی متنوع', image: '/product/hazelnut-category.webp', sort_order: 2 },
    { slug: 'almond', name_fa: 'بادام', desc_fa: 'در ۶ دسته‌بندی متنوع', image: '/product/almond-category.webp', sort_order: 3 },
  ]) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name_fa: c.name_fa, desc_fa: c.desc_fa, image: c.image, sort_order: c.sort_order },
      create: c,
    });
  }
  console.log('TOTAL', await prisma.product.count());
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
