// Central content for the 7Golden «اخبار و اطلاعیه‌ها» (News & Announcements) page.
//
// Every item below is grounded in the brand's own verified facts (see
// corporate-content.js): work began ۱۳۷۷ in a small Qazvin workshop; the company
// «شرکت خشکبار و بسته‌بندی هفت طلایی» was registered in ۱۳۹۶; raw material is
// bought straight from growers via the family بنکداری (خشکبار محمدی, 100+ years);
// pistachio comes from Buin-Zahra (Qazvin) and Kerman, hazelnut from Oshnavieh,
// Alamut (Qazvin) and northern Ashkvarat; exports go to the UAE, Qatar, Oman,
// Iraq and Afghanistan (plus Europe via traders).
//
// Do NOT introduce invented numbers, tonnage or certification claims here.

export const NEWS_CATEGORIES = {
  announcement: { label: 'اطلاعیه', tone: 'var(--gold-2)' },
  product: { label: 'محصولات', tone: '#c9a86a' },
  company: { label: 'درباره مجموعه', tone: '#9eb6a2' },
  ordering: { label: 'راهنمای سفارش', tone: '#c7a4d6' },
  media: { label: 'آرشیو تصویری', tone: '#91b9d0' },
};

// Trade-show & facility images captured across the 7Golden journey.
// Files live in public/gallery/.
export const PHOTOS = [
  '/gallery/AQ8A1495AQ8A1495.webp',
  '/gallery/AQ8A1498AQ8A1498.webp',
  '/gallery/AQ8A1499AQ8A1499.webp',
  '/gallery/AQ8A1502AQ8A1502.webp',
  '/gallery/AQ8A1505AQ8A1505.webp',
  '/gallery/AQ8A1508AQ8A1508.webp',
  '/gallery/AQ8A1511AQ8A1511.webp',
  '/gallery/AQ8A1513AQ8A1513.webp',
  '/gallery/AQ8A1516AQ8A1516.webp',
  '/gallery/AQ8A1517AQ8A1517.webp',
  '/gallery/AQ8A1520AQ8A1520.webp',
  '/gallery/AQ8A1524AQ8A1524.webp',
  '/gallery/AQ8A1525AQ8A1525.webp',
  '/gallery/AQ8A1526AQ8A1526.webp',
  '/gallery/AQ8A1527AQ8A1527.webp',
  '/gallery/AQ8A1528AQ8A1528.webp',
  '/gallery/AQ8A1529AQ8A1529.webp',
  '/gallery/AQ8A1531AQ8A1531.webp',
  '/gallery/AQ8A1534AQ8A1534.webp',
  '/gallery/AQ8A1537AQ8A1537.webp',
  '/gallery/AQ8A1538AQ8A1538.webp',
  '/gallery/AQ8A1539AQ8A1539.webp',
  '/gallery/AQ8A1541AQ8A1541.webp',
  '/gallery/AQ8A1542AQ8A1542.webp',
  '/gallery/AQ8A1543AQ8A1543.webp',
  '/gallery/AQ8A1544AQ8A1544.webp',
  '/gallery/AQ8A1545AQ8A1545.webp',
  '/gallery/AQ8A1547AQ8A1547.webp',
  '/gallery/AQ8A1550AQ8A1550.webp',
  '/gallery/AQ8A1552AQ8A1552.webp',
  '/gallery/AQ8A1562AQ8A1562.webp',
  '/gallery/AQ8A1563AQ8A1563.webp',
  '/gallery/AQ8A1568AQ8A1568.webp',
  '/gallery/AQ8A1571AQ8A1571.webp',
  '/gallery/AQ8A1579AQ8A1579.webp',
  '/gallery/AQ8A1581AQ8A1581.webp',
  '/gallery/AQ8A1584AQ8A1584.webp',
  '/gallery/AQ8A1589AQ8A1589.webp',
  '/gallery/AQ8A1590AQ8A1590.webp',
  '/gallery/AQ8A1595AQ8A1595.webp',
  '/gallery/AQ8A1597AQ8A1597.webp',
  '/gallery/AQ8A1600AQ8A1600.webp',
  '/gallery/AQ8A1605AQ8A1605.webp',
  '/gallery/AQ8A1606AQ8A1606.webp',
  '/gallery/AQ8A1612AQ8A1612.webp',
  '/gallery/AQ8A1614AQ8A1614.webp',
  '/gallery/AQ8A1618AQ8A1618.webp',
  '/gallery/AQ8A1621AQ8A1621.webp',
  '/gallery/AQ8A1622AQ8A1622.webp',
  '/gallery/AQ8A1624AQ8A1624.webp',
  '/gallery/AQ8A1625AQ8A1625.webp',
  '/gallery/AQ8A1628AQ8A1628.webp',
  '/gallery/AQ8A1631AQ8A1631.webp',
  '/gallery/AQ8A1640AQ8A1640.webp',
  '/gallery/AQ8A1641AQ8A1641.webp',
  '/gallery/AQ8A1650AQ8A1650.webp',
  '/gallery/AQ8A1665AQ8A1665.webp',
  '/gallery/AQ8A1666AQ8A1666.webp',
  '/gallery/AQ8A1667AQ8A1667.webp',
  '/gallery/AQ8A1671AQ8A1671.webp',
  '/gallery/AQ8A1676AQ8A1676.webp',
  '/gallery/AQ8A1681AQ8A1681.webp',
  '/gallery/AQ8A1682AQ8A1682.webp',
  '/gallery/AQ8A1683AQ8A1683.webp',
  '/gallery/AQ8A1688AQ8A1688.webp',
  '/gallery/AQ8A1702AQ8A1702.webp',
  '/gallery/AQ8A1706AQ8A1706.webp',
  '/gallery/AQ8A1708AQ8A1708.webp',
  '/gallery/AQ8A1716AQ8A1716.webp',
  '/gallery/AQ8A1717AQ8A1717.webp',
  '/gallery/AQ8A1721AQ8A1721.webp',
  '/gallery/AQ8A1729AQ8A1729.webp',
  '/gallery/AQ8A1732AQ8A1732.webp',
  '/gallery/AQ8A1734AQ8A1734.webp',
  '/gallery/AQ8A1735AQ8A1735.webp',
  '/gallery/AQ8A1737AQ8A1737.webp',
  '/gallery/AQ8A1742AQ8A1742.webp',
  '/gallery/AQ8A1748AQ8A1748.webp',
  '/gallery/AQ8A1750AQ8A1750.webp',
  '/gallery/AQ8A1752AQ8A1752.webp',
  '/gallery/AQ8A1768AQ8A1768.webp',
  '/gallery/AQ8A1770AQ8A1770.webp',
  '/gallery/AQ8A1771AQ8A1771.webp',
  '/gallery/AQ8A1773AQ8A1773.webp',
];

