// Complete repository media manifest used by the homepage's editorial mosaic.
// All image/video assets are local files in public/gallery and public/video.
const GALLERY_PHOTOS = [
  '/gallery/AQ8A1495AQ8A1495.webp', '/gallery/AQ8A1498AQ8A1498.webp', '/gallery/AQ8A1499AQ8A1499.webp',
  '/gallery/AQ8A1502AQ8A1502.webp', '/gallery/AQ8A1505AQ8A1505.webp', '/gallery/AQ8A1508AQ8A1508.webp',
  '/gallery/AQ8A1511AQ8A1511.webp', '/gallery/AQ8A1513AQ8A1513.webp', '/gallery/AQ8A1516AQ8A1516.webp',
  '/gallery/AQ8A1517AQ8A1517.webp', '/gallery/AQ8A1520AQ8A1520.webp', '/gallery/AQ8A1524AQ8A1524.webp',
  '/gallery/AQ8A1525AQ8A1525.webp', '/gallery/AQ8A1526AQ8A1526.webp', '/gallery/AQ8A1527AQ8A1527.webp',
  '/gallery/AQ8A1528AQ8A1528.webp', '/gallery/AQ8A1529AQ8A1529.webp', '/gallery/AQ8A1530AQ8A1530.webp',
  '/gallery/AQ8A1531AQ8A1531.webp', '/gallery/AQ8A1534AQ8A1534.webp', '/gallery/AQ8A1537AQ8A1537.webp',
  '/gallery/AQ8A1538AQ8A1538.webp', '/gallery/AQ8A1539AQ8A1539.webp', '/gallery/AQ8A1541AQ8A1541.webp',
  '/gallery/AQ8A1542AQ8A1542.webp', '/gallery/AQ8A1543AQ8A1543.webp', '/gallery/AQ8A1544AQ8A1544.webp',
  '/gallery/AQ8A1545AQ8A1545.webp', '/gallery/AQ8A1547AQ8A1547.webp', '/gallery/AQ8A1550AQ8A1550.webp',
  '/gallery/AQ8A1552AQ8A1552.webp', '/gallery/AQ8A1562AQ8A1562.webp', '/gallery/AQ8A1563AQ8A1563.webp',
  '/gallery/AQ8A1568AQ8A1568.webp', '/gallery/AQ8A1571AQ8A1571.webp', '/gallery/AQ8A1579AQ8A1579.webp',
  '/gallery/AQ8A1581AQ8A1581.webp', '/gallery/AQ8A1584AQ8A1584.webp', '/gallery/AQ8A1589AQ8A1589.webp',
  '/gallery/AQ8A1590AQ8A1590.webp', '/gallery/AQ8A1595AQ8A1595.webp', '/gallery/AQ8A1597AQ8A1597.webp',
  '/gallery/AQ8A1600AQ8A1600.webp', '/gallery/AQ8A1605AQ8A1605.webp', '/gallery/AQ8A1606AQ8A1606.webp',
  '/gallery/AQ8A1612AQ8A1612.webp', '/gallery/AQ8A1614AQ8A1614.webp', '/gallery/AQ8A1618AQ8A1618.webp',
  '/gallery/AQ8A1621AQ8A1621.webp', '/gallery/AQ8A1622AQ8A1622.webp', '/gallery/AQ8A1624AQ8A1624.webp',
  '/gallery/AQ8A1625AQ8A1625.webp', '/gallery/AQ8A1628AQ8A1628.webp', '/gallery/AQ8A1631AQ8A1631.webp',
  '/gallery/AQ8A1640AQ8A1640.webp', '/gallery/AQ8A1641AQ8A1641.webp', '/gallery/AQ8A1650AQ8A1650.webp',
  '/gallery/AQ8A1665AQ8A1665.webp', '/gallery/AQ8A1666AQ8A1666.webp', '/gallery/AQ8A1667AQ8A1667.webp',
  '/gallery/AQ8A1671AQ8A1671.webp', '/gallery/AQ8A1676AQ8A1676.webp', '/gallery/AQ8A1681AQ8A1681.webp',
  '/gallery/AQ8A1682AQ8A1682.webp', '/gallery/AQ8A1683AQ8A1683.webp', '/gallery/AQ8A1688AQ8A1688.webp',
  '/gallery/AQ8A1702AQ8A1702.webp', '/gallery/AQ8A1706AQ8A1706.webp', '/gallery/AQ8A1708AQ8A1708.webp',
  '/gallery/AQ8A1716AQ8A1716.webp', '/gallery/AQ8A1717AQ8A1717.webp', '/gallery/AQ8A1721AQ8A1721.webp',
  '/gallery/AQ8A1729AQ8A1729.webp', '/gallery/AQ8A1732AQ8A1732.webp', '/gallery/AQ8A1734AQ8A1734.webp',
  '/gallery/AQ8A1735AQ8A1735.webp', '/gallery/AQ8A1737AQ8A1737.webp', '/gallery/AQ8A1742AQ8A1742.webp',
  '/gallery/AQ8A1748AQ8A1748.webp', '/gallery/AQ8A1750AQ8A1750.webp', '/gallery/AQ8A1752AQ8A1752.webp',
  '/gallery/AQ8A1768AQ8A1768.webp', '/gallery/AQ8A1770AQ8A1770.webp', '/gallery/AQ8A1771AQ8A1771.webp',
  '/gallery/AQ8A1773AQ8A1773.webp',
];

