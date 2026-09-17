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

const exportData: Record<string, unknown[]> = {};

for (const name of entities) {
  const records: unknown[] = [];
  let skip = 0;

  while (true) {
    const rows = await base44.entities[name].list(
      undefined,
      PAGE_SIZE,
      skip
    );

    const count = rows?.length ?? 0;

    if (count === 0) {
      break;
    }

    records.push(...rows);

    if (count < PAGE_SIZE) {
      break;
    }

    skip += PAGE_SIZE;
  }

  exportData[name] = records;
}

console.log(JSON.stringify(exportData));
