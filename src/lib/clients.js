// Industrial buyers shown in the home-page logo wall.
//
// Each entry renders as a generated logo lockup (emblem + wordmark) unless a
// real logo file is supplied: drop the file into /public/clients/ and set
//   logo: '/clients/your-file.svg'
// on the matching entry — it then replaces the generated mark automatically.
//
// `icon` is a lucide-react icon name resolved in components/home/ClientLogo.jsx,
// `shape` picks the emblem frame and `font` / `weight` give each wordmark its
// own voice so the wall reads as ten different brands.
export const CLIENTS = [
  { id: 'golestan-icecream', nameFA: 'بستنی گلستان', sectorFA: 'صنایع بستنی', icon: 'IceCreamCone', shape: 'circle', font: 'Peyda', weight: 800 },
  { id: 'bartar-pastry', nameFA: 'قنادی برتر', sectorFA: 'صنایع قنادی', icon: 'Cake', shape: 'arch', font: 'Kalameh', weight: 800 },
  { id: 'arya-chocolate', nameFA: 'شکلات‌سازی آریا', sectorFA: 'صنایع شکلات', icon: 'Candy', shape: 'hex', font: 'Peyda', weight: 700 },
  { id: 'pars-holding', nameFA: 'هلدینگ پارس', sectorFA: 'خواروبار عمده', icon: 'Building2', shape: 'square', font: 'YekanBakh', weight: 700 },
  { id: 'sarv-group', nameFA: 'گروه صنایع غذایی سرو', sectorFA: 'فرآورده غذایی', icon: 'TreePine', shape: 'circle', font: 'Kalameh', weight: 700 },
  { id: 'nokhbegan-food', nameFA: 'نخبگان غذا', sectorFA: 'تأمین مواد اولیه', icon: 'Crown', shape: 'diamond', font: 'Peyda', weight: 800 },
  { id: 'zarrindaneh', nameFA: 'زرین‌دانه', sectorFA: 'صادرات خشکبار', icon: 'Wheat', shape: 'arch', font: 'YekanBakh', weight: 700 },
  { id: 'mehr-sweets', nameFA: 'صنایع شیرین مهر', sectorFA: 'شیرینی و بیسکوییت', icon: 'Sun', shape: 'hex', font: 'Kalameh', weight: 800 },
  { id: 'negin-bakery', nameFA: 'نگین نان و شیرینی', sectorFA: 'کیک و شیرینی', icon: 'Gem', shape: 'square', font: 'Peyda', weight: 700 },
  { id: 'mahan-biscuit', nameFA: 'بیسکوییت ماهان', sectorFA: 'صنایع بیسکوییت', icon: 'Cookie', shape: 'circle', font: 'YekanBakh', weight: 700 },
];