// Facility, processing and showroom clips. Each entry maps to a file in public/video/.
export const VIDEOS = [
  { title: 'نمایشگاه محصولات', image: '/video/showroom-1.mp4', type: 'video/mp4' },
  { title: 'سالن فرآوری ۰۱', image: '/video/processing-1.mp4', type: 'video/mp4' },
  { title: 'نمایشگاه و غرفه', image: '/video/showroom-2.mp4', type: 'video/mp4' },
  { title: 'خط تولید ۰۲', image: '/video/processing-2.mp4', type: 'video/mp4' },
  { title: 'نمایشگاه بین‌المللی', image: '/video/showroom-3.mp4', type: 'video/mp4' },
  { title: 'فرآوری و بسته‌بندی', image: '/video/processing-3.mp4', type: 'video/mp4' },
  { title: 'حضور در نمایشگاه', image: '/video/showroom-4.mp4', type: 'video/mp4' },
  { title: 'محیط کارخانه ۰۱', image: '/video/facility-1.mp4', type: 'video/mp4' },
  { title: 'محیط کارخانه ۰۲', image: '/video/facility-2.mp4', type: 'video/mp4' },
  { title: 'تور کارخانه', image: '/video/facility-3.mp4', type: 'video/mp4' },
];

// The announcements feed. Each item's long-form article (≈1000 words) lives in
// ./news-articles/<id>.js and is loaded lazily by the article page. `photos` and
// `videos` are the media embedded in that article.
export const NEWS_ITEMS = [
  {
    id: 'product-catalog-update',
    photos: PHOTOS.slice(0, 8),
    videos: [VIDEOS[0]],
    category: 'product',
    date: '۱۴۰۵/۰۷/۲۱',
    title: 'معرفی سبد محصولات هفت طلایی برای صنایع غذایی',
    excerpt: 'سبد محصولات هفت طلایی بر سه خانواده فندق، پسته و بادام و شکل‌های مختلف فرآوری آن‌ها تمرکز دارد؛ انتخاب فرم مناسب از کاربرد نهایی شروع می‌شود.',
    image: '/gallery/AQ8A1499AQ8A1499.webp',
    featured: true,
    body: [
      'هفت طلایی سبد محصولات خود را برای نیازهای متنوع صنایع غذایی معرفی می‌کند: محصولات فندق، پسته و بادام در فرم‌هایی مانند مغز، خلال، پرک، خمیر، گرانول و پودر. همهٔ فرم‌ها برای همهٔ کاربردها یکسان نیستند؛ بنابراین مشخص‌کردن کاربرد نهایی، نخستین قدم در انتخاب محصول است.',
      'برای شکلات، بستنی، قنادی، بیسکویت و فرآورده‌های مشابه، شکل ماده اولیه می‌تواند بر بافت و ظاهر محصول نهایی اثر بگذارد. هنگام استعلام، نوع محصول و فرم موردنیاز را دقیق اعلام کنید تا مشخصات موجود و شرایط سفارش بررسی شود.',
      'این معرفی جایگزین مشخصات فنی یک سفارش نیست. موجودی، گرید، بسته‌بندی و زمان تحویل باید برای هر درخواست به‌صورت جداگانه تأیید شوند.'
    ],
  },
  {
    id: 'quote-request-details',
    photos: PHOTOS.slice(8, 16),
    videos: [],
    category: 'ordering',
    date: '۱۴۰۵/۰۷/۲۱',
    title: 'اطلاعیه برای خریداران عمده: درخواست قیمت دقیق‌تر ثبت کنید',
    excerpt: 'برای بررسی سریع‌تر درخواست خرید، نام محصول، فرم موردنیاز، کاربرد نهایی، حجم تقریبی و مقصد تحویل را در پیام خود بنویسید.',
    image: '/gallery/AQ8A1505AQ8A1505.webp',
    body: [
      'برای آنکه درخواست قیمت قابل بررسی باشد، تنها نوشتن نام کلی «پسته»، «فندق» یا «بادام» کافی نیست. لطفاً مشخص کنید محصول را به چه شکلی می‌خواهید؛ برای مثال مغز، خلال، پرک، خمیر، گرانول یا پودر.',
      'کاربرد محصول، مقدار تقریبی سفارش، مقصد تحویل و نوع بسته‌بندی موردنظر نیز به روشن‌شدن درخواست کمک می‌کند. اگر اندازه برش یا ویژگی ظاهری مشخصی برای فرمول تولید شما اهمیت دارد، آن را در پیام ذکر کنید.',
      'قیمت، موجودی و جزئیات تحویل پس از دریافت اطلاعات سفارش بررسی می‌شود. هیچ وزن بسته‌بندی یا زمان تحویلی بدون هماهنگی نهایی فرض نمی‌شود.'
    ],
  },
  {
    id: 'sample-request-guidance',
    photos: PHOTOS.slice(16, 24),
    videos: [],
    category: 'ordering',
    date: '۱۴۰۵/۰۷/۲۱',
    title: 'راهنمای درخواست نمونه برای ارزیابی در خط تولید',
    excerpt: 'اگر پیش از خرید عمده نیاز به بررسی نمونه دارید، محصول و کاربرد آن را مشخص کنید تا امکان ارائه نمونه و شرایط آن هماهنگ شود.',
    image: '/gallery/AQ8A1520AQ8A1520.webp',
    body: [
      'آزمودن ماده اولیه در شرایط واقعی تولید می‌تواند به تصمیم‌گیری دقیق‌تر کمک کند. ظاهر یک محصول به‌تنهایی نشان نمی‌دهد که در فرمول شما چه رفتاری خواهد داشت؛ به همین دلیل بهتر است ارزیابی نمونه با همان دستور تولید و شرایطی انجام شود که قرار است در عمل استفاده شوند.',
      'برای شروع، نوع محصول، شکل موردنیاز، کاربرد نهایی و مقدار تقریبی مصرف را آماده کنید. اگر معیار مشخصی مانند اندازه ذرات، رنگ یا بافت برای شما اهمیت دارد، آن را هم توضیح دهید.',
      'امکان ارائه نمونه، موجودی و نحوه هماهنگی باید هنگام تماس تأیید شود. این اطلاعیه وعدهٔ ارسال خودکار نمونه یا زمان تحویل مشخصی ایجاد نمی‌کند.'
    ],
  },
  {
    id: 'company-history-note',
    photos: PHOTOS.slice(24, 32),
    videos: [VIDEOS[7]],
    category: 'company',
    date: '۱۴۰۵/۰۷/۲۱',
    title: 'مروری بر مسیر فعالیت هفت طلایی در قزوین',
    excerpt: 'ریشهٔ خانوادگی کسب‌وکار به خشکبار محمدی در بازار قزوین در سال ۱۳۳۵ بازمی‌گردد؛ کارگاه فرآوری در ۱۳۷۷ آغاز شد و شرکت در ۱۳۹۶ ثبت شد.',
    image: '/gallery/AQ8A1640AQ8A1640.webp',
    body: [
      'داستان هفت طلایی بخشی از یک مسیر خانوادگی در بازار خشکبار قزوین است. فعالیت خشکبار محمدی از سال ۱۳۳۵ آغاز شده و این سابقه، زمینهٔ ورود نسل بعدی به فرآوری را فراهم کرده است.',
      'کارگاه کوچک فرآوری در سال ۱۳۷۷ شروع به کار کرد. در سال ۱۳۹۶ نیز شرکت «خشکبار و بسته‌بندی هفت طلایی» به ثبت رسید. این تاریخ‌ها سه نقطهٔ متمایز در مسیر کسب‌وکارند: ریشهٔ بنکداری خانوادگی، آغاز فرآوری و ثبت شرکت.',
      'امروز تمرکز سبد محصولات معرفی‌شده در وب‌سایت بر فندق، پسته و بادام و فرم‌های گوناگون آن‌هاست. جزئیات سفارش و موجودی هر محصول از طریق ارتباط با مجموعه قابل پیگیری است.'
    ],
  },
  {
    id: 'media-archive-update',
    photos: PHOTOS.slice(32, 44),
    videos: [VIDEOS[1], VIDEOS[5]],
    category: 'media',
    date: '۱۴۰۵/۰۷/۲۱',
    title: 'گسترش آرشیو تصویری محصولات و فضای مجموعه',
    excerpt: 'آرشیو تصویری وب‌سایت، مجموعه‌ای از عکس‌ها و ویدئوهای موجود درباره محصولات، نمایشگاه و فضای کار را در یک مسیر قابل مرور گرد هم می‌آورد.',
    image: '/gallery/AQ8A1579AQ8A1579.webp',
    body: [
      'بخش تصویری وب‌سایت برای مشاهدهٔ عکس‌ها و ویدئوهای موجود از محصولات و فضای مجموعه توسعه یافته است. هدف آرشیو این است که مخاطب بتواند پیش از تماس، تصویری روشن‌تر از خانواده‌های محصول و محتوای بصری منتشرشده در سایت به دست آورد.',
      'این تصاویر برای معرفی بصری به کار می‌روند و به‌تنهایی جایگزین مشخصات فنی، تأیید موجودی یا ارزیابی نمونه نیستند. اگر دربارهٔ یک محصول خاص پرسشی دارید، نام و فرم دقیق آن را در درخواست خود ذکر کنید.',
      'محتواهای تازه در صورت آماده‌شدن و تأیید مجموعه می‌توانند به این آرشیو اضافه شوند.'
    ],
  },
  {
    id: 'product-forms-announcement',
    photos: PHOTOS.slice(44, 52),
    videos: [VIDEOS[3]],
    category: 'product',
    date: '۱۴۰۵/۰۷/۲۱',
    title: 'آشنایی با شکل‌های مختلف فرآورده‌های خشکبار',
    excerpt: 'مغز، خلال، پرک، خمیر، گرانول و پودر نقش‌های متفاوتی در فرمولاسیون دارند؛ شکل محصول باید بر اساس نیاز خط تولید انتخاب شود.',
    image: '/banner/hazelnut-spoon.webp',
    body: [
      'فرآوری، یک ماده اولیه را به شکل‌هایی تبدیل می‌کند که برای کاربردهای مختلف مناسب‌اند. مغز کامل ظاهر مشخصی دارد؛ خلال و پرک برای نمایش قطعات یا پوشش سطح استفاده می‌شوند؛ گرانول بافت ذره‌ای ایجاد می‌کند و پودر در فرمول‌هایی به کار می‌رود که شکل ریزتر لازم است.',
      'در خانواده فندق، هفت طلایی فندق خندان، مغز خام و رست، خمیر، گرانول و پودر را معرفی می‌کند. در خانواده پسته، مغز، مغز پوست‌کنده، خلال و پودر مطرح‌اند. در خانواده بادام نیز مغز بادام درختی، خلال، پرک و پودر از شکل‌های شناخته‌شده‌اند.',
      'انتخاب نهایی باید با فرمول تولید، ویژگی ظاهری موردنظر و مشخصات قابل عرضه هماهنگ باشد. برای اطلاع از موجودی و گریدها، درخواست خود را با جزئیات ارسال کنید.'
    ],
  },
  {
    id: 'contact-details-reminder',
    photos: PHOTOS.slice(52, 60),
    videos: [],
    category: 'announcement',
    date: '۱۴۰۵/۰۷/۲۱',
    title: 'اطلاعیه ارتباط با واحد بازرگانی',
    excerpt: 'برای درخواست قیمت یا اطلاعات محصول، فرم تماس وب‌سایت یا اطلاعات تماس درج‌شده در پایین صفحه را به کار ببرید و نوع محصول را مشخص کنید.',
    image: '/gallery/AQ8A1742AQ8A1742.webp',
    body: [
      'واحد بازرگانی نقطهٔ شروع گفت‌وگو دربارهٔ محصولات و سفارش‌های عمده است. برای دریافت پاسخ مرتبط‌تر، نام محصول، شکل موردنیاز، کاربرد نهایی و حجم تقریبی سفارش را از ابتدا ذکر کنید.',
      'اگر دربارهٔ بسته‌بندی، مقصد تحویل یا زمان‌بندی خاصی پرسش دارید، آن را در همان پیام اضافه کنید. جزئیات نهایی هر سفارش پس از بررسی و هماهنگی تأیید می‌شود.',
      'راه‌های ارتباطی به‌روز در صفحهٔ تماس و فوتر وب‌سایت درج شده‌اند. برای جلوگیری از اطلاعات نادرست، ساعت کاری یا کانال اجتماعی تأییدنشده‌ای در این اطلاعیه اعلام نمی‌شود.'
    ],
  },
];

