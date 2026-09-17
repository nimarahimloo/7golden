const entities = [
  'User',
  'Product',
  'Category',
  'BlogPost',
  'Award',
  'GalleryImage',
  'Testimonial',
  'ContactMessage',
  'SiteSettings',
];

const PAGE_SIZE = 1000;

for (const name of entities) {
  try {
    let total = 0;
    let skip = 0;

    while (true) {
      const rows = await base44.entities[name].list(
        undefined,
        PAGE_SIZE,
        skip
      );

      const count = rows?.length ?? 0;
      total += count;

      if (count < PAGE_SIZE) {
        break;
      }

      skip += PAGE_SIZE;
    }

    console.log(`${name}: ${total}`);
  } catch (error) {
    console.error(
      `${name}: ERROR`,
      error?.message ?? String(error)
    );
  }
}
