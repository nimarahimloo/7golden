import { Link } from 'react-router-dom';
import { ChevronLeft, Factory, PackageCheck, Layers } from 'lucide-react';

import StoryChapter from '@/components/story/StoryChapter';
import Reveal from '@/components/story/Reveal';
import DepthParallax from '@/components/story/DepthParallax';
import Eyebrow from '@/components/ui/eyebrow';

const PRODUCT_GROUPS = [
  {
    icon: Factory,
    title: 'فرآورده‌های فندق',
    text: 'مغز فندق خام و برشته، خمیر، گرانول و پودر فندق؛ برای استفاده در شکلات، کرم فندق، کیک و بستنی.',
  },
  {
    icon: PackageCheck,
    title: 'مغز و خلال پسته',
    text: 'مغز پسته، مغز پوست‌کنده، خلال و پودر پسته؛ برای کاربردهایی مانند شکلات، بستنی، قنادی و حلوا ارده.',
  },
  {
    icon: Layers,
    title: 'محصولات بادام',
    text: 'مغز، خلال و پرک بادام برای تهیه کیک، شیرینی و دیگر فرآورده‌های غذایی.',
  },
];

export default function HomeOrigin({ section = {} }) {
  return (
    <section className="chapter">
      <div className="chapter-shell">
        <StoryChapter
          index="03"
          eyebrow={section.badge_fa || 'محصولات هفت طلایی'}
          title={section.title_fa || 'سه گروه محصول؛ کاربردهای متنوع'}
          lead={section.subtitle_fa || 'فهرست محصولات هفت طلایی بر فندق، پسته و بادام متمرکز است. هر گروه در شکل‌های مختلف فرآوری عرضه می‌شود تا برای کاربردهای متفاوت در صنایع غذایی قابل انتخاب باشد.'}
          align="center"
          className="mb-12 md:mb-16"
        />

        <DepthParallax
          src={section.image || '/banner/banner-spoons-set.webp'}
          alt="فرآورده‌های فندق، پسته و بادام هفت طلایی"
          ratio="aspect-[4/3] md:aspect-[21/9]"
          className="rounded-2xl"
        >
          <div>
            <Eyebrow className="block mb-2">محصولات هفت طلایی</Eyebrow>
            <span className="display-md" style={{ color: 'var(--ink)' }}>
              پسته، بادام و فندق
            </span>
          </div>
        </DepthParallax>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-10 md:mt-12">
          {PRODUCT_GROUPS.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <div className="fact-card h-full">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center mb-5"
                  style={{
                    background: 'rgba(201, 168, 75, 0.08)',
                    border: '1px solid var(--hairline)',
                  }}
                >
                  <item.icon size={18} style={{ color: 'var(--gold-2)' }} />
                </div>
                <h3 className="display-sm mb-3" style={{ color: 'var(--fg)' }}>
                  {item.title}
                </h3>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: 'var(--fg-muted)' }}
                >
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link to="/shop" className="btn-gold">
            مشاهده محصولات
            <ChevronLeft size={16} />
          </Link>
          <Link to="/contact" className="btn-ghost">
            استعلام قیمت
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