const FACTORY_VIDEOS = [
  { id: 'video-facility-1', title: 'فضای کارخانه', url: '/video/facility-1.mp4', type: 'video', poster: '/gallery/AQ8A1495AQ8A1495.webp' },
  { id: 'video-processing-1', title: 'فرآوری و آماده‌سازی', url: '/video/processing-1.mp4', type: 'video', poster: '/gallery/AQ8A1702AQ8A1702.webp' },
  { id: 'video-showroom-1', title: 'محصولات از نزدیک', url: '/video/showroom-1.mp4', type: 'video', poster: '/gallery/AQ8A1520AQ8A1520.webp' },
  { id: 'video-facility-2', title: 'محیط تولید', url: '/video/facility-2.mp4', type: 'video', poster: '/gallery/AQ8A1495AQ8A1495.webp' },
  { id: 'video-processing-2', title: 'خط فرآوری', url: '/video/processing-2.mp4', type: 'video', poster: '/gallery/AQ8A1702AQ8A1702.webp' },
  { id: 'video-showroom-2', title: 'نمایشگاه محصولات', url: '/video/showroom-2.mp4', type: 'video', poster: '/gallery/AQ8A1520AQ8A1520.webp' },
  { id: 'video-facility-3', title: 'تور کارخانه', url: '/video/facility-3.mp4', type: 'video', poster: '/gallery/AQ8A1495AQ8A1495.webp' },
  { id: 'video-processing-3', title: 'جزئیات فرآوری', url: '/video/processing-3.mp4', type: 'video', poster: '/gallery/AQ8A1702AQ8A1702.webp' },
  { id: 'video-showroom-3', title: 'محصولات و نمایشگاه', url: '/video/showroom-3.mp4', type: 'video', poster: '/gallery/AQ8A1520AQ8A1520.webp' },
  { id: 'video-showroom-4', title: 'مجموعه محصولات', url: '/video/showroom-4.mp4', type: 'video', poster: '/gallery/AQ8A1520AQ8A1520.webp' },
  { id: 'video-facility-5384', title: 'روایت تصویری کارخانه', url: '/video/facility-5384.mov', type: 'video', poster: '/gallery/AQ8A1495AQ8A1495.webp' },
  { id: 'video-facility-5387', title: 'جزئیات محیط تولید', url: '/video/facility-5387.mov', type: 'video', poster: '/gallery/AQ8A1495AQ8A1495.webp' },
  { id: 'video-facility-7a8d', title: 'نگاهی به مجموعه', url: '/video/facility-7a8d.mov', type: 'video', poster: '/gallery/AQ8A1495AQ8A1495.webp' },
];

const GALLERY_ITEMS = GALLERY_PHOTOS.map((url, index) => ({
  id: `photo-${url.split('/').pop().replace(/\.webp$/i, '')}`,
  title: `تصویر ${String(index + 1).padStart(2, '0')} از مجموعه هفت طلایی`,
  url,
  type: 'image',
  poster: url,
}));

// Interleave factory clips and the complete gallery so moving images are spread
// through the masonry instead of being isolated in a separate video strip.
export const HOME_MEDIA_ITEMS = (() => {
  const result = [];
  const count = Math.max(GALLERY_ITEMS.length, FACTORY_VIDEOS.length);
  for (let i = 0; i < count; i += 1) {
    if (i < FACTORY_VIDEOS.length && i === 0) result.push(FACTORY_VIDEOS[i]);
    if (i < GALLERY_ITEMS.length) result.push(GALLERY_ITEMS[i]);
    if (i < FACTORY_VIDEOS.length && i > 0) result.push(FACTORY_VIDEOS[i]);
  }
  return result.map((item, index) => ({
    ...item,
    defaultOrder: index + 1,
    shape: index === 0 ? 'feature' : (index % 9 === 4 ? 'portrait' : (index % 5 === 2 ? 'wide' : 'standard')),
  }));
})();
