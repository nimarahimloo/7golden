// Industries that buy from 7Golden, shown in the home-page buyer wall.
//
// These are the real, verifiable sectors the company supplies — chocolate &
// cocoa, ice-cream, confectionery, sesame/halva, biscuit & cake, dairy and
// export groups — instead of made-up brand names. Each entry renders as a
// generated lockup (emblem + wordmark) unless a real customer logo is supplied:
// drop the file into /public/clients/ and set
//   logo: '/clients/your-file.svg'
// on the matching entry — it then replaces the generated mark automatically.
//
// `icon` is a lucide-react icon name resolved in components/home/ClientLogo.jsx
// (one of the icons imported there), `shape` picks the emblem frame and
// `font` / `weight` give each wordmark its own voice so the wall reads as
// distinct buyers.
export const CLIENTS = [
  { id: 'chocolate', nameFA: 'کارخانه‌های شکلات', sectorFA: 'شکلات و کاکائو', icon: 'Candy', shape: 'hex', font: 'Peyda', weight: 800 },
  { id: 'icecream', nameFA: 'صنایع بستنی', sectorFA: 'بستنی و لبنیات', icon: 'IceCreamCone', shape: 'circle', font: 'Kalameh', weight: 800 },
  { id: 'confectionery', nameFA: 'قنادی و شیرینی', sectorFA: 'شیرینی و کیک', icon: 'Cake', shape: 'arch', font: 'Peyda', weight: 700 },
  { id: 'halva', nameFA: 'حلوا ارده و کنجد', sectorFA: 'فرآورده‌های کنجد', icon: 'Sun', shape: 'square', font: 'YekanBakh', weight: 700 },
  { id: 'biscuit', nameFA: 'بیسکوییت و ویفر', sectorFA: 'صنایع پخت', icon: 'Cookie', shape: 'hex', font: 'Kalameh', weight: 700 },
  { id: 'bakery', nameFA: 'کیک و شیرینی خشک', sectorFA: 'صنایع پخت', icon: 'Gem', shape: 'circle', font: 'Peyda', weight: 700 },
  { id: 'dairy', nameFA: 'لبنیات و دسر', sectorFA: 'لبنیات', icon: 'IceCreamCone', shape: 'square', font: 'YekanBakh', weight: 700 },
  { id: 'export', nameFA: 'گروه‌های صادراتی', sectorFA: 'بازرگانی و صادرات', icon: 'Building2', shape: 'diamond', font: 'Peyda', weight: 800 },
  { id: 'nuts', nameFA: 'آجیل و خشکبار', sectorFA: 'پخش عمده', icon: 'Wheat', shape: 'arch', font: 'YekanBakh', weight: 700 },
  { id: 'snack', nameFA: 'تنقلات و اسنک', sectorFA: 'صنایع غذایی', icon: 'TreePine', shape: 'hex', font: 'Kalameh', weight: 800 },
];
